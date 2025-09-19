const GEMINI_IMAGE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage";

async function generateProductImage(formulaData, userInput, apiKey) {
  try {
    console.log("🎨 Starting AI image generation...");
    
    const imagePrompt = `Professional cosmetics product photography of "${formulaData.name}" - ${formulaData.type}.
    
    Product details: ${formulaData.description}
    User request: ${userInput.productDescription}
    
    Requirements: High-end cosmetics product photography, clean white background, professional studio lighting, luxury packaging design, premium container, commercial product photography style, sharp focus, professional shadows and highlights.
    
    Create a marketable cosmetics product image suitable for e-commerce.`;

    console.log("📝 Image prompt created");
    
    const response = await fetch(`${GEMINI_IMAGE_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        imageGenerationConfig: {
          aspectRatio: "4:3",
          negativePrompt: "blurry, low quality, text, watermark, logo, amateur, cartoon, anime, drawing, sketch"
        }
      })
    });

    console.log("📡 Image API response status:", response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log("📦 Image API response:", result);
      
      const imageData = result.candidates?.[0]?.image?.bytesBase64Jpeg;
      if (imageData) {
        formulaData.mockup_image = `data:image/jpeg;base64,${imageData}`;
        console.log("✅ AI image generated successfully!");
        return true;
      } else {
        console.warn("❌ No image data in response");
      }
    } else {
      const errorText = await response.text();
      console.error("❌ Image API error:", response.status, errorText);
    }
    
  } catch (error) {
    console.error("💥 Image generation error:", error);
  }
  
  // Fallback
  console.warn("🔄 Using fallback image");
  formulaData.mockup_image = "/images/placeholder-mockup.jpg";
  return false;
}

export { generateProductImage };
