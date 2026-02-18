"use client";

import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-muted/30 border-t py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight">InnerHue</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your mindful companion for emotional well-being. Reflect, understand, and grow with every visit.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#mood-selection" className="hover:text-primary transition-colors">
                  Mood Selection
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-primary transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/music" className="hover:text-primary transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col justify-center items-center gap-2 text-sm text-foreground/80 md:flex-row md:justify-center">
          <p className="flex items-center gap-1 text-center">
            <span>© {new Date().getFullYear()} InnerHue. Crafted with care for emotional well-being. All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
