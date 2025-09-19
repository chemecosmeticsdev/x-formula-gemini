
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, FlaskConical } from "lucide-react";

export function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById("cta-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="cta-section"
      className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full filter blur-3xl" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Your Formula?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
            Join cosmetics professionals using AI-powered formulation technology. 
            Generate your first formula in under 60 seconds.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/form">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 group border-0"
              >
                <FlaskConical className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Generate Formula Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-8 mt-16 text-blue-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Industry Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Instant Results</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
