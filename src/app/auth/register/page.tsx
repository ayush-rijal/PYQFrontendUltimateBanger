import Link from 'next/link';
import { RegisterForm } from '@/components/forms';
import { SocialButtons } from '@/components/common';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register for PYQ | Create Your Quiz Account',
  description: 'Sign up for PYQ to access premium quizzes, track your progress, and enhance your learning experience. Create your account today!',
  keywords: 'register, sign up, PYQ, quiz app, online learning, account creation',
  openGraph: {
    title: 'Register for PYQ | Create Your Quiz Account',
    description: 'Join PYQ to unlock premium quizzes and personalized learning tools. Sign up now!',
    url: 'https://yourdomain.com/auth/register', // Replace with your actual domain
    siteName: 'PYQ',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg', // Replace with your OG image URL
        width: 1200,
        height: 630,
        alt: 'PYQ Registration Page',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Register for PYQ | Create Your Quiz Account',
    description: 'Sign up for PYQ to access premium quizzes and track your progress. Join now!',
    images: ['https://yourdomain.com/twitter-image.jpg'], // Replace with your Twitter image URL
  },
  alternates: {
    canonical: 'https://yourdomain.com/auth/register', // Replace with your actual domain
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center px-6 py-12 lg:px-8 rounded-4xl">
      {/* Container */}
      <section className="sm:mx-auto sm:w-full sm:max-w-md" aria-labelledby="register-heading">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            <span className="sr-only">PYQ Logo</span>
            PYQ
          </div>
        </div>

        {/* Header */}
        <h1
          id="register-heading"
          className="mt-8 text-center text-3xl font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl"
        >
          Create Your Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          Join PYQ to access premium quizzes and track your learning progress
        </p>
      </section>

      {/* Form Section */}
      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-md" aria-label="Registration Form">
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-200 dark:border-gray-700">
          <RegisterForm />
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <SocialButtons />
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </section>
    </main>
  );
}