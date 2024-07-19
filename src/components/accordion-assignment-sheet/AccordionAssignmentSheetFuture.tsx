import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AssignmentCategoryTasksFuture } from '@/components/accordion-assignment-sheet/AssignmentCategoryTasksFuture';
import { NoTaskMessage } from '@/components/accordion-assignment-sheet/NoTaskMessage';

interface AccordionAssignmentSheetFutureProps {
  startDate: string;
  endDate: string;
  categories: {
    id: string;
    name: string;
    tasks: {
      id: string;
      title: string;
      description?: string;
    }[];
  }[];
}

export const AccordionAssignmentSheetFuture = ({
  startDate,
  endDate,
  categories,
}: AccordionAssignmentSheetFutureProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`item-1`}>
        <AccordionTrigger>
          {startDate} - {endDate}
        </AccordionTrigger>
        <AccordionContent className={'p-0 !rounded-none'} asChild>
          <div>
            {categories.length === 0 ? (
              <NoTaskMessage />
            ) : (
              categories.map((category) => (
                <AssignmentCategoryTasksFuture
                  key={category.id}
                  category={category}
                />
              ))
            )}
            <p className="text-right text-sm">This assignment may change.</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
