"use client";

import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Spinner } from "@/components/common";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

export default function Header() {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner lg />
      </div>
    );
  }

  return (
    <div className="">
      <header className="w-full  bg-amber-200 slide-out-to-bottom-0 text-black dark:text-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 rounded-4xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className=" rounded-full text-2xl font-bold text-black dark:text-white">
                {greeting}, {user?.first_name || "User"} !
                <span className="ml-2 wave">👋</span>
              </h1>
              <p className="mt-1 text-sm text-black dark:text-white">
                Welcome to your Dashboard
              </p>
            </div>
            <div className=" rounded-full relative w-full sm:w-64 border-3 border-amber-900 dark:border-none">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dashboard..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/20 white-black dark:text-white placeholder-amber-900 dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-white/30 "
              />
              <Search className="text-amber-900 dark:text-white h-5 w-5  absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className=" text-center justify-center items-center container mt-3 h-12 w-12">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={"/profile"}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* CSS for animations */}
      <style jsx>{`
        .wave {
          display: inline-block;
          animation: wave 2s infinite;
        }

        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
