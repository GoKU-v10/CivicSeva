
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the map component outside of the render cycle for stability.
const CommunityMap = dynamic(
  () => import('../community/components/community-map'), 
  { 
      ssr: false,
      loading: () => <Skeleton className="w-full h-full" />
  }
);

export default function MapViewPage() {
  return (
    <div className="h-[calc(100vh-100px)] w-full">
        <CommunityMap />
    </div>
  );
}
