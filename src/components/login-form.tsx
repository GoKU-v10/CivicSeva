'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, LogIn } from 'lucide-react';
import Link from 'next/link';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16a8 8 0 1 1 8-8c.661 0 1.284.124 1.844.34l-1.933 1.933a3.92 3.92 0 0 0-1.844-2.265Z" />
        <path d="M22 12h-4v4h-2v-4h-4v-2h4V6h2v4h4v2Z" />
      </svg>
    )
}
  
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Welcome to CivicConnect</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline" prefetch={false}>
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
            <LogIn className="mr-2" />
            Sign In with Email
        </Button>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline">
            <FacebookIcon className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-2 rounded-lg border bg-muted/50 p-4 text-center">
            <h4 className="font-semibold">Government Official?</h4>
            <p className="text-sm text-muted-foreground">Use your government ID to sign in for official duties.</p>
            <Button variant="secondary" className="w-full">
                <ShieldCheck className="mr-2" />
                Sign in with Government ID
            </Button>
        </div>

      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full">
            New User?{' '}
            <Link href="#" className="text-primary hover:underline" prefetch={false}>
                Sign Up
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
