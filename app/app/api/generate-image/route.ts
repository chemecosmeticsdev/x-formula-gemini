
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, productName, description } = await request.json();
    
    if (!prompt || !productName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll use the asset retrieval system to generate images
    // This would call an actual image generation service in production
    
    // Create a detailed image generation prompt for cosmetic products
    const detailedPrompt = `Create a professional, high-quality product mockup image for "${productName}".

Product Details: ${description}

Visual Style:
- Clean, modern aesthetic with soft shadows and premium lighting
- Minimalist packaging design with elegant typography
- Soft pastel color palette (whites, creams, soft pinks, or light blues)
- Professional product photography style similar to luxury beauty brands
- Show the product in an attractive cosmetic container appropriate for the product type:
  * Serum: elegant dropper bottle with clear or tinted glass
  * Cream/Moisturizer: premium jar or tube with clean labels
  * Cleanser: modern pump bottle or squeeze tube
  * Sunscreen: sleek tube or pump dispenser
- Include subtle gradient backgrounds or soft geometric patterns
- Add realistic reflections and shadows for depth and dimension
- Premium, luxury cosmetic product aesthetic that looks Instagram-worthy
- Clean, sans-serif fonts for any branding elements
- 16:9 aspect ratio for optimal web display

Technical Requirements:
- Photorealistic 3D rendering quality
- Commercial product photography standards
- High resolution and crisp details
- Professional studio lighting setup
- No people or hands in the image
- Focus entirely on the product and packaging`;

    // Simulate image generation process
    const imageUrl = await generateProductImage(detailedPrompt, productName, description);
    
    return NextResponse.json({ 
      imageUrl,
      status: 'success'
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { 
        error: 'Image generation failed',
        imageUrl: getDefaultProductImage('')
      },
      { status: 500 }
    );
  }
}

async function generateProductImage(prompt: string, productName: string, description: string): Promise<string> {
  // For this demo, we'll use high-quality stock images that match the product type
  // In production, this would call an actual AI image generation service
  
  const productType = description.toLowerCase();
  
  // Enhanced image selection based on product characteristics
  if (productType.includes('serum') || productType.includes('essence')) {
    const serumImages = [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format&q=80'
    ];
    return serumImages[Math.floor(Math.random() * serumImages.length)];
  }
  
  if (productType.includes('cream') || productType.includes('moisturizer') || productType.includes('lotion')) {
    const creamImages = [
      'https://m.media-amazon.com/images/I/61bAPJahObL._UF894,1000_QL80_.jpg',
      'https://m.media-amazon.com/images/I/61jeXEEvGAL._UF1000,1000_QL80_.jpg',
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=450&fit=crop&auto=format&q=80'
    ];
    return creamImages[Math.floor(Math.random() * creamImages.length)];
  }
  
  if (productType.includes('cleanser') || productType.includes('foam') || productType.includes('wash')) {
    const cleanserImages = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=450&fit=crop&auto=format&q=80'
    ];
    return cleanserImages[Math.floor(Math.random() * cleanserImages.length)];
  }
  
  if (productType.includes('sunscreen') || productType.includes('spf') || productType.includes('sun protection')) {
    const sunscreenImages = [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=450&fit=crop&auto=format&q=80',
      'https://images.everydayhealth.com/images/wellness/sun-care-products-that-dermatologists-use-1440x810.jpg?sfvrsn=ff4d2286_5'
    ];
    return sunscreenImages[Math.floor(Math.random() * sunscreenImages.length)];
  }
  
  // Default high-quality cosmetic product images
  const defaultImages = [
    'https://i.pinimg.com/564x/3f/c5/56/3fc5569e6773dbe40c34964bb6c3d0a1.jpg',
    'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=450&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=450&fit=crop&auto=format&q=80'
  ];
  
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

function getDefaultProductImage(description: string): string {
  // Fallback image for errors
  return 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081';
}
