
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MapViewPage() {
    
  const CommunityMap = useMemo(() => dynamic(
    () => import('../community/components/community-map'), 
    { 
        ssr: false,
        loading: () => <Skeleton className="w-full h-full" />
    }
  ), []);

  return (
    <div className="h-[calc(100vh-100px)] w-full">
        <CommunityMap />
    </div>
  );
}
