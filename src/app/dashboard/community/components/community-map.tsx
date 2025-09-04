
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db } from "@/firebase";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import type { Issue } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


// Fix default Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});


export default function CommunityMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
            console.error("Location error:", err)
            // Fallback location if user denies permission
            setUserLocation([20.5937, 78.9629]); 
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
        // Fallback location if geolocation is not supported
        setUserLocation([20.5937, 78.9629]);
    }

    // Fetch issues from Firestore
    const fetchIssues = async () => {
      try {
        const snapshot = await getDocs(collection(db, "issues"));
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const docData = doc.data();
            // Adapt the fetched data to the app's Issue type
            return {
                id: doc.id,
                title: docData.title || "No title",
                description: docData.description || "",
                imageUrl: docData.imageUrl || "",
                imageHint: "",
                images: docData.imageUrl ? [{ url: docData.imageUrl, caption: 'Issue Photo' }] : [],
                location: {
                    latitude: docData.lat || docData.latitude || 0,
                    longitude: docData.lng || docData.longitude || 0,
                    address: docData.address || "No address provided",
                },
                status: docData.status || "Reported",
                category: docData.category || "Other",
                reportedAt: docData.reportedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                department: docData.department || "Pending Assignment",
                updates: docData.updates || [],
            } as Issue
        });
        setIssues(data);
      } catch (error) {
          console.error("Failed to fetch issues from Firestore:", error);
          // You might want to show a toast notification to the user here
      }
    };

    fetchIssues();
  }, [isClient]);

  if (!isClient) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="w-full h-full">
      {userLocation ? (
        <MapContainer center={userLocation} zoom={14} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* User marker */}
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
          {/* Community issues */}
          {issues.map((issue) => (
            <Marker key={issue.id} position={[issue.location.latitude, issue.location.longitude]}>
              <Popup>
                <strong>{issue.category}:</strong> {issue.title}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
            <p>Fetching your location...</p>
        </div>
      )}
    </div>
  );
}
