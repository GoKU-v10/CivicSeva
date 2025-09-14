
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { db } from '@/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { Issue } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Fix default Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function CommunityMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
            setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            setLocationError(null);
        },
        (err) => {
          const message = "Location access denied. Showing map for default area.";
          console.warn(`Location error: ${err.message} (code: ${err.code})`);
          setLocationError(message);
          toast({
            variant: "default",
            title: "Location Access Denied",
            description: "You've denied location access. The map will show a default area. You can change this in your browser settings.",
          });
          // Fallback location if user denies permission
          setUserLocation([20.5937, 78.9629]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const message = "Geolocation is not supported by your browser. Showing default location.";
      setLocationError(message);
      // Fallback location if geolocation is not supported
      setUserLocation([20.5937, 78.9629]);
    }

    // Fetch issues from Firestore
    const fetchIssues = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'issues'));
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const docData = doc.data();
          // Adapt the fetched data to the app's Issue type
          return {
            id: doc.id,
            title: docData.title || 'No title',
            description: docData.description || '',
            imageUrl: docData.imageUrl || '',
            imageHint: '',
            images: docData.imageUrl ? [{ url: docData.imageUrl, caption: 'Issue Photo' }] : [],
            location: {
              latitude: docData.lat || docData.latitude || 0,
              longitude: docData.lng || docData.longitude || 0,
              address: docData.address || 'No address provided',
            },
            status: docData.status || 'Reported',
            category: docData.category || 'Other',
            reportedAt: docData.reportedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            department: docData.department || 'Pending Assignment',
            updates: docData.updates || [],
          } as Issue;
        });
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issues from Firestore:', error);
        toast({
            variant: 'destructive',
            title: 'Error Fetching Issues',
            description: 'Could not load community issues from the database.',
        });
      }
    };

    fetchIssues();
  }, [isClient, toast]);

  if (!isClient) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }
  
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapboxUrl = mapboxAccessToken 
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapboxAttribution = mapboxAccessToken 
    ? '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation ?? [20.5937, 78.9629]}
        zoom={14}
        className="w-full h-full"
      >
        <TileLayer
          url={mapboxUrl}
          attribution={mapboxAttribution}
        />
        {userLocation && <RecenterMap lat={userLocation[0]} lng={userLocation[1]} />}
        {/* User marker */}
        {userLocation && !locationError && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {/* Community issues */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.latitude, issue.location.longitude]}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{issue.category}</h3>
                <p className="text-sm">{issue.title}</p>
                <a href={`/track/${issue.id}`} target="_blank" rel="noopener noreferrer" className="text-primary text-xs mt-2 inline-block hover:underline">
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {locationError && (
        <div className="absolute top-4 left-4 z-[1000] w-full max-w-sm">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Location Access Denied</AlertTitle>
                <AlertDescription>
                   {locationError} Please enable location in your browser settings for a personalized view.
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
