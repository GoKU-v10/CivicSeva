
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, LogOut, ShieldCheck, UserCog, LayoutGrid, List, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

            <nav className="flex items-center gap-4 mx-auto">
                <Button variant="ghost" asChild>
                    <Link href="/admin">
                        <List className="mr-2" />
                        Dashboard
                    </Link>
                </Button>
                 <Button variant="ghost" asChild>
                    <Link href="/admin/assignment-board">
                        <LayoutGrid className="mr-2" />
                        Assignment Board
                    </Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/admin/analytics">
                        <BarChart3 className="mr-2" />
                        Analytics
                    </Link>
                </Button>
            </nav>

            <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell />
                    <span className="sr-only">System Notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="flex items-center gap-2">
                         <Avatar className="h-9 w-9">
                            <AvatarImage src="https://picsum.photos/seed/admin/80/80" />
                            <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold">Siddharam</span>
                            <span className="text-xs text-muted-foreground">Administrator</span>
                        </div>
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings">
                                <Settings className="mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/department-update">
                                <UserCog className="mr-2" />
                                Update Issue
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                           <Link href="/login">
                                <LogOut className="mr-2" />
                                Logout
                           </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
            {children}
        </main>
    </div>
  );
}
