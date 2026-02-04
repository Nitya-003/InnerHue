"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-transparent border-t border-white/10 py-12 mt-auto relative z-10 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">InnerHue</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your mindful companion for emotional well-being. Reflect, understand, and grow with every visit.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/mood" className="hover:text-pink-400 transition-colors">
                  Mood Selection
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-pink-400 transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/music" className="hover:text-pink-400 transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-pink-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-white">Community</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
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
                  className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
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
                  className="flex items-center space-x-2 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/privacy" className="hover:text-pink-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-pink-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} InnerHue. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for better mental health.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
