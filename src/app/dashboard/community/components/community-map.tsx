
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
import { WifiOff } from 'lucide-react';

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
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function CommunityMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [isClient, setIsClient] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const getPreciseLocation = () => {
      return new Promise<GeolocationPosition>((resolve, reject) => {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 20000, 
                  maximumAge: 0
              });
          } else {
              reject(new Error("Geolocation is not supported by this browser."));
          }
      });
    };

    const detectLocation = async () => {
        try {
            const pos = await getPreciseLocation();
            const { latitude, longitude } = pos.coords;
            const newLocation: [number, number] = [latitude, longitude];
            setUserLocation(newLocation);
            setMapCenter(newLocation);
            setLocationError(null); // Clear any previous errors
            toast({ title: 'Success', description: 'Precise GPS location acquired!' });
        } catch (err: any) {
             let message = "Your browser has blocked location access. Please enable it in your browser's site settings to see your current location.";
             if (err.code === 1) { // PERMISSION_DENIED
                message = "You have denied location access. Please enable it in your browser's site settings to use this feature.";
             } else if (err.code === 2 || err.code === 3) { // POSITION_UNAVAILABLE or TIMEOUT
                message = "Could not get a precise location. Please try moving to an area with a clearer view of the sky (e.g., near a window or outdoors).";
             }
            
             console.error("Geolocation Error:", err.message);
             setLocationError(message);
             toast({
                variant: "destructive",
                title: "Could Not Get Precise Location",
                description: "The map will show a default area. See the on-map alert for more details.",
            });
            setUserLocation(null);
            setMapCenter([20.5937, 78.9629]); // Fallback to default
        }
    };

    detectLocation();

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
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const mapboxAttribution = mapboxAccessToken 
    ? '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={14}
        className="w-full h-full"
      >
        <TileLayer
          url={mapboxUrl}
          attribution={mapboxAttribution}
        />
        <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
        {/* User marker */}
        {userLocation && !locationError && (
          <Marker position={userLocation}>
            <Popup>You are here (Precise Location)</Popup>
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
