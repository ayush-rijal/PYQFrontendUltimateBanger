import { Hero } from "@/components/ui/hero";

function HeroSection() {
  return (
    <Hero
      // title="Master Exams with Past Papers & AI-Powered Learning"
      title="The ultimate LMS companion, empowering students "
      subtitle="Explore thousands of questions, analyze your performance, and improve with smart suggestions."
      actions={[
        {
          label: "Try Demo",
          href: "#",
          variant: "outline",
        },
        {
          label: "Start Free",
          href: "#",
          variant: "default",
        },
      ]}
      // bage="master Exam with past Papers"
      // bageClassName="text-3xl md:text-4xl font-extrabold"
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-8"
    />
  );
}

export { HeroSection };
