"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface RegionSelectorProps {
  imageUrl: string
}

export function RegionSelector({ imageUrl }: RegionSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [endX, setEndX] = useState(0)
  const [endY, setEndY] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = imageUrl
    imageRef.current = image

    image.onload = () => {
      setImageLoaded(true)

      if (canvasRef.current) {
        const canvas = canvasRef.current
        const container = canvas.parentElement

        if (container) {
          const containerWidth = container.clientWidth
          const aspectRatio = image.height / image.width

          const canvasWidth = containerWidth
          const canvasHeight = containerWidth * aspectRatio

          setCanvasSize({ width: canvasWidth, height: canvasHeight })
        }
      }
    }
  }, [imageUrl])

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx && imageRef.current) {
        // Draw the image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)

        // Draw the selection rectangle if we have coordinates
        if (isDrawing || (endX !== 0 && endY !== 0)) {
          const rectX = Math.min(startX, endX)
          const rectY = Math.min(startY, endY)
          const rectWidth = Math.abs(endX - startX)
          const rectHeight = Math.abs(endY - startY)

          // Draw semi-transparent overlay
          ctx.fillStyle = "rgba(76, 175, 80, 0.2)"
          ctx.fillRect(rectX, rectY, rectWidth, rectHeight)

          // Draw border
          ctx.strokeStyle = "#4CAF50"
          ctx.lineWidth = 2
          ctx.strokeRect(rectX, rectY, rectWidth, rectHeight)
        }
      }
    }
  }, [imageLoaded, isDrawing, startX, startY, endX, endY, canvasSize])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setIsDrawing(true)
      setStartX(x)
      setStartY(y)
      setEndX(x)
      setEndY(y)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setEndX(x)
      setEndY(y)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (canvasRef.current && e.touches.length > 0) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setIsDrawing(true)
      setStartX(x)
      setStartY(y)
      setEndX(x)
      setEndY(y)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing && canvasRef.current && e.touches.length > 0) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setEndX(x)
      setEndY(y)
    }
  }

  const handleTouchEnd = () => {
    setIsDrawing(false)
  }

  const resetSelection = () => {
    setStartX(0)
    setStartY(0)
    setEndX(0)
    setEndY(0)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full rounded-lg cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {endX !== 0 && endY !== 0 && (
        <button
          type="button"
          className="absolute top-2 right-2 bg-white text-[#558B59] text-xs px-2 py-1 rounded shadow-sm"
          onClick={resetSelection}
        >
          Reset Selection
        </button>
      )}
      <div className="mt-2 text-xs text-[#558B59] text-center">
        Click and drag to select the affected area of your plant
      </div>
    </div>
  )
}
