"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface ImageUploadButtonProps {
  children: React.ReactNode
  onImageUpload: (file: File) => void
}

export function ImageUploadButton({ children, onImageUpload }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        onImageUpload(file)
      }

      // Reset the input so the same file can be uploaded again
      e.target.value = ""
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleClick}
        className="border-[#D8EFD9] text-[#4CAF50] hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
      >
        {children}
      </Button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </>
  )
}
