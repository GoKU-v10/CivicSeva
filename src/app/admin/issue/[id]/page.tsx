

'use client';

import { issues as initialIssues } from "@/lib/data";
import type { Issue, IssueUpdate, IssueImage } from "@/lib/types";
import { useParams, notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IssueStatusBadge } from "@/components/issue-status-badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Building, Clock, Calendar, CheckCircle2, Star, MessageSquare, AlertTriangle, Edit, Loader2, ArrowLeft, User, Workflow, ShieldQuestion, Upload, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { priorities } from "../../components/columns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateIssueDetailsAction, deleteAfterPhotoAction } from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


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

function ImageGallery({ issue, images, onIssueUpdate }: { issue: Issue; images: IssueImage[], onIssueUpdate: (updatedIssue: Issue) => void }) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAfterPhoto = async () => {
        setIsDeleting(true);

        const formData = new FormData();
        formData.append('issueId', issue.id);

        const localIssues = localStorage.getItem('civicseva_issues');
        if (localIssues) {
            formData.append('localIssues', localIssues);
        }

        const result = await deleteAfterPhotoAction(formData);

        if (result.success && result.issue) {
            onIssueUpdate(result.issue);
            toast({ title: "Success", description: "'After' photo has been deleted." });
        } else {
            toast({ variant: 'destructive', title: 'Delete Failed', description: result.error });
        }
        setIsDeleting(false);
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                    <AlertTriangle className="mx-auto size-8 mb-2"/>
                    <p className="font-semibold">No Images Available</p>
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
                                {image.caption.toLowerCase() === 'after' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8">
                                                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 className="size-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the 'After' photo. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteAfterPhoto} disabled={isDeleting}>
                                                    Yes, delete photo
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 md:-left-12" />
            <CarouselNext className="hidden md:flex -right-4 md:-right-12" />
        </Carousel>
    )
}

function AfterPhotoDialog({ issue, onIssueUpdate }: { issue: Issue, onIssueUpdate: (updatedIssue: Issue) => void }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setPhotoDataUri(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!photoDataUri) {
            toast({ variant: 'destructive', title: 'No Photo Selected', description: 'Please select a photo to upload.' });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('issueId', issue.id);
        formData.append('afterPhotoDataUri', photoDataUri);
        
        const localIssues = localStorage.getItem('civicseva_issues');
        if (localIssues) {
            formData.append('localIssues', localIssues);
        }

        const result = await updateIssueDetailsAction(formData);
        
        if (result.success && result.issue) {
            onIssueUpdate(result.issue);
            toast({ title: "Success!", description: "'After' photo uploaded successfully." });
            setOpen(false);
            setPhotoPreview(null);
            setPhotoDataUri(null);
        } else {
            toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm">
                    <Upload className="mr-2" />
                    Add 'After' Photo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Upload 'After' Photo</DialogTitle>
                        <DialogDescription>
                            Upload a photo showing the resolved issue. This will be visible to the public.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="photo">Photo File</Label>
                            <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} ref={photoInputRef} className="col-span-3" />
                            {photoPreview && (
                                <div className="relative aspect-video mt-2">
                                    <Image 
                                        src={photoPreview} 
                                        alt="After photo preview" 
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                         <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Upload Photo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


function AdminIssueDetailSkeleton() {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/4" />
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

export default function AdminIssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [issue, setIssue] = useState<Issue | null | undefined>(undefined);

     const handleIssueUpdate = (updatedIssue: Issue) => {
        setIssue(updatedIssue);
        const localIssues: Issue[] = JSON.parse(localStorage.getItem('civicseva_issues') || '[]');
        const issueIndex = localIssues.findIndex(i => i.id === updatedIssue.id);
        if (issueIndex > -1) {
            localIssues[issueIndex] = updatedIssue;
        } else {
             const initialIssueIndex = initialIssues.findIndex(i => i.id === updatedIssue.id);
             if (initialIssueIndex > -1) {
                // This means the issue was from initialData, and is now updated.
                // We must add it to localStorage.
                 localIssues.unshift(updatedIssue);
             } else {
                 // This case should ideally not happen if data sources are consistent.
                 localIssues.unshift(updatedIssue);
             }
        }
        localStorage.setItem('civicseva_issues', JSON.stringify(localIssues));
    };

    useEffect(() => {
        if (!id) return;
        
        const localIssues: Issue[] = JSON.parse(localStorage.getItem('civicseva_issues') || '[]');
        
        // Merge with initial data, giving preference to local (updated) data
        const issueMap = new Map<string, Issue>();
        initialIssues.forEach(issue => issueMap.set(issue.id, issue));
        localIssues.forEach(issue => issueMap.set(issue.id, issue));

        const foundIssue = issueMap.get(id);
        
        setIssue(foundIssue || null);

    }, [id]);

    useEffect(() => {
        if(issue === null) {
            notFound();
        }
    }, [issue]);

    if (issue === undefined) {
        return <AdminIssueDetailSkeleton />;
    }

    const priority = priorities.find(p => p.value === issue.priority);

    return (
        <div className="space-y-8">
             <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2" />
                Back
            </Button>
            
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground font-mono">{issue.id.substring(0,9)}</p>
                    <h1 className="text-3xl font-bold">{issue.title}</h1>
                </div>
                <IssueStatusBadge status={issue.status} className="text-base py-1 px-3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">{issue.description}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Photo Gallery</CardTitle>
                             <AfterPhotoDialog issue={issue} onIssueUpdate={handleIssueUpdate} />
                        </CardHeader>
                        <CardContent>
                            <ImageGallery issue={issue} images={issue.images} onIssueUpdate={handleIssueUpdate} />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Workflow /> Issue Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                {issue.updates.map((update, index) => (
                                    <TimelineItem key={index} item={update} isLast={index === issue.updates.length - 1} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Internal Notes</CardTitle>
                            <CardDescription>Notes are only visible to other admins and officials.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                               <div className="flex gap-4">
                                   <Textarea placeholder="Add an internal note..." />
                                   <Button>
                                       <MessageSquare className="mr-2" />
                                       Add Note
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
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold">Category</h4>
                                <Badge variant="secondary" className="mt-1">{issue.category}</Badge>
                            </div>
                            <Separator />
                             {priority && (
                                <>
                                <div>
                                    <h4 className="font-semibold">Priority</h4>
                                    <div className="flex items-center text-sm mt-1">
                                        <priority.icon className="mr-1.5 h-4 w-4 text-muted-foreground" />
                                        <span>{priority.label}</span>
                                    </div>
                                </div>
                                <Separator />
                                </>
                             )}
                            <div className="flex items-start gap-2.5">
                                <Building className="size-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Department</h4>
                                    <p className="text-muted-foreground">{issue.department}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin className="size-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Location</h4>
                                    <p className="text-muted-foreground">{issue.location.address}</p>
                                    <p className="text-xs text-muted-foreground/80">({issue.location.latitude.toFixed(5)}, {issue.location.longitude.toFixed(5)})</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-2.5">
                                <Calendar className="size-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Reported On</h4>
                                    <p className="text-muted-foreground">
                                        <FormattedDate dateString={issue.reportedAt} />
                                    </p>
                                </div>
                            </div>
                            {issue.eta && (
                                <div className="flex items-start gap-2.5">
                                    <Clock className="size-4 text-muted-foreground mt-0.5" />
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
                            <CardTitle className="flex items-center gap-2"><ShieldQuestion /> Citizen Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">
                            To protect privacy, the identity of the citizen who reported this issue is kept completely anonymous.
                           </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

    

