
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FormulaForm } from "@/components/form/formula-form";
import { Beaker, Sparkles } from "lucide-react";

export default function FormPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Beaker className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Formula
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Describe your product vision and let our AI generate a detailed cosmetics formula 
              with ingredients, percentages, and professional instructions.
            </p>
          </div>

          {/* Form Section */}
          <div className="form-container p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Product Description
              </h2>
            </div>
            
            <Suspense fallback={
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            }>
              <FormulaForm />
            </Suspense>
          </div>

          {/* Example Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              💡 Example Description:
            </h3>
            <p className="text-blue-800 italic">
              "I want to create a lightweight anti-aging serum for sensitive skin. 
              It should contain vitamin C for brightening, hyaluronic acid for hydration, 
              and peptides for firming. The texture should be lightweight and fast-absorbing, 
              suitable for daily use under makeup. pH should be skin-friendly around 5.5-6.0."
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
