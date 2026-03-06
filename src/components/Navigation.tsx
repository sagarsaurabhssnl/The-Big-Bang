
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Box, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Box className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold tracking-tight text-foreground font-headline">SceneCraft</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#showcase" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Showcase</Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Get Started
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 ease-in-out",
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-4">
          <Link href="#features" className="block text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>Features</Link>
          <Link href="#showcase" className="block text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>Showcase</Link>
          <Link href="#about" className="block text-base font-medium text-muted-foreground hover:text-primary" onClick={() => setIsOpen(false)}>About</Link>
          <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
