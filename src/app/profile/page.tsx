// import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { ProfileHeader}  from "./profile-header";
// import { ProfileTabs } from "./profile-tabs";
// import { getCurrentUser } from "@/lib/auth";

// export const metadata: Metadata = {
//   title: "User Profile - PYQ",
//   description: "Manage your profile information and account settings",
// };

// export default async function ProfilePage() {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <div className="container max-w-5xl py-8 mx-auto px-4">
//       <ProfileHeader />
//       <ProfileTabs user = {user} />
//     </div>
//   );
// }

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { getCurrentUser } from "@/lib/auth";
import { Lock } from "lucide-react"; // Import lock icon

export const metadata: Metadata = {
  title: "User Profile - PYQ",
  description: "Manage your profile information and account settings",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Check if the profile page is published
  const isPublished = false; // Change to `true` to unlock the page

  return (
    <div className="container max-w-5xl py-8 mx-auto px-4 relative">
      <ProfileHeader />

      {/* Wrapper for opacity & lock effect */}
      <div className="relative">
        {/* Profile Tabs with blur effect if locked */}
        <div
          className={`${
            !isPublished ? "opacity-30 blur-sm" : ""
          } transition-all duration-300`}
        >
          <ProfileTabs user={user} />
        </div>

        {/* Lock overlay if the page is unpublished */}
        {!isPublished && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg transition-all hover:bg-white/40">
            <div className="flex flex-col items-center text-gray-700">
              <Lock className="w-12 h-12 mb-2 text-gray-500 group-hover:text-gray-700 transition-all" />
              <p className="text-lg font-semibold">Profile Page is Locked</p>
              <p className="text-sm">This page is not yet published.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
