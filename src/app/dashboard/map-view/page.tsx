
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
    <div className="h-[calc(100vh-84px)] w-[calc(100%+2rem)] -m-4 md:h-[calc(100vh-96px)] md:w-[calc(100%+3rem)] md:-m-6 lg:h-[calc(100vh-112px)] lg:w-[calc(100%+4rem)] lg:-m-8">
        <CommunityMap />
    </div>
  );
}
