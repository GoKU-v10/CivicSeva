import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function CommunityMapPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MapPin />
            Community Issues Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[16/9] w-full">
            <Image 
                src="https://picsum.photos/seed/map/1280/720" 
                alt="Map of community issues"
                fill
                className="rounded-lg object-cover"
                data-ai-hint="map city"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                <p className="text-lg font-semibold text-foreground p-4 bg-background/80 rounded-md">
                    Community Map Coming Soon
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
