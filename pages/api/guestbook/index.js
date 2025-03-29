import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const entries = await prisma.guestbook.findMany({
        orderBy: {
          updated_at: 'desc',
        },
      })

      return res.status(200).json(
        entries.map((entry) => ({
          id: entry.id.toString(),
          body: entry.body,
          created_by: entry.created_by,
          updated_at: entry.updated_at,
        }))
      )
    } catch (error) {
      console.error('Error fetching guestbook entries:', error)
      return res.status(500).json({ error: 'Failed to fetch entries' })
    }
  }

  if (req.method === 'POST') {
    const session = await getSession({ req })

    if (!session || !session.user) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const { name, email } = session.user
    const bodyContent = (req.body.body || '').slice(0, 500).trim()

    if (!bodyContent) {
      return res.status(400).json({ error: 'Entry body cannot be empty' })
    }

    try {
      const newEntry = await prisma.guestbook.create({
        data: {
          body: bodyContent,
          created_by: name,
          email: email,
        },
      })

      return res.status(201).json({
        id: newEntry.id.toString(),
        body: newEntry.body,
        created_by: newEntry.created_by,
        updated_at: newEntry.updated_at,
      })
    } catch (error) {
      console.error('Error creating guestbook entry:', error)
      return res.status(500).json({ error: 'Failed to create entry' })
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
