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
            Common questions about the Firefly Algorithm Workbench
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
                technique that mimics the flashing behavior of fireflies to
                solve complex problems. It uses the concept of light intensity
                and attractiveness to guide solutions toward the global optimum.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What's the difference between the Original FA and the Extended
                FA?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The Original Firefly Algorithm (FA) is the standard version of
                the metaheuristic algorithm, while the Extended FA is the
                proposed optimized version by the researchers. The proposed EFA
                is designed to address the common problem experienced by the
                original FA, which is getting stuck in local optima, leading to
                premature convergence or stagnation of the best solution, and
                reduced performance in complex, high-dimensional problems due to
                limited global search ability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                What were the main reasons for modifying the standard Firefly
                Algorithm instead of using it as-is?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The primary reason for proposing an Extended FA is to address
                the fundamental issue of the standard version. The goal is to
                optimize the algorithm into an even better version that could
                produce more efficient results using fewer computational
                resources and less time. Second, it aims to enable the algorithm
                to be applied to a wider range of problems, specifically,
                resource allocation, and to demonstrate its effectiveness in
                solving real-world scenarios.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                How did you produce the default parameter configurations in the
                tool for both the Original and Extended FA?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The default parameter configurations presented in the tool are a
                result of a series of repeated parameter fine-tuning, simulation
                testing, and sensitivity analysis. In the tests conducted by the
                researchers, this set of parameter values yielded the most
                efficient average results compared to other configurations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                How generalizable is your Extended Firefly Algorithm—could it be
                applied to optimization problems beyond flood personnel
                allocation?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The current implementation of the Extended FA is built
                specifically for a resource allocation problem. In that regard,
                it is not bounded by the selected disaster scenario for this
                study, which are flood scenarios, and can be applied in other
                contexts that mirror the methodology used in the study.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
