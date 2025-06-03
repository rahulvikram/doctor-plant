import Link from "next/link"
import { Leaf, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { SignedOut, SignedIn, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <main>
        <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 mb-6">
            The fastest way to detect, diagnose, and treat plant diseases
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mb-10">
            Upload, analyze, and manage all your plant health data—images, AI diagnoses, treatment plans, regional
            alerts, and user feedback—in one seamless platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <SignedOut>
              <Link href="/dashboard">
                  <InteractiveHoverButton>Get started for free</InteractiveHoverButton>
              </Link>
            </SignedOut>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-green-900 text-center mb-12">Why choose LeafLens.ai?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"></path>
                  <path d="m7 16.5-4.74-2.85"></path>
                  <path d="m7 16.5 5-3"></path>
                  <path d="M7 16.5v5.17"></path>
                  <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"></path>
                  <path d="m17 16.5-5-3"></path>
                  <path d="m17 16.5 4.74-2.85"></path>
                  <path d="M17 16.5v5.17"></path>
                  <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"></path>
                  <path d="M12 8 7.26 5.15"></path>
                  <path d="m12 8 4.74-2.85"></path>
                  <path d="M12 13.5V8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">AI-Powered Diagnosis</h3>
              <p className="text-green-700">
                Advanced machine learning algorithms that can identify thousands of plant diseases with 98% accuracy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Personalized Treatment Plans</h3>
              <p className="text-green-700">
                Get customized care instructions based on your specific plant species, disease, and growing conditions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Community Insights</h3>
              <p className="text-green-700">
                Connect with other gardeners, share experiences, and learn from a global community of plant enthusiasts.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-green-900 text-center mb-12">
              Ready to transform your gardening experience?
            </h2>
            <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-lg shadow-lg border border-green-100">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">Join LeafLens.ai today</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-green-700">Instant plant disease diagnosis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-green-700">Personalized treatment recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-green-700">Regional disease alerts and forecasts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span className="text-green-700">Access to plant care experts</span>
                </li>
              </ul>
              <Link href="/signup" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Create your free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-green-300" />
                <span className="text-xl font-bold text-white">LeafLens.ai</span>
              </div>
              <p className="text-green-300">
                Transform unstructured garden snapshots into high‑quality insights and training data for smarter, faster
                plant care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Plant Library
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Disease Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-green-300 hover:text-white">
                    Data Processing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-300">
            <p>© {new Date().getFullYear()} LeafLens.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
