import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  BoldIcon,
  ListIcon,
  ListOrderedIcon,
  UnderlineIcon,
} from 'lucide-react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessage } from '@/components/ui/formMessage';
import { cn } from '@/lib/utils';

// The list of toolbar icons to be displayed in the task description input field
const toolbarIcons = [
  {
    name: 'bold',
    icon: <BoldIcon className={'size-5'} />,
  },
  {
    name: 'underline',
    icon: <UnderlineIcon className={'size-5'} />,
  },
  {
    name: 'list',
    icon: <ListIcon className={'size-5'} />,
  },
  {
    name: 'listOrdered',
    icon: <ListOrderedIcon className={'size-5'} />,
  },
];

// Define the schema for the task creation form
const schema = z.object({
  category: z
    .string()
    .min(1, "Category can't be empty")
    .max(15, "Category can't be more than 15 characters"),
  title: z
    .string()
    .min(1, "Title can't be empty")
    .max(20, "Title can't be more than 20 characters"),
  description: z
    .string()
    .min(10, "Description can't be empty")
    .max(1000, "Description can't be more than 1000 characters"),
});

// Infer the type from the schema
type TScheme = z.infer<typeof schema>;

interface ITaskCreationDrawer {
  taskId?: string;
  category?: string;
  title?: string;
  description?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * TaskCreationDrawer component
 *
 * This component is used to create a new task or edit an existing task.
 *
 * @param taskId - The ID will be used to update the task
 * @param category - The category of the task (e.g. Kitchen, Bathroom)
 * @param title - The title of the task (e.g. Mop the floor)
 * @param description - The description of the task (e.g. Mop the floor with a wet mop)
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 */
export const TaskCreationDrawer = ({
  taskId,
  category,
  title,
  description,
  open,
  setOpen,
}: ITaskCreationDrawer) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TScheme>({
    resolver: zodResolver(schema),
  });

  // This function will be called when the validation is successful after form submission
  const onSubmit: SubmitHandler<TScheme> = async (data) => {
    // Handle form submission
    console.log('submitting data');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(data);
    reset();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent className={'h-5/6'}>
        <DrawerHeader>
          <DrawerTitle>Edit Task</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex-1 flex flex-col'}
        >
          <DrawerDescription
            className={'flex-1 flex flex-col justify-center items-start'}
          >
            {/* Category input field */}
            <p className={'font-medium'}>Category</p>
            <Input
              {...register('category')}
              variant={errors.category ? 'destructive' : 'default'}
              type="text"
              defaultValue={category}
              placeholder="Category name"
              className={'mt-1.5'}
              // Disable the input field if category is present
              disabled={!!category}
            />
            {errors.category?.message && (
              <FormMessage message={errors.category.message} />
            )}

            {/* Task title input field */}
            <p className={'pt-4 font-medium'}>Task title</p>
            <Input
              {...register('title')}
              variant={errors.category ? 'destructive' : 'default'}
              type="text"
              defaultValue={title}
              placeholder="Task name"
              className={'mt-1.5'}
            />
            {errors.title?.message && (
              <FormMessage message={errors.title.message} />
            )}

            {/* Task description input field */}
            <p className={'pt-4 font-medium'}>Task description</p>
            <div
              className={cn(
                'flex-1 w-full flex flex-col mt-1.5 rounded-xl border border-slate-400 bg-background ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
                errors.description
                  ? 'border-destructive focus-within:ring-destructive'
                  : 'border-input focus-within:ring-ring',
              )}
            >
              <div className="flex justify-between items-center px-6 bg-slate-100 rounded-t-xl">
                {toolbarIcons.map(({ name, icon }) => (
                  <button
                    type={'button'}
                    key={`${taskId}-${name}`}
                    className="size-12 flex justify-center items-center focus:outline-none"
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <textarea
                {...register('description')}
                placeholder="Task description"
                defaultValue={description}
                className={
                  'flex-1 mt-1.5 mb-4 mx-3 text-lg rounded-b-xl resize-none focus:outline-none focus:ring-transparent'
                }
              />
            </div>
            {errors.description?.message && (
              <FormMessage message={errors.description.message} />
            )}
          </DrawerDescription>
          <DrawerFooter>
            <DrawerClose>
              <Button type={'button'} variant={'secondary'}>
                Cancel
              </Button>
            </DrawerClose>
            <Button type={'submit'}>Save</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
