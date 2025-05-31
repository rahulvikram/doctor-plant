import { Avatar } from "@/components/ui/avatar"
import { Leaf, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  imageUrl?: string
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar
        className={cn("h-8 w-8 border", isUser ? "bg-[#E8F5E9] border-[#A8E6CF]" : "bg-[#4CAF50] border-[#4CAF50]")}
      >
        {isUser ? <User className="h-4 w-4 text-[#4CAF50]" /> : <Leaf className="h-4 w-4 text-white" />}
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-white border border-[#D8EFD9] text-[#2E7D32]",
        )}
      >
        {message.imageUrl && (
          <div className="mb-2">
            <img
              src={message.imageUrl || "/placeholder.svg"}
              alt="Uploaded plant"
              className="rounded-md max-h-48 object-contain"
            />
          </div>
        )}

        <p className="text-sm">{message.content}</p>

        <div className="mt-1 text-xs opacity-70">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}
