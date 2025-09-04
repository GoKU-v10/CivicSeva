'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Settings Saved",
        description: "Your profile information has been updated.",
    });
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
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User avatar" />
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
              <Input id="email" type="email" defaultValue="samarth.narayankar@example.com" />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="address">Home Address (Optional)</Label>
              <Input id="address" defaultValue="123 Main St, New York, NY" />
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

    </div>
  );
}
