"use client";

import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

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
            <ul className="space-y-2 text-sm">
              <li className="relative group cursor-pointer transition-all">
                <Link href="/" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Home
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/#mood-selection" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Mood Selection
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/insights" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Insights
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/music" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Music
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/about" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    About
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/faqs" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    FAQs
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Github className="h-4 w-4" />
                  <span className="
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">GitHub</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">LinkedIn</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li className="relative group cursor-pointer transition-all">
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Privacy Policy
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
              </li>
              <li className="relative group cursor-pointer transition-all">
                <Link href="/terms" className="hover:text-primary transition-colors">
                  <span className="
                    text-muted-foreground
                    group-hover:text-transparent
                    group-hover:bg-gradient-to-r
                    group-hover:from-purple-700
                    group-hover:to-pink-400
                    group-hover:bg-clip-text
                    transition-all
                    duration-300
                  ">
                    Terms of Service
                  </span>
                </Link>
                <span className="
                  absolute
                  -left-4
                  top-1/2
                  -translate-y-1/2
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  text-purple-700
                ">
                  •
                </span>
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
