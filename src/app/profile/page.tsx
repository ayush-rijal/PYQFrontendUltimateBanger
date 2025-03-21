import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { getCurrentUser } from "@/lib/auth";
import { Lock } from "lucide-react"; // Import lock icon
import Head from "next/head";

// 🚀 SEO Metadata
export const metadata: Metadata = {
  title: "Your Profile | Manage Account - PYQ",
  description:
    "Update your profile details, change password, and manage your account settings on PYQ.",
  robots: "noindex, follow", // Prevents search engine indexing of private pages
  openGraph: {
    title: "Your Profile | Manage Account - PYQ",
    description: "Easily manage your profile and account settings on PYQ.",
    url: "https://pyq.com/profile", // Change this to your actual domain
    type: "profile",
    siteName: "PYQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Profile | Manage Account - PYQ",
    description: "Easily manage your profile and account settings on PYQ.",
  },
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // 🔒 Page Lock Feature
  const isPublished = false; // Set to `true` to unlock the profile page

  return (
    <>
      {/* ✅ SEO Structured Data */}
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: user?. firstName|| "User Profile",
            url: "https://pyq.com/profile",
            author: {
              "@type": "Person",
              name: user?.firstName || "User",
            },
          })}
        </script>
      </Head>

      {/* 🌟 Profile Page Layout */}
      <div className="container max-w-5xl py-8 mx-auto px-4 relative">
        <ProfileHeader />

        {/* 🔒 Wrapper for Lock Effect */}
        <div className="relative">
          {/* Profile Tabs - Apply Blur & Opacity if Locked */}
          <div
            className={`${
              !isPublished ? "opacity-30 blur-md pointer-events-none" : ""
            } transition-all duration-300`}
          >
            <ProfileTabs user={user} />
          </div>

          {/* 🔒 Lock Overlay - Shows When Page is Locked */}
          {!isPublished && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-lg transition-all hover:bg-white/40">
              <div className="flex flex-col items-center text-gray-700">
                <Lock className="w-14 h-14 mb-2 text-gray-600 transition-all" />
                <p className="text-lg font-semibold">Profile Page is Locked</p>
                <p className="text-sm">This page is not yet published.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
