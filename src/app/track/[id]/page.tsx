
'use client';

import { issues as initialIssues } from "@/lib/data";
import type { Issue, IssueUpdate, IssueImage } from "@/lib/types";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { IssueStatusBadge } from "@/components/issue-status-badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Building, Clock, Calendar, CheckCircle2, Star, MessageSquare, AlertTriangle, Edit, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateIssueAction } from "@/lib/actions";

function TimelineItem({ item, isLast }: { item: IssueUpdate, isLast: boolean }) {
    const [formattedTimestamp, setFormattedTimestamp] = useState('');

    useEffect(() => {
        setFormattedTimestamp(format(new Date(item.timestamp), "PPP p"));
    }, [item.timestamp]);
    
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
                    <CheckCircle2 className="size-4" />
                </div>
                {!isLast && <div className="w-px h-full bg-border flex-1" />}
            </div>
            <div className="pb-8">
                <p className="font-semibold">{item.status}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{formattedTimestamp || '...'}</p>
            </div>
        </div>
    )
}

function ImageGallery({ images }: { images: IssueImage[] }) {
    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                    <AlertTriangle className="mx-auto size-8 mb-2"/>
                    <p className="font-semibold">No Images Available</p>
                    <p className="text-xs">No images were provided for this issue.</p>
                </div>
            </div>
        );
    }
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {images.map((image, index) => (
                <CarouselItem key={index}>
                    <div className="p-1">
                        <Card>
                            <CardContent className="relative aspect-video flex items-center justify-center p-6">
                                <Image src={image.url} alt={image.caption} fill className="object-cover rounded-lg" data-ai-hint="issue photo" />
                                <Badge className="absolute bottom-2 left-2">{image.caption}</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
    )
}

function RateService() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>How was the service?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Your feedback helps us improve our services.</p>
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <Button key={rating} variant="outline" size="icon" className="h-12 w-12 rounded-full">
                            <Star className="size-6" />
                        </Button>
                    ))}
                </div>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button>Submit Rating</Button>
            </CardFooter>
        </Card>
    )
}

function IssueDetailSkeleton() {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-9 w-3/4" />
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full aspect-video" />
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                       </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                         <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                     </CardContent>
                </Card>
            </div>
        </div>
      </div>
    );
}

function EditIssueDialog({ issue, onIssueUpdate }: { issue: Issue, onIssueUpdate: (updatedIssue: Issue) => void }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newDescription, setNewDescription] = useState(issue.description);
    const [newPhotoDataUri, setNewPhotoDataUri] = useState<string | null>(null);
    const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewPhotoPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setNewPhotoDataUri(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('issueId', issue.id);
        formData.append('description', newDescription);
        if (newPhotoDataUri) {
            formData.append('photoDataUri', newPhotoDataUri);
        }
        
        // Pass the localStorage data to the server action
        const localIssues = localStorage.getItem('civicseva_issues');
        if (localIssues) {
            formData.append('localIssues', localIssues);
        }


        const result = await updateIssueAction(formData);
        
        if(result.success && result.issue) {
            onIssueUpdate(result.issue);
            toast({ title: "Success!", description: "Issue updated successfully." });
            setOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Update Failed', description: result.error });
        }
        setIsSubmitting(false);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2" />
                    Edit Issue
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Issue</DialogTitle>
                        <DialogDescription>
                            Make changes to your reported issue here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="photo">Photo</Label>
                            <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} ref={photoInputRef} className="col-span-3" />
                            <div className="relative aspect-video mt-2">
                                <Image 
                                    src={newPhotoPreview || issue.imageUrl} 
                                    alt="Issue photo" 
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function FormattedDate({ dateString }: { dateString: string }) {
    const [formattedDate, setFormattedDate] = useState('');
    useEffect(() => {
        if (dateString) {
          try {
            setFormattedDate(format(new Date(dateString), 'PPP'));
          } catch (e) {
            console.error("Invalid date format for", dateString);
            setFormattedDate("Invalid Date");
          }
        }
    }, [dateString]);
    return <span>{formattedDate || "..."}</span>;
}

