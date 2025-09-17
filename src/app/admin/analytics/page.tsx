
'use client';

import { issues as allIssues } from '@/lib/data';
import { StatCard } from './components/stat-card';
import { TrendingUp, CheckCircle, Clock, Star, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryBreakdownChart } from './components/category-breakdown-chart';
import { ResolutionTimeChart } from './components/resolution-time-chart';
import { DepartmentPerformanceChart } from './components/department-performance-chart';
import { ActivityFeed } from './components/activity-feed';
import { BeforeAfterGallery } from './components/before-after-gallery';


export default function AdminAnalyticsPage() {
    const totalIssues = allIssues.length;
    const resolvedThisMonth = allIssues.filter(i => 
        i.status === 'Resolved' && 
        new Date(i.resolvedAt || 0).getMonth() === new Date().getMonth()
    ).length;

    // Dummy data for example purposes
    const avgResolutionTime = 3.2; // in days
    const userSatisfaction = 4.5; // out of 5

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Platform Analytics</h1>
                <p className="text-muted-foreground">A deep-dive into your city's civic engagement.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Issues Reported"
                    value={totalIssues}
                    icon={TrendingUp}
                    trendValue="+15% this month"
                    trendDirection="up"
                />
                <StatCard 
                    title="Resolved This Month"
                    value={resolvedThisMonth}
                    icon={CheckCircle}
                    trendValue="+5% from last month"
                    trendDirection="up"
                />
                 <StatCard 
                    title="Avg. Resolution Time"
                    value={avgResolutionTime}
                    unit="days"
                    icon={Clock}
                    trendValue="-0.5 days from last month"
                    trendDirection="down"
                />
                <StatCard 
                    title="Avg. User Satisfaction"
                    value={userSatisfaction}
                    unit="/ 5"
                    icon={Star}
                    trendValue="+0.2 from last quarter"
                    trendDirection="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Issue Trends</CardTitle>
                            <CardDescription>Reported vs. Resolved issues over the last 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResolutionTimeChart />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Department Performance</CardTitle>
                            <CardDescription>Average resolution time and total issues per department.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                           <DepartmentPerformanceChart />
                        </CardContent>
                    </Card>
                </div>
                 {/* Sidebar with Donut Chart and Activity Feed */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Category Breakdown</CardTitle>
                            <CardDescription>Distribution of all reported issues by category.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <CategoryBreakdownChart />
                        </CardContent>
                    </Card>
                    <ActivityFeed />
                </div>
            </div>

             <BeforeAfterGallery />

        </div>
    )
}
