"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Download, Share } from "lucide-react"

type Plant = {
  id: string
  name: string
  species: string
  image: string
  diagnosis: string
  treatments: string[]
  confidence: number
  severity: "low" | "medium" | "high"
  plant_health: "excellent" | "good" | "fair" | "poor" | "critical"
  date: Date
  notes?: string
}

interface PlantDetailModalProps {
  plant: Plant
  onClose: () => void
}

export function PlantDetailModal({ plant, onClose }: PlantDetailModalProps) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-[#2E7D32]">{plant.name}</DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-[#4CAF50] text-[#4CAF50]">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="border-[#4CAF50] text-[#4CAF50]">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image and Basic Info */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                className="w-full h-64 object-cover rounded-lg"
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
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-[#2E7D32] mb-1">Species</h3>
                <p className="text-[#558B59] italic">{plant.species}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[#2E7D32] mb-1">Confidence</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#E8F5E9] rounded-full h-2">
                      <div className="bg-[#4CAF50] h-2 rounded-full" style={{ width: `${plant.confidence}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-[#2E7D32]">{plant.confidence}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#2E7D32] mb-1">Severity</h4>
                  <Badge className={getSeverityColor(plant.severity)}>{plant.severity}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#2E7D32] mb-1">Date Added</h4>
                <div className="flex items-center gap-1 text-[#558B59]">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {plant.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis and Treatment */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[#2E7D32] mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Diagnosis
              </h3>
              <div className="bg-[#F8FFF8] p-4 rounded-lg border border-[#E8F5E9]">
                <p className="text-[#2E7D32]">{plant.diagnosis}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-[#2E7D32] mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recommended Treatments
              </h3>
              <div className="space-y-2">
                {plant.treatments.map((treatment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#F8FFF8] rounded-lg border border-[#E8F5E9]"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#4CAF50] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                    <p className="text-[#2E7D32]">{treatment}</p>
                  </div>
                ))}
              </div>
            </div>

            {plant.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-[#2E7D32] mb-3">Additional Notes</h3>
                  <div className="bg-[#F8FFF8] p-4 rounded-lg border border-[#E8F5E9]">
                    <p className="text-[#558B59]">{plant.notes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8F5E9]">
          <Button variant="outline" onClick={onClose} className="border-[#D8EFD9] text-[#558B59]">
            Close
          </Button>
          <Button className="bg-[#4CAF50] hover:bg-[#3B8C3F] text-white">Update Treatment</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
