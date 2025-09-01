'use client';
import { useState, useEffect, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestDescriptionAction, createIssueAction } from '@/lib/actions';
import { Image as ImageIcon, Sparkles, MapPin, Loader2, Mic,Languages, Info, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const reportIssueSchema = z.object({
    category: z.string().min(1, 'Please select a category.'),
    description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters long.' })
        .max(500, { message: 'Description must not exceed 500 characters.' }),
    photos: z.any().refine((files) => files?.length >= 1, 'At least one photo is required.'),
    address: z.string().optional(),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions.'),
    language: z.string().optional(),
});


type LocationState = {
  latitude: number | null;
  longitude: number | null;
  address: string;
  error: string | null;
};

export function ReportIssueForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSuggesting, startSuggestionTransition] = useTransition();
    const [isSubmitting, startSubmissionTransition] = useTransition();

    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        address: '',
        error: null,
    });
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [photoDataUris, setPhotoDataUris] = useState<string[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState<{ category: string, confidence: number} | null>(null);

    const form = useForm<z.infer<typeof reportIssueSchema>>({
        resolver: zodResolver(reportIssueSchema),
        defaultValues: {
            category: '',
            description: '',
            photos: undefined,
            address: '',
            terms: false,
            language: 'en',
        },
    });

    const photoInputRef = useRef<HTMLInputElement>(null);

    const fetchLocation = () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude, address: 'Fetching address...', error: null });
            // In a real app, you would use a geocoding service here.
            setTimeout(() => {
                const fetchedAddress = '123 Main St, Anytown, USA';
                setLocation(loc => ({...loc, address: fetchedAddress}));
                form.setValue('address', fetchedAddress);
            }, 1000);
            },
            (error) => {
            setLocation({ latitude: null, longitude: null, address: '', error: error.message });
            toast({
                variant: 'destructive',
                title: 'Location Error',
                description: 'Could not fetch your location. Please enable location services and refresh.',
            });
            }
        );
        }
    };
    
    useEffect(() => {
        fetchLocation();
    }, [toast, form]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newPreviews: string[] = [];
            const newDataUris: string[] = [];
            const fileArray = Array.from(files);

            fileArray.forEach(file => {
                newPreviews.push(URL.createObjectURL(file));
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    newDataUris.push(loadEvent.target?.result as string);
                    if(newDataUris.length === fileArray.length) {
                       setPhotoDataUris(uris => [...uris, ...newDataUris]);
                    }
                };
                reader.readAsDataURL(file);
            });
            setPhotoPreviews(previews => [...previews, ...newPreviews]);
        }
    };
  
    const handleSuggestDescription = () => {
        if (photoDataUris.length === 0) {
            toast({ variant: 'destructive', title: 'Please upload a photo first.' });
            return;
        }
        if (!location.latitude || !location.longitude) {
            toast({ variant: 'destructive', title: 'Waiting for location data.' });
            return;
        }

        startSuggestionTransition(async () => {
            const formData = new FormData();
            formData.append('photoDataUri', photoDataUris[0]); // Suggest based on the first photo
            formData.append('locationData', `Lat: ${location.latitude}, Lon: ${location.longitude}`);
            
            const result = await suggestDescriptionAction(formData);

            if (result.success && result.description) {
                form.setValue('description', result.description);
                toast({ title: 'Description suggested by AI!' });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        });
    };

    const onSubmit = (values: z.infer<typeof reportIssueSchema>) => {
        if (photoDataUris.length === 0 || !location.latitude || !location.longitude) {
            toast({ variant: 'destructive', title: 'Missing photo or location data.' });
            return;
        }
        
        startSubmissionTransition(async () => {
            const formData = new FormData();
            formData.append('description', values.description);
            // In a real implementation, you'd handle multiple URIs.
            // For now, we send the first one for categorization.
            formData.append('photoDataUri', photoDataUris[0]); 
            formData.append('latitude', String(location.latitude));
            formData.append('longitude', String(location.longitude));

            const result = await createIssueAction(formData);

            if(result.success) {
                toast({ title: 'Success!', description: 'Issue submitted successfully. Your issue ID is XYZ-123.' });
                router.push('/dashboard/my-issues');
            } else {
                toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
            }
        });
    };
    
    const descriptionLength = form.watch('description')?.length || 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report a New Civic Issue</CardTitle>
                <CardDescription>Provide detailed information about the issue for a faster resolution.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>1. Category</FormLabel>
                             {aiSuggestion && (
                                <Alert>
                                    <Sparkles className="h-4 w-4" />
                                    <AlertTitle>AI Suggestion</AlertTitle>
                                    <AlertDescription>
                                        We think this is a <span className="font-semibold">{aiSuggestion.category}</span> issue (Confidence: {Math.round(aiSuggestion.confidence * 100)}%). Feel free to change it if it's incorrect.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select an issue category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Pothole">Pothole</SelectItem>
                                <SelectItem value="Graffiti">Graffiti</SelectItem>
                                <SelectItem value="Streetlight Outage">Streetlight Outage</SelectItem>
                                <SelectItem value="Waste Management">Waste Management</SelectItem>
                                <SelectItem value="Damaged Sign">Damaged Sign</SelectItem>
                                <SelectItem value="Water Leak">Water Leak</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photos"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>2. Issue Photos/Videos</FormLabel>
                            <FormControl>
                                <div>
                                    <Input 
                                        type="file" 
                                        accept="image/*,video/*" 
                                        className="hidden" 
                                        id="photo-upload" 
                                        ref={photoInputRef}
                                        multiple
                                        onChange={(e) => {
                                            field.onChange(e.target.files);
                                            handlePhotoChange(e);
                                        }} 
                                    />
                                    <div className="p-6 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50" onClick={() => photoInputRef.current?.click()}>
                                        <ImageIcon className="mx-auto size-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">Drag & drop files here, or click to browse.</p>
                                    </div>
                                    {photoPreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                            {photoPreviews.map((src, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>3. Description</FormLabel>
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => alert('Voice-to-text coming soon!')}>
                                        <Mic className="size-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={handleSuggestDescription} disabled={isSuggesting || photoDataUris.length === 0 || !location.latitude}>
                                        {isSuggesting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                                        AI Suggest
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                               <FormControl>
                                    <Textarea placeholder="Describe the issue you see..." rows={6} {...field} maxLength={500} className="pr-24"/>
                                </FormControl>
                                <div className="absolute top-2 right-2">
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-auto text-xs h-7">
                                                            <SelectValue placeholder="Language" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="en">English</SelectItem>
                                                        <SelectItem value="hi">Hindi</SelectItem>
                                                        <SelectItem value="mr">Marathi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormDescription className="flex justify-between">
                                <span>Provide as much detail as possible.</span>
                                <span>{descriptionLength} / 500</span>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>4. Location</FormLabel>
                             <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder={location.address || "Enter address or detect location"} {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={fetchLocation}>
                                    <MapPin className="size-4" />
                                    <span className="sr-only">Detect Location</span>
                                </Button>
                             </div>
                             {location.error && <FormDescription className="text-destructive">{location.error}</FormDescription>}
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <div className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Expected Resolution Timeline</AlertTitle>
                            <AlertDescription>
                            Based on the selected category, the expected resolution time is <span className="font-bold">3-5 business days</span>. This may vary depending on issue severity.
                            </AlertDescription>
                        </Alert>
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Please Note</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Submitting false or misleading information is a punishable offense.</li>
                                    <li>This platform is for civic issues only. For emergencies, please call 911.</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </div>


                    <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>
                                I confirm the information is accurate and accept the terms of service.
                            </FormLabel>
                            <FormMessage />
                            </div>
                        </FormItem>
                        )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Review & Submit Issue
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    );
}
