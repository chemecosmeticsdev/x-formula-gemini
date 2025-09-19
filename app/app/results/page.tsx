
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ResultsDisplay } from "@/components/results/results-display";
import { FlaskConical, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/form" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FlaskConical className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your AI-Generated Formula
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete cosmetics formula with ingredients, instructions, and professional analysis
            </p>
          </div>

          {/* Results Section */}
          <Suspense fallback={
            <div className="space-y-8">
              <div className="formula-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="cosmetics-card p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <ResultsDisplay />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
