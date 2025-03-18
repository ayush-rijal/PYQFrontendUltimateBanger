"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// FAQ data structure
const faqData = {
  general: [
    {
      question: "What is a Learning Management System (LMS)?",
      answer:
        "A Learning Management System (LMS) is a software application for the administration, documentation, tracking, reporting, automation, and delivery of educational courses, training programs, or learning and development programs.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email address, and password. Then verify your email address by clicking on the link sent to your inbox.",
    },
    {
      question: "Is my data secure on your platform?",
      answer:
        "Yes, we take data security very seriously. We use industry-standard encryption protocols, regular security audits, and strict access controls to ensure your data remains protected. For more information, please review our Privacy Policy.",
    },
    {
      question: "Can I access the LMS on mobile devices?",
      answer:
        "Yes, our LMS is fully responsive and can be accessed on smartphones and tablets. We also offer dedicated mobile apps for iOS and Android for an enhanced mobile learning experience.",
    },
  ],
  courses: [
    {
      question: "How do I enroll in a course?",
      answer:
        "To enroll in a course, browse our course catalog, select the course you're interested in, and click the 'Enroll' button. If it's a paid course, you'll be directed to the payment page. For free courses, you'll get immediate access.",
    },
    {
      question: "Can I download course materials for offline use?",
      answer:
        "Yes, most course materials can be downloaded for offline use. Look for the download icon next to videos, PDFs, and other resources. Note that some premium content may have download restrictions.",
    },
    {
      question: "How do I track my progress in a course?",
      answer:
        "Your progress is automatically tracked as you complete lessons and activities. You can view your overall progress on your dashboard and detailed progress within each course on the course page.",
    },
    {
      question: "What happens if I can't complete a course on time?",
      answer:
        "Most of our courses are self-paced, so you can complete them at your convenience. For courses with deadlines, you can request an extension by contacting your instructor or our support team.",
    },
  ],
  technical: [
    {
      question: "What are the system requirements for using the LMS?",
      answer:
        "Our LMS works on any modern web browser (Chrome, Firefox, Safari, Edge). We recommend a stable internet connection with at least 5 Mbps download speed for streaming video content. For mobile access, iOS 12+ or Android 8+ is recommended.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
    },
    {
      question: "The video content isn't playing. What should I do?",
      answer:
        "First, check your internet connection. Then try refreshing the page. If the issue persists, try clearing your browser cache or using a different browser. If none of these solutions work, please contact our technical support team.",
    },
    {
      question: "How do I enable notifications for course updates?",
      answer:
        "Go to your account settings, select 'Notifications', and choose which types of notifications you'd like to receive. You can opt for email notifications, in-app notifications, or both.",
    },
  ],
  billing: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in some regions, bank transfers. For organizational purchases, we also offer invoice-based payments.",
    },
    {
      question: "How do I get a receipt for my purchase?",
      answer:
        "A receipt is automatically emailed to you after a successful purchase. You can also find all your receipts in the 'Billing History' section of your account settings.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for most courses. If you're not satisfied with a course, you can request a refund within 30 days of purchase. Some specialized or limited-time courses may have different refund policies, which will be clearly stated on the course page.",
    },
    {
      question: "Are there any discounts for multiple course purchases?",
      answer:
        "Yes, we offer bundle discounts when you purchase multiple courses. We also have subscription plans that give you access to a wide range of courses for a monthly or annual fee, which can be more economical for active learners.",
    },
  ],
}

export function FaqContent() {
  const [activeTab, setActiveTab] = useState("general")
  const [filteredFaqs, setFilteredFaqs] = useState(faqData)

  // Listen for search events
  useEffect(() => {
    const handleSearch = (e: CustomEvent) => {
      const query = (e.detail as string).toLowerCase()

      if (!query) {
        setFilteredFaqs(faqData)
        return
      }

      // Filter FAQs based on search query
      const filtered = Object.entries(faqData).reduce(
        (acc, [category, items]) => {
          acc[category] = items.filter(
            (item) => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
          )
          return acc
        },
        {} as typeof faqData,
      )

      setFilteredFaqs(filtered)
    }

    window.addEventListener("faq-search", handleSearch as EventListener)

    return () => {
      window.removeEventListener("faq-search", handleSearch as EventListener)
    }
  }, [])

  return (
    <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      {Object.entries(filteredFaqs).map(([category, items]) => (
        <TabsContent key={category} value={category} className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No matching questions found in this category.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

