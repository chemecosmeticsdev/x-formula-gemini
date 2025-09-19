
"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FlaskConical, Sparkles, BarChart3, Shield, Zap, Bot } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Analysis",
    description: "Advanced artificial intelligence analyzes thousands of ingredients to create optimal formulations tailored to your specific requirements.",
  },
  {
    icon: FlaskConical,
    title: "Professional Formulations", 
    description: "Generate complete cosmetics formulas with precise ingredient percentages, processing instructions, and quality specifications.",
  },
  {
    icon: BarChart3,
    title: "Detailed Research Reports",
    description: "Comprehensive analysis of ingredient properties, benefits, usage guidelines, and market pricing to support informed decisions.",
  },
  {
    icon: Shield,
    title: "Quality & Safety",
    description: "All formulations follow industry standards with safety guidelines, pH optimization, and stability recommendations.",
  },
  {
    icon: Sparkles,
    title: "Visual Mockups",
    description: "Generate realistic product mockups to visualize your formulations with professional NanoBanana-style visual appeal.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get complete formulations and research reports in seconds, streamlining your product development process.",
  },
];

export function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Professional Cosmetics Research Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by advanced AI technology and comprehensive ingredient databases to deliver 
            accurate formulations and market insights for cosmetics professionals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="cosmetics-card p-8 group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
