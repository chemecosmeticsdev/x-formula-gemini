"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Download, Printer, Share, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Ingredient {
  name: string;
  inci_name: string;
  percentage: number;
  function: string;
  phase: string;
}

interface Formula {
  name: string;
  type: string;
  description: string;
  mockup_image: string;
  ingredients: Ingredient[];
  instructions: string[];
  properties: {
    ph: string;
    viscosity: string;
    stability: string;
    shelfLife: string;
  };
  claims: string[];
  cost_estimate: string;
}

interface FormData {
  productDescription: string;
  productType?: string;
  targetAudience?: string;
  budgetRange?: string;
}

export function ResultsDisplay() {
  const [formula, setFormula] = useState<Formula | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get stored data and generate formula
    const storedData = sessionStorage.getItem('formData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as FormData;
        generateFormula(data);
      } catch (err) {
        setError('Failed to retrieve form data');
      }
    }
  }, []);

  const generateFormula = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Direct Gemini API integration for AWS Amplify deployment
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      
      console.log('Environment check:', {
        hasPublicKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        hasPrivateKey: !!process.env.GEMINI_API_KEY,
        finalKey: !!GEMINI_API_KEY,
        keyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0
      });
      
      if (!GEMINI_API_KEY) {
        // Fallback to demo data if no API key available
        console.warn('No Gemini API key found, using demo data');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time

        const mockFormula = {
          name: `${data.productType || 'Custom'} Formula`,
          type: data.productType || "Beauty Product", 
          description: `A ${data.productType?.toLowerCase() || 'custom'} formulated based on: ${data.productDescription}`,
          mockup_image: "/images/placeholder-mockup.jpg",
          ingredients: [
            { name: "Aqua (Water)", inci_name: "Aqua", percentage: 65.0, function: "solvent", phase: "A" },
            { name: "Glycerin", inci_name: "Glycerin", percentage: 8.0, function: "humectant", phase: "A" },
            { name: "Zinc Oxide", inci_name: "Zinc Oxide", percentage: 15.0, function: "UV filter", phase: "B" },
            { name: "Niacinamide", inci_name: "Niacinamide", percentage: 4.0, function: "active", phase: "D" },
            { name: "Caprylic/Capric Triglyceride", inci_name: "Caprylic/Capric Triglyceride", percentage: 5.0, function: "emollient", phase: "B" },
            { name: "Phenoxyethanol", inci_name: "Phenoxyethanol", percentage: 1.0, function: "preservative", phase: "D" },
            { name: "Xanthan Gum", inci_name: "Xanthan Gum", percentage: 2.0, function: "thickener", phase: "C" }
          ],
          instructions: [
            "Heat Phase A (water phase) to 70°C while stirring gently",
            "In separate container, heat Phase B (oil phase) to 70°C",
            "Slowly add Phase B to Phase A while homogenizing at high speed",
            "Cool mixture to 40°C while stirring continuously",
            "Add Phase C (thickener) and mix until uniform",
            "At 30°C, add Phase D (actives and preservatives) one by one",
            "Continue cooling to room temperature while stirring",
            "Check pH and adjust if needed (target 5.5-6.0)",
            "Let mixture rest for 24h before final quality check"
          ],
          properties: { ph: "5.5-6.0", viscosity: "Medium", stability: "Stable for 24 months", shelfLife: "24 months" },
          claims: ["Suitable for sensitive skin", "Fragrance-free formula", "Non-greasy finish", "Professional formulation"],
          cost_estimate: "$12.50"
        };

        setFormula(mockFormula);
        setIsLoading(false);
        return;
      }

      // Real Gemini API call - using correct v1 endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a detailed cosmetics formula for: ${data.productDescription}. 
                     Product Type: ${data.productType || 'Not specified'}
                     Target Audience: ${data.targetAudience || 'General'}
                     Budget Range: ${data.budgetRange || 'Mid-range'}
                     
                     Please respond with ONLY a valid JSON object (no markdown formatting) with this exact structure:
                     {
                       "name": "Product name",
                       "type": "Product category",
                       "description": "Brief description",
                       "ingredients": [
                         {"name": "Ingredient name", "inci_name": "INCI name", "percentage": 5.0, "function": "ingredient function", "phase": "A"}
                       ],
                       "instructions": ["Step 1", "Step 2", "Step 3"],
                       "properties": {"ph": "5.5-6.0", "viscosity": "Medium", "stability": "24 months", "shelfLife": "24 months"},
                       "claims": ["Claim 1", "Claim 2"],
                       "cost_estimate": "$XX.XX"
                     }
                     
                     Use realistic cosmetic ingredients with proper INCI names and realistic percentages that add up to 100%.`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      const generatedText = result.candidates[0]?.content?.parts[0]?.text || '';
      
      try {
        // Clean the response - remove markdown formatting if present
        let cleanJson = generatedText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
        
        // Try to extract JSON if it's embedded in text
        const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanJson = jsonMatch[0];
        }
        
        const formulaData = JSON.parse(cleanJson);
        
        // CRITICAL: Generate AI product mockup image 
        console.log('🎨 DEBUGGING: Starting image generation...');
        console.log('🔑 API Key status:', GEMINI_API_KEY ? 'AVAILABLE' : 'MISSING');
        
        await generateProductImage(formulaData, data, GEMINI_API_KEY);
        
        setFormula(formulaData);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw API Response:', generatedText);
        throw new Error('Could not parse formula from AI response. Please try again.');
      }
      
      setIsLoading(false);

    } catch (err) {
      console.error("Error generating formula:", err);
      setError(err instanceof Error ? err.message : "Failed to generate formula");
      setIsLoading(false);
    }
  };

  // CRITICAL FUNCTION: AI Image Generation
  async function generateProductImage(formulaData: any, userInput: any, apiKey: string) {
    console.log('🎨 Starting AI image generation process...');
    
    // Test API key first
    console.log('🔑 Testing API key with basic call...');
    try {
      const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });
      console.log('🔍 API Key test result:', testResponse.status, testResponse.ok ? 'SUCCESS' : 'FAILED');
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('🚨 API Key test error:', errorText);
        formulaData.mockup_image = "/images/placeholder-mockup.jpg";
        return;
      }
    } catch (testError) {
      console.error('🚨 API Key test failed:', testError);
      formulaData.mockup_image = "/images/placeholder-mockup.jpg";
      return;
    }

    console.log('✅ API Key is valid, proceeding with image generation...');
    
    // Create image prompt
    const imagePrompt = `Professional cosmetics product photography: "${formulaData.name}" - ${formulaData.type}. Clean white background, studio lighting, luxury packaging, commercial product shot for ${userInput.productDescription}`;
    
    console.log('📝 Image prompt created:', imagePrompt.substring(0, 100) + '...');
    
    // Try different possible endpoints
    const imageEndpoints = [
      'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage',
      'https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate-001:generateImage',
      'https://generativelanguage.googleapis.com/v1beta/models/imagegeneration-004:generateImage'
    ];

    for (let i = 0; i < imageEndpoints.length; i++) {
      const endpoint = imageEndpoints[i];
      console.log(`🌐 Trying image endpoint ${i + 1}: ${endpoint}`);
      
      try {
        const response = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imagePrompt,
            imageGenerationConfig: {
              aspectRatio: "4:3",
              negativePrompt: "blurry, low quality"
            }
          })
        });

        console.log(`📡 Image API ${i + 1} response:`, response.status, response.statusText);
        
        if (response.ok) {
          const result = await response.json();
          console.log('📦 Image API response keys:', Object.keys(result));
          console.log('🖼️ Full response:', JSON.stringify(result, null, 2));
          
          const imageData = result.candidates?.[0]?.image?.bytesBase64Jpeg;
          if (imageData) {
            formulaData.mockup_image = `data:image/jpeg;base64,${imageData}`;
            console.log('✅ SUCCESS: AI image generated!');
            return;
          } else {
            console.warn('❌ No image data in successful response');
          }
        } else {
          const errorText = await response.text();
          console.error(`❌ Image API ${i + 1} error:`, response.status, errorText);
        }
      } catch (error) {
        console.error(`❌ Image endpoint ${i + 1} failed:`, error);
      }
    }

    console.warn('🔄 All image generation methods failed, using intelligent placeholder...');
    
    // Intelligent placeholder selection
    const productType = formulaData.type?.toLowerCase() || '';
    if (productType.includes('serum')) {
      formulaData.mockup_image = "https://images.unsplash.com/photo-1620916297593-6e5f6e4c2b27?w=800&h=600&fit=crop&auto=format&q=80";
    } else if (productType.includes('cream')) {
      formulaData.mockup_image = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&q=80";
    } else if (productType.includes('oil')) {
      formulaData.mockup_image = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=600&fit=crop&auto=format&q=80";
    } else {
      formulaData.mockup_image = "/images/placeholder-mockup.jpg";
    }
    
    console.log('📸 Using intelligent placeholder for:', productType);
  }

  const handleDownloadPDF = () => {
    toast({
      title: "Feature Coming Soon",
      description: "PDF download will be available in the next update.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Print functionality will be available in the next update.",
    });
  };

  const handleShare = () => {
    if (navigator.share && formula) {
      navigator.share({
        title: formula.name,
        text: formula.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Formula link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <h2 className="text-xl font-semibold mb-2">Generating Your Formula</h2>
              <p className="text-muted-foreground">
                Our AI is creating a custom cosmetics formula based on your requirements...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Generation Failed</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/form">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!formula) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No Formula Found</h2>
              <p className="text-muted-foreground mb-4">
                Please fill out the form to generate your custom formula.
              </p>
              <Link href="/form">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Form
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your AI-Generated Formula</h1>
            <p className="text-muted-foreground">
              Complete cosmetics formula with ingredients, instructions, and professional analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Share Formula</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Download PDF</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Print Formula</span>
            </Button>
          </div>
        </div>

        {/* Product Overview */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{formula.name}</h2>
              <p className="text-muted-foreground mb-4">{formula.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {formula.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Product Type</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    {formula.properties.ph}
                  </Badge>
                  <p className="text-sm text-muted-foreground">pH Range</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    {formula.properties.viscosity}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Viscosity</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">
                    {formula.cost_estimate}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Est. Cost</p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={formula.mockup_image}
                alt={`${formula.name} product mockup`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </Card>

        {/* Properties & Claims */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            <div className="space-y-3">
              {Object.entries(formula.properties).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize text-muted-foreground">
                    {key === 'ph' ? 'pH' : key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Product Claims</h3>
            <div className="space-y-2">
              {formula.claims.map((claim, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{claim}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cost Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{formula.cost_estimate}</span>
              <span className="text-sm text-muted-foreground">
                Estimated cost per 100g finished product
              </span>
            </div>
          </div>
        </Card>

        {/* Ingredients */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Formula Ingredients</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Ingredient Name</th>
                  <th className="text-left pb-2">INCI Name</th>
                  <th className="text-right pb-2">%</th>
                  <th className="text-left pb-2">Function</th>
                  <th className="text-center pb-2">Phase</th>
                </tr>
              </thead>
              <tbody>
                {formula.ingredients.map((ingredient, index) => (
                  <tr key={index} className="border-b border-muted">
                    <td className="py-2 font-medium">{ingredient.name}</td>
                    <td className="py-2 text-sm text-muted-foreground">
                      {ingredient.inci_name}
                    </td>
                    <td className="py-2 text-right font-mono">
                      {ingredient.percentage.toFixed(1)}%
                    </td>
                    <td className="py-2 text-sm capitalize">{ingredient.function}</td>
                    <td className="py-2 text-center">
                      <Badge variant="outline" className="text-xs">
                        {ingredient.phase}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Manufacturing Instructions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Manufacturing Instructions</h3>
          <div className="space-y-3">
            {formula.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Back to Form */}
        <div className="text-center">
          <Link href="/form">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Create Another Formula
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
