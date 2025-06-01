import express from "express";
import env from "dotenv";
import cors from "cors";
import multer from "multer";
import compressImage from "./compressImage.js";

env.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Image processing service is running' });
});

app.post('/compress', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
        const compressedFile = await compressImage(req.file.buffer);
        
        // Get the correct MIME type based on the original file
        const mimeType = req.file.mimetype.startsWith('image/png') ? 'image/png' : 'image/jpeg';
        
        // Convert buffer to base64 string with correct MIME type
        const base64String = `data:${mimeType};base64,${compressedFile.toString('base64')}`;
        
        res.status(200).json({ 
            compressedFile: base64String,
            originalSize: req.file.size,
            compressedSize: compressedFile.length
        });
    } catch (error) {
        console.error('Error compressing image:', error);
        res.status(500).json({ error: 'Failed to compress image' });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
