
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">CivicSeva</span>
              <span className="text-xs text-muted-foreground">Building Better Cities Together</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#statistics" className="text-sm font-medium hover:text-primary">
              Statistics
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
             <Link href="/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-2">
             <Button asChild>
                <Link href="/report">Report Issue Now</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {showMobileMenu && (
             <div className="md:hidden bg-background/95">
                <nav className="flex flex-col items-center gap-4 p-4">
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>
                    How It Works
                    </Link>
                    <Link href="#statistics" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>
                    Statistics
                    </Link>
                    <Link href="#features" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>
                    Features
                    </Link>
                    <Link href="/login" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>
                    Login
                    </Link>
                     <Button asChild className="w-full">
                        <Link href="/report">Report Issue Now</Link>
                    </Button>
                </nav>
            </div>
        )}
      </header>

      <main className="flex-1">
        <section className="relative h-[calc(100vh-4rem)] w-full overflow-hidden flex items-center justify-center">
          <Image
            src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/c85bf75a-bbda-4828-9abb-5888f102b302.png"
            alt="Smart green city"
            fill
            className="object-cover z-0"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/40 z-10" />

          <div className="z-20 flex flex-col items-center text-center text-white p-4">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-shadow-lg">
              Report Civic Issues
            </h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground/90 text-shadow">
              An AI-powered platform connecting citizens with municipal services for faster issue resolution.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/report">
                  Report on Web
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary">
                Download Mobile App
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
