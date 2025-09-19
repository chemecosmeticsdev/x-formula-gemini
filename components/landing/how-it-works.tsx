
"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FileText, Bot, FlaskConical, Download } from "lucide-react";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Describe Your Product",
    description: "Input your product vision, target benefits, constraints, and desired properties. Our AI understands natural language descriptions.",
  },
  {
    icon: Bot,
    number: "02", 
    title: "AI Analysis & Generation",
    description: "Our advanced AI analyzes your requirements against our comprehensive ingredient database to generate optimal formulations.",
  },
  {
    icon: FlaskConical,
    number: "03",
    title: "Review Your Formula",
    description: "Get complete formulations with ingredient percentages, processing instructions, properties analysis, and cost estimates.",
  },
  {
    icon: Download,
    number: "04",
    title: "Download & Implement",
    description: "Export your formula as PDF, print for manufacturing, or save for future reference and development iterations.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to generate professional cosmetics formulations 
            powered by artificial intelligence and industry expertise.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ 
                opacity: inView ? 1 : 0, 
                x: inView ? 0 : (index % 2 === 0 ? -50 : 50)
              }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Step Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step Visual */}
              <div className="flex-1 flex justify-center">
                <div className="cosmetics-card p-12 max-w-sm w-full">
                  <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-2xl mx-auto mb-6">
                    <step.icon className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      Step {step.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-2">
                      {step.title}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
