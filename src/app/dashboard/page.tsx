
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { issues } from '@/lib/data';
import type { Issue } from '@/lib/types';
import { ArrowRight, Camera, CheckCircle, MapPin, List, Edit, ShieldAlert, Leaf, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HomePage() {
  const reportedIssues: Issue[] = issues;
  const activeIssues = reportedIssues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedIssues = reportedIssues.filter(issue => issue.status === 'Resolved').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
            <h1 className="text-3xl font-bold">Welcome back, Citizen!</h1>
            <p className="text-muted-foreground">Here's what's happening in your community.</p>
        </div>
        <Button asChild size="lg">
            <Link href="/report">
                <Camera className="mr-2"/>
                Report a New Issue
            </Link>
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues Reported</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportedIssues.length}</div>
            <p className="text-xs text-muted-foreground">in your area</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Active Issues</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIssues}</div>
            <p className="text-xs text-muted-foreground">Currently being tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
             <p className="text-xs text-muted-foreground">Successfully fixed</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Hub</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Explore Now</div>
            <Link href="/dashboard/community" className="text-xs text-muted-foreground hover:underline">
              View community map and stats
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
            <h2 className="text-2xl font-bold">Your Responsibilities as a Citizen</h2>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <ShieldAlert className="size-8 text-primary" />
                    <CardTitle className="text-xl">Precautions & Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <Leaf className="h-4 w-4" />
                        <AlertTitle>Environmental Responsibility</AlertTitle>
                        <AlertDescription>
                            Dispose of waste properly in designated bins. Conserve water and report leaks promptly. Help keep our public spaces clean and green for everyone to enjoy.
                        </AlertDescription>
                    </Alert>
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Reporting Guidelines</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside">
                            <li>Provide clear, accurate information. False reports can lead to penalties.</li>
                            <li>Do not report emergencies here. For urgent situations, call 911.</li>
                            <li>Respect the privacy of others when taking photos.</li>
                          </ul>
                        </AlertDescription>
                    </Alert>
                    <p className="text-sm text-muted-foreground">
                        By working together, we can build a safer, cleaner, and more efficient city. Your active participation makes a real difference.
                    </p>
                </CardContent>
            </Card>
        </div>
        
        {/* Community Map Preview */}
        <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">Community Map</h2>
             <Card>
                <CardContent className="p-0">
                    <div className="relative aspect-video w-full">
                         <Image 
                            src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+29abe2(-74.0060,40.7128),pin-s+29abe2(-73.9650,40.7739),pin-s+29abe2(-74.0090,40.7088)/-73.98,40.75,12/1000x600?access_token=pk.eyJ1IjoiZ29vZ2xlLWZpcmViYXNlIiwiYSI6ImNsc3ZlZ3AwbjB2dG4yanA2bXR4d3kya3QifQ.5h3L2H-p2bW40h2cM5y4fA"
                            alt="Map of community issues"
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint="map issues"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg pointer-events-none" />
                         <div className="absolute bottom-4 left-4">
                            <Button asChild>
                                <Link href="/dashboard/community">
                                    Explore Full Map <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                         </div>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground">
                            See what's being reported in your neighborhood and stay up-to-date on local civic action.
                        </p>
                    </div>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  );
}
