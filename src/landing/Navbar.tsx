"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    setIsMounted(true);

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          !target.closest(".navbar-container") &&
          !target.closest(".mobile-menu")
        ) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full px-4 py-4 fixed top-0 left-0 z-50">
      <nav className="navbar-container max-w-[800px] mx-auto rounded-full dark:bg-slate-600/50 backdrop-blur-md  shadow-lg  bg-gradient-to-r border-2 border-amber-900  flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-inner">
            <Image src="/logo.svg" width="300" height="300" alt="logo" />
          </div>
          <p className="ml-2 text-x font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            PastYearQuestion
          </p>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl hover:bg-muted"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            asChild
            variant="secondary"
            className="rounded-xl font-medium px-6"
          >
            <Link href="/auth/login">Log In</Link>
          </Button>

          <Button
            asChild
            className={cn(
              "rounded-xl font-medium px-6 border-0",
              "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800",
              "text-white"
            )}
          >
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-xl hover:bg-muted"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-xl hover:bg-muted"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="mobile-menu absolute top-[calc(4rem+4rem)] left-0 right-0 rounded-2xl backdrop-blur-md bg-background/70 p-4 border-2 border-amber-400 dark:border-amber-300 shadow-lg mx-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <Button
              asChild
              variant="secondary"
              className="w-full rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/login">Log In</Link>
            </Button>

            <Button
              asChild
              className={cn(
                "w-full rounded-xl border-0",
                "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800",
                "text-white"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
