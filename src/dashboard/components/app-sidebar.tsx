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
  LogOut,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { usePathname } from "next/navigation";

// Define menu item type
interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
}

// Menu items with categories
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
    title: "Past Questions",
    url: "/quiz-app",
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
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(setLogout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check if the current path is active
  const isSelected = (url: string) => pathname === url;

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="bg-white dark:bg-gray-900"
    >
      <SidebarContent>
        <ScrollArea className="h-full py-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <SidebarGroup key={category}>
              <SidebarGroupLabel className="text-gray-700 dark:text-gray-300">
                {category}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          isSelected(item.url)
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        <a href={item.url}>
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

      {/* Footer with Theme Toggle and Logout */}
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="mb-2" />
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
              className="w-full justify-start gap-3 py-2 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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

          {isAuthenticated ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Log Out"
                className="w-full justify-start gap-3 py-2 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
                <span className="truncate">Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start gap-3 py-2 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <a href="/auth/login">
                    <LogOut className="h-5 w-5" />
                    <span className="truncate">Login</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start gap-3 py-2 px-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <a href="/auth/register">
                    <Users className="h-5 w-5" />
                    <span className="truncate">Register</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
