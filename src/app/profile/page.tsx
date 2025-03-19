import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "User Profile - PYQ",
  description: "Manage your profile information and account settings",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container max-w-5xl py-8 mx-auto px-4">
      <ProfileHeader config={{}} />
      <ProfileTabs user = {user} />
    </div>
  );
}
