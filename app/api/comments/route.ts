import { type NextRequest, NextResponse } from "next/server"

// Mock comments storage
let comments: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get("documentId")

  const documentComments = comments.filter((comment) => comment.documentId === documentId)
  return NextResponse.json(documentComments)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { documentId, userId, text, position, selection } = body

  const newComment = {
    id: Date.now().toString(),
    documentId,
    userId,
    text,
    position,
    selection,
    createdAt: new Date(),
    resolved: false,
    replies: [],
  }

  comments.push(newComment)

  return NextResponse.json(newComment)
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, resolved, reply } = body

  const commentIndex = comments.findIndex((comment) => comment.id === id)

  if (commentIndex === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 })
  }

  if (resolved !== undefined) {
    comments[commentIndex].resolved = resolved
  }

  if (reply) {
    comments[commentIndex].replies.push({
      id: Date.now().toString(),
      userId: reply.userId,
      text: reply.text,
      createdAt: new Date(),
    })
  }

  return NextResponse.json(comments[commentIndex])
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const commentId = searchParams.get("id")

  comments = comments.filter((comment) => comment.id !== commentId)

  return NextResponse.json({ success: true })
}
