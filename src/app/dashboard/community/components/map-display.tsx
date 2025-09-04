
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Issue } from '@/lib/types';
import { useEffect, useState } from 'react';
import { IssueStatusBadge } from '@/components/issue-status-badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { issues as initialIssues } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const UserLocationMarker = () => {
  const map = useMap();

  useEffect(() => {
    let located = false;
    map.locate().on("locationfound", function (e) {
      if (!located) {
        map.flyTo(e.latlng, 15);
        const marker = L.marker(e.latlng).addTo(map);
        marker.bindPopup("You are here!").openPopup();
        located = true;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export function MapDisplay() {
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      const localIssues: Issue[] = JSON.parse(localStorage.getItem('civicseva_issues') || '[]');
      const combinedIssues = [...localIssues, ...initialIssues];
      const uniqueIssues = combinedIssues.filter((issue, index, self) =>
        index === self.findIndex((t) => (t.id === issue.id))
      );
      setAllIssues(uniqueIssues);
    }
  }, [isClient]);

  if (!isClient) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserLocationMarker />
      {allIssues.map(issue => (
        <Marker key={issue.id} position={[issue.location.latitude, issue.location.longitude]}>
          <Popup>
            <div className="space-y-2">
              <h4 className="font-bold">{issue.title}</h4>
              <p className="text-xs text-muted-foreground">{issue.location.address}</p>
              <div className="flex items-center justify-between">
                <IssueStatusBadge status={issue.status} />
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href={`/track/${issue.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
