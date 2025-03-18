"use client";
import {
  Calendar,
  Home,
  Inbox,
  Settings,
  Presentation,
  Users,
  ChartNoAxesCombined,
  MessageCircle,
  BookOpen,
  FileChartColumnIncreasing,
  Sun,
  Moon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter, // Added SidebarFooter
} from "@/components/ui/sidebar";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Define menu item type
interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
}

// Organized menu items with categories
const menuItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home, category: "Main" },
  { title: "Inbox", url: "/inbox", icon: Inbox, category: "Main" },
  { title: "To-Do", url: "/todo", icon: Calendar, category: "Main" },
  { title: "Lab", url: "/lab", icon: Presentation, category: "Work" },
  {
    title: "Result Analysis",
    url: "/results",
    icon: ChartNoAxesCombined,
    category: "Work",
  },
  { title: "Collab", url: "/whiteboard", icon: Users, category: "Work" },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageCircle,
    category: "Communication",
  },
  { title: "Skills", url: "/skills", icon: BookOpen, category: "Learning" },
  {
    title: "Quizzes",
    url: "/all_quizzes",
    icon: FileChartColumnIncreasing,
    category: "Learning",
  },
  {
    title: "Settings",
    url: "/profile",
    icon: Settings,
    category: "Configuration",
  },
];

// Group items by category
const groupedItems = menuItems.reduce((acc, item) => {
  const category = item.category || "Other";
  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
}, {} as Record<string, MenuItem[]>);

export function AppSidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to document
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <ScrollArea className="h-full">
          {Object.entries(groupedItems).map(([category, items]) => (
            <SidebarGroup key={category}>
              <SidebarGroupLabel>{category}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span className="truncate">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

      {/* Theme Toggle Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              className="w-full justify-start"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="truncate">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
