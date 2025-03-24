/* eslint-disable @next/next/no-html-link-for-pages */
import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { signIn, useSession } from 'next-auth/react'
import useSWR, { useSWRConfig } from 'swr'

import fetcher from '@/lib/fetcher'
import SuccessMessage from '@/components/SuccessMessage'
import ErrorMessage from '@/components/ErrorMessage'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FaGoogle, FaGithub } from 'react-icons/fa'

// ➡️ GuestbookEntry Component
function GuestbookEntry({ entry, user }) {
  const { mutate } = useSWRConfig()

  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/guestbook/${entry.id}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Failed to delete entry.')

      mutate('/api/guestbook')
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const isOwner = user?.name === entry.created_by

  return (
    <div className="my-4 w-full rounded-md border border-gray-100 bg-gray-100 px-4 py-4 shadow-sm shadow-gray-300 dark:border-zinc-900 dark:bg-zinc-900 dark:shadow-none">
      <div className="mb-2 text-neutral-900 dark:text-neutral-300">{entry.body}</div>
      <div className="text-sm text-gray-600 dark:text-white">
        <p className="text-gray-500">
          {entry.created_by} • {format(new Date(entry.updated_at), "d MMM yyyy 'at' h:mm bb")}
        </p>
        {isOwner && (
          <button
            aria-label="Delete comment"
            onClick={handleDelete}
            className="mt-2 text-red-600 hover:underline dark:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

// ➡️ Main Guestbook Component
export default function Guestbook({ fallbackData }) {
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()

  const [form, setForm] = useState({ state: '', message: '' })
  const [loadingProvider, setLoadingProvider] = useState(null)

  const inputEl = useRef(null)
  const { data: entries } = useSWR('/api/guestbook', fetcher, { fallbackData })

  const leaveEntry = async (e) => {
    e.preventDefault()

    const message = inputEl.current.value.trim()

    if (!message) {
      setForm({ state: 'error', message: 'Message cannot be empty.' })
      return
    }

    setForm({ state: 'loading', message: '' })

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: message }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Something went wrong!')
      }

      inputEl.current.value = ''
      mutate('/api/guestbook')

      setForm({ state: 'success', message: 'Hooray! Thanks for signing my Guestbook.' })
    } catch (error) {
      console.error('Submit error:', error)
      setForm({ state: 'error', message: error.message || 'Something went wrong.' })
    }
  }

  const handleSignIn = (provider) => {
    setLoadingProvider(provider)
    signIn(provider)
  }

  return (
    <>
      {/* Auth & Form Section */}
      <div className="my-2 w-full rounded-md border border-gray-200 bg-white px-6 py-4 shadow-xl shadow-gray-400 dark:border-zinc-900 dark:bg-zinc-900 dark:shadow-none">
        <div className="text-center">
          <h5 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Sign the Guestbook
          </h5>
        </div>

        {!session && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => handleSignIn('github')}
              disabled={loadingProvider === 'github'}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-neutral-100 py-3 text-sm font-medium text-gray-900 ring-gray-300 transition-all hover:ring-2 dark:bg-zinc-800 dark:text-gray-100"
            >
              {loadingProvider === 'github' ? (
                <>
                  Loading <LoadingSpinner className="ml-2" />
                </>
              ) : (
                <>
                  <FaGithub className="h-5 w-5" />
                  Sign in with GitHub
                </>
              )}
            </button>

            <button
              onClick={() => handleSignIn('google')}
              disabled={loadingProvider === 'google'}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-neutral-100 py-3 text-sm font-medium text-gray-900 ring-gray-300 transition-all hover:ring-2 dark:bg-zinc-800 dark:text-gray-100"
            >
              {loadingProvider === 'google' ? (
                <>
                  Loading <LoadingSpinner className="ml-2" />
                </>
              ) : (
                <>
                  <FaGoogle className="h-5 w-5" />
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        )}

        {session && (
          <form className="mt-4 flex flex-col gap-3" onSubmit={leaveEntry}>
            <textarea
              ref={inputEl}
              aria-label="Your message"
              placeholder="Your message..."
              required
              rows={3}
              maxLength={500}
              className="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:focus:border-gray-700 dark:focus:ring-neutral-600"
            />

            <button
              type="submit"
              disabled={form.state === 'loading'}
              className="grid w-full place-items-center rounded bg-neutral-100 px-3 py-2 font-medium ring-gray-300 transition-all hover:ring-2 dark:bg-gray-600 dark:text-white"
            >
              {form.state === 'loading' ? <LoadingSpinner /> : 'Sign'}
            </button>
          </form>
        )}

        {/* Feedback messages */}
        {form.state === 'error' && (
          <div className="mt-3">
            <ErrorMessage>{form.message}</ErrorMessage>
          </div>
        )}
        {form.state === 'success' && (
          <div className="mt-3">
            <SuccessMessage>{form.message}</SuccessMessage>
          </div>
        )}
      </div>

      {/* Guestbook Entries */}
      <div className="mt-6 w-full">
        {entries?.length > 0 ? (
          entries.map((entry) => (
            <GuestbookEntry key={entry.id} entry={entry} user={session?.user} />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">No entries yet.</p>
        )}
      </div>
    </>
  )
}
