

'use client';
import { useState, useTransition } from 'react';
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
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const updateStatusSchema = z.object({
  issueId: z.string().regex(/^IS-\d+$/, { message: "Invalid Issue ID format. Must be 'IS-' followed by numbers." }),
  departmentPin: z.string().length(4, { message: "PIN must be exactly 4 digits." }).regex(/^\d{4}$/, { message: "PIN must only contain numbers." }),
  status: z.string().min(1, 'Please select a status.'),
  comments: z.string().optional(),
});

export function DepartmentUpdateForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof updateStatusSchema>>({
        resolver: zodResolver(updateStatusSchema),
        defaultValues: {
            issueId: '',
            departmentPin: '',
            status: '',
            comments: '',
        },
    });

    const onSubmit = (values: z.infer<typeof updateStatusSchema>) => {
       setIsSubmitting(true);
       
       // Simulate API call and PIN validation
       setTimeout(() => {
        console.log("Form submitted:", values);
        
        // In a real app, you would have a server action here to validate the PIN
        // against the issue's assigned department and then update the database.
        
        toast({
            title: "Update Successful!",
            description: `Status for issue ${values.issueId} has been updated to "${values.status}". The citizen has been notified.`,
        });

        form.reset();
        setIsSubmitting(false);
       }, 1500);
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
