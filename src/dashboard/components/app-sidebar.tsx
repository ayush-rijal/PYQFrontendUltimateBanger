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
  Lock,
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

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: string;
  isLocked?: boolean;
}

const menuItems: MenuItem[] = [
  { title: "Home", url: "/dashboard", icon: Home, category: "Main" },
  { title: "Inbox", url: "/inbox", icon: Inbox, category: "Main" },
  { title: "To-Do", url: "/todo", icon: Calendar, category: "Main" },
  {
    title: "Lab",
    url: "/lab",
    icon: Presentation,
    category: "Work",
    isLocked: true,
  },
  {
    title: "Result Analysis",
    url: "/results",
    icon: ChartNoAxesCombined,
    category: "Work",
  },
  {
    title: "Collab",
    url: "/whiteboard",
    icon: Users,
    category: "Work",
    isLocked: true,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageCircle,
    category: "Communication",
    isLocked: true,
  },
  {
    title: "Skills",
    url: "/skills",
    icon: BookOpen,
    category: "Learning",
    isLocked: true,
  },
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

// Group and sort items by category, putting locked items last
const groupedItems = menuItems.reduce((acc, item) => {
  const category = item.category || "Other";
  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
}, {} as Record<string, MenuItem[]>);

// Sort each category to show unlocked items first
Object.keys(groupedItems).forEach((category) => {
  groupedItems[category].sort((a, b) => {
    if (!a.isLocked && b.isLocked) return -1;
    if (a.isLocked && !b.isLocked) return 1;
    return 0;
  });
});

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      dispatch(setLogout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
                        asChild={!item.isLocked}
                        tooltip={
                          item.isLocked
                            ? `${item.title} (Coming Soon)`
                            : item.title
                        }
                        className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                          item.isLocked
                            ? "cursor-not-allowed opacity-50"
                            : isSelected(item.url)
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hover:w-48 md:hover:bg-gray-100 dark:md:hover:bg-gray-800 md:hover:shadow-md"
                        }`}
                      >
                        {item.isLocked ? (
                          <div className="flex items-center gap-3 w-full">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate hidden md:group-hover:block">
                              {item.title}
                            </span>
                            <Lock className="h-4 w-4 ml-auto hidden md:group-hover:block" />
                          </div>
                        ) : (
                          <a
                            href={item.url}
                            className="flex items-center gap-3 w-full"
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate hidden md:group-hover:block ">
                              {item.title}
                            </span>
                          </a>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

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
