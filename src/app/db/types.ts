export interface Treatment {
    id: string;
    disease: string;
    treatments: string[];
    image: string // base64 encoded image
    date: string;
}

export interface DbSchema {
    treatments: Treatment[];
}