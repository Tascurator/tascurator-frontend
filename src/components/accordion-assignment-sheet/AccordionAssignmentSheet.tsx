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

interface AccordionAssignmentSheetProps {
  rotationData: {
    rotations: {
      [key: number]: {
        startDate: string;
        endDate: string;
        categories: {
          id: string;
          name: string;
          tasks: {
            id: string;
            title: string;
            description?: string;
            isCompleted?: boolean;
          }[];
        }[];
      };
    };
  };
}

export const AccordionAssignmentSheet = ({
  rotationData,
}: AccordionAssignmentSheetProps) => {
  const [isChecked, setIsChecked] = useState<{ [taskId: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Set initial checkbox states based on task completion status
  useEffect(() => {
    // Initialize isChecked based on initial task data
    const initialChecked: { [taskId: string]: boolean } = {};
    Object.values(rotationData.rotations).forEach((rotation) => {
      rotation.categories.forEach((category) => {
        category.tasks.forEach((task) => {
          initialChecked[task.id] = !!task.isCompleted;
        });
      });
    });
    setIsChecked(initialChecked);
  }, [rotationData]);

  const handleCheckboxChange = (taskId: string) => {
    setIsEnabled(false);
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [taskId]: !prevChecked[taskId],
    }));
  };

  const handleAllCheckedChange = (categoryId: string) => {
    setIsEnabled(false);
    // Get all task IDs for the category
    const taskIds = Object.values(rotationData.rotations).flatMap(
      (rotation) =>
        rotation.categories
          .find((category) => category.id === categoryId)
          ?.tasks.map((task) => task.id) || [],
    );

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
    const updatedTasks = Object.values(rotationData.rotations)
      .flatMap((rotation) =>
        rotation.categories.flatMap((category) => category.tasks),
      )
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
          {Object.entries(rotationData.rotations).map(([key, rotation]) => {
            const numericKey = parseInt(key);
            return (
              <AccordionItem value={`item-${key}`} key={key}>
                <AccordionTrigger>
                  {rotation.startDate} - {rotation.endDate}
                </AccordionTrigger>
                <AccordionContent
                  className={'bg-primary-lightest p-0 rounded-none'}
                  asChild
                >
                  {rotation.categories.length === 0 ? (
                    <p className="p-4 text-center">No task</p>
                  ) : (
                    rotation.categories.map((category) => (
                      <AssignmentCategoryTasks
                        key={category.id}
                        category={category}
                        isChecked={isChecked}
                        handleAllCheckedChange={handleAllCheckedChange}
                        handleCheckboxChange={handleCheckboxChange}
                        numericKey={parseInt(key)}
                      />
                    ))
                  )}
                  {numericKey === 1 && (
                    <Button
                      type={'submit'}
                      className={'w-full mt-6'}
                      disabled={isEnabled}
                    >
                      Save
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </form>
      </Accordion>
    </>
  );
};
