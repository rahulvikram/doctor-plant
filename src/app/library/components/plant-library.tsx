"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Loader2 } from "lucide-react"
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

export function PlantLibrary() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterHealth, setFilterHealth] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)

  // Fetch plants when component mounts
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/plants', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch plants')
        }

        const data = await response.json()
        // Convert date strings to Date objects
        const plantsWithDates = data.map((plant: any) => ({
          ...plant,
          date: new Date(plant.date)
        }))
        setPlants(plantsWithDates)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlants()
  }, [])

  const filteredAndSortedPlants = useMemo(() => {
    const filtered = plants.filter((plant) => {
        console.log(plant)
      const matchesSearch =
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

  // Add loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-8 w-8 text-[#4CAF50]" />
          </div>
          <h3 className="text-lg font-medium text-[#2E7D32]">Loading plants...</h3>
        </div>
      </div>
    )
  }

  // Add error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mx-auto mb-4">
          {/* You can add an error icon here */}
        </div>
        <h3 className="text-lg font-medium text-red-700 mb-2">Failed to load plants</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          Retry
        </Button>
      </div>
    )
  }

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
