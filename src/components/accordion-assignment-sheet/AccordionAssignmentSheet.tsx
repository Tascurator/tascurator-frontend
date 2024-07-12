'use client';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TaskDescriptionDrawer } from '../ui/drawers/TaskDescriptionDrawer';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { toast } from '../ui/use-toast';
import { cn } from '@/lib/utils';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<{ [taskId: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    title: string;
    description: string;
  }>({ title: '', description: '' });

  const handleCheckboxChange = (taskId: string) => {
    setIsChecked((prevChecked) => ({
      ...prevChecked,
      [taskId]: !prevChecked[taskId],
    }));
  };

  const handleAllCheckedChange = (categoryId: string) => {
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

  const handleSaveClick = () => {
    const updatedTasks = Object.values(rotationData.rotations)
      .flatMap((rotation) =>
        rotation.categories.flatMap((category) => category.tasks),
      )
      .filter((task) => isChecked[task.id])
      .map((task) => ({
        ...task,
        isCompleted: isChecked[task.id] || false,
      }));
    console.log('updated', updatedTasks);
  };

  // TODO: Implement the onSubmit click functionality
  const onSubmit = async () => {
    setIsLoading(true);

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
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
            if (numericKey > 2) {
              return null;
            }
            return (
              <AccordionItem value={`item-${key}`} key={key}>
                <AccordionTrigger>
                  {rotation.startDate} - {rotation.endDate}
                </AccordionTrigger>
                <AccordionContent
                  className={'bg-primary-lightest p-0 rounded-none'}
                  asChild
                >
                  {rotation.categories.map((category) => (
                    <div key={category.id}>
                      <label className="flex items-center gap-1 mb-2 font-medium cursor-pointer">
                        <Checkbox
                          checked={category.tasks.every(
                            (task) => isChecked[task.id],
                          )}
                          onCheckedChange={() =>
                            handleAllCheckedChange(category.id)
                          }
                          disabled={numericKey > 1}
                        />
                        <p>{category.name}</p>
                      </label>

                      {category.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex justify-between items-center bg-white rounded-xl mb-2"
                        >
                          <label
                            className={cn(
                              `flex flex-1 items-center gap-1 py-2 px-3 cursor-pointer ${isChecked[task.id] ? 'text-gray-500' : ''}`,
                            )}
                          >
                            <Checkbox
                              checked={isChecked[task.id] || false}
                              onCheckedChange={() =>
                                handleCheckboxChange(task.id)
                              }
                              disabled={numericKey > 1}
                            />
                            <p>{task.title}</p>
                          </label>
                          <div className="flex items-center w-10 h-12 cursor-pointer">
                            {numericKey < 2 && (
                              <Info
                                className="stroke-gray-500"
                                onClick={() => {
                                  setCurrentTask({
                                    title: task.title,
                                    description: task.description || '',
                                  });
                                  setIsDrawerOpen(true);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {numericKey < 2 && (
                    <Button
                      type={'submit'}
                      className={'w-full mt-6'}
                      disabled={Object.values(isChecked).every(
                        (value) => !value,
                      )}
                      onClick={handleSaveClick}
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
      <TaskDescriptionDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        title={currentTask.title}
        description={currentTask.description}
      />
    </>
  );
};
