"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, UploadIcon, X, Crop, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDatabase } from "@/app/db/dbAdapter"
import { Plant } from "@/app/db/types"
import { v4 as uuidv4 } from 'uuid';

export function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [plantType, setPlantType] = useState<string>("")
  const [plantSpecies, setPlantSpecies] = useState<string>("")
  const [symptoms, setSymptoms] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const API_ROUTE_PORT = process.env.NEXT_PUBLIC_API_ROUTE_PORT || 5000

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      addFiles(newFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => file.type.startsWith("image/"))

    if (validFiles.length === 0) return

    const newPreviews: string[] = []

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string)
          if (newPreviews.length === validFiles.length) {
            setPreviews((prev) => [...prev, ...newPreviews])
            setFiles((prev) => [...prev, ...validFiles])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      addFiles(newFiles)
    }
  }

  const removeImage = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setFiles(newFiles)
    setPreviews(newPreviews)

    if (selectedImageIndex === index) {
      setSelectedImageIndex(null)
    } else if (selectedImageIndex !== null && selectedImageIndex > index) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // check if the user has uploaded any images
    if (files.length === 0) {
      alert("Please upload at least one image")
      return
    }

    // set the isUploading state to true to show the loading spinner
    setIsUploading(true)

    // set up the form data to send to the server
    const formData = new FormData()
    formData.append("plant_type", plantType)
    formData.append("plant_species", plantSpecies)
    formData.append("prompt", symptoms)
    formData.append("image", files[0])

    // send the form data to the server flask api route
    try {
      const response = await fetch(`http://localhost:${API_ROUTE_PORT}/analyze`, {
        method: "POST",
        body: formData
      })

      if (response.ok) {      
        const data = await response.json()
        const analysisResults = data.analysis
        
        // Download the PDF
        const pdfUrl = `http://localhost:${API_ROUTE_PORT}/download-pdf/${data.pdf_timestamp}`
        window.open(pdfUrl, '_blank')

        // Add the treatment to the database
        const plant: Plant = {
          id: uuidv4(),
          species: analysisResults.plant_species,
          image: previews[0],
          diagnosis: analysisResults.disease_detected,
          treatments: analysisResults.recommendations,
          confidence: analysisResults.confidence,
          severity: analysisResults.severity.toLowerCase() as "low" | "medium" | "high",
          plant_health: analysisResults.plant_health.toLowerCase() as "excellent" | "good" | "fair" | "poor" | "critical",
          date: new Date(),
          notes: symptoms
        }

        // Save plant using the API route
        const plantResponse = await fetch('/api/plants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(plant)
        })

        if (!plantResponse.ok) {
          throw new Error('Failed to save plant data')
        }

        // Reset form state
        setFiles([])
        setPreviews([])
        setSelectedImageIndex(null)
        setPlantType("")
        setPlantSpecies("")
        setSymptoms("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      
        alert("Plant analysis completed successfully!")
        router.push("/dashboard")
      } else {
        let errorMessage = `Error analyzing plant: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData && errorData.error) {
            errorMessage = `Error analyzing plant: ${errorData.error}`
          }
        } catch (jsonError) {
          console.warn("Response was not valid JSON. Reading as text.")
          try {
            const errorText = await response.text()
            errorMessage = `Error analyzing plant: ${response.status} ${response.statusText}. Server response: ${errorText.substring(0, 300)}...`
          } catch (textError) {
            console.error("Could not read error response as text.", textError)
          }
        }
        alert(errorMessage)
      }
    } catch (error) {
      console.error("Error analyzing plant:", error)
    } finally {
      setIsUploading(false)
    }

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-[#4CAF50] bg-[#E8F5E9]" : "border-[#D8EFD9] hover:border-[#4CAF50] hover:bg-[#F8FFF8]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <ImagePlus className="h-8 w-8 text-[#4CAF50]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#2E7D32]">Drag and drop your plant images</h3>
            <p className="text-sm text-[#558B59] mt-1">or click to browse from your device</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-[#A8E6CF] text-[#2E7D32] hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Select Images
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-[#558B59]">Supported formats: JPG, PNG, WEBP (max 10MB)</p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-medium text-[#2E7D32]">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden border-2 aspect-square ${
                  selectedImageIndex === index ? "border-[#4CAF50]" : "border-transparent"
                }`}
              >
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Plant image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4 text-[#558B59]" />
                </button>
                {selectedImageIndex === index && (
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm"
                    onClick={() => {}}
                  >
                    <Crop className="h-4 w-4 text-[#558B59]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plant-type" className="text-[#2E7D32]">
              Plant Type
            </Label>
            <Select value={plantType} onValueChange={setPlantType}>
              <SelectTrigger id="plant-type" className="border-[#D8EFD9] text-black">
                <SelectValue placeholder="Select plant type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="houseplant">Houseplant</SelectItem>
                <SelectItem value="garden">Garden Plant</SelectItem>
                <SelectItem value="vegetable">Vegetable</SelectItem>
                <SelectItem value="fruit">Fruit Tree/Plant</SelectItem>
                <SelectItem value="flower">Flower</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plant-species" className="text-[#2E7D32]">
              Plant Species (if known)
            </Label>
            <Input
              id="plant-species"
              value={plantSpecies}
              onChange={(e) => setPlantSpecies(e.target.value)}
              placeholder="E.g., Monstera, Tomato, Rose"
              className="border-[#D8EFD9] text-black"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="symptoms" className="text-[#2E7D32]">
            Symptoms or Concerns
          </Label>
          <Textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe any symptoms or concerns you've noticed (e.g., yellow leaves, spots, wilting)"
            className="border-[#D8EFD9] min-h-[100px] text-black"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button" // Ensure cancel button does not submit the form
          onClick={() => {
            if (!isUploading) { // Prevent navigation if uploading
              router.back()
            }
          }}
          className="bg-white text-[#4CAF50] border-green-800 mr-2" // Added margin for spacing
          disabled={isUploading} // Disable cancel button during upload
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#4CAF50] hover:bg-[#3B8C3F] text-white"
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>Analyze Images</>
          )}
        </Button>
      </div>
    </form>
  )
}
