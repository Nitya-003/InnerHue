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