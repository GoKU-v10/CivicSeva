import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, Phone } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I report an issue?",
      answer: "Navigate to the 'Report New Issue' page from the sidebar. Upload a photo, fill in the description, and our app will automatically detect your location. Then, just hit submit!",
    },
    {
      question: "How can I track the status of my reported issues?",
      answer: "You can see all the issues you've reported on the 'My Issues' page. The status of each issue (Reported, In Progress, Resolved) will be displayed on the issue card.",
    },
    {
        question: "Is my personal information kept private?",
        answer: "Yes, you have the option to report issues anonymously. We are committed to protecting your privacy. Please see our Privacy Policy for more details.",
    },
    {
        question: "What is the Community Map?",
        answer: "The Community Map shows all the issues reported by citizens in your area. It helps you stay informed about what's happening in your neighborhood.",
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">We're here to help you. Find answers to common questions below.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <LifeBuoy className="h-6 w-6 text-primary" />
                <span>support@civicconnect.app</span>
            </div>
            <div className="flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                <span>(555) 123-4567</span>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
