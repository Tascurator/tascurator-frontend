import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessage } from '@/components/ui/formMessage';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  taskCreationSchema,
  taskUpdateSchema,
  TTaskCreationSchema,
  TTaskUpdateSchema,
} from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';
import { TaskDescriptionEditor } from '@/components/ui/drawers/task-description/TaskDescriptionEditor';
import { TaskDescriptionRenderer } from '@/components/ui/drawers/task-description/TaskDescriptionRenderer';
import type { ITask, ICategoryWithoutTasks } from '@/types/commons';
import { toast } from '../use-toast';
import { LoadingSpinner } from '../loadingSpinner';

const { CATEGORY_NAME, TASK_TITLE, TASK_DESCRIPTION } = INPUT_TEXTS;

interface IEditTaskDrawer {
  category: ICategoryWithoutTasks;
  task?: ITask;
  formControls: UseFormReturn<TTaskCreationSchema | TTaskUpdateSchema>;
  open: boolean;
  setOpen: (value: boolean) => void;
  openConfirmationDrawer: () => void;
}

/**
 * A drawer component to create or edit a task
 */
const EditTaskDrawer = ({
  category,
  task,
  formControls,
  open,
  setOpen,
  openConfirmationDrawer,
}: IEditTaskDrawer) => {
  const {
    register,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = formControls;

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['categoryId', 'title', 'description']);

    // Open the confirmation drawer if all the fields are valid
    if (isValid) {
      openConfirmationDrawer();
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent className={'h-[90%]'}>
        <DrawerTitle>{task?.id ? 'Edit task' : 'Create task'}</DrawerTitle>
        <DrawerDescription
          className={'flex-1 flex flex-col items-start'}
          asChild
        >
          <div className={'overflow-y-scroll pb-1'}>
            {/* Category input field */}
            <Input
              value={category.name}
              type="text"
              label={CATEGORY_NAME.label}
              disabled
            />

            {/* Task title input field */}
            <Input
              {...register('title')}
              variant={errors.title ? 'destructive' : 'default'}
              type="text"
              placeholder={TASK_TITLE.placeholder}
              label={TASK_TITLE.label}
              classNames={{
                label: 'mt-4',
              }}
            />
            {errors.title?.message && (
              <FormMessage message={errors.title.message} />
            )}

            {/* Task description input field */}
            <div className={'pt-4 text-base'}>{TASK_DESCRIPTION.label}</div>
            <div
              className={cn(
                'group w-full flex flex-col mt-1.5 rounded-xl border border-slate-400 bg-background ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
                errors.description
                  ? 'border-destructive focus-within:ring-destructive'
                  : 'border-input focus-within:ring-ring',
              )}
            >
              <TaskDescriptionEditor
                taskDescription={getValues('description') || ''}
                formControls={formControls}
              />
            </div>
            {errors.description?.message && (
              <FormMessage message={errors.description.message} />
            )}
          </div>
        </DrawerDescription>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type={'button'} variant={'outline'} className={'flex-1'}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type={'button'}
            className={'flex-1'}
            disabled={!isValid}
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface ITasksCreationConfirmationDrawer {
  task: ITask | undefined;
  category: ICategoryWithoutTasks;
  type: 'creation' | 'edit';
  open: boolean;
  setOpen: (value: boolean) => void;
  formControls: UseFormReturn<TTaskCreationSchema | TTaskUpdateSchema>;
  closeConfirmationDrawer: () => void;
}

/**
 * A confirmation drawer component to confirm the task creation or update
 */
const ConfirmTaskDrawer = ({
  task,
  category,
  type,
  open,
  setOpen,
  formControls,
  closeConfirmationDrawer,
}: ITasksCreationConfirmationDrawer) => {
  const {
    handleSubmit,
    watch,
    formState: { isValid },
  } = formControls;
  const [isLoading, setIsLoading] = useState(false);

  // for determining if the form data has been changed
  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
  };

  const [isTitleChanged, setIsTitleChanged] = useState(false);
  const [isDescriptionChanged, setIsDescriptionChanged] = useState(false);

  const watchedTitle = watch('title');
  const watchedDescription = watch('description');

  useEffect(() => {
    setIsTitleChanged(initialValues.title !== watchedTitle);
  }, [watchedTitle, initialValues.title]);

  useEffect(() => {
    setIsDescriptionChanged(initialValues.description !== watchedDescription);
  }, [watchedDescription, initialValues.description]);

  const onSubmit: SubmitHandler<
    TTaskCreationSchema | TTaskUpdateSchema
  > = async (data) => {
    setIsLoading(true);
    setOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update or create the task based on the taskId
    if (isValid) {
      // if no change, delete the title from the data object
      if (type === 'edit' && !isTitleChanged) {
        delete data.title;
      }
      // if no change, delete the description from the data object
      if (type === 'edit' && !isDescriptionChanged) {
        delete data.description;
      }

      // if no change for both title and description, return without doing anything
      if (type === 'edit' && !isTitleChanged && !isDescriptionChanged) {
        setIsLoading(false);
        setOpen(false);
        return;
      }

      console.log('Updating the task:', data);

      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
      setOpen(false);
    } else {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        description: 'error!',
      });
      console.log('Creating a new task:', data);
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer
        modal={!isLoading}
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
        <DrawerContent className={'h-[90%]'} asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerTitle>{watch('title')}</DrawerTitle>
            <DrawerDescription className={'flex-1'} asChild>
              <div>
                <div
                  className={
                    'w-fit text-base px-2 py-1 mb-2 rounded-full text-gray-500 bg-slate-100'
                  }
                >
                  {category.name}
                </div>
                <TaskDescriptionRenderer formControls={formControls} />
              </div>
            </DrawerDescription>
            <DrawerFooter>
              <Button
                type={'button'}
                variant={'outline'}
                onClick={closeConfirmationDrawer}
                className={'flex-1'}
              >
                Cancel
              </Button>
              <Button
                type={'submit'}
                className={'flex-1'}
                disabled={!isTitleChanged && !isDescriptionChanged}
              >
                Publish
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

type drawerType = 'creation' | 'edit';

interface ITaskCreationDrawer {
  task?: ITask;
  category: ICategoryWithoutTasks;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: drawerType;
}

const getSchema = (type: drawerType) => {
  return type === 'creation' ? taskCreationSchema : taskUpdateSchema;
};

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param task - The task object to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 * @param type - The type to determine if creating a 'task' or editing a 'task'
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // To create a new task
 * const category = {
 * id: '1'
 * title: 'Kitchen',
 * };
 * <TaskCreationDrawer open={open} setOpen={setOpen} type={'creation'} category={category}/>
 *
 * // To edit an existing task
 * const category = {
 * id: '1'
 * title: 'Kitchen',
 * };
 *
 * const task = {
 *  id: '1',
 *  title: 'Clean the kitchen',
 *  description: 'Clean the kitchen and make it shine.',
 * };
 * <TaskCreationDrawer open={open} setOpen={setOpen} task={task} category={category} type={'edit'}/>
 */
export const TaskCreationDrawer = ({
  category,
  task,
  open,
  setOpen,
  type,
}: ITaskCreationDrawer) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const schema = getSchema(type);

  const formControls = useForm<TTaskCreationSchema | TTaskUpdateSchema>({
    resolver: zodResolver(schema),
    mode: 'all', // Trigger validation on both blur and change events
    defaultValues: {
      categoryId: category?.id,
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
        category={category}
        task={task}
        formControls={formControls}
        open={open}
        setOpen={setOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmTaskDrawer
        task={task}
        category={category}
        type={type}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        formControls={formControls}
        closeConfirmationDrawer={closeConfirmationDrawer}
      />
    </>
  );
};
