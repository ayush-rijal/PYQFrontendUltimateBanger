"use client";
import React from "react";
// import { BookOpen } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center">
                <Image src="/logo.svg" alt="logo" height={300} width={300}/>
              </div>
              <span className="font-bold text-xl from-amber-500 to-amber-700">PastYearQuestion</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              The modern learning platform for Nepalese students.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="font-medium mb-4 text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Real-time Collaboration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Result Analysis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  AI-Powered Whiteboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Real-time Chat
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Skill Improvement
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Past Papers
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-medium mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-medium mb-4 text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} PastYearQuestion. All rights reserved.
          </p>
          <nav aria-label="Social media links">
            <ul className="flex gap-6">
              {[
                { name: "Twitter", href: "#" },
                { name: "Facebook", href: "#" },
                { name: "Instagram", href: "#" },
                { name: "LinkedIn", href: "#" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}