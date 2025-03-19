"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./personal-info-form";
import { ChangePasswordForm } from "./change-password-form";
import { ProfilePictureForm } from "./profile-picture-form";
import { Lock } from "lucide-react"; // Import lock icon
import type { User } from "@/lib/types";

interface ProfileTabsProps {
  user: User;
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("personal-info");

  // Tabs ko publish status (false bhaye locked)
  const publishedPages: Record<string, boolean> = {
    "personal-info": true,
    password: false, // Locked page
    "profile-picture": true,
  };

  return (
    <Tabs
      defaultValue="personal-info"
      value={activeTab}
      onValueChange={(val) => {
        if (publishedPages[val]) setActiveTab(val); // Prevent switching to locked tabs
      }}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
        {["personal-info", "password", "profile-picture"].map((tab) => {
          const isLocked = !publishedPages[tab];

          return (
            <div key={tab} className="relative">
              <TabsTrigger
                value={tab}
                className={`relative group ${
                  isLocked
                    ? "pointer-events-none opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLocked && (
                  <Lock
                    className="absolute inset-0 m-auto text-gray-400 group-hover:text-gray-700 transition-opacity opacity-60 group-hover:opacity-100"
                    size={18}
                  />
                )}
                <span className="group-hover:opacity-100 opacity-50 transition-opacity">
                  {tab === "personal-info"
                    ? "Personal Info"
                    : tab === "password"
                    ? "Password (Locked)"
                    : "Profile Picture"}
                </span>
              </TabsTrigger>
            </div>
          );
        })}
      </TabsList>

      <TabsContent value="personal-info" className="space-y-4">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          <PersonalInfoForm user={user} />
        </div>
      </TabsContent>

      <TabsContent value="password" className="space-y-4">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>
          <p className="text-center text-gray-500">
            🔒 This page is not published yet.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="profile-picture" className="space-y-4">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
          <ProfilePictureForm user={user} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
