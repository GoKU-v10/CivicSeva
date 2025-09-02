
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, LogOut, ShieldCheck, UserCog } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Link href="/admin" className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary">CivicSeva Admin Panel</span>
            </Link>

            <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell />
                    <span className="sr-only">System Notifications</span>
                </Button>
                <Card>
                    <CardContent className="p-2 flex items-center gap-2">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src="https://picsum.photos/seed/admin/80/80" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">Admin User</span>
                            <span className="text-xs text-muted-foreground">Public Works Dept.</span>
                        </div>
                    </CardContent>
                </Card>
                 <Button variant="outline" size="sm" asChild>
                   <Link href="/login">
                    <LogOut className="mr-2" />
                    Logout
                   </Link>
                </Button>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
            {children}
        </main>
    </div>
  );
}
