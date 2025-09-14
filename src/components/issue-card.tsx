
'use client';

import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight, Camera, AlertTriangle, SprayCan, LightbulbOff, Trash2, Signpost, Droplets, HelpCircleIcon } from 'lucide-react';
import type { Issue, IssueCategory } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
}

const categoryIcons: Record<IssueCategory, React.ElementType> = {
    'Pothole': AlertTriangle,
    'Graffiti': SprayCan,
    'Streetlight Outage': LightbulbOff,
    'Waste Management': Trash2,
    'Damaged Sign': Signpost,
    'Water Leak': Droplets,
    'Other': HelpCircleIcon
}

export function IssueCard({ issue }: IssueCardProps) {
  const [reportedDate, setReportedDate] = useState('');

  useEffect(() => {
    // This code runs only on the client, after hydration
    try {
      setReportedDate(format(new Date(issue.reportedAt), "PPP"));
    } catch (e) {
      console.error("Invalid date for issue", issue.id);
      setReportedDate("Invalid date");
    }
  }, [issue.reportedAt, issue.id]);
  
  const beforeImage = issue.images.find(img => img.caption.toLowerCase().includes('before'));
  const afterImage = issue.images.find(img => img.caption.toLowerCase().includes('after'));
  const CategoryIcon = categoryIcons[issue.category] || HelpCircleIcon;

  return (
    <Card className={cn(
        "flex flex-col overflow-hidden group/card shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1", 
        issue.priority === 'High' && issue.status !== 'Resolved' && "border-destructive border-2 shadow-destructive/20"
    )}>
        <CardContent className="p-0 relative">
            <div className="absolute top-3 right-3 z-10">
                <IssueStatusBadge status={issue.status} />
            </div>
            <div className="absolute top-3 left-3 z-10 size-10 rounded-full bg-background/80 flex items-center justify-center backdrop-blur-sm shadow-lg">
                <CategoryIcon className="size-5 text-primary" />
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <Image 
                    src={issue.imageUrl}
                    alt={issue.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    data-ai-hint={issue.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 p-4 text-white">
                <h3 className="text-lg font-bold leading-tight drop-shadow-md">{issue.title}</h3>
            </div>
        </CardContent>
      <CardFooter className="p-4 flex-col items-start gap-3 bg-muted/30">
        <div className="w-full space-y-1 text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="size-3 flex-shrink-0" />
                <span className="truncate">{issue.location.address}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-3" />
                <span>{reportedDate ? `Reported on ${reportedDate}` : 'Loading date...'}</span>
            </div>
        </div>

        <div className="w-full flex gap-2">
            <Button asChild className="flex-1" variant="default" size="sm">
                <Link href={`/track/${issue.id}`}>
                    View Details <ArrowRight className="ml-2" />
                </Link>
            </Button>
            {issue.status === 'Resolved' && beforeImage && afterImage && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                            <Camera className="mr-2" />
                            Before & After
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Issue Resolution: Before & After</DialogTitle>
                        </DialogHeader>
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="p-1">
                                        <h4 className="text-center font-semibold mb-2">Before</h4>
                                        <div className="relative aspect-video">
                                            <Image src={beforeImage.url} alt="Before" fill className="object-contain rounded-md" />
                                        </div>
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                     <div className="p-1">
                                        <h4 className="text-center font-semibold mb-2">After</h4>
                                        <div className="relative aspect-video">
                                            <Image src={afterImage.url} alt="After" fill className="object-contain rounded-md" />
                                        </div>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </DialogContent>
                </Dialog>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
