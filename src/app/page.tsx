import { HeroSection } from "@/landing/HeroSection";
import Introduction from "@/landing/Intoduction"; // Fixed typo in component name
import LogoTicker from "@/landing/LogoTicker";
import LandingPage from "@/landing/landingPage"; // Fixed capitalization for consistency
import Navbar from "@/landing/Navbar";
import Footer from "@/landing/Nooter"; // Fixed typo in component name 'Nooter' to 'Footer'
import Head from "next/head"; // Import Head for metadata

export default function Home() {
  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>
          Past Year Questions Collection - Revolutionizing Education
        </title>
        <meta
          name="description"
          content="Explore our vast collection of past year questions and revolutionize your education experience with innovative learning tools and resources."
        />
        <meta
          name="keywords"
          content="past year questions, education revolution, study resources, exam preparation, learning platform"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:title"
          content="Past Year Questions Collection - Revolutionizing Education"
        />
        <meta
          property="og:description"
          content="Access past year questions and transform your learning journey with our innovative educational platform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />{" "}
        {/* Replace with your actual URL */}
        <meta
          property="og:image"
          content="https://yourwebsite.com/og-image.jpg"
        />{" "}
        {/* Replace with actual image */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Past Year Questions Collection - Revolutionizing Education"
        />
        <meta
          name="twitter:description"
          content="Discover past year questions and innovative education tools to enhance your learning."
        />
        <meta
          name="twitter:image"
          content="https://yourwebsite.com/twitter-image.jpg"
        />{" "}
        {/* Replace with actual image */}
        <link rel="canonical" href="https://yourwebsite.com" />{" "}
        {/* Replace with your actual URL */}
      </Head>

      {/* Main Content with Semantic Structure */}
      <header>
        <Navbar />
      </header>

      <main>
        <section aria-label="Hero">
          <HeroSection />
        </section>

        <section aria-label="Trusted By">
          <LogoTicker />
        </section>

        <section aria-label="Introduction">
          <Introduction />
        </section>

        <section aria-label="Features">
          <LandingPage />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
