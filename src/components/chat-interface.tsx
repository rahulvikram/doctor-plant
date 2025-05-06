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

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
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
  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("yellow leaves") || lowerQuery.includes("yellowing")) {
      return "Yellowing leaves can be caused by several factors: overwatering, underwatering, nutrient deficiencies (especially nitrogen), or insufficient light. Check the soil moisture first - it should be moist but not soggy. If you'd like a more accurate diagnosis, please upload a photo of your plant."
    } else if (lowerQuery.includes("brown spots") || lowerQuery.includes("spots")) {
      return "Brown spots on leaves often indicate fungal infection, which can be caused by overwatering or high humidity. Try to improve air circulation around your plant and avoid getting water on the leaves when watering. A fungicide may help if the problem persists. Would you like to upload an image for a more specific diagnosis?"
    } else if (lowerQuery.includes("water") || lowerQuery.includes("watering")) {
      return "Proper watering depends on the plant species, pot size, and environmental conditions. As a general rule, water when the top inch of soil feels dry. Most plants prefer thorough watering until water drains from the bottom, then allowing the soil to dry somewhat before watering again. What specific plant are you asking about?"
    } else if (lowerQuery.includes("fertilizer") || lowerQuery.includes("feed")) {
      return "Most houseplants benefit from fertilizing during their active growing season (spring and summer) with a balanced, water-soluble fertilizer diluted to half the recommended strength. Reduce or stop fertilizing in fall and winter when growth slows. What type of plant are you growing?"
    } else if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
      return "Hello! I'm your LeafLens plant health assistant. How can I help with your plants today? You can ask me about plant care, disease symptoms, or upload a photo for analysis."
    } else if (lowerQuery.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions about your plants. I'm here to help!"
    } else {
      return "I'd be happy to help with your plant question. For the most accurate advice, consider uploading a photo of your plant so I can see exactly what you're describing. Would you like specific care tips or disease identification?"
    }
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
