
import { AppShell } from '@/components/app-shell';

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
