import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Camera,
  Cpu,
  CheckCircle,
  BarChart,
  Users,
  Building,
  Clock,
  Star,
  Eye,
  Languages,
  ArrowRight,
  Shield,
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
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
            <Link href="#contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">
              Login
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard/report">Report Issue Now</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[500px]">
          <Image
            src="https://picsum.photos/seed/civic/1920/1080"
            alt="Citizens collaborating with government officials in a city hall."
            fill
            className="object-cover"
            data-ai-hint="government citizens"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Report Civic Issues
            </h1>
            <p className="mt-4 max-w-3xl text-lg md:text-xl text-primary-foreground/80">
              An AI-powered platform connecting citizens with municipal services for faster issue resolution.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard/report">
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

        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
              A simple, three-step process to get civic issues resolved quickly.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Camera className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">1. Take a Photo</h3>
                <p className="mt-2 text-muted-foreground">
                  Snap a picture of the issue. Our app automatically captures the GPS location.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Cpu className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">2. AI Processes It</h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI analyzes the image and your description to categorize and route the issue to the correct department.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">3. Get It Fixed</h3>
                <p className="mt-2 text-muted-foreground">
                  Track the progress in real-time and get notified when the issue is resolved.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="statistics" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Live Statistics</h2>
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <BarChart className="h-10 w-10 text-primary" />
                <span className="mt-2 text-3xl font-bold">2,847</span>
                <span className="text-muted-foreground">Issues Resolved This Month</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-primary" />
                <span className="mt-2 text-3xl font-bold">3.2 Days</span>
                <span className="text-muted-foreground">Average Resolution Time</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-10 w-10 text-primary" />
                <span className="mt-2 text-3xl font-bold">15,632</span>
                <span className="text-muted-foreground">Active Users</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Building className="h-10 w-10 text-primary" />
                <span className="mt-2 text-3xl font-bold">12</span>
                <span className="text-muted-foreground">Departments Connected</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Key Features</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-4">
                <Eye className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Real-time Tracking</h3>
                  <p className="mt-1 text-muted-foreground">Monitor your reported issue's status from start to finish, with progress photos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Cpu className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">AI-Powered Categorization</h3>
                  <p className="mt-1 text-muted-foreground">Automatic routing to the right department ensures faster response times.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Anonymous Reporting</h3>
                  <p className="mt-1 text-muted-foreground">Report issues with confidence. Your privacy is protected.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Languages className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Multi-language Support</h3>
                  <p className="mt-1 text-muted-foreground">Access the platform in both English and Hindi for wider reach.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer id="contact" className="bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">CivicSeva</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Partnering with governments to build smarter, more responsive cities.
              </p>
              <div className="mt-4 flex space-x-4">
                <Image src="https://picsum.photos/seed/gov1/100/40" width={100} height={40} alt="Gov Partner 1" data-ai-hint="logo government" />
                <Image src="https://picsum.photos/seed/gov2/100/40" width={100} height={40} alt="Gov Partner 2" data-ai-hint="logo government" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold">Quick Links</h4>
                <ul className="mt-2 space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Terms of Service</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Follow Us</h4>
                <ul className="mt-2 space-y-2">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Facebook</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">Twitter</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary-foreground">LinkedIn</Link></li>
                </ul>
              </div>
            </div>
            <div>
                <h4 className="font-semibold">Subscribe to our newsletter</h4>
                <p className="mt-2 text-sm text-muted-foreground">Get the latest updates on our progress and new features.</p>
                {/* Add newsletter form here */}
            </div>
          </div>
          <div className="mt-8 border-t border-muted pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CivicSeva. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
