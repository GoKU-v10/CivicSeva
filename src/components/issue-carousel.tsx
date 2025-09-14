
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import type { Issue } from '@/lib/types';
import { IssueCard } from './issue-card';
import { AlertTriangle } from 'lucide-react';

interface IssueCarouselProps {
  issues: Issue[];
  title: string;
  emptyMessage?: string;
}

export function IssueCarousel({
  issues,
  title,
  emptyMessage = 'No issues to display.',
}: IssueCarouselProps) {

  if (!issues || issues.length === 0) {
    return (
        <Card className="mt-4">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <AlertTriangle className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Issues Found</h3>
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold px-1 mb-4">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-4">
          {issues.map((issue) => (
            <CarouselItem key={issue.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="h-full">
                <IssueCard issue={issue} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
