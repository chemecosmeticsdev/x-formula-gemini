
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, FlaskConical, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200"
          >
            <Zap className="h-4 w-4" />
            AI-Powered Cosmetics Research Platform
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Formula Ideas</span>
            <br />
            with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Advanced cosmetics ingredient research platform for B2B customers. 
            Get detailed product research reports and AI-generated formulas to aid your purchase decisions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/form">
              <Button size="lg" className="btn-cosmetics text-lg px-8 py-4 group">
                <FlaskConical className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Generate Formula
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 border-gray-300 hover:border-blue-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <StatCard number="900+" label="Cosmetics Ingredients" />
            <StatCard number="50+" label="Formula Types" />
            <StatCard number="AI" label="Powered Research" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="cosmetics-card p-6 text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2 count-up">
        {number}
      </div>
      <div className="text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
}
