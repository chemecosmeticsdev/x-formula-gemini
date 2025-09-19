
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_DESCRIPTIONS = [
  "Create a lightweight anti-aging serum for sensitive skin with vitamin C, hyaluronic acid, and peptides. pH should be around 5.5-6.0.",
  "Develop a rich moisturizing cream for dry skin with ceramides and shea butter. Should have good spreadability and non-greasy finish.",
  "Formulate a gentle cleansing foam for oily skin with salicylic acid and niacinamide. pH around 5.5 for optimal efficacy.",
  "Design a sunscreen lotion SPF 30+ with zinc oxide and titanium dioxide. Should be water-resistant and suitable for daily use."
];

export function FormulaForm() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description?.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a product description to generate a formula.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Store the description in sessionStorage for the results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("formulaRequest", JSON.stringify({
          productDescription: description.trim(),
          timestamp: new Date().toISOString(),
        }));
      }

      // Navigate to results page - the API call will be made there
      router.push("/results");
      
    } catch (error) {
      console.error("Error preparing formula generation:", error);
      toast({
        title: "Error",
        description: "Failed to prepare formula generation. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const insertExample = (example: string) => {
    setDescription(example);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-lg font-medium text-gray-900">
            Product Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your cosmetic product in detail. Include target benefits, skin type, desired texture, key ingredients, pH requirements, and any specific constraints..."
            className="min-h-64 text-base resize-none border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            style={{ minHeight: '256px', height: '256px' }}
            rows={10}
            maxLength={2000}
            disabled={isGenerating}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Be specific about your product vision for better results</span>
            <span>{description?.length || 0}/2000</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          type="submit" 
          disabled={!description?.trim() || isGenerating} 
          className="w-full btn-cosmetics text-lg py-6"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Formula...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Generate AI Formula
            </>
          )}
        </Button>

        {/* Progress indicator */}
        {isGenerating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="text-blue-900 font-medium">Processing your request...</p>
                <p className="text-blue-700 text-sm">Our AI is analyzing ingredients and creating your formula</p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Example Descriptions */}
      {!isGenerating && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-900">
              Need Inspiration? Try These Examples:
            </h3>
          </div>
          <div className="space-y-3">
            {EXAMPLE_DESCRIPTIONS.map((example, index) => (
              <button
                key={index}
                onClick={() => insertExample(example)}
                className="w-full text-left p-3 bg-white border border-yellow-200 rounded-md hover:bg-yellow-50 hover:border-yellow-300 transition-colors text-sm text-gray-700"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
