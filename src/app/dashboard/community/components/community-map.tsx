
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MapDisplay = dynamic(() => import('./map-display').then((mod) => mod.MapDisplay), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export function CommunityMap() {
  return <MapDisplay />;
}
