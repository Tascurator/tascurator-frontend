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
import { useState } from 'react';
import { taskCreationSchema, TTaskCreationSchema } from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';

import { useEditor, Editor } from '@tiptap/react';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

import { TaskDescriptionEditor } from '@/components/ui/TaskDescriptionEditor';
import { TaskDescription } from '@/components/ui/taskDescription';

const { CATEGORY_NAME, TASK_TITLE, TASK_DESCRIPTION } = INPUT_TEXTS;

interface ITask {
  id: string;
  category: string;
  title: string;
  description: string;
}

interface IEditTaskDrawer {
  task?: ITask;
  formControls: UseFormReturn<TTaskCreationSchema>;
  open: boolean;
  setOpen: (value: boolean) => void;
  openConfirmationDrawer: () => void;
  editor: Editor;
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
  editor,
}: IEditTaskDrawer) => {
  const {
    register,
    formState: { errors, isValid },
    trigger,
  } = formControls;

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['category', 'title', 'description']);

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
          className={
            'flex-1 flex flex-col justify-center items-start overflow-visible'
          }
        >
          {/* Category input field */}
          <Input
            {...register('category')}
            variant={errors.category ? 'destructive' : 'default'}
            type="text"
            placeholder={CATEGORY_NAME.placeholder}
            label={CATEGORY_NAME.label}
            // Disable the input field if category is present
            disabled={!!task?.category}
          />
          {errors.category?.message && (
            <FormMessage message={errors.category.message} />
          )}

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
          <p className={'pt-4 text-base'}>{TASK_DESCRIPTION.label}</p>
          <div
            className={cn(
              'flex-1 w-full flex flex-col mt-1.5 rounded-xl border border-slate-400 bg-background ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
              errors.description
                ? 'border-destructive focus-within:ring-destructive'
                : 'border-input focus-within:ring-ring',
            )}
          >
            <TaskDescriptionEditor editor={editor} />
          </div>
          {errors.description?.message && (
            <FormMessage message={errors.description.message} />
          )}
        </DrawerDescription>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type={'button'} variant={'secondary'} className={'flex-1'}>
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
  taskId?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  formControls: UseFormReturn<TTaskCreationSchema>;
  closeConfirmationDrawer: () => void;
  editor: Editor;
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
  editor,
}: ITasksCreationConfirmationDrawer) => {
  const { handleSubmit, watch, reset } = formControls;

  const onSubmit: SubmitHandler<TTaskCreationSchema> = async (data) => {
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
      <DrawerContent className={'h-[90%]'} asChild>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerTitle>{watch('title')}</DrawerTitle>
          <DrawerDescription className={'flex-1'}>
            <div
              className={
                'w-fit text-base px-2 py-1 rounded-full text-gray-500 bg-slate-100'
              }
            >
              {watch('category')}
            </div>
            <TaskDescription editor={editor} />
            {/* <p className={'mt-2.5'}>{watch('description')}</p> */}
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
            <Button type={'submit'} className={'flex-1'}>
              Publish
            </Button>
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
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // To create a new task
 * <TaskCreationDrawer open={open} setOpen={setOpen} />
 *
 * // To edit an existing task
 * const task = {
 *  id: '1',
 *  category: 'Kitchen',
 *  title: 'Clean the kitchen',
 *  description: 'Clean the kitchen and make it shine.',
 * };
 * <TaskCreationDrawer task={task} open={open} setOpen={setOpen} />
 */
export const TaskCreationDrawer = ({
  task,
  open,
  setOpen,
}: ITaskCreationDrawer) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const formControls = useForm<TTaskCreationSchema>({
    resolver: zodResolver(taskCreationSchema),
    mode: 'all', // Trigger validation on both blur and change events
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

  const { setValue } = formControls;

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Underline,
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: task?.description || '<p>test</p>',
    onUpdate: ({ editor }) => {
      const descriptionData = editor.getHTML();
      setValue('description', descriptionData);
    },
    editable: !confirmationOpen,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <EditTaskDrawer
        task={task}
        formControls={formControls}
        open={open}
        setOpen={setOpen}
        openConfirmationDrawer={openConfirmationDrawer}
        editor={editor}
      />

      <ConfirmTaskDrawer
        taskId={task?.id}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        formControls={formControls}
        closeConfirmationDrawer={closeConfirmationDrawer}
        editor={editor}
      />
    </>
  );
};
