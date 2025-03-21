import Link from 'next/link';
import { LoginForm } from '@/components/forms';
import { SocialButtons } from '@/components/common';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login to PYQ | Sign In to Your Quiz Account',
  description: 'Log in to your PYQ account to access premium quizzes, track your progress, and continue your learning journey. Sign in now!',
  keywords: 'login, sign in, PYQ, quiz app, online learning, account access',
  openGraph: {
    title: 'Login to PYQ | Sign In to Your Quiz Account',
    description: 'Sign in to PYQ to access your personalized quiz dashboard and premium content. Log in today!',
    url: 'https://yourdomain.com/auth/login', // Replace with your actual domain
    siteName: 'PYQ',
    images: [
      {
        url: 'https://yourdomain.com/og-login-image.jpg', // Replace with your OG image URL
        width: 1200,
        height: 630,
        alt: 'PYQ Login Page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to PYQ | Sign In to Your Quiz Account',
    description: 'Access your PYQ account to enjoy premium quizzes and learning tools. Sign in now!',
    images: ['https://yourdomain.com/twitter-login-image.jpg'], // Replace with your Twitter image URL
  },
  alternates: {
    canonical: 'https://yourdomain.com/auth/login', // Replace with your actual domain
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center px-6 py-12 lg:px-8 rounded-4xl">
      {/* Container */}
      <section className="sm:mx-auto sm:w-full sm:max-w-md" aria-labelledby="login-heading">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <span className="sr-only">PYQ Logo</span>
            PYQ
          </div>
        </div>

        {/* Header */}
        <h1
          id="login-heading"
          className="mt-8 text-center text-3xl font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl"
        >
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          Access your PYQ dashboard and continue your quiz journey
        </p>
      </section>

      {/* Form Section */}
      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-md" aria-label="Login Form">
        <div className="bg-white text-white dark:text-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-200 dark:border-gray-700">
          <LoginForm />
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                Or sign in with
              </span>
            </div>
          </div>
          <SocialButtons />
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Register here
          </Link>
        </p>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login to PYQ",
            "description": "Sign in to your PYQ account to access premium quizzes and track your progress.",
            "url": "https://yourdomain.com/auth/login",
            "publisher": {
              "@type": "Organization",
              "name": "PYQ",
              "logo": {
                "@type": "ImageObject",
                "url": "https://yourdomain.com/logo.png", // Replace with your logo URL
              },
            },
          }),
        }}
      />
    </main>
  );
}