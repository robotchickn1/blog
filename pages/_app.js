import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/extra.css'
import 'katex/dist/katex.css'
import '@fontsource/inter/variable-full.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ClientReload } from '@/components/ClientReload'
import ProgressBar from 'react-scroll-progress-bar'
import ScrollTop from '@/components/ScrollTop'
import { SessionProvider, signOut } from 'next-auth/react'
import { Provider } from '@lyket/react'
import { useEffect } from 'react'

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

NProgress.configure({ showSpinner: false })

Router.onRouteChangeStart = () => {
  NProgress.start()
}

Router.onRouteChangeComplete = () => {
  NProgress.done()
}

Router.onRouteChangeError = () => {
  NProgress.done()
}

const defaultTheme = {
  colors: {
    primary: '#71717a',
    secondary: '#ff00c3',
    text: '#fff',
    highlight: '#ff00c3',
    icon: '#fff',
    background: 'transparent',
  },
  fonts: {
    body: 'inherit',
  },
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    let timeout = setTimeout(() => {
      signOut({ callbackUrl: '/' })
    }, 5 * 60 * 1000) // 🔥 Auto-logout after 5 minutes (300,000 ms)

    const resetTimer = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        signOut({ callbackUrl: '/' })
      }, 5 * 60 * 1000)
    }

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keydown', resetTimer)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keydown', resetTimer)
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <Provider apiKey="pt_ac1b18fa4c8c4992f045da3c8fb280" theme={defaultTheme}>
        <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
          <ProgressBar bgcolor="#DE1D8D" />
          <ScrollTop />
          <Head>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
          </Head>
          {isDevelopment && isSocket && <ClientReload />}
          <Analytics />
          <LayoutWrapper>
            <Component {...pageProps} />
          </LayoutWrapper>
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  )
}
