// WebSocket server for real-time collaboration
// Run with: node scripts/websocket_server.js

const WebSocket = require("ws")
const http = require("http")

// Create HTTP server
const server = http.createServer()
const wss = new WebSocket.Server({ server })

// Store active connections and document states
const connections = new Map()
const documentStates = new Map()
const userCursors = new Map()

// Operational Transform functions
class Operation {
  constructor(type, position, content, length = 0) {
    this.type = type // 'insert', 'delete', 'retain'
    this.position = position
    this.content = content
    this.length = length
  }
}

function transformOperation(op1, op2) {
  // Simple operational transform implementation
  // In production, use a library like ShareJS or Yjs

  if (op1.type === "insert" && op2.type === "insert") {
    if (op1.position <= op2.position) {
      return new Operation(op2.type, op2.position + op1.content.length, op2.content)
    }
    return op2
  }

  if (op1.type === "delete" && op2.type === "insert") {
    if (op1.position < op2.position) {
      return new Operation(op2.type, op2.position - op1.length, op2.content)
    }
    return op2
  }

  if (op1.type === "insert" && op2.type === "delete") {
    if (op1.position <= op2.position) {
      return new Operation(op2.type, op2.position + op1.content.length, op2.content, op2.length)
    }
    return op2
  }

  if (op1.type === "delete" && op2.type === "delete") {
    if (op1.position < op2.position) {
      return new Operation(op2.type, op2.position - op1.length, op2.content, op2.length)
    }
    return op2
  }

  return op2
}

function applyOperation(content, operation) {
  switch (operation.type) {
    case "insert":
      return content.slice(0, operation.position) + operation.content + content.slice(operation.position)

    case "delete":
      return content.slice(0, operation.position) + content.slice(operation.position + operation.length)

    default:
      return content
  }
}

// WebSocket connection handler
wss.on("connection", (ws, request) => {
  console.log("New WebSocket connection established")

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      handleMessage(ws, data)
    } catch (error) {
      console.error("Error parsing message:", error)
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }))
    }
  })

  ws.on("close", () => {
    console.log("WebSocket connection closed")
    handleDisconnection(ws)
  })

  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
  })
})

function handleMessage(ws, data) {
  switch (data.type) {
    case "join_document":
      handleJoinDocument(ws, data)
      break

    case "leave_document":
      handleLeaveDocument(ws, data)
      break

    case "document_operation":
      handleDocumentOperation(ws, data)
      break

    case "cursor_update":
      handleCursorUpdate(ws, data)
      break

    case "typing_start":
      handleTypingStart(ws, data)
      break

    case "typing_stop":
      handleTypingStop(ws, data)
      break

    case "add_comment":
      handleAddComment(ws, data)
      break

    default:
      ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }))
  }
}

function handleJoinDocument(ws, data) {
  const { documentId, userId, userName } = data

  // Store connection info
  ws.documentId = documentId
  ws.userId = userId
  ws.userName = userName

  // Add to connections map
  if (!connections.has(documentId)) {
    connections.set(documentId, new Set())
  }
  connections.get(documentId).add(ws)

  // Initialize document state if not exists
  if (!documentStates.has(documentId)) {
    documentStates.set(documentId, {
      content: "",
      version: 0,
      operations: [],
    })
  }

  // Send current document state
  const documentState = documentStates.get(documentId)
  ws.send(
    JSON.stringify({
      type: "document_state",
      content: documentState.content,
      version: documentState.version,
    }),
  )

  // Notify other users
  broadcastToDocument(
    documentId,
    {
      type: "user_joined",
      userId,
      userName,
    },
    ws,
  )

  // Send list of active users
  const activeUsers = Array.from(connections.get(documentId)).map((connection) => ({
    userId: connection.userId,
    userName: connection.userName,
  }))

  ws.send(
    JSON.stringify({
      type: "active_users",
      users: activeUsers,
    }),
  )
}

