
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ArrowRight,
  Camera,
  Cpu,
  CheckCircle,
  MapPin,
  TrendingUp,
  Users,
  Building,
  Languages,
  Eye,
  Lock,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const features = [
    {
      icon: <Eye className="size-8 text-primary" />,
      title: 'Real-Time Tracking',
      description: 'Monitor the progress of your reported issues with live status updates and photos.',
    },
    {
      icon: <Cpu className="size-8 text-primary" />,
      title: 'AI-Powered Categorization',
      description: 'Our smart system automatically categorizes your issue for faster routing to the right department.',
    },
    {
      icon: <Lock className="size-8 text-primary" />,
      title: 'Anonymous Reporting',
      description: 'Report issues with the option to keep your identity private and secure.',
    },
    {
      icon: <Languages className="size-8 text-primary" />,
      title: 'Multi-Language Support',
      description: 'Our platform supports multiple languages, including English and Hindi, to serve a diverse community.',
    },
  ];

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
            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
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
                    <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Home</Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>How It Works</Link>
                    <Link href="#statistics" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Statistics</Link>
                    <Link href="#features" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Features</Link>
                    <Link href="/login" className="text-sm font-medium hover:text-primary" onClick={() => setShowMobileMenu(false)}>Login</Link>
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
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-primary">2,847</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">Issues Resolved This Month</p></CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-primary">3.2 Days</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">Average Resolution Time</p></CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-primary">15,632</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">Active Users</p></CardContent>
                    </Card>
                     <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold text-primary">12</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-muted-foreground">Departments Connected</p></CardContent>
                    </Card>
                </div>
            </div>
        </section>
        
        <section id="features" className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Platform Features</h2>
              <p className="mt-2 text-lg text-muted-foreground">Empowering citizens with cutting-edge technology.</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
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
