import sharp from "sharp";

async function compressImage(fileBuffer) {
    try {
        // First, get the image metadata to determine the best format
        const metadata = await sharp(fileBuffer).metadata();
        
        // Process the image based on its format
        const compressedFile = await sharp(fileBuffer)
            .toColorspace("srgb")
            .resize(metadata.width, metadata.height, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .normalize()
            // Use JPEG for photos, PNG for graphics with transparency
            .toFormat(metadata.hasAlpha ? 'png' : 'jpeg', {
                quality: 50,  // For JPEG
                compressionLevel: 9  // For PNG
            })
            .toBuffer();
            
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
}

export default compressImage;