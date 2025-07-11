import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use MongoDB or PostgreSQL
let documents: any[] = []
let documentVersions: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get("id")

  if (documentId) {
    const document = documents.find((doc) => doc.id === documentId)
    return NextResponse.json(document || { error: "Document not found" })
  }

  return NextResponse.json(documents)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, content, userId } = body

  const newDocument = {
    id: Date.now().toString(),
    title,
    content,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    collaborators: [userId],
    version: 1,
  }

  documents.push(newDocument)

  return NextResponse.json(newDocument)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, content, userId, operation } = body

  const documentIndex = documents.findIndex((doc) => doc.id === id)

  if (documentIndex === -1) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  // Store version for conflict resolution
  documentVersions.push({
    documentId: id,
    content: documents[documentIndex].content,
    version: documents[documentIndex].version,
    timestamp: new Date(),
    userId,
  })

  // Update document
  documents[documentIndex] = {
    ...documents[documentIndex],
    content,
    updatedAt: new Date(),
    version: documents[documentIndex].version + 1,
  }

  // Add collaborator if not already present
  if (!documents[documentIndex].collaborators.includes(userId)) {
    documents[documentIndex].collaborators.push(userId)
  }

  return NextResponse.json(documents[documentIndex])
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get("id")

  documents = documents.filter((doc) => doc.id !== documentId)
  documentVersions = documentVersions.filter((version) => version.documentId !== documentId)

  return NextResponse.json({ success: true })
}
