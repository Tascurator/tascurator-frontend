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
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessage } from '@/components/ui/formMessage';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ITask {
  id: string;
  category: string;
  title: string;
  description: string;
}

enum Syntax {
  BOLD = 'bold',
  UNDERLINE = 'underline',
  LIST = 'list',
  LIST_ORDERED = 'listOrdered',
}

// The list of toolbar icons to be displayed in the task description input field
const toolbarIcons = [
  {
    name: Syntax.BOLD,
    icon: <BoldIcon className={'size-5'} />,
  },
  {
    name: Syntax.UNDERLINE,
    icon: <UnderlineIcon className={'size-5'} />,
  },
  {
    name: Syntax.LIST,
    icon: <ListIcon className={'size-5'} />,
  },
  {
    name: Syntax.LIST_ORDERED,
    icon: <ListOrderedIcon className={'size-5'} />,
  },
];

// Define the schema for the task creation form
const schema = z.object({
  category: z
    .string()
    .min(1, 'Category must be at least 1 character')
    .max(15, 'Category must be at most 15 characters'),
  title: z
    .string()
    .min(1, 'Title must be at least 1 character')
    .max(20, 'Title must be at most 20 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
});

// Infer the type from the schema
type TScheme = z.infer<typeof schema>;

interface IEditTaskDrawer {
  task?: ITask;
  formControls: UseFormReturn<TScheme>;
  open: boolean;
  setOpen: (value: boolean) => void;
  openConfirmationDrawer: () => void;
}

/**
 * A drawer component to create or edit a task
 */
const EditTaskDrawer = ({
  task,
  formControls,
  open,
  setOpen,
  openConfirmationDrawer,
}: IEditTaskDrawer) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formControls;

  const handleToolbarClick = (name: Syntax) => {
    // TODO: Implement the toolbar click functionality
    console.log('Toolbar icon clicked:', name);
  };

  const onSubmit: SubmitHandler<TScheme> = () => {
    // Open the confirmation drawer after passing the validation
    openConfirmationDrawer();
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent className={'h-[90%]'}>
        <DrawerHeader>
          <DrawerTitle>{task?.id ? 'Edit Task' : 'Create Task'}</DrawerTitle>
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
              placeholder="Category name"
              className={'mt-1.5'}
              // Disable the input field if category is present
              disabled={!!task?.category}
            />
            {errors.category?.message && (
              <FormMessage message={errors.category.message} />
            )}

            {/* Task title input field */}
            <p className={'pt-4 font-medium'}>Task title</p>
            <Input
              {...register('title')}
              variant={errors.title ? 'destructive' : 'default'}
              type="text"
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
                    key={`${task?.id}-${name}`}
                    onClick={() => handleToolbarClick(name)}
                    className="size-12 flex justify-center items-center focus:outline-none"
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <textarea
                {...register('description')}
                placeholder="Task description"
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

interface ITasksCreationConfirmationDrawer {
  taskId?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  formControls: UseFormReturn<TScheme>;
  closeConfirmationDrawer: () => void;
}

/**
 * A confirmation drawer component to confirm the task creation or update
 */
const ConfirmTaskDrawer = ({
  taskId,
  open,
  setOpen,
  formControls,
  closeConfirmationDrawer,
}: ITasksCreationConfirmationDrawer) => {
  const { handleSubmit, watch, reset } = formControls;

  const onSubmit: SubmitHandler<TScheme> = async (data) => {
    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update or create the task based on the taskId
    if (taskId) {
      console.log('Updating the task:', data);
    } else {
      console.log('Creating a new task:', data);
    }

    // Clear the form data
    reset();

    // Close the confirmation drawer
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(state) => {
        // Just close the confirmation drawer when the drawer is closed programmatically in onSubmit
        if (!open && !state) {
          setOpen(false);
          return;
        }

        // Call custom close function to open the edit drawer while closing the confirmation drawer
        if (!state) {
          closeConfirmationDrawer();
          return;
        }

        setOpen(true);
      }}
    >
      <DrawerTrigger />
      <DrawerContent className={'h-[90%]'}>
        <DrawerHeader>
          <DrawerTitle>{watch('title')}</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'flex flex-col h-full'}
        >
          <DrawerDescription
            className={'flex-1 overflow-hidden break-words text-wrap'}
          >
            {watch('description')}
          </DrawerDescription>
          <DrawerFooter className={'flex-none'}>
            <Button
              type={'button'}
              variant={'secondary'}
              onClick={closeConfirmationDrawer}
            >
              Cancel
            </Button>
            <Button type={'submit'}>Save</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

interface ITaskCreationDrawer {
  task?: ITask;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param task - The task object to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 */
export const TaskCreationDrawer = ({
  task,
  open,
  setOpen,
}: ITaskCreationDrawer) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const formControls = useForm<TScheme>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: task?.category || '',
      title: task?.title || '',
      description: task?.description || '',
    },
  });

  const openConfirmationDrawer = () => {
    setOpen(false);
    setConfirmationOpen(true);
  };

  const closeConfirmationDrawer = () => {
    setConfirmationOpen(false);
    setOpen(true);
  };

  return (
    <>
      <EditTaskDrawer
        task={task}
        formControls={formControls}
        open={open}
        setOpen={setOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmTaskDrawer
        taskId={task?.id}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        formControls={formControls}
        closeConfirmationDrawer={closeConfirmationDrawer}
      />
    </>
  );
};
