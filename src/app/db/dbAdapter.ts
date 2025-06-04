import { Plant, DbSchema } from "./types";

class DatabaseAdapter {
    private db: any; 
    private static instance: DatabaseAdapter;

    private constructor() {}

    // Using singleton pattern to ensure only one instance of the database adapter
    static async getInstance(): Promise<DatabaseAdapter> {
        if (!DatabaseAdapter.instance) {
            DatabaseAdapter.instance = new DatabaseAdapter();
            // Only initialize the database on the server side
            if (typeof window === 'undefined') {
                const { join } = await import('path');
                const { Low } = await import('lowdb');
                const { JSONFile } = await import('lowdb/node');
                
                const file = join(process.cwd(), "db.json");
                const adapter = new JSONFile<DbSchema>(file);
                DatabaseAdapter.instance.db = new Low(adapter, {plants: []});
                await DatabaseAdapter.instance.db.read();
            }
        }
        return DatabaseAdapter.instance;
    }

    // Get all plants
    async getPlants(): Promise<Plant[]> {
        if (!this.db) {
            throw new Error('Database not initialized. This method should only be called on the server side.');
        }
        return this.db.data.plants;
    }

    // Add a new plant
    async addPlant(plant: Plant): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized. This method should only be called on the server side.');
        }
        this.db.data.plants.push(plant);
        await this.db.write();
    }
}

export const getDatabase = DatabaseAdapter.getInstance;