'use client';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { toast } from '../ui/use-toast';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { AssignmentCategoryTasks } from './AssignmentCategoryTasks';
import { ITask } from '@/types/commons';
import { NoTaskMessage } from './NoTaskMessage';

interface AccordionAssignmentSheetProps {
  startDate: string;
  endDate: string;
  categories: {
    id: string;
    name: string;
    tasks: (ITask & { isCompleted: boolean })[];
  }[];
}

export const AccordionAssignmentSheet = ({
  startDate,
  endDate,
  categories,
}: AccordionAssignmentSheetProps) => {
  const [isChecked, setIsChecked] = useState<{ [taskId: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [updatedTasks, setUpdatedTasks] = useState<{
    [taskId: string]: boolean;
  }>({});

  // Set initial checkbox states based on task completion status
  useEffect(() => {
    // Initialize isChecked based on initial task data
    const initialChecked: { [taskId: string]: boolean } = {};
    categories.forEach((category) => {
      category.tasks.forEach((task) => {
        initialChecked[task.id] = !!task.isCompleted;
      });
    });
    setIsChecked(initialChecked);
  }, [categories]);

  const handleCheckboxChange = (taskId: string) => {
    setIsEnabled(false);
    setIsChecked((prevChecked) => {
      const newChecked = {
        ...prevChecked,
        [taskId]: !prevChecked[taskId],
      };
      setUpdatedTasks({
        ...updatedTasks,
        [taskId]: newChecked[taskId],
      });
      return newChecked;
    });
  };

  const handleAllCheckedChange = (categoryId: string) => {
    setIsEnabled(false);
    // Get all task IDs for the category
    const taskIds =
      categories
        .find((category) => category.id === categoryId)
        ?.tasks.map((task) => task.id) || [];

    // Check if all tasks in the category are checked
    const allChecked = taskIds.every((taskId) => isChecked[taskId]);

    // Create a new checked state with toggled values
    const newChecked = { ...isChecked };
    taskIds.forEach((taskId) => {
      newChecked[taskId] = !allChecked;
    });

    // Update the checked state
    setIsChecked(newChecked);
  };

  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    setIsLoading(true);

    // Update the tasks
    const updatedTasks = categories
      .flatMap((category) => category.tasks)
      // .filter((task) => task.isCompleted)
      .map((task) => ({
        // ...task,
        id: task.id,
        isCompleted: isChecked[task.id] || false,
      }));
    console.log('updated', updatedTasks);

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
    }, 1000);
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
              className={'bg-primary-lightest p-0 rounded-none'}
              asChild
            >
              {categories.length === 0 ? (
                <NoTaskMessage />
              ) : (
                categories.map((category) => (
                  <AssignmentCategoryTasks
                    key={category.id}
                    category={category}
                    isChecked={isChecked}
                    handleAllCheckedChange={handleAllCheckedChange}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                ))
              )}
              <Button
                type={'submit'}
                className={'w-full mt-6'}
                disabled={isEnabled}
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
