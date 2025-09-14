
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2, Wrench, ShieldAlert } from "lucide-react";
import React from 'react';
import { Separator } from "@/components/ui/separator";

const notifications = [
    {
        icon: <CheckCircle2 className="text-green-500" />,
        title: "Issue Resolved",
        description: "Your report 'Large pothole on main street' has been marked as resolved.",
        time: "2 hours ago",
    },
    {
        icon: <Wrench className="text-yellow-500" />,
        title: "Status Update",
        description: "Your report 'Damaged Stop Sign' is now In Progress.",
        time: "1 day ago",
    },
    {
        icon: <ShieldAlert className="text-primary" />,
        title: "New Community Issue",
        description: "A new 'Water Leak' issue was reported near you.",
        time: "3 days ago",
    },
     {
        icon: <Bell className="text-blue-500" />,
        title: "Welcome to CivicSeva!",
        description: "Thanks for joining our community. Report an issue to get started.",
        time: "5 days ago",
    }
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Notifications</h1>
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bell />
                All Notifications
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg">
                            <div className="relative size-10">
                                <div className="absolute -left-1 -top-1 size-10 flex items-center justify-center rounded-full bg-background border-2 border-primary/50 shadow-md">
                                    {notification.icon}
                                </div>
                            </div>
                            <div className="flex-grow pl-2">
                                <p className="font-semibold text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {notification.time}
                            </div>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
                {notifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="mx-auto h-10 w-10 mb-2" />
                        <h3 className="text-lg font-medium">No new notifications</h3>
                    </div>
                )}
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
