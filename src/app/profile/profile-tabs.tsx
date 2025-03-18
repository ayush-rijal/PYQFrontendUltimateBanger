"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "./personal-info-form"
import { ChangePasswordForm } from "./change-password-form"
import { ProfilePictureForm } from "./profile-picture-form"
import type { User } from "@/lib/types"

interface ProfileTabsProps {
  user: User
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("personal-info")

  return (
    <Tabs defaultValue="personal-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
        <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="profile-picture">Profile Picture</TabsTrigger>
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
          <ChangePasswordForm />
        </div>
      </TabsContent>

      <TabsContent value="profile-picture" className="space-y-4">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
          <ProfilePictureForm user={user} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

