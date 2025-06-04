import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/db/dbAdapter';
import { Plant } from '@/app/db/types';


// GET all plants
export async function GET() {
    try {
        const db = await getDatabase();
        const plants = await db.getPlants();
        return NextResponse.json(plants);
    } catch (error) {
        console.error('GET /api/plants error:', error);
        return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 });
    }
}

// POST a new plant
export async function POST(request: Request) {
    try {
        const plant = await request.json() as Plant;
        const db = await getDatabase();
        await db.addPlant(plant);
        return NextResponse.json({ message: 'Plant added successfully' });
    } catch (error) {
        console.error('POST /api/plants error:', error);
        return NextResponse.json({ error: 'Failed to add plant' }, { status: 500 });
    }
}