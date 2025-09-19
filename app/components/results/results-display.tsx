
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

      const response = await fetch("/api/generate-formula", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";
      let partialRead = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.status === 'processing') {
                // Show progress feedback
                console.log('Processing...', parsed.message);
              } else if (parsed.status === 'completed') {
                setFormula(parsed.result);
                setIsLoading(false);
                return;
              } else if (parsed.status === 'error') {
                throw new Error(parsed.message || 'Generation failed');
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

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
