"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatMessage } from "@/components/chat-message"
import { ImageUploadButton } from "@/components/image-upload-button"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  imageUrl?: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your LeafLens plant health assistant. How can I help you with your plants today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 60000),
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const API_ROUTE_PORT = process.env.NEXT_PUBLIC_API_ROUTE_PORT

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim() && !e) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // AI response
    setTimeout(async () => {
      const response = await generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        // Add user message with image
        const userMessage: Message = {
          id: Date.now().toString(),
          content: "I've uploaded an image of my plant.",
          role: "user",
          timestamp: new Date(),
          imageUrl: e.target.result as string,
        }

        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        // Simulate AI response to image
        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              "I can see your plant image. It appears to be a healthy specimen, though I notice some slight discoloration on the leaves which might indicate early signs of nutrient deficiency. Would you like me to analyze this further or provide care recommendations?",
            role: "assistant",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }, 2000)
      }
    }
    reader.readAsDataURL(file)
  }

  // Simple response generator based on keywords
  const generateResponse = async (query: string): Promise<string> => {
    // make a request to the chat api route
    const response = await fetch(`http://localhost:${API_ROUTE_PORT}/chat`, {
      method: "POST",
      body: JSON.stringify({ message: query }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    return data.response
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-[#558B59]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">LeafLens is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-[#E8F5E9] p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <ImageUploadButton onImageUpload={handleImageUpload}>
            <ImageIcon className="h-5 w-5" />
          </ImageUploadButton>

          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about plant care, diseases, or upload a photo..."
            className="flex-1 border-[#D8EFD9] focus-visible:ring-[#4CAF50] text-[#427D32]"
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className={cn(
              "bg-[#4CAF50] hover:bg-[#3B8C3F] text-white",
              (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed",
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>

        <div className="mt-2 text-xs text-[#558B59] text-center">
          For more detailed analysis, upload plant images or visit our{" "}
          <a href="/upload" className="text-[#4CAF50] hover:underline">
            image upload page
          </a>
        </div>
      </div>
    </div>
  )
}
