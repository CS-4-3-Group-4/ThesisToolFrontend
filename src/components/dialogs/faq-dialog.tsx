import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function FAQDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] !max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </DialogTitle>
          <DialogDescription>
            Common questions about the Firefly Algorithm Simulator
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                What is the Firefly Algorithm?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The Firefly Algorithm (FA) is a nature-inspired optimization
                algorithm based on the flashing behavior of fireflies. It uses
                the concept of attractiveness and light intensity to guide
                fireflies (solutions) toward optimal positions in the search
                space.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What's the difference between Original FA and Extended FA?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perferendis ab repellendus facere voluptate, ut officiis
                distinctio in fugit error culpa voluptatibus, esse maiores
                consequatur vel praesentium saepe quaerat blanditiis voluptates!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
