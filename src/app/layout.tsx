import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Leaf, ArrowRight, Check } from "lucide-react"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Link from "next/link"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/theme-provider'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LeafLens.ai',
  description: 'LeafLens.ai is a plant health assistant that uses AI to diagnose and treat plant diseases.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <header className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <Link href="/" className="text-xl font-bold text-green-800">LeafLens.ai</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-green-700 hover:text-green-900">
              Features
            </Link>
            <Link href="/diagnose" className="text-green-700 hover:text-green-900">
              Diagnose
            </Link>
            <Link href="/chat" className="text-green-700 hover:text-green-900">
              AI Chat
            </Link>
            <SignedOut>
              <InteractiveHoverButton>
                <SignInButton />
              </InteractiveHoverButton>
              <InteractiveHoverButton>
                <SignUpButton />
              </InteractiveHoverButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
          <Button variant="ghost" className="md:hidden">
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
              className="text-green-800"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </Button>
        </header>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}