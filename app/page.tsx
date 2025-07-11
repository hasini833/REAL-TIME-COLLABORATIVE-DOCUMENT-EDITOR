"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Users,
  Share2,
  Save,
  Download,
  MessageCircle,
  Eye,
  Edit3,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface User {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number }
}

interface Comment {
  id: string
  user: string
  text: string
  position: number
  timestamp: Date
}

export default function CollaborativeEditor() {
  const [document, setDocument] = useState("")
  const [title, setTitle] = useState("Untitled Document")
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "You", color: "#3b82f6" },
    { id: "2", name: "Alice", color: "#ef4444" },
    { id: "3", name: "Bob", color: "#10b981" },
    { id: "4", name: "Carol", color: "#f59e0b" },
  ])
  const [comments, setComments] = useState<Comment[]>([])
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [wordCount, setWordCount] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const words = document
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [document])

  const handleDocumentChange = (value: string) => {
    setDocument(value)

    // Simulate real-time typing indicators
    setIsTyping((prev) => (prev.includes("You") ? prev : [...prev, "You"]))

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping((prev) => prev.filter((user) => user !== "You"))
    }, 1000)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }

  const addComment = () => {
    if (selectedText) {
      const newComment: Comment = {
        id: Date.now().toString(),
        user: "You",
        text: `Comment on: "${selectedText}"`,
        position: document.indexOf(selectedText),
        timestamp: new Date(),
      }
      setComments((prev) => [...prev, newComment])
      setSelectedText("")
    }
  }

  const formatText = (format: string) => {
    // Simulate text formatting
    console.log(`Formatting text with: ${format}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold border-none shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
                placeholder="Document title"
              />
            </motion.div>
            <Badge variant="secondary" className="animate-pulse">
              Auto-saved
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Avatars */}
            <div className="flex -space-x-2">
              <AnimatePresence>
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{ scale: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  >
                    <Avatar className="border-2 border-white shadow-md" style={{ borderColor: user.color }}>
                      <AvatarFallback style={{ backgroundColor: user.color + "20", color: user.color }}>
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-64 bg-white border-r border-slate-200 p-4 space-y-4"
        >
          <div>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Collaborators
            </h3>
            <div className="space-y-2">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
                  <span className="text-sm">{user.name}</span>
                  {isTyping.includes(user.name) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex space-x-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments
            </h3>
            <Button variant="outline" size="sm" onClick={() => setShowComments(!showComments)} className="w-full">
              {showComments ? "Hide" : "Show"} Comments ({comments.length})
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600 space-y-1">
              <div>Words: {wordCount}</div>
              <div>Characters: {document.length}</div>
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {users.length} viewing
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Editor */}
        <div className="flex-1 flex">
          <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 p-6"
            onMouseMove={handleMouseMove}
          >
            {/* Toolbar */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg border border-slate-200 p-3 mb-4 shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
                  {[Bold, Italic, Underline].map((Icon, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => formatText(Icon.name.toLowerCase())}
                      className="p-2 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
                  {[AlignLeft, AlignCenter, AlignRight].map((Icon, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => formatText(`align-${Icon.name.toLowerCase()}`)}
                      className="p-2 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded hover:bg-slate-100 transition-colors"
                  >
                    <Type className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded hover:bg-slate-100 transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Editor */}
            <Card className="relative overflow-hidden">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <textarea
                  ref={editorRef}
                  value={document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  onSelect={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    const selected = target.value.substring(target.selectionStart, target.selectionEnd)
                    setSelectedText(selected)
                  }}
                  placeholder="Start typing your document..."
                  className="w-full h-[600px] p-6 border-none outline-none resize-none text-slate-700 leading-relaxed text-lg bg-transparent"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                />

                {/* Collaborative Cursors */}
                <AnimatePresence>
                  {users.slice(1).map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute pointer-events-none"
                      style={{
                        left: Math.random() * 80 + 10 + "%",
                        top: Math.random() * 60 + 20 + "%",
                      }}
                    >
                      <div className="w-0.5 h-6 animate-pulse" style={{ backgroundColor: user.color }} />
                      <div
                        className="absolute -top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicators */}
                <AnimatePresence>
                  {isTyping.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-4 left-6 flex items-center space-x-2 text-sm text-slate-500"
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span>{isTyping.join(", ")} typing...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Card>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between mt-4"
            >
              <div className="flex items-center space-x-2">
                {selectedText && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Button size="sm" onClick={addComment}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.main>

          {/* Comments Panel */}
          <AnimatePresence>
            {showComments && (
              <motion.aside
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-80 bg-white border-l border-slate-200 p-4"
              >
                <h3 className="font-semibold text-slate-700 mb-4">Comments</h3>
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{comment.user}</span>
                        <span className="text-xs text-slate-500">{comment.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-slate-700">{comment.text}</p>
                    </motion.div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center text-slate-500 py-8">
                      No comments yet. Select text to add a comment.
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Edit3 className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  )
}
