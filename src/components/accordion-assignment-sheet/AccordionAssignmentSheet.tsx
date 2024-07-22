'use client';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { AssignmentCategoryTasks } from '@/components/accordion-assignment-sheet/AssignmentCategoryTasks';
import { ITask } from '@/types/commons';
import { NoTaskMessage } from '@/components/accordion-assignment-sheet/NoTaskMessage';
import { taskCompletionUpdateSchema } from '@/constants/schema';

interface AccordionAssignmentSheetProps {
  startDate: string;
  endDate: string;
  categories: {
    id: string;
    name: string;
    tasks: (ITask & { isCompleted: boolean })[];
  }[];
}

interface FormValues {
  tasks: {
    id: string;
    isCompleted: boolean;
  }[];
}

export const AccordionAssignmentSheet = ({
  startDate,
  endDate,
  categories,
}: AccordionAssignmentSheetProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    tasks: categories.flatMap((category) =>
      category.tasks.map((task) => ({
        id: task.id,
        isCompleted: task.isCompleted,
      })),
    ),
  };

  const { handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(taskCompletionUpdateSchema),
    defaultValues,
  });

  // Watch changes in form field values
  const watchedFields = watch('tasks');

  // Enable Save button when isCompleted status is changed from the initial value
  const isEnabled = watchedFields.some(
    (task, index) =>
      task.isCompleted !==
      categories.flatMap((category) => category.tasks)[index].isCompleted,
  );

  // Change the state of checkboxes
  const handleCheckboxChange = (taskId: string) => {
    setValue(
      'tasks',
      watchedFields.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  const handleAllCheckedChange = (categoryId: string) => {
    // Get all task IDs in the category
    const taskIds =
      categories
        .find((category) => category.id === categoryId)
        ?.tasks.map((task) => task.id) || [];

    // Check if all tasks are completed
    const allChecked = taskIds.every(
      (taskId) => watchedFields.find((task) => task.id === taskId)?.isCompleted,
    );

    setValue(
      'tasks',
      watchedFields.map((task) =>
        taskIds.includes(task.id)
          ? { ...task, isCompleted: !allChecked }
          : task,
      ),
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    // Filter out only the changed tasks
    const updatedTasks = data.tasks.filter(
      (task, index) =>
        task.isCompleted !== defaultValues.tasks[index].isCompleted,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      variant: 'default',
      description: TOAST_TEXTS.success,
    });

    console.log('Updated Tasks:', updatedTasks);
  };

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={true} />}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={`item-1`}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AccordionItem value={`item-1`}>
            <AccordionTrigger>
              {startDate} - {endDate}
            </AccordionTrigger>
            <AccordionContent
              className="bg-primary-lightest p-0 rounded-none"
              asChild
            >
              {categories.length === 0 ? (
                <NoTaskMessage />
              ) : (
                categories.map((category) => (
                  <AssignmentCategoryTasks
                    key={category.id}
                    category={category}
                    isChecked={watchedFields.reduce(
                      (acc, task) => {
                        acc[task.id] = task.isCompleted;
                        return acc;
                      },
                      {} as { [taskId: string]: boolean },
                    )}
                    handleAllCheckedChange={handleAllCheckedChange}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                ))
              )}
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={!isEnabled}
              >
                Save
              </Button>
            </AccordionContent>
          </AccordionItem>
        </form>
      </Accordion>
    </>
  );
};