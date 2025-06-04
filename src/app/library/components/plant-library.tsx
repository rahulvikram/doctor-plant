"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List } from "lucide-react"
import { PlantCard } from "./plant-card"
import { PlantDetailModal } from "./plant-detail-modal"

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

// Mock data for demonstration
const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Leaf Yellowing - Overwatering",
    treatments: ["Reduce watering frequency", "Improve drainage", "Remove affected leaves"],
    confidence: 94,
    severity: "medium",
    plant_health: "fair",
    date: new Date("2024-01-15"),
    notes: "Large houseplant showing signs of overwatering. Owner reports watering daily.",
  },
  {
    id: "2",
    name: "Snake Plant",
    species: "Sansevieria trifasciata",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Root Rot - Severe Overwatering",
    treatments: ["Emergency repotting", "Antifungal treatment", "Quarantine from other plants"],
    confidence: 98,
    severity: "high",
    plant_health: "poor",
    date: new Date("2024-01-12"),
    notes: "Severe root rot detected. Immediate action required to save the plant.",
  },
  {
    id: "3",
    name: "Peace Lily",
    species: "Spathiphyllum wallisii",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Brown Leaf Tips - Low Humidity",
    treatments: ["Increase humidity", "Use distilled water", "Trim brown tips"],
    confidence: 87,
    severity: "low",
    plant_health: "good",
    date: new Date("2024-01-10"),
    notes: "Common issue with peace lilies in dry indoor environments.",
  },
  {
    id: "4",
    name: "Fiddle Leaf Fig",
    species: "Ficus lyrata",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Healthy Plant - No Issues Detected",
    treatments: ["Continue current care routine", "Monitor for changes"],
    confidence: 96,
    severity: "low",
    plant_health: "excellent",
    date: new Date("2024-01-08"),
    notes: "Plant appears healthy with no visible issues. Maintain current care schedule.",
  },
  {
    id: "5",
    name: "Rubber Plant",
    species: "Ficus elastica",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Pest Infestation - Spider Mites",
    treatments: ["Neem oil treatment", "Increase humidity", "Isolate plant", "Weekly monitoring"],
    confidence: 91,
    severity: "high",
    plant_health: "poor",
    date: new Date("2024-01-05"),
    notes: "Spider mites detected on undersides of leaves. Webbing visible.",
  },
  {
    id: "6",
    name: "Pothos",
    species: "Epipremnum aureum",
    image: "/placeholder.svg?height=300&width=300",
    diagnosis: "Nutrient Deficiency - Nitrogen",
    treatments: ["Balanced fertilizer", "Increase feeding frequency", "Check soil pH"],
    confidence: 89,
    severity: "medium",
    plant_health: "fair",
    date: new Date("2024-01-03"),
    notes: "Yellowing of older leaves indicates nitrogen deficiency.",
  },
]

export function PlantLibrary() {
  const [plants] = useState<Plant[]>(mockPlants)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterHealth, setFilterHealth] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)

  const filteredAndSortedPlants = useMemo(() => {
    const filtered = plants.filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesHealth = filterHealth === "all" || plant.plant_health === filterHealth
      const matchesSeverity = filterSeverity === "all" || plant.severity === filterSeverity

      return matchesSearch && matchesHealth && matchesSeverity
    })

    // Sort plants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.getTime() - a.date.getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "health":
          const healthOrder = { excellent: 5, good: 4, fair: 3, poor: 2, critical: 1 }
          return healthOrder[b.plant_health] - healthOrder[a.plant_health]
        case "confidence":
          return b.confidence - a.confidence
        default:
          return 0
      }
    })

    return filtered
  }, [plants, searchTerm, sortBy, filterHealth, filterSeverity])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D8EFD9] p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#558B59]" />
            <Input
              placeholder="Search plants, species, or diagnoses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#D8EFD9]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] border-[#D8EFD9]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="name">Plant Name</SelectItem>
                <SelectItem value="health">Health Status</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterHealth} onValueChange={setFilterHealth}>
              <SelectTrigger className="w-[130px] border-[#D8EFD9]">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[120px] border-[#D8EFD9]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border border-[#D8EFD9] rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-[#4CAF50] text-white hover:bg-[#3B8C3F]"
                    : "text-[#558B59] hover:text-[#2E7D32]"
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-[#4CAF50] text-white hover:bg-[#3B8C3F]"
                    : "text-[#558B59] hover:text-[#2E7D32]"
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#558B59]">
          <span>
            <strong className="text-[#2E7D32]">{filteredAndSortedPlants.length}</strong> plants found
          </span>
          <span>
            <strong className="text-[#2E7D32]">
              {
                filteredAndSortedPlants.filter((p) => p.plant_health === "excellent" || p.plant_health === "good")
                  .length
              }
            </strong>{" "}
            healthy
          </span>
          <span>
            <strong className="text-[#2E7D32]">
              {filteredAndSortedPlants.filter((p) => p.severity === "high").length}
            </strong>{" "}
            need attention
          </span>
        </div>
      </div>

      {/* Plants Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredAndSortedPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} viewMode={viewMode} onClick={() => setSelectedPlant(plant)} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedPlants.length === 0 && (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-[#4CAF50]" />
          </div>
          <h3 className="text-lg font-medium text-[#2E7D32] mb-2">No plants found</h3>
          <p className="text-[#558B59] mb-4">Try adjusting your search or filter criteria.</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setFilterHealth("all")
              setFilterSeverity("all")
            }}
            variant="outline"
            className="border-[#4CAF50] text-[#4CAF50] hover:bg-[#E8F5E9]"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Plant Detail Modal */}
      {selectedPlant && <PlantDetailModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />}
    </div>
  )
}
