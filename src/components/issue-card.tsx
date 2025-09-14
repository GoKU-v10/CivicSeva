
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ArrowRight, Camera } from 'lucide-react';
import type { Issue } from '@/lib/types';
import { IssueStatusBadge } from './issue-status-badge';
import Image from 'next/image';
import { Progress } from './ui/progress';
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

export function IssueCard({ issue }: IssueCardProps) {
  const progress = issue.status === 'Resolved' ? 100 : issue.status === 'In Progress' ? 50 : 10;
  
  const [reportedDate, setReportedDate] = useState('');

  useEffect(() => {
    setReportedDate(format(new Date(issue.reportedAt), "PPP"));
  }, [issue.reportedAt]);
  
  const beforeImage = issue.images.find(img => img.caption.toLowerCase().includes('before'));
  const afterImage = issue.images.find(img => img.caption.toLowerCase().includes('after'));


  return (
    <Card className={cn("flex flex-col overflow-hidden group", issue.priority === 'High' && issue.status !== 'Resolved' && "border-destructive border-2")}>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <Badge variant="secondary">{issue.category}</Badge>
            <IssueStatusBadge status={issue.status} />
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-2">{issue.id}</p>
        <h3 className="text-base font-semibold leading-tight mt-1">{issue.title}</h3>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="size-3" />
                <span>{issue.location.address}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-3" />
                <span>{reportedDate ? `Reported on ${reportedDate}` : 'Loading date...'}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col items-start gap-3">
        <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Progress</p>
            <Progress value={progress} className="h-2" />
        </div>

        <div className="w-full flex gap-2">
            <Button asChild className="flex-1" variant="outline">
                <Link href={`/track/${issue.id}`}>
                    View Details <ArrowRight className="ml-2" />
                </Link>
            </Button>
            {issue.status === 'Resolved' && beforeImage && afterImage && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
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
