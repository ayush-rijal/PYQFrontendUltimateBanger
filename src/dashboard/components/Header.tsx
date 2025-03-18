"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Bell, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface UserResponse {
  username: string;
  status: "success" | "error";
  message?: string;
}

interface HeaderProps {
  apiEndpoint?: string;
  onSearch?: (term: string) => void;
  onProfileClick?: () => void;
  firstName?: string;
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const fetchUsername = async (
  endpoint: string,
  token?: string
): Promise<UserResponse> => {
  const response = await fetch(endpoint, {
    method: "GET",
    credentials: "include", // Include cookies if your JWT is stored in an HTTP-only cookie
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Add JWT token if provided
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch username: ${response.statusText}`);
  }

  const data = await response.json();
  // Adjust this based on your backend's actual response shape
  return {
    username: data.username || "Unknown",
    status: "success",
    message: data.message,
  };
};

const Header: React.FC<HeaderProps> = ({
  apiEndpoint = "http://localhost:8000/userapi/jwt/verify/",
  onSearch,
  onProfileClick,
  firstName,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("User");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>(getTimeBasedGreeting());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadUsername = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual JWT token retrieval logic
      const token = localStorage.getItem("jwt_token") || ""; // Example: token from localStorage
      const data = await fetchUsername(apiEndpoint, token);
      if (data.status === "success") {
        setUsername(data.username);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user data";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setUsername("User");
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, toast]);

  useEffect(() => {
    loadUsername();
    const updateGreeting = () => setGreeting(getTimeBasedGreeting());
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [loadUsername]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleProfileClick = useCallback(
    () => onProfileClick?.(),
    [onProfileClick]
  );

  return (
    <header
      className={cn(
        "w-full bg-white dark:bg-gray-900 shadow-sm py-4 px-6 rounded-lg",
        isLoading && "opacity-75"
      )}
      aria-busy={isLoading}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-shrink-0">
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"
            aria-label={`${greeting} ${firstName || username}`}
          >
            {greeting}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              {isLoading ? "Loading..." : firstName || username}
            </span>
            <span className="animate-wave">👋</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Let’s explore new learning opportunities!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72 transition-all duration-300">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isLoading}
              className={cn(
                "w-full h-11 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-gray-800 border",
                "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                "transition-all duration-200",
                isFocused && "shadow-md",
                isLoading && "cursor-not-allowed"
              )}
              aria-label="Search courses"
            />
            <Search
              size={18}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "text-gray-400 transition-colors",
                isFocused && "text-blue-500",
                isLoading && "text-gray-300"
              )}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
              disabled={isLoading}
            >
              <Bell size={18} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </Button>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={handleProfileClick}
                disabled={isLoading}
              >
                <User size={16} />
                <span className="font-medium">Profile</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Edit profile"
              disabled={isLoading}
            >
              <Edit size={18} className="text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
