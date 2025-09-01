
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
import { Image as ImageIcon, Sparkles, MapPin, Loader2, Mic,Languages, Info, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast as useAppToast } from '@/hooks/use-toast';

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
    const { toast: appToast } = useAppToast();
    const router = useRouter();
    const [isSuggesting, startSuggestionTransition] = useTransition();
    
    // This state is just to show a loading spinner, not for triggering actions
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        address: '',
        error: null,
    });
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
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

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        // In a real app, you'd use a geocoding service here.
                        // For now, we'll just show the coordinates and a placeholder address.
                        const mockAddress = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        setLocation({ latitude, longitude, address: mockAddress, error: null });
                        form.setValue('address', mockAddress);
                    },
                    (error) => {
                        setLocation({ latitude: null, longitude: null, address: '', error: 'Could not fetch your location. Please enable location services and try again.' });
                        appToast({
                            variant: 'destructive',
                            title: 'Location Error',
                            description: 'Please enable location services to automatically detect your location.',
                        });
                    }
                );
            } else {
                setLocation({ latitude: null, longitude: null, address: '', error: 'Geolocation is not supported by this browser.' });
                 appToast({
                    variant: 'destructive',
                    title: 'Location Error',
                    description: 'Geolocation is not supported by your browser.',
                });
            }
        };

        getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            appToast({ variant: 'destructive', title: 'Please upload a photo first.' });
            return;
        }
        if (!location.latitude || !location.longitude) {
            appToast({ variant: 'destructive', title: 'Waiting for location data.' });
            return;
        }

        startSuggestionTransition(async () => {
            const formData = new FormData();
            formData.append('photoDataUri', photoDataUris[0]); // Suggest based on the first photo
            formData.append('locationData', `Lat: ${location.latitude}, Lon: ${location.longitude}`);
            
            const result = await suggestDescriptionAction(formData);

            if (result.success && result.description) {
                form.setValue('description', result.description);
                appToast({ title: 'Description suggested by AI!' });
            } else {
                appToast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        });
    };

    const onSubmit = (values: z.infer<typeof reportIssueSchema>) => {
       // Instead of submitting, we now redirect to login
       // We can store the form data in localStorage to repopulate after login
       try {
           const reportData = {
               ...values,
               photoDataUris,
               location,
           }
           localStorage.setItem('pending_issue_report', JSON.stringify(reportData));
       } catch (error) {
           console.error("Could not save report data to local storage", error);
       }
       
       setIsSubmitting(true);
       // Redirect to login page, which should then handle the submission after auth
       router.push('/login?redirect=/track&action=submit_issue');
    };
    
    const descriptionLength = form.watch('description')?.length || 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report a New Civic Issue</CardTitle>
                <CardDescription>Provide detailed information about the issue. You will be asked to log in to submit.</CardDescription>
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
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>3. Location</FormLabel>
                             <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder={location.error || location.address || "Detecting location..."} {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={() => {
                                     const getLocation = () => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (position) => {
                                                    const { latitude, longitude } = position.coords;
                                                    const mockAddress = `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                                                    setLocation({ latitude, longitude, address: mockAddress, error: null });
                                                    form.setValue('address', mockAddress);
                                                },
                                                (error) => {
                                                    setLocation({ latitude: null, longitude: null, address: '', error: 'Could not fetch your location. Please enable location services and try again.' });
                                                    appToast({
                                                        variant: 'destructive',
                                                        title: 'Location Error',
                                                        description: 'Please enable location services to automatically detect your location.',
                                                    });
                                                }
                                            );
                                        }
                                    };
                                    getLocation();
                                }}>
                                    <MapPin className="size-4" />
                                    <span className="sr-only">Detect Location</span>
                                </Button>
                             </div>
                             {location.error && <FormDescription className="text-destructive">{location.error}</FormDescription>}
                             {!location.error && location.latitude && location.longitude && (
                                <FormDescription>
                                    Lat: {location.latitude.toFixed(5)}, Lon: {location.longitude.toFixed(5)}
                                </FormDescription>
                             )}
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
                                <FormLabel>4. Description</FormLabel>
                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => appToast({title: 'Voice-to-text coming soon!'})}>
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