export default function IssueDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [issue, setIssue] = useState<Issue | null | undefined>(undefined);

    const handleIssueUpdate = (updatedIssue: Issue) => {
        setIssue(updatedIssue);
         // Also update localStorage
        const localIssues: Issue[] = JSON.parse(localStorage.getItem('civicseva_issues') || '[]');
        const issueIndex = localIssues.findIndex(i => i.id === updatedIssue.id);
        if(issueIndex > -1) {
            localIssues[issueIndex] = updatedIssue;
        } else {
            // if it's a new issue not in localstorage yet (e.g. from initialData), add it
            const initialIssueIndex = initialIssues.findIndex(i => i.id === updatedIssue.id);
            if(initialIssueIndex === -1) {
                 localIssues.unshift(updatedIssue);
            }
        }
        localStorage.setItem('civicseva_issues', JSON.stringify(localIssues));
    }

    useEffect(() => {
        if (!id) return;
        
        const localIssues: Issue[] = JSON.parse(localStorage.getItem('civicseva_issues') || '[]');
        const allIssues = [...localIssues, ...initialIssues];
        const foundIssue = allIssues.find(i => i.id === id);
        
        setIssue(foundIssue || null);

    }, [id]);

    useEffect(() => {
        if(issue === null) {
            notFound();
        }
    }, [issue]);

    if (issue === undefined) {
        return <IssueDetailSkeleton />;
    }

    const progress = issue.status === 'Resolved' ? 100 : issue.status === 'In Progress' ? 50 : 10;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground font-mono">{issue.id}</p>
                    <h1 className="text-3xl font-bold">{issue.title}</h1>
                </div>
                {issue.status === 'Reported' && (
                    <EditIssueDialog issue={issue} onIssueUpdate={handleIssueUpdate} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Photo Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageGallery images={issue.images} />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Issue Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                {issue.updates.map((update, index) => (
                                    <TimelineItem key={index} item={update} isLast={index === issue.updates.length - 1} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {issue.status === 'Resolved' && (
                       <RateService />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Comments</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                               <div className="flex gap-4">
                                   <Textarea placeholder="Add a public comment..." />
                                   <Button>
                                       <MessageSquare className="mr-2" />
                                       Comment
                                   </Button>
                               </div>
                           </div>
                        </CardContent>
                    </Card>

                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm">Status</h4>
                                <IssueStatusBadge status={issue.status} className="mt-1" />
                            </div>
                            <Separator />
                             <div>
                                <h4 className="font-semibold text-sm">Category</h4>
                                <Badge variant="secondary" className="mt-1">{issue.category}</Badge>
                            </div>
                             <Separator />
                            <div className="flex items-start gap-2 text-sm">
                                <Building className="size-4 text-muted-foreground mt-1" />
                                <div>
                                    <h4 className="font-semibold">Department</h4>
                                    <p className="text-muted-foreground">{issue.department}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="size-4 text-muted-foreground mt-1" />
                                <div>
                                    <h4 className="font-semibold">Location</h4>
                                    <p className="text-muted-foreground">{issue.location.address}</p>
                                    <p className="text-xs text-muted-foreground/80">({issue.location.latitude.toFixed(5)}, {issue.location.longitude.toFixed(5)})</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-2 text-sm">
                                <Calendar className="size-4 text-muted-foreground mt-1" />
                                <div>
                                    <h4 className="font-semibold">Reported On</h4>
                                    <p className="text-muted-foreground">
                                        <FormattedDate dateString={issue.reportedAt} />
                                    </p>
                                </div>
                            </div>
                            {issue.eta && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Clock className="size-4 text-muted-foreground mt-1" />
                                    <div>
                                        <h4 className="font-semibold">Est. Completion</h4>
                                        <p className="text-muted-foreground">
                                            <FormattedDate dateString={issue.eta} />
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={progress} className="h-3" />
                            <p className="text-sm text-center text-muted-foreground mt-2">{progress}% complete</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
