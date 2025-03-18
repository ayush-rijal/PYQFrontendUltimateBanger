import type { Metadata } from "next"
import { TableOfContents } from "./table-of-contents"

export const metadata: Metadata = {
  title: "Privacy Policy - Learning Management System",
  description: "Our commitment to protecting your privacy and personal data",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Last updated: March 14, 2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <TableOfContents />

        <div className="md:col-span-3 space-y-10">
          <section id="introduction" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Welcome to our Learning Management System. We respect your privacy and are committed to protecting your
                personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our platform.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                please do not access our platform. By using our Learning Management System, you consent to the
                collection, use, and disclosure of your information as described in this Privacy Policy.
              </p>
            </div>
          </section>

          <section id="information-we-collect" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">2.1 Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide when you register for an account,
                enroll in courses, participate in discussion forums, or contact our support team. This information may
                include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full name</li>
                <li>Email address</li>
                <li>Contact information (phone number, address)</li>
                <li>Profile picture</li>
                <li>Educational background</li>
                <li>Employment information</li>
                <li>Payment information (when purchasing courses)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">2.2 Learning Data</h3>
              <p>As you use our platform, we collect data about your learning activities, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Courses enrolled in and completed</li>
                <li>Quiz and assessment results</li>
                <li>Time spent on learning activities</li>
                <li>Contributions to discussions and forums</li>
                <li>Completion certificates earned</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">
                2.3 Automatically Collected Information
              </h3>
              <p>
                When you access our platform, we automatically collect certain information about your device and usage,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Time and date of access</li>
                <li>Pages visited and features used</li>
                <li>Referring website or application</li>
              </ul>
            </div>
          </section>

          <section id="how-we-use-information" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing and maintaining our Learning Management System</li>
                <li>Processing enrollments and delivering course content</li>
                <li>Tracking your progress and issuing certificates</li>
                <li>Personalizing your learning experience</li>
                <li>Communicating with you about courses, updates, and support</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Detecting and preventing fraudulent activity</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>
          </section>

          <section id="data-sharing" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We may share your information with the following categories of third parties:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Course Instructors:</strong> Information about your enrollment and progress may be shared with
                  the instructors of courses you are enrolled in.
                </li>
                <li>
                  <strong>Service Providers:</strong> We use third-party service providers to help us operate our
                  platform, such as cloud hosting, payment processing, and analytics services.
                </li>
                <li>
                  <strong>Educational Institutions:</strong> If you are accessing our platform through your school or
                  employer, we may share information about your progress with them.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or
                  in response to valid requests by public authorities.
                </li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>
            </div>
          </section>

          <section id="data-security" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from
                unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication procedures</li>
                <li>Secure data storage practices</li>
                <li>Staff training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we
                strive to use commercially acceptable means to protect your personal information, we cannot guarantee
                its absolute security.
              </p>
            </div>
          </section>

          <section id="cookies" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain
                information. Cookies are files with a small amount of data that may include an anonymous unique
                identifier.
              </p>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for the platform to function properly.
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Help us recognize you and remember your preferences.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to track users across websites for marketing purposes.
                </li>
              </ul>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our platform.
              </p>
            </div>
          </section>

          <section id="user-rights" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">7. Your Data Protection Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Access:</strong> You can request copies of your personal information.
                </li>
                <li>
                  <strong>Rectification:</strong> You can request that we correct inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Erasure:</strong> You can request that we delete your personal information in certain
                  circumstances.
                </li>
                <li>
                  <strong>Restriction:</strong> You can request that we restrict the processing of your information.
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of your data in a structured,
                  machine-readable format.
                </li>
                <li>
                  <strong>Objection:</strong> You can object to our processing of your personal information.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided in the &quot;Contact Us&quot;
                section. We will respond to your request within the timeframe required by applicable law.
              </p>
            </div>
          </section>

          <section id="children-privacy" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our platform is not intended for children under the age of 13 (or the applicable age of digital consent
                in your jurisdiction). We do not knowingly collect personal information from children. If you are a
                parent or guardian and believe that your child has provided us with personal information, please contact
                us, and we will take steps to delete such information.
              </p>
            </div>
          </section>

          <section id="international-transfers" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Your information may be transferred to and processed in countries other than the country in which you
                reside. These countries may have data protection laws that are different from the laws of your country.
              </p>
              <p>
                When we transfer your information to other countries, we will take appropriate safeguards to ensure that
                your information remains protected in accordance with this Privacy Policy and applicable law.
              </p>
            </div>
          </section>

          <section id="policy-changes" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>
            </div>
          </section>

          <section id="contact-us" className="scroll-mt-16">
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p>
                  <strong>Learning Management System, Inc.</strong>
                </p>
                <p>123 Education Street</p>
                <p>Learning City, LC 12345</p>
                <p>Email: privacy@lmssystem.com</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <p>
                If you have unresolved concerns, you may also have the right to complain to your local data protection
                authority.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

