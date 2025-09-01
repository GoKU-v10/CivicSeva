'use client';
import { useState, useEffect, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
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
import { Image as ImageIcon, Sparkles, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const reportIssueSchema = z.object({
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters long.',
  }),
  photo: z.any().refine((files) => files?.length === 1, 'Photo is required.'),
});

type LocationState = {
  latitude: number | null;
  longitude: number | null;
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
    error: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

  const form = useForm<z.infer<typeof reportIssueSchema>>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: {
      description: '',
    },
  });
  
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not fetch your location. Please ensure location services are enabled.',
          });
        }
      );
    }
  }, [toast]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setPhotoPreview(URL.createObjectURL(file));
        setPhotoDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSuggestDescription = () => {
    if (!photoDataUri) {
        toast({ variant: 'destructive', title: 'Please upload a photo first.' });
        return;
    }
    if (!location.latitude || !location.longitude) {
        toast({ variant: 'destructive', title: 'Waiting for location data.' });
        return;
    }

    startSuggestionTransition(async () => {
        const formData = new FormData();
        formData.append('photoDataUri', photoDataUri);
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
    if (!photoDataUri || !location.latitude || !location.longitude) {
        toast({ variant: 'destructive', title: 'Missing photo or location data.' });
        return;
    }
    
    startSubmissionTransition(async () => {
        const formData = new FormData();
        formData.append('description', values.description);
        formData.append('photoDataUri', photoDataUri);
        formData.append('latitude', String(location.latitude));
        formData.append('longitude', String(location.longitude));

        const result = await createIssueAction(formData);

        if(result.success) {
            toast({ title: 'Success', description: result.message });
            router.push('/dashboard');
        } else {
            toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
        }
    });
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Report a New Issue</CardTitle>
            <CardDescription>Fill out the details below. Our AI will help categorize it for a faster response.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Issue Photo</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-dashed border-2">
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Issue preview" width={128} height={128} className="object-cover rounded-lg w-full h-full" />
                                ) : (
                                    <ImageIcon className="size-8 text-muted-foreground" />
                                )}
                                </div>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    id="photo-upload" 
                                    ref={photoInputRef}
                                    onChange={(e) => {
                                        field.onChange(e.target.files);
                                        handlePhotoChange(e);
                                    }} 
                                />
                                <Button type="button" variant="outline" onClick={() => photoInputRef.current?.click()}>
                                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                </Button>
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
                            <FormLabel>Description</FormLabel>
                            <Button type="button" variant="ghost" size="sm" onClick={handleSuggestDescription} disabled={isSuggesting || !photoDataUri || !location.latitude}>
                                {isSuggesting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                                AI Suggest
                            </Button>
                        </div>
                        <FormControl>
                            <Textarea
                                placeholder="Describe the issue you see..."
                                rows={5}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="flex items-center p-3 rounded-lg bg-muted text-muted-foreground text-sm gap-2">
                    <MapPin className="size-4 shrink-0" />
                    {location.latitude && location.longitude ? 
                        <span>Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span> :
                        <span>{location.error || 'Fetching location...'}</span>
                    }
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Submit Report
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
