import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { issues } from '@/lib/data';
import type { Issue } from '@/lib/types';
import { ArrowRight, Camera, CheckCircle, MapPin, List, Edit } from 'lucide-react';
import Link from 'next/link';
import { IssueCard } from '@/components/issue-card';
import Image from 'next/image';

export default function HomePage() {
  const reportedIssues: Issue[] = issues;
  const activeIssues = reportedIssues.filter(issue => issue.status !== 'Resolved').length;
  const resolvedIssues = reportedIssues.filter(issue => issue.status === 'Resolved').length;
  const recentIssues = reportedIssues.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
            <h1 className="text-3xl font-bold">Welcome back, Citizen!</h1>
            <p className="text-muted-foreground">Here's what's happening in your community.</p>
        </div>
        <Button asChild size="lg">
            <Link href="/dashboard/report">
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
            <CardTitle className="text-sm font-medium">Community Map</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Map</div>
            <Link href="/dashboard/map" className="text-xs text-muted-foreground hover:underline">
              See nearby reports
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Issues */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Recent Issues in Your Area</h2>
          {recentIssues.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium">No recent issues</h3>
                <p className="text-muted-foreground">Be the first to report one!</p>
            </div>
          )}
           <div className="text-right">
                <Button variant="link" asChild>
                    <Link href="/dashboard/my-issues">
                        View All Issues <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
        
        {/* Community Map Preview */}
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Community Map</h2>
             <Card>
                <CardContent className="p-0">
                    <div className="relative aspect-video w-full">
                        <Image 
                            src="https://picsum.photos/seed/map-preview/600/400"
                            alt="Preview of community map"
                            fill
                            className="rounded-t-lg object-cover"
                            data-ai-hint="map city"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg" />
                         <div className="absolute bottom-4 left-4">
                            <Button asChild>
                                <Link href="/dashboard/map">
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
