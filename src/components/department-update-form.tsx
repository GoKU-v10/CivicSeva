

'use client';
import { useState, useTransition, useRef } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';
import { updateIssueDetailsAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const updateStatusSchema = z.object({
  issueId: z.string().regex(/^IS-\d+$/, { message: "Invalid Issue ID format. Must be 'IS-' followed by numbers." }),
  departmentPin: z.string().length(4, { message: "PIN must be exactly 4 digits." }).regex(/^\d{4}$/, { message: "PIN must only contain numbers." }),
  status: z.string().min(1, 'Please select a status.'),
  comments: z.string().optional(),
  afterPhoto: z.any().optional(),
});

export function DepartmentUpdateForm() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);

    const form = useForm<z.infer<typeof updateStatusSchema>>({
        resolver: zodResolver(updateStatusSchema),
        defaultValues: {
            issueId: '',
            departmentPin: '',
            status: '',
            comments: '',
        },
    });
    
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

    const onSubmit = async (values: z.infer<typeof updateStatusSchema>) => {
       setIsSubmitting(true);
       
        const formData = new FormData();
        formData.append('issueId', values.issueId);
        formData.append('status', values.status);
        if (values.comments) {
            formData.append('comments', values.comments);
        }
        if (photoDataUri) {
            formData.append('afterPhotoDataUri', photoDataUri);
        }
        
        // In a real app, the PIN would be validated on the server against the issue's department
        // For this demo, we'll just pass it along but not use it.
        
        const localIssues = localStorage.getItem('civicseva_issues');
        if (localIssues) {
          formData.append('localIssues', localIssues);
        }

        const result = await updateIssueDetailsAction(formData);

        if (result.success && result.issue) {
            toast({
                title: "Update Successful!",
                description: `Status for issue ${values.issueId} has been updated.`,
            });
            form.reset();
            setPhotoPreview(null);
            setPhotoDataUri(null);
            
            // Redirect to the public tracking page for the updated issue
            router.push(`/track/${result.issue.id}`);

        } else {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.error || "An unknown error occurred.",
            });
        }

        setIsSubmitting(false);
    };
    

    return (
        <Card>
            <CardContent className="p-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="issueId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Issue ID</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., IS-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="departmentPin"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department PIN</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your 4-digit department PIN" {...field} />
                            </FormControl>
                             <FormDescription>This PIN was provided in your assignment notification.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a new status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Cannot Fix">Cannot Fix</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="afterPhoto"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload "After" Photo (Optional)</FormLabel>
                            <FormControl>
                                 <Input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        field.onChange(e.target.files);
                                        handlePhotoChange(e);
                                    }} 
                                />
                            </FormControl>
                             {photoPreview && (
                                <div className="relative aspect-video mt-2 rounded-md overflow-hidden border">
                                    <Image src={photoPreview} alt="After photo preview" fill className="object-cover" />
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comments (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add any relevant notes or comments for the public timeline..." rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        Update Status
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    );
}
