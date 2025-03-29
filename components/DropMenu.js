import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import classNames from 'classnames'
import { useSession, signIn, signOut } from 'next-auth/react'
import useSound from 'use-sound'

import Link from './Link'
import {
  CodeIcon,
  HomeIcon,
  Pencil1Icon,
  DiscIcon,
  HamburgerMenuIcon,
  FrameIcon,
  LaptopIcon,
  BarChartIcon,
  DrawingPinIcon,
  Link2Icon,
  QuoteIcon,
  CalendarIcon,
  PersonIcon,
  ArchiveIcon,
  TwitterLogoIcon,
  RocketIcon,
  ChatBubbleIcon,
  EnterIcon,
} from '@radix-ui/react-icons'

export default function DropMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [ThemeSound] = useSound('/static/sounds/page-change.mp3')

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }) // Redirects after logout
    localStorage.clear() // Clears stored session
    sessionStorage.clear()
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
    })
    window.location.reload() // Force refresh
  }

  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <div>
        <Menu.Button className="ml-2 cursor-pointer rounded-full bg-zinc-300 ring-zinc-400 transition-all hover:bg-violet-400 hover:ring-1 dark:bg-zinc-700 dark:ring-violet-700 dark:hover:bg-violet-600">
          <motion.button
            className="flex h-8 w-8 items-center justify-center p-2"
            whileTap={{ scale: 0.5 }}
            transition={{ duration: 0.1, ease: 'easeIn' }}
            aria-label="Toggle List Menu"
            type="button"
          >
            <HamburgerMenuIcon className="h-4 w-4" />
          </motion.button>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        afterEnter={() => ThemeSound()}
        afterLeave={() => ThemeSound()}
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-300 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-zinc-700 dark:bg-zinc-800">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link href="/">
                  <a
                    className={classNames(
                      active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex flex-row">
                      <HomeIcon className="mr-4 mt-0.5" /> Home
                    </div>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href="/blog">
                  <a
                    className={classNames(
                      active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex flex-row">
                      <Pencil1Icon className="mr-4 mt-0.5" /> Blog
                    </div>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href="/snippets">
                  <a
                    className={classNames(
                      active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex flex-row">
                      <CodeIcon className="mr-4 mt-0.5" /> Snippets
                    </div>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href="/projects">
                  <a
                    className={classNames(
                      active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex flex-row">
                      <ArchiveIcon className="mr-4 mt-0.5" /> Projects
                    </div>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link href="/about">
                  <a
                    className={classNames(
                      active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <div className="flex flex-row">
                      <PersonIcon className="mr-4 mt-0.5" /> About
                    </div>
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={session ? handleLogout : signIn}
                  className={classNames(
                    active ? 'bg-gray-200 dark:bg-zinc-700' : '',
                    'flex w-full items-center px-4 py-2 text-sm'
                  )}
                >
                  {session ? (
                    <>
                      {session.user?.image && (
                        <img
                          className="mr-2 h-6 w-6 rounded-full"
                          src={session.user.image}
                          alt="User Profile"
                        />
                      )}
                      Sign Out
                    </>
                  ) : (
                    <>
                      <EnterIcon className="mr-4 mt-0.5" />
                      Sign In
                    </>
                  )}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
