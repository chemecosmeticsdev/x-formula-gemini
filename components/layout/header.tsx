
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Menu, X, ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Create Formula", href: "/form" },
    { 
      name: "Chemecosmetics.com", 
      href: "https://chemecosmetics.com/product-category/cosmetics/", 
      external: true 
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              X FORMULA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`group flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {item.external && (
                  <ShoppingBag className="h-4 w-4" />
                )}
                <span>{item.name}</span>
                {item.external && (
                  <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/form">
              <Button className="btn-cosmetics">
                Generate Formula
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`group flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.external && (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                  <span>{item.name}</span>
                  {item.external && (
                    <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Link href="/form" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full btn-cosmetics">
                    Generate Formula
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
