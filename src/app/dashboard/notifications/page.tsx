import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import React from 'react';

export default function NotificationsPage() {

    const notifications = [
        {
            icon: <CheckCircle2 className="text-green-500" />,
            title: "Issue Resolved",
            description: "Your report 'Large pothole on main street' has been marked as resolved.",
            time: "2 hours ago",
            avatar: "https://picsum.photos/seed/avatar1/40/40"
        },
        {
            icon: <Wrench className="text-yellow-500" />,
            title: "Status Update",
            description: "Your report 'Damaged Stop Sign' is now In Progress.",
            time: "1 day ago",
            avatar: "https://picsum.photos/seed/avatar2/40/40"
        },
        {
            icon: <Bell className="text-primary" />,
            title: "New Community Issue",
            description: "A new 'Water Leak' issue was reported near you.",
            time: "3 days ago",
            avatar: "https://picsum.photos/seed/avatar3/40/40"
        }
    ]

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50">
                        <Avatar className="h-10 w-10 border">
                            <div className="bg-background flex items-center justify-center h-full w-full">
                                {notification.icon}
                            </div>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {notification.time}
                        </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                </React.Fragment>
            ))}
            {notifications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-medium">No notifications yet</h3>
                    <p>We'll let you know when there's something new.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
