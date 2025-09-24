
'use client';
import { AppShell } from '@/components/app-shell';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    try {
        const sessionLoggedIn = sessionStorage.getItem('is_citizen_logged_in') === 'true';

        // Also check cookies as fallback for server-side rendering
        const getCookie = (name: string) => {
          if (typeof document === 'undefined') return null;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        const cookieLoggedIn = getCookie('is_citizen_logged_in') === 'true';

        setIsLoggedIn(sessionLoggedIn || cookieLoggedIn);

        if (!sessionLoggedIn && !cookieLoggedIn) {
            router.replace('/login');
        }
    } catch (error) {
        console.error("Could not access session storage. Redirecting to login.");
        router.replace('/login');
    } finally {
        setIsLoading(false);
    }
  }, [router]);

  if (isLoading || !isLoggedIn) {
     return (
        <div className="flex min-h-screen">
            <Skeleton className="hidden md:block h-full w-[16rem]" />
            <div className="flex-1 p-8 space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
