
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSaveChanges = () => {
    toast({
        title: "Settings Saved",
        description: "Your profile information has been updated.",
    });
  }

  const handleClearLocalStorage = () => {
    try {
        localStorage.removeItem('civicseva_issues');
        toast({
            title: "Local Data Cleared",
            description: "Your locally stored issue reports have been deleted. The page will now refresh.",
        });
        // Reload the page to reflect the changes
        setTimeout(() => {
            router.refresh();
            window.location.reload();
        }, 1500);

    } catch (error) {
         toast({
            variant: 'destructive',
            title: "Error",
            description: "Could not clear local data.",
        });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="text-center">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account details and notification preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your personal information is kept private and anonymous.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://picsum.photos/seed/anon/100/100" alt="User avatar" />
                    <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
            </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Samarth Narayankar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="citizen@civicseva.app" required />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="address">Home Address (Optional)</Label>
              <Input id="address" placeholder="Your address is not stored" />
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates on your reported issues via email.</p>
                </div>
                <Switch defaultChecked/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get real-time alerts on your mobile device.</p>
                </div>
                <Switch />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <h4 className="font-medium">Community Alerts</h4>
                    <p className="text-sm text-muted-foreground">Be notified about major issues reported in your area.</p>
                </div>
                <Switch defaultChecked/>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your locally stored application data.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <h4 className="font-medium">Clear Local Issue Data</h4>
                    <p className="text-sm text-muted-foreground">
                        This will remove all issues you have reported that are stored on this device.
                        This action cannot be undone.
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2" />
                            Clear Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all locally stored issue data from your browser.
                            This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearLocalStorage}>
                            Yes, delete my data
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
