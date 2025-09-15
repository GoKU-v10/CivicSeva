
'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { db } from '@/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { Issue } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

// Fix default Leaflet marker icon which breaks with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A component to recenter the map
function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function CommunityMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default: India
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Fetch user location
      try {
        const pos: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          });
        });
        const { latitude, longitude } = pos.coords;
        const newLocation: [number, number] = [latitude, longitude];
        setUserLocation(newLocation);
        setMapCenter(newLocation);
        setLocationError(null);
        toast({ title: 'Success', description: 'Precise GPS location acquired!' });
      } catch (err: any) {
        let message = "Your browser has blocked location access. Please enable it in your browser's site settings.";
        if (err.code === 1) { // PERMISSION_DENIED
          message = "You have denied location access. Please enable it in your browser's site settings to see your location.";
        } else if (err.code === 2 || err.code === 3) { // POSITION_UNAVAILABLE or TIMEOUT
          message = "Could not get a precise location. Please try moving to an area with a clearer view of the sky (e.g., near a window or outdoors).";
        }
        console.log("Geolocation Error:", err.message);
        setLocationError(message);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not get your precise location. Displaying default map area.",
        });
        // Keep default map center (India)
      }

      // 2. Fetch issues from Firestore
      try {
        const snapshot = await getDocs(collection(db, 'issues'));
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const docData = doc.data();
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
          title: 'Database Error',
          description: 'Could not load community issues.',
        });
      }

      setIsLoading(false);
    };

    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }
  
  const mapboxAccessToken = 'pk.eyJ1IjoiZ29vZ2xlLWZpcmViYXNlIiwiYSI6ImNsc3ZlZ3AwbjB2dG4yanA2bXR4d3kya3QifQ.5h3L2H-p2bW40h2cM5y4fA';
  const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`;
  const mapboxAttribution = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        className='z-0'
      >
        <TileLayer
          url={mapboxUrl}
          attribution={mapboxAttribution}
        />
        <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} />
        
        {/* User marker - only if location was successfully found */}
        {userLocation && !locationError && (
          <Marker position={userLocation}>
            <Popup>You are here (Precise Location)</Popup>
          </Marker>
        )}

        {/* Issue markers */}
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
      
      {/* Error overlay */}
      {locationError && (
        <div className="absolute top-4 left-4 right-4 z-10">
            <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Precise Location Unavailable</AlertTitle>
                <AlertDescription>
                   {locationError}
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
