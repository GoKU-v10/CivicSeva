
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Issue } from '@/lib/types';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface BeforeAfterGalleryProps {
    issues: Issue[];
}

export function BeforeAfterGallery({ issues }: BeforeAfterGalleryProps) {
    const resolvedWithImages = issues.filter(
        i => i.status === 'Resolved' &&
        i.images.some(img => img.caption.toLowerCase().includes('before')) &&
        i.images.some(img => img.caption.toLowerCase().includes('after'))
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Success Stories: Before & After</CardTitle>
                <CardDescription>Visual proof of resolved issues from the community.</CardDescription>
            </CardHeader>
            <CardContent>
                 {resolvedWithImages.length > 0 ? (
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {resolvedWithImages.map(issue => {
                                const before = issue.images.find(i => i.caption.toLowerCase().includes('before'));
                                const after = issue.images.find(i => i.caption.toLowerCase().includes('after'));
                                if(!before || !after) return null;

                                return (
                                    <CarouselItem key={issue.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                            <Card className="overflow-hidden">
                                                <CardContent className="p-4">
                                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                                        <div className="relative aspect-square">
                                                            <Image src={before.url} alt={`Before shot of ${issue.title}`} fill className="object-cover rounded-md" />
                                                            <Badge variant="destructive" className="absolute top-2 left-2">Before</Badge>
                                                        </div>
                                                        <div className="relative aspect-square">
                                                            <Image src={after.url} alt={`After shot of ${issue.title}`} fill className="object-cover rounded-md" />
                                                            <Badge className="absolute top-2 left-2">After</Badge>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-semibold text-sm truncate">
                                                        <Link href={`/admin/issue/${issue.id}`} className="hover:underline">
                                                            {issue.title}
                                                        </Link>
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">{issue.category} in {issue.location.address}</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious className="ml-14" />
                        <CarouselNext className="mr-14" />
                    </Carousel>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>No "Before & After" stories yet. Resolve an issue and upload an 'After' photo to feature it here!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
