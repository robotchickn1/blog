import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'

// ✅ Token refresh logic for Spotify
async function refreshAccessToken(token) {
  try {
    const url = 'https://accounts.spotify.com/api/token'

    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw new Error(`Spotify Token Refresh Error: ${JSON.stringify(refreshedTokens)}`)
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error('❌ Error refreshing Spotify token:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export default NextAuth({
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { scope: 'openid email profile' }, // ✅ Ensures correct Google OAuth scopes
      },
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,user-read-recently-played,user-top-read,user-library-read',
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure this is set properly

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user,
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error || null
      return session
    },
  },

  pages: {
    error: '/auth/error', // ✅ Redirects to a custom error page if OAuth fails
  },

  events: {
    async signIn({ user, account }) {
      console.log(`✅ Sign-in successful: ${user.email} via ${account.provider}`)
    },
    async error(message) {
      console.error(`❌ NextAuth Error: ${message}`)
    },
  },
})
