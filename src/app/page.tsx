

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ArrowRight,
  Camera,
  Cpu,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Map,
  Eye,
  Languages,
  UserCheck,
  TrendingUp,
  Clock,
  Users,
  Building,
} from 'lucide-react';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">How It Works</Link>
            <Link href="#statistics" className="text-sm font-medium hover:text-primary">Statistics</Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">Login</Link>
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
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>How It Works</Link>
                    <Link href="#statistics" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Statistics</Link>
                    <Link href="#features" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Features</Link>
                    <Link href="/login" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Login</Link>
                </nav>
            </div>
        )}
      </header>

      <main className="flex-1">
        <section
          className="relative h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{
            backgroundImage: "url('https://i.pinimg.com/1200x/03/4f/b3/034fb32699e23030c17e6d0776d0db8b.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
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

        <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
                <p className="mt-2 text-lg text-muted-foreground">A simple, 3-step process to get issues resolved.</p>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Camera className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">1. Take a Photo</h3>
                        <p className="mt-2 text-muted-foreground">Snap a picture of the issue. Our app automatically captures the GPS location.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Cpu className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">2. AI Processes It</h3>
                        <p className="mt-2 text-muted-foreground">Our AI analyzes the image and text to suggest a category and description.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">3. Get It Fixed</h3>
                        <p className="mt-2 text-muted-foreground">The issue is routed to the correct department, and you get real-time updates.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="statistics" className="py-16 md:py-24">
             <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Live Statistics</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Real-time impact of citizen engagement.</p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Issues Resolved
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">2,847</div>
                        <p className="text-xs text-muted-foreground">
                            in the last 30 days
                        </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Resolution Time
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">3.2 Days</div>
                        <p className="text-xs text-muted-foreground">
                            across all departments
                        </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">15,632</div>
                        <p className="text-xs text-muted-foreground">
                            making a difference
                        </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Departments Connected
                        </CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            working together efficiently
                        </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
            <p className="mt-2 text-lg text-muted-foreground">Everything you need to improve your community.</p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Eye className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Real-time Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Track the status of your reported issues from start to finish, with progress photos at each stage.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">AI Categorization</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Our AI automatically analyzes your submission to categorize it and route it to the right department, fast.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Anonymous Reporting</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Report issues with confidence. We value your privacy and offer the option to submit reports anonymously.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Languages className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Multi-language Support</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Our platform supports multiple languages, including English and Hindi, to ensure accessibility for all citizens.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Map className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Interactive Maps</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Explore a map of your local area to see all reported issues, check their status, and avoid duplicate reports.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">PWA & Offline-ready</CardTitle>
                </CardHeader>
                <CardContent className="text-left text-muted-foreground">Use our app on any device, even without an internet connection. Your reports will be saved and submitted later.</CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-sidebar text-sidebar-foreground py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-6">
            <div className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-sidebar-primary" />
                    <span className="text-xl font-bold text-sidebar-primary">CivicSeva</span>
                </Link>
                <p className="text-sm text-muted-foreground">Partnering with governments to build smarter, greener, and more responsive cities.</p>
                <div className="mt-4">
                    <h4 className="font-semibold">Government Partners</h4>
                     <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm font-semibold">City of Metropolis</span>
                        <span className="text-sm font-semibold">Gotham City Hall</span>
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-lg">Quick Links</h4>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-sidebar-primary">How It Works</Link></li>
                    <li><Link href="#statistics" className="text-sm text-muted-foreground hover:text-sidebar-primary">Statistics</Link></li>
                    <li><Link href="#features" className="text-sm text-muted-foreground hover:text-sidebar-primary">Features</Link></li>
                    <li><Link href="/report" className="text-sm text-muted-foreground hover:text-sidebar-primary">Report an Issue</Link></li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-lg">Legal</h4>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-sidebar-primary">Privacy Policy</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-sidebar-primary">Terms of Service</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-sidebar-primary">Contact Us</Link></li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-lg">Connect With Us</h4>
                <div className="flex gap-4 mt-4">
                    <Link href="#"><Facebook className="text-muted-foreground hover:text-sidebar-primary" /></Link>
                    <Link href="#"><Twitter className="text-muted-foreground hover:text-sidebar-primary" /></Link>
                    <Link href="#"><Instagram className="text-muted-foreground hover:text-sidebar-primary" /></Link>
                </div>
            </div>
        </div>
         <div className="container mx-auto mt-8 border-t border-sidebar-border pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CivicSeva. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

    