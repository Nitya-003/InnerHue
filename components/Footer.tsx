"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Mood Selection", href: "/#mood-selection" },
    { name: "Insights", href: "/insights" },
    { name: "Music", href: "/music" },
    { name: "About", href: "/about" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contributors", href: "/contributors" },
    { name: "FAQs", href: "/faqs" },
  ];

  return (
    <footer className="relative w-full mt-auto py-20 px-6 overflow-hidden">

      {/* Background Gradient Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-pink-500/10 blur-3xl opacity-60" />

      <div className="max-w-7xl mx-auto">

        {/* Glass Card Container */}
        <div className="
          relative
          rounded-3xl
          border
          border-white/20
          bg-white/10
          dark:bg-white/5
          backdrop-blur-2xl
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          px-10
          py-16
        ">

          {/* Light Reflection Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 relative z-10">

            {/* Brand */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                InnerHue
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Your mindful companion for emotional well-being.
                Reflect, understand, and grow with every visit.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Empower your mood journey. Discover, express,
                and embrace your feelings every day.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                Navigation
              </h3>
              <ul className="space-y-4">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <li key={link.name} className="group relative">
                      <Link
                        href={link.href}
                        className={`relative text-sm transition-all duration-300 ${
                          isActive
                            ? "text-indigo-600 font-medium"
                            : "text-muted-foreground hover:text-indigo-500"
                        }`}
                      >
                        {link.name}

                        {/* Animated underline */}
                        <span
                          className={`absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 ${
                            isActive && "scale-x-100"
                          }`}
                        />

                        {/* Active Glow */}
                        {isActive && (
                          <span className="absolute inset-0 -z-10 rounded-md bg-indigo-500/10 blur-md" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                Community
              </h3>
              <ul className="space-y-5">
                {[
                  { name: "GitHub", icon: Github, href: "https://github.com" },
                  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
                  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-indigo-500 transition-all duration-300 group"
                    >
                      <item.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                      <span className="relative">
                        {item.name}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-pink-500" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                Legal
              </h3>
              <ul className="space-y-4">
                {legalLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name} className="group relative">
                      <Link
                        href={link.href}
                        className={`relative text-sm transition-all duration-300 ${
                          isActive
                            ? "text-indigo-600 font-medium"
                            : "text-muted-foreground hover:text-indigo-500"
                        }`}
                      >
                        {link.name}

                        <span
                          className={`absolute left-0 -bottom-1 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-gradient-to-r from-indigo-500 to-pink-500 ${
                            isActive && "scale-x-100"
                          }`}
                        />

                        {isActive && (
                          <span className="absolute inset-0 -z-10 rounded-md bg-indigo-500/10 blur-md" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
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
                <Link href="/contributors" className="hover:text-primary transition-colors">
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
                    Contributors
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
                  href="https://github.com/Nitya-003/InnerHue" 
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

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-white/20 text-center text-sm text-muted-foreground relative z-10">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">
              InnerHue
            </span>{" "}
            — Crafted with care for emotional well-being.
          </div>
        </div>
      </div>
    </footer>
  );
}