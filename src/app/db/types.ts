export interface Plant {
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

export interface DbSchema {
    plants: Plant[]
}