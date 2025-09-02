
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Home,
  FilePlus2,
  Shield,
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  Map,
  Bell,
  Settings,
  LifeBuoy,
  Target,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/track',
      label: 'My Issues',
      icon: Target,
      badge: "3"
    },
    {
      href: '/dashboard/community',
      label: 'Community Hub',
      icon: Users,
    },
     {
      href: '/dashboard/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: "2"
    },
  ];
  
  const bottomMenuItems = [
     {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      href: '/dashboard/help',
      label: 'Help & Support',
      icon: LifeBuoy,
    },
  ]
  
  const adminMenuItem = {
    href: '/dashboard/admin',
    label: 'Admin',
    icon: Shield,
  }

  const allItems = [...menuItems, ...bottomMenuItems, adminMenuItem];

  const getPageTitle = () => {
    // Handle the new /track and /track/[id] routes
    if (pathname.startsWith('/track')) return 'My Issues';
    
    const currentItem = allItems.find(item => item.href !== '/dashboard' && item.href !== '/track' && pathname.startsWith(item.href));
    if (currentItem) return currentItem.label;
    if(pathname === '/dashboard') return 'Dashboard';
    
    return 'CivicSeva';
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 p-2">
                <ShieldCheck className="text-primary size-8" />
                <h1 className="text-2xl font-bold text-primary">CivicSeva</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                 <SidebarMenuItem>
                  <Link href="/report">
                    <SidebarMenuButton
                        variant="secondary"
                        className="w-full justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    >
                      <FilePlus2 />
                      <span>Report New Issue</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarSeparator />
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{
                        children: item.label,
                      }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                      {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="mt-auto">
            <SidebarMenu>
                <SidebarSeparator />
                 {bottomMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={{
                            children: item.label,
                        }}
                        >
                        <item.icon />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                <SidebarSeparator />
                 <div className="p-2">
                    <div className="p-2 flex items-center gap-2 rounded-lg bg-sidebar-accent">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://picsum.photos/seed/user/80/80" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-sidebar-accent-foreground">John Doe</span>
                            <span className="text-xs text-muted-foreground">john.doe@email.com</span>
                        </div>
                    </div>
                </div>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        {getPageTitle()}
                    </h1>
                </div>
                <Button variant="ghost" size="icon">
                    <Bell />
                    <span className="sr-only">Notifications</span>
                </Button>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
