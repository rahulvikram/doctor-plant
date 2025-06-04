import { join } from "path";
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node'
import { Treatment, DbSchema } from "./Types";

class DatabaseAdapter {
    private db: Low<DbSchema>;
    private static instance: DatabaseAdapter;

    private constructor() {
        const file = join(process.cwd(), "db.json");
        const adapter = new JSONFile<DbSchema>(file);
        this.db = new Low(adapter, {treatments: []});
    }

    // Using singleton pattern to ensure only one instance of the database adapter
    static async getInstance(): Promise<DatabaseAdapter> {
        if (!DatabaseAdapter.instance) {
            DatabaseAdapter.instance = new DatabaseAdapter();
            await DatabaseAdapter.instance.db.read();
        }
        return DatabaseAdapter.instance;
    }

    // Get all treatments
    async getTreatments(): Promise<Treatment[]> {
        return this.db.data.treatments
    }

    // Add a new treatment plan
    async addTreatment(treatment: Treatment): Promise<void> {

    }
}

export const getDatabase = DatabaseAdapter.getInstance;