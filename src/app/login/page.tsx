
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldCheck, LogIn, User, UserCog, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { createIssueAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [role, setRole] = useState('citizen');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const action = searchParams.get('action');
    const redirectUrl = searchParams.get('redirect') || '/dashboard';

    if (action === 'submit_issue') {
        const pendingReportJSON = localStorage.getItem('pending_issue_report');
        if (pendingReportJSON) {
            const pendingReport = JSON.parse(pendingReportJSON);
            
            const formData = new FormData();
            formData.append('description', pendingReport.description);
            formData.append('category', pendingReport.category);
            formData.append('address', pendingReport.location.address);
            formData.append('photoDataUri', pendingReport.photoDataUris[0]); // Assuming one photo for now
            formData.append('latitude', String(pendingReport.location.latitude));
            formData.append('longitude', String(pendingReport.location.longitude));

            const result = await createIssueAction(formData);

            if (result.success) {
                toast({ title: 'Success!', description: 'Issue submitted successfully.' });
                localStorage.removeItem('pending_issue_report');
                router.push(redirectUrl);
            } else {
                toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
                // Don't remove the data, so they can try again
                router.push('/report'); // Go back to the report page on failure
            }
        } else {
             toast({ variant: 'destructive', title: 'Error', description: "Could not find the pending report data. Please try again." });
             router.push('/report');
        }
    } else {
        // Default login behavior
        router.push(redirectUrl);
    }
  };


  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Welcome to CivicSeva</CardTitle>
        <CardDescription>Select your role and sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
       <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-3">
          <Label>I am a...</Label>
          <RadioGroup defaultValue="citizen" onValueChange={setRole} className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="citizen" id="citizen" className="peer sr-only" />
              <Label
                htmlFor="citizen"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <User className="mb-3 h-6 w-6" />
                Citizen
              </Label>
            </div>
            <div>
              <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
              <Label
                htmlFor="admin"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <UserCog className="mb-3 h-6 w-6" />
                Admin
              </Label>
            </div>
            <div>
              <RadioGroupItem value="official" id="official" className="peer sr-only" />
              <Label
                htmlFor="official"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Building className="mb-3 h-6 w-6" />
                Official
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required defaultValue="citizen@test.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline" prefetch={false}>
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" required defaultValue="password" />
        </div>
        <Button type="submit" className="w-full">
            <LogIn className="mr-2" />
            Sign In
        </Button>
        </form>

        <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="outline">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline">
            <FacebookIcon className="mr-2 h-4 w-4" />
            Facebook
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

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
