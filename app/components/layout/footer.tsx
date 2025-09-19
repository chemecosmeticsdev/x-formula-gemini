
import Link from "next/link";
import { FlaskConical, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FlaskConical className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">X FORMULA</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-sm">
              AI-powered cosmetics ingredient research platform helping B2B customers 
              make informed decisions with detailed product analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/form" className="text-gray-300 hover:text-white transition-colors">
                  Create Formula
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Technology</h3>
            <p className="text-gray-300 text-sm">
              Powered by advanced AI technology for accurate cosmetics formulation 
              and ingredient analysis.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 X Formula Platform. Advanced cosmetics research technology.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              Made with <Heart className="h-4 w-4 text-red-500" /> for cosmetics professionals
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
