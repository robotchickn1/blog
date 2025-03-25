import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const { id } = req.query

  // Fetch entry
  const entry = await prisma.guestbook.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' })
  }

  if (req.method === 'GET') {
    return res.json({
      id: entry.id.toString(),
      body: entry.body,
      created_by: entry.created_by,
      updated_at: entry.updated_at,
    })
  }

  if (session.user.email !== entry.email) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (req.method === 'DELETE') {
    await prisma.guestbook.delete({
      where: {
        id: Number(id),
      },
    })
    return res.status(204).json({})
  }

  if (req.method === 'PUT') {
    const body = (req.body.body || '').slice(0, 500)

    await prisma.guestbook.update({
      where: { id: Number(id) },
      data: {
        body,
        updated_at: new Date().toISOString(),
      },
    })

    return res.status(201).json({
      ...entry,
      body,
    })
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
