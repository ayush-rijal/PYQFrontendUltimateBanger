"use client";

import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Spinner } from "@/components/common";
import { useState, useEffect } from "react";
import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@/redux/notification/notificationsSlice";
import { RootState, AppDispatch } from '@reduxjs/toolkit';

export default function Header() {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // notification dispatch
  const dispatch = useDispatch<AppDispatch>();
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

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
      <div className="flex justify-center items-center h-24">
        <Spinner />
      </div>
    );
  }

  // Fallback to initials if profilePicture is missing
  const profilePicSrc = user?.profilePicture || null;
  const userInitials = user?.first_name?.[0] || user?.username?.[0] || "U";
  const userName = user?.first_name || user?.username || "User";

  return (
    <header className="w-full bg-amber-200 text-black dark:text-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 rounded-4xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left section - Greeting */}
          <div className="flex items-center">
            <div className={`${showSearch ? "hidden md:block" : "block"}`}>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="hidden sm:inline">{greeting},</span> {userName}
                <span className="ml-2 wave text-amber-500">👋</span>
              </h1>
              <p className="hidden sm:block mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Welcome to your Dashboard
              </p>
            </div>
          </div>

          {/* Center section - Search */}
          <div
            className={`${
              showSearch ? "flex-1 mx-4" : "hidden md:block md:flex-1 md:mx-4"
            }`}
          >
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dashboard..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Search className="text-gray-500 dark:text-gray-400 h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white dark:text-amber-900">
                    {notifications.length > 99 ? "99+" : notifications.length}
                    <span className="sr-only">New notifications</span>
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification: any, i: number) => (
                      <DropdownMenuItem key={i} className="py-3 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {notification.title || "New update available"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message ||
                                "Check out the latest features in your dashboard"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {notification.time || "Just now"}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      🎉 You&apos;re all caught up! No new notifications.
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator />
                {/* <DropdownMenuItem className="justify-center">
                  <Link href="/" className="text-primary text-sm">
                    View all notifications
                  </Link>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-gray-100 dark:border-gray-800">
                    <AvatarImage src={profilePicSrc || ""} alt={userName} />
                    <AvatarFallback className="font-semibold bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profilePicSrc || ""} alt={userName} />
                    <AvatarFallback className="font-semibold bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/user/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/user/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .wave {
          display: inline-block;
          animation: wave 2s infinite;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-10deg);
          }
        }
      `}</style>
    </header>
  );
}
