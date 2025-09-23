
'use client';
import { useState, useEffect, useTransition, useRef, useCallback } from 'react';
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
import { suggestIssueDescription } from '@/ai/flows/ai-suggest-issue-description';
import { categorizeIssue } from '@/ai/flows/ai-categorize-issue';
import { Image as ImageIcon, Sparkles, Loader2, Mic, Info, AlertTriangle, LocateFixed, Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createIssueAction } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Issue } from '@/lib/types';


const reportIssueSchema = z.object({
    category: z.string().min(1, 'Please select a category.'),
    description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters long.' })
        .max(500, { message: 'Description must not exceed 500 characters.' }),
    photos: z.any().refine((files) => files?.length >= 1, 'At least one photo is required.'),
    address: z.string().min(1, 'Location could not be determined. Please try again or enter manually.'),
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
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        address: '',
        error: null,
    });
    const [isFetchingLocation, setIsFetchingLocation] = useState(true);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [photoDataUris, setPhotoDataUris] = useState<string[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState<{ category: string, confidence: number} | null>(null);

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);


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
    
    const detectLocation = useCallback(async () => {
        setIsFetchingLocation(true);
        form.setValue('address', 'Detecting location...');

        const getPreciseLocation = () => {
            return new Promise<GeolocationPosition>((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 12000,
                        maximumAge: 0
                    });
                } else {
                    reject(new Error("Geolocation not supported."));
                }
            });
        };

        const reverseGeocode = async (lat: number, lon: number) => {
            const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}&types=address,place`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Reverse geocoding failed');
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    return data.features[0].place_name;
                }
                return `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            } catch (error) {
                console.error("Reverse geocoding error:", error);
                return `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            }
        };

        const getFallbackLocation = async () => {
            let res = await fetch("https://ipapi.co/json/");
            if (!res.ok) throw new Error("IP API failed");
            return res.json();
        };

        try {
            const pos = await getPreciseLocation();
            const { latitude, longitude } = pos.coords;
            const address = await reverseGeocode(latitude, longitude);
            setLocation({ latitude, longitude, address, error: null });
            form.setValue('address', address, { shouldValidate: true });
            toast({ title: 'Success', description: 'Precise location captured!' });
        } catch (err) {
            console.warn("GPS failed, falling back to IP:", err);
            toast({ variant: 'default', title: 'GPS failed', description: 'Using approximate location from IP address.' });
            try {
                const data = await getFallbackLocation();
                const address = await reverseGeocode(data.latitude, data.longitude);
                setLocation({ latitude: data.latitude, longitude: data.longitude, address, error: null });
                form.setValue('address', address, { shouldValidate: true });
            } catch (fallbackErr) {
                console.error("IP fallback also failed:", fallbackErr);
                const errorMsg = "Could not detect location automatically. Please enter manually.";
                setLocation(prev => ({ ...prev, error: errorMsg }));
                form.setValue('address', '');
                form.setError('address', { type: 'manual', message: errorMsg });
            }
        } finally {
            setIsFetchingLocation(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        detectLocation();
    }, [detectLocation]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            processFiles(files);
        }
    };

    const processFiles = async (files: File[]) => {
         const previewUrls = files.map(file => URL.createObjectURL(file));
        setPhotoPreviews(prev => [...prev, ...previewUrls]);

        const dataUris = await Promise.all(
            files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })
        );
        setPhotoDataUris(prev => [...prev, ...dataUris]);
        form.setValue('photos', [...(form.getValues('photos') || []), ...files], { shouldValidate: true });

        if (dataUris.length > 0 && location.latitude && location.longitude) {
            startSuggestionTransition(async () => {
                try {
                    const result = await categorizeIssue({
                        photoDataUri: dataUris[0],
                        description: '', 
                        location: {
                            latitude: location.latitude!,
                            longitude: location.longitude!,
                        }
                    });
                    if (result && result.category) {
                        setAiSuggestion(result);
                        if (!form.getValues('category')) {
                            form.setValue('category', result.category, { shouldValidate: true });
                        }
                    }
                } catch (error) {
                    console.error("AI categorization failed:", error);
                }
            });
        }
    }
    
    const handleSuggestDescription = () => {
        if (photoDataUris.length === 0 || !location.latitude) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please upload a photo and ensure location is set before using AI Suggest.' });
            return;
        }

        startSuggestionTransition(async () => {
            try {
                const result = await suggestIssueDescription({
                    photoDataUri: photoDataUris[0],
                    locationData: JSON.stringify({ lat: location.latitude, lon: location.longitude }),
                });

                if (result.suggestedDescription) {
                    form.setValue('description', result.suggestedDescription, { shouldValidate: true });
                    toast({ title: 'Success', description: 'AI has generated a description for you.' });
                } else {
                    toast({ variant: 'destructive', title: 'AI Suggestion Failed', description: 'Could not generate a suggestion.' });
                }
            } catch (error) {
                 toast({ variant: 'destructive', title: 'AI Suggestion Failed', description: 'An error occurred while generating the description.' });
                 console.error(error);
            }
        });
    };

    const handleVoiceToText = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({ variant: 'destructive', title: 'Error', description: 'Speech recognition is not supported in this browser.' });
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.lang = form.getValues('language') || 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsListening(true);
            toast({ title: 'Listening...', description: 'Start speaking to dictate the description.' });
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            toast({ variant: 'destructive', title: 'Voice Error', description: event.error });
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const currentDescription = form.getValues('description');
            form.setValue('description', currentDescription ? `${currentDescription} ${transcript}` : transcript);
            toast({ title: 'Success', description: 'Text successfully added from voice.'});
        };

        recognition.start();
    };

    const submitIssue = async (values: z.infer<typeof reportIssueSchema>) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('address', location.address);
        formData.append('photoDataUri', photoDataUris[0]);
        if (location.latitude) formData.append('latitude', String(location.latitude));
        if (location.longitude) formData.append('longitude', String(location.longitude));

        const localIssuesJSON = localStorage.getItem('civicseva_issues');
        if(localIssuesJSON) {
            formData.append('localIssues', localIssuesJSON);
        }

        const result = await createIssueAction(formData);

        if (result.success && result.issue) {
            const localIssues: Issue[] = localIssuesJSON ? JSON.parse(localIssuesJSON) : [];
            localIssues.unshift(result.issue);
            localStorage.setItem('civicseva_issues', JSON.stringify(localIssues));

            toast({ title: 'Success!', description: 'Issue submitted successfully.' });
            sessionStorage.setItem('newly_submitted_issue', JSON.stringify(result.issue));
            localStorage.removeItem('pending_issue_report');
            router.push('/dashboard/my-issues');
        } else {
            toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
        }
        setIsSubmitting(false);
    }

    const onSubmit = (values: z.infer<typeof reportIssueSchema>) => {
        if (!location.latitude || !location.longitude) {
            form.setError('address', { type: 'manual', message: 'Location is required. Please try again or enter manually.' });
            return;
        }
        const isLoggedIn = sessionStorage.getItem('is_citizen_logged_in') === 'true';

        if (isLoggedIn) {
            submitIssue(values);
        } else {
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
            router.push('/login?redirect=/dashboard/my-issues&action=submit_issue');
        }
    };
    
    useEffect(() => {
        if (!isCameraOpen) {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            return;
        }

        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings.',
                });
            }
        };

        getCameraPermission();
    }, [isCameraOpen, toast]);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUri = canvas.toDataURL('image/jpeg');
                
                fetch(dataUri)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        processFiles([file]);
                    });
            }
            setIsCameraOpen(false);
        }
    };
    
    const descriptionLength = form.watch('description')?.length || 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Report a New Civic Issue</CardTitle>
                <CardDescription>Provide detailed information about the issue. You may be asked to log in to submit.</CardDescription>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                                            <DialogTrigger asChild>
                                                <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50 flex flex-col items-center justify-center">
                                                    <Camera className="mx-auto size-10 text-muted-foreground" />
                                                    <p className="mt-2 text-sm text-muted-foreground">Use Camera</p>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                <DialogTitle>Live Camera</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                                                     {hasCameraPermission === false && (
                                                        <Alert variant="destructive">
                                                            <AlertTriangle className="h-4 w-4" />
                                                            <AlertTitle>Camera Access Denied</AlertTitle>
                                                            <AlertDescription>
                                                                Please allow camera access in your browser settings to use this feature.
                                                            </AlertDescription>
                                                        </Alert>
                                                    )}
                                                    <Button onClick={handleCapture} className="w-full" disabled={!hasCameraPermission}>
                                                        <Camera className="mr-2" /> Capture Photo
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50 flex flex-col items-center justify-center" onClick={() => photoInputRef.current?.click()}>
                                            <ImageIcon className="mx-auto size-10 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">Upload File</p>
                                        </div>
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
                                    <Input 
                                        placeholder={isFetchingLocation ? 'Detecting location...' : 'Location Address'} 
                                        {...field} 
                                    />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={detectLocation} disabled={isFetchingLocation}>
                                    {isFetchingLocation ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                                </Button>
                             </div>
                             {location.error && <FormDescription className="text-destructive">{location.error}</FormDescription>}
                             {!location.error && location.latitude && location.longitude && (
                                <FormDescription>
                                   ({location.latitude.toFixed(5)}, {location.longitude.toFixed(5)})
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
                                    <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8", isListening && "bg-red-500/20 text-red-500")} onClick={handleVoiceToText}>
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
                            Based on the selected category, the expected resolution time is <span className="font-bold">7-8 business days</span>. This may vary depending on issue severity.
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

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isFetchingLocation}>
                        {(isSubmitting || isFetchingLocation) && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {isFetchingLocation ? 'Getting Location...' : 'Review & Submit Issue'}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    );
}
