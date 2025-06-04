"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, AlertTriangle } from "lucide-react"

type Plant = {
  id: string
  name: string
  species: string
  image: string
  diagnosis: string
  treatments: string[]
  confidence: string
  severity: "low" | "medium" | "high"
  plant_health: "excellent" | "good" | "fair" | "poor" | "critical"
  date: Date
  notes?: string
}

interface PlantCardProps {
  plant: Plant
  viewMode: "grid" | "list"
  onClick: () => void
}

export function PlantCard({ plant, viewMode, onClick }: PlantCardProps) {
  const getHealthColor = (health: Plant["plant_health"]) => {
    switch (health) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-green-100 text-green-700"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: Plant["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="border-[#D8EFD9] hover:border-[#4CAF50] transition-colors cursor-pointer" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img
              src={plant.image || "/placeholder.svg"}
              alt={plant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[#2E7D32] truncate">{plant.name}</h3>
                <Badge className={getHealthColor(plant.plant_health)}>{plant.plant_health}</Badge>
              </div>
              <p className="text-sm text-[#558B59] mb-1">{plant.species}</p>
              <p className="text-sm text-[#2E7D32] truncate">{plant.diagnosis}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#558B59]">
              <div className="text-center">
                <div className="font-medium text-[#2E7D32]">{plant.confidence}%</div>
                <div>Confidence</div>
              </div>
              <Badge className={getSeverityColor(plant.severity)}>{plant.severity}</Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{plant.date.toLocaleDateString()}</span>
              </div>
              <Button size="sm" variant="outline" className="border-[#4CAF50] text-[#4CAF50]">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#D8EFD9] hover:border-[#4CAF50] transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={plant.image || "/placeholder.svg"}
            alt={plant.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge className={getHealthColor(plant.plant_health)}>{plant.plant_health}</Badge>
            {plant.severity === "high" && (
              <Badge className="bg-red-100 text-red-800">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-white/90 text-[#2E7D32]">{plant.confidence}% confidence</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-[#2E7D32] mb-1">{plant.name}</h3>
            <p className="text-sm text-[#558B59] italic">{plant.species}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#2E7D32] mb-1">Diagnosis</h4>
            <p className="text-sm text-[#558B59]">{plant.diagnosis}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#2E7D32] mb-1">Treatments</h4>
            <div className="flex flex-wrap gap-1">
              {plant.treatments.slice(0, 2).map((treatment, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-[#E8F5E9] text-[#2E7D32]">
                  {treatment}
                </Badge>
              ))}
              {plant.treatments.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-[#E8F5E9] text-[#2E7D32]">
                  +{plant.treatments.length - 2} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E8F5E9]">
            <div className="flex items-center gap-1 text-xs text-[#558B59]">
              <Calendar className="h-3 w-3" />
              <span>{plant.date.toLocaleDateString()}</span>
            </div>
            <Badge className={getSeverityColor(plant.severity)}>{plant.severity}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
