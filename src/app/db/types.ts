export interface Plant {
    id: string;
    disease: string;
    treatments: string[];
    image: string // base64 encoded image
    confidence: string;
    severity: string;
    plant_health: string;
    date: string;
}

export interface DbSchema {
    plants: Plant[];
}