function handleLeaveDocument(ws, data) {
  const { documentId } = data

  if (connections.has(documentId)) {
    connections.get(documentId).delete(ws)

    // Clean up empty document connections
    if (connections.get(documentId).size === 0) {
      connections.delete(documentId)
    }
  }

  // Notify other users
  broadcastToDocument(
    documentId,
    {
      type: "user_left",
      userId: ws.userId,
      userName: ws.userName,
    },
    ws,
  )
}

function handleDocumentOperation(ws, data) {
  const { documentId, operation, version } = data

  if (!documentStates.has(documentId)) {
    ws.send(JSON.stringify({ type: "error", message: "Document not found" }))
    return
  }

  const documentState = documentStates.get(documentId)

  // Check version for conflict resolution
  if (version !== documentState.version) {
    // Transform operation against newer operations
    let transformedOp = new Operation(operation.type, operation.position, operation.content, operation.length)

    const newerOps = documentState.operations.slice(version)
    for (const newerOp of newerOps) {
      transformedOp = transformOperation(newerOp, transformedOp)
    }

    operation.position = transformedOp.position
  }

  // Apply operation to document
  documentState.content = applyOperation(documentState.content, operation)
  documentState.version++
  documentState.operations.push(operation)

  // Keep only recent operations (for memory management)
  if (documentState.operations.length > 1000) {
    documentState.operations = documentState.operations.slice(-500)
  }

  // Broadcast operation to other users
  broadcastToDocument(
    documentId,
    {
      type: "document_operation",
      operation,
      version: documentState.version,
      userId: ws.userId,
    },
    ws,
  )

  // Send acknowledgment
  ws.send(
    JSON.stringify({
      type: "operation_ack",
      version: documentState.version,
    }),
  )
}

function handleCursorUpdate(ws, data) {
  const { documentId, position, selection } = data

  // Store cursor position
  const cursorKey = `${documentId}:${ws.userId}`
  userCursors.set(cursorKey, { position, selection, userId: ws.userId, userName: ws.userName })

  // Broadcast cursor update
  broadcastToDocument(
    documentId,
    {
      type: "cursor_update",
      userId: ws.userId,
      userName: ws.userName,
      position,
      selection,
    },
    ws,
  )
}

function handleTypingStart(ws, data) {
  const { documentId } = data

  broadcastToDocument(
    documentId,
    {
      type: "typing_start",
      userId: ws.userId,
      userName: ws.userName,
    },
    ws,
  )
}

function handleTypingStop(ws, data) {
  const { documentId } = data

  broadcastToDocument(
    documentId,
    {
      type: "typing_stop",
      userId: ws.userId,
      userName: ws.userName,
    },
    ws,
  )
}

function handleAddComment(ws, data) {
  const { documentId, comment } = data

  // In production, save comment to database
  const commentWithId = {
    ...comment,
    id: Date.now().toString(),
    userId: ws.userId,
    userName: ws.userName,
    timestamp: new Date().toISOString(),
  }

  // Broadcast comment to all users
  broadcastToDocument(documentId, {
    type: "comment_added",
    comment: commentWithId,
  })
}

function handleDisconnection(ws) {
  if (ws.documentId && ws.userId) {
    handleLeaveDocument(ws, { documentId: ws.documentId })

    // Clean up cursor data
    const cursorKey = `${ws.documentId}:${ws.userId}`
    userCursors.delete(cursorKey)
  }
}

function broadcastToDocument(documentId, message, excludeWs = null) {
  if (!connections.has(documentId)) return

  const documentConnections = connections.get(documentId)
  const messageStr = JSON.stringify(message)

  documentConnections.forEach((ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr)
    }
  })
}

// Start server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
  console.log("Ready for real-time collaborative editing!")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down WebSocket server...")
  wss.close(() => {
    server.close(() => {
      console.log("Server closed")
      process.exit(0)
    })
  })
})
