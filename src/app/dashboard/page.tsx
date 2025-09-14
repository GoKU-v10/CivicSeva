
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { issues } from '@/lib/data';
import type { Issue } from '@/lib/types';
import { ArrowRight, Camera, CheckCircle, MapPin, List, Edit, ShieldAlert, Leaf, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentIssueTimeline } from '@/components/recent-issue-timeline';

const CommunityMap = dynamic(
  () => import('./community/components/community-map'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full aspect-video" />
  }
);


export default function HomePage() {
  const reportedIssues: Issue[] = issues;
  const activeIssues = reportedIssues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedIssues = reportedIssues.filter(issue => issue.status === 'Resolved').length;
  
  // Find the most recently reported issue to display in the timeline
  const latestIssue = reportedIssues.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())[0];


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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
            <h2 className="text-2xl font-bold mb-4">Latest Issue Progress</h2>
            {latestIssue ? (
            <RecentIssueTimeline issue={latestIssue} />
            ) : (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                You haven't reported any issues yet.
                </CardContent>
            </Card>
            )}
        </div>
        
        {/* Community Map Preview */}
        <div className="space-y-4">
             <h2 className="text-2xl font-bold mb-4">Community Map</h2>
             <Card className="overflow-hidden">
                <div className="relative aspect-video w-full">
                    <CommunityMap />
                </div>
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold">Explore the Community Map</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">View interactive maps, see area statistics, and check out the community leaderboard.</p>
                    <Button asChild className="w-full">
                        <Link href="/dashboard/community">
                            Explore Full Map <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                </CardContent>
             </Card>
        </div>
      </div>

        <div className="space-y-4">
            <h2 className="text-2xl font-bold pt-4">Citizen Responsibilities</h2>
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <ShieldAlert className="size-8 text-primary" />
                    <CardTitle className="text-xl">Precautions &amp; Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                     <Alert>
                        <Leaf className="h-4 w-4" />
                        <AlertTitle>Environmental Responsibility</AlertTitle>
                        <AlertDescription>
                            Dispose of waste properly. Conserve water and report leaks promptly. Help keep public spaces clean.
                        </AlertDescription>
                    </Alert>
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Reporting Guidelines</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside text-xs">
                            <li>Provide clear, accurate information. False reports can lead to penalties.</li>
                            <li>Do not report emergencies here. For urgent situations, call 911.</li>
                            <li>Respect the privacy of others when taking photos.</li>
                          </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
