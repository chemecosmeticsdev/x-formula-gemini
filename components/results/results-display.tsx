
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Printer, 
  Share2, 
  Loader2, 
  AlertCircle, 
  FlaskConical,
  Eye,
  Clock,
  Shield,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedFormula, FormData } from "@/lib/types";
import Image from "next/image";

export function ResultsDisplay() {
  const [formula, setFormula] = useState<GeneratedFormula | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<FormData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get the request data from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("formulaRequest");
      if (stored) {
        try {
          const data = JSON.parse(stored) as FormData;
          setRequestData(data);
          generateFormula(data);
        } catch (err) {
          console.error("Error parsing stored data:", err);
          setError("Invalid request data");
          setIsLoading(false);
        }
      } else {
        setError("No product description found. Please go back to the form.");
        setIsLoading(false);
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
          mockup_image: "https://t4.ftcdn.net/jpg/05/48/18/43/360_F_548184349_aE1jiNSqyEmG8qhEOF5rcK2pTW0ClqqR.jpg",
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
        
        // Add a product mockup image
        formulaData.mockup_image = "https://i.ytimg.com/vi/3IL-gbbeYqE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAEQxCEog1f9iJbB0tBxuYrJ2O-og";
        
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

  const handleDownloadPDF = () => {
    toast({
      title: "Feature Coming Soon",
      description: "PDF download functionality will be available in a future update.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Print functionality will be available in a future update.",
    });
  };

  const handleShare = async () => {
    if (navigator.share && formula) {
      try {
        await navigator.share({
          title: `Formula: ${formula.name}`,
          text: `Check out this AI-generated cosmetics formula: ${formula.description}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard?.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Formula link copied to clipboard!",
        });
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast({
        title: "Link Copied", 
        description: "Formula link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Generating Your Formula</h3>
          <p className="text-gray-600 max-w-md">
            Our AI is analyzing ingredients and creating your personalized cosmetics formula...
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
            <p className="text-blue-900 text-sm">
              This typically takes 30-60 seconds for complex formulations
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">Generation Failed</h3>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.href = "/form"} className="btn-cosmetics">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!formula) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-center space-y-4">
          <FlaskConical className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">No Formula Generated</h3>
          <p className="text-gray-600">Please try generating a new formula.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center no-print">
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Formula
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Formula
        </Button>
      </div>

      {/* Formula Overview */}
      <div className="formula-grid">
        {/* Main Formula Info */}
        <div className="cosmetics-card p-8 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{formula.name}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{formula.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formula.type}</div>
              <div className="text-sm text-gray-600">Product Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formula.properties.ph}</div>
              <div className="text-sm text-gray-600">pH Range</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formula.properties.viscosity}</div>
              <div className="text-sm text-gray-600">Viscosity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formula.cost_estimate}</div>
              <div className="text-sm text-gray-600">Est. Cost</div>
            </div>
          </div>
        </div>

        {/* Product Properties */}
        <div className="cosmetics-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Properties</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div><strong>Stability:</strong> {formula.properties.stability}</div>
            <div><strong>Shelf Life:</strong> {formula.properties.shelfLife}</div>
            <div><strong>pH:</strong> {formula.properties.ph}</div>
            <div><strong>Viscosity:</strong> {formula.properties.viscosity}</div>
          </div>
        </div>

        {/* Claims */}
        <div className="cosmetics-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Product Claims</h3>
          </div>
          <div className="space-y-1">
            {formula.claims?.map((claim, index) => (
              <div key={index} className="text-sm text-gray-700 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                {claim}
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="cosmetics-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Cost Analysis</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-2">{formula.cost_estimate}</div>
          <div className="text-sm text-gray-600">
            Estimated cost per 100g finished product
          </div>
        </div>

        {/* Mockup Image */}
        {formula.mockup_image && (
          <div className="cosmetics-card p-6 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Product Mockup</h3>
            </div>
            <div className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={formula.mockup_image}
                alt={`${formula.name} product mockup`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        {/* Ingredients List */}
        <div className="cosmetics-card p-6 md:col-span-full">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Formula Ingredients</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Phase</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Ingredient</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">INCI Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-900">Function</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-900">%</th>
                </tr>
              </thead>
              <tbody>
                {formula.ingredients?.map((ingredient, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {ingredient.phase}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium text-gray-900">{ingredient.name}</td>
                    <td className="py-3 px-2 text-gray-600 text-sm">{ingredient.inci_name || "—"}</td>
                    <td className="py-3 px-2 text-gray-600 text-sm">{ingredient.function}</td>
                    <td className="py-3 px-2 text-right font-mono font-semibold text-blue-600">
                      {ingredient.percentage?.toFixed(2)}%
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 font-semibold">
                  <td className="py-3 px-2" colSpan={4}>Total</td>
                  <td className="py-3 px-2 text-right font-mono text-blue-600">
                    {formula.ingredients?.reduce((sum, ing) => sum + (ing.percentage || 0), 0)?.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing Instructions */}
        <div className="cosmetics-card p-6 md:col-span-full">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Processing Instructions</h3>
          </div>
          <div className="space-y-4">
            {formula.instructions?.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="text-gray-700">{instruction}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
