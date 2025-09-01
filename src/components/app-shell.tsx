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
} from '@/components/ui/sidebar';
import {
  Home,
  FilePlus2,
  Shield,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/report',
      label: 'Report Issue',
      icon: FilePlus2,
    },
    {
      href: '/dashboard/admin',
      label: 'Admin',
      icon: Shield,
    },
  ];
  
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => pathname === item.href);
    if (currentItem) return currentItem.label;
    if (pathname.startsWith('/dashboard/admin')) return 'Admin';
    if (pathname.startsWith('/dashboard/report')) return 'Report Issue';
    return 'Dashboard';
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 p-2">
                <ShieldCheck className="text-primary size-8" />
                <h1 className="text-2xl font-bold text-primary">CivicConnect</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{
                        children: item.label,
                        className: 'bg-sidebar text-sidebar-foreground',
                      }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        {getPageTitle()}
                    </h1>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
