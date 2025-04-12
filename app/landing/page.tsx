import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Cpu, FileCode, Layers, Scan } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,40,200,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(160,40,220,0.1),transparent_40%)] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-purple-500" />
              <h1 className="text-xl font-bold tracking-tight">ElementForge AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-zinc-300 hover:text-purple-400 transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-zinc-300 hover:text-purple-400 transition-colors">
                  How It Works
                </a>
                <a href="#pricing" className="text-sm text-zinc-300 hover:text-purple-400 transition-colors">
                  Pricing
                </a>
                <a href="#faq" className="text-sm text-zinc-300 hover:text-purple-400 transition-colors">
                  FAQ
                </a>
              </nav>
              <Link href="/login">
                <Button variant="outline" className="border-purple-800 text-purple-400 hover:bg-purple-900/20">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              Automate Testing
            </span>{" "}
            <br className="md:hidden" />
            Without Writing Code
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto">
            ElementForge AI maps any website and generates complete Playwright test projects in seconds, not days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 h-12 px-8"
              >
                Start Mapping For Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 h-12 px-8">
                See How It Works
              </Button>
            </a>
          </div>
          <div className="relative mx-auto max-w-5xl rounded-xl border border-zinc-800 shadow-2xl shadow-purple-900/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-fuchsia-900/20 backdrop-blur-sm"></div>
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="ElementForge AI Dashboard"
              className="w-full h-auto relative z-10 opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              ElementForge AI combines advanced web scraping with AI to create the most efficient test automation
              solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-purple-900/10 hover:border-purple-900/50 transition-all">
              <CardHeader>
                <Scan className="h-12 w-12 mb-4 text-purple-500" />
                <CardTitle className="text-xl text-white">Intelligent Element Mapping</CardTitle>
                <CardDescription className="text-zinc-400">
                  Automatically detects and categorizes all interactive elements on your website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["Buttons", "Links", "Forms", "Inputs", "Dropdowns", "ARIA elements", "Multi-framework support"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-purple-900/10 hover:border-purple-900/50 transition-all">
              <CardHeader>
                <FileCode className="h-12 w-12 mb-4 text-purple-500" />
                <CardTitle className="text-xl text-white">Complete Project Generation</CardTitle>
                <CardDescription className="text-zinc-400">
                  Creates a fully structured test project ready to run in your preferred framework.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Playwright Projects",
                    "Cypress Projects",
                    "Selenium Projects",
                    "Page Object Models",
                    "Test Files",
                    "Configuration",
                    "Documentation",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-purple-900/10 hover:border-purple-900/50 transition-all">
              <CardHeader>
                <Cpu className="h-12 w-12 mb-4 text-purple-500" />
                <CardTitle className="text-xl text-white">AI-Powered Analysis</CardTitle>
                <CardDescription className="text-zinc-400">
                  Uses advanced algorithms to identify unique pages and avoid duplicates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Fingerprinting Technology",
                    "Duplicate Detection",
                    "Smart Selectors",
                    "Accessibility Support",
                    "Cross-browser Compatibility",
                    "Responsive Testing",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              ElementForge AI simplifies the test automation process in just three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Scan className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Enter Your URL</h3>
              <p className="text-zinc-300">
                Simply paste your website URL and let ElementForge AI scan your pages and interactive elements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <Layers className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Review Results</h3>
              <p className="text-zinc-300">
                Review the mapped elements and pages, with detailed information about each interactive component.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
                <DownloadIcon className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Download Project</h3>
              <p className="text-zinc-300">
                Download your complete Playwright test project, ready to run with zero configuration needed.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 h-12 px-8"
              >
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Join thousands of developers who are saving time with ElementForge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6">
                  "ElementForge AI saved our team weeks of work. We mapped our entire e-commerce site in minutes and had
                  tests running the same day. Incredible tool!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
                    <span className="text-purple-300 font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">Jane Doe</p>
                    <p className="text-sm text-zinc-500">Lead QA Engineer, TechCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6">
                  "As a solo developer, I couldn't afford to spend days writing test automation. ElementForge AI lets me
                  generate tests in minutes, so I can focus on building features."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
                    <span className="text-purple-300 font-semibold">MS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Michael Smith</p>
                    <p className="text-sm text-zinc-500">Indie Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6">
                  "The Page Object Models that ElementForge generates are better than what our team was writing
                  manually. It's like having an expert test automation engineer on demand."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
                    <span className="text-purple-300 font-semibold">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-zinc-500">CTO, StartupX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Simple Pricing
              </span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Choose the plan that works for your needs. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-zinc-400 ml-2">/ month</span>
                </div>
                <CardDescription className="text-zinc-400">Perfect for personal projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "5 website scans per month",
                    "Basic element mapping",
                    "Single page analysis",
                    "Standard Playwright config",
                    "Community support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-zinc-400 ml-2">/ month</span>
                </div>
                <CardDescription className="text-zinc-400">For professional developers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited website scans",
                    "Advanced element mapping",
                    "Multi-page analysis",
                    "Custom Playwright config",
                    "Priority email support",
                    "CI/CD integration",
                    "Advanced selectors",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                      Start 14-Day Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-zinc-400 ml-2">/ month</span>
                </div>
                <CardDescription className="text-zinc-400">For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Everything in Pro",
                    "Team collaboration",
                    "Custom integrations",
                    "Advanced analytics",
                    "Dedicated support",
                    "SLA guarantees",
                    "Custom training",
                    "White labeling",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
              Everything you need to know about ElementForge AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  question: "Which test automation frameworks are supported?",
                  answer:
                    "ElementForge AI supports three popular test automation frameworks: Playwright, Cypress, and Selenium. You can choose your preferred framework when generating your test project, and we'll create all the necessary files and configurations for that specific framework.",
                },
                {
                  question: "How does ElementForge AI work?",
                  answer:
                    "ElementForge AI uses advanced web scraping techniques to analyze your website, identify interactive elements, and generate a complete Playwright test automation project. It maps buttons, links, forms, and other elements, then creates Page Object Models and test files.",
                },
                {
                  question: "Do I need to know Playwright to use ElementForge AI?",
                  answer:
                    "No! ElementForge AI is designed for both beginners and experts. The generated code follows best practices and includes documentation to help you get started, even if you're new to Playwright.",
                },
                {
                  question: "Can ElementForge AI handle single-page applications (SPAs)?",
                  answer:
                    "Yes, ElementForge AI works with modern SPAs built with React, Vue, Angular, and other frameworks. It can detect and map dynamic elements that are loaded via JavaScript.",
                },
                {
                  question: "How accurate is the element mapping?",
                  answer:
                    "ElementForge AI uses multiple strategies to generate reliable selectors for elements, including IDs, test attributes, ARIA roles, and CSS selectors. In most cases, it achieves over 95% accuracy in mapping interactive elements.",
                },
                {
                  question: "Can I customize the generated tests?",
                  answer:
                    "The generated code is clean, well-structured, and follows best practices. You can easily modify the tests and Page Object Models to suit your specific needs.",
                },
                {
                  question: "Is my website data secure?",
                  answer:
                    "Yes, ElementForge AI processes your website data securely and doesn't store any sensitive information. We only analyze the public-facing elements of your website that any user could see.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-zinc-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 rounded-2xl p-10 border border-purple-800/30 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Revolutionize Your Test Automation?</h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who are saving hours every week with ElementForge AI.
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 h-12 px-8"
                >
                  Get Started For Free
                </Button>
              </Link>
              <p className="mt-4 text-zinc-400">No credit card required. Free plan available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-6 w-6 text-purple-500" />
                <span className="text-lg font-semibold text-white">ElementForge AI</span>
              </div>
              <p className="text-zinc-400 mb-4">
                Next-gen AI tool for mapping interactive elements and generating Playwright test projects.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-purple-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-zinc-400 hover:text-purple-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-zinc-400 hover:text-purple-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Playwright Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-purple-400">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-zinc-900 text-center">
            <p className="text-zinc-500">© {new Date().getFullYear()} ElementForge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper component for the Download icon
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}
