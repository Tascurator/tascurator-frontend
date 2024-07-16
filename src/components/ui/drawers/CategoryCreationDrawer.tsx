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
import {
  categoryCreationSchema,
  TCategoryCreationSchema,
} from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskDescriptionEditor } from '@/components/ui/drawers/TaskDescriptionEditor';
import { TaskDescriptionRenderer } from '@/components/ui/drawers/TaskDescriptionRenderer';
import { toast } from '../use-toast';
import { LoadingSpinner } from '../loadingSpinner';

const { CATEGORY_NAME, TASK_TITLE, TASK_DESCRIPTION } = INPUT_TEXTS;

// Configure the Tiptap editor extensions
export const editorExtensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Underline,
  ListItem.configure({
    HTMLAttributes: {
      class: '[&>p]:inline',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc pl-6',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal pl-6',
    },
  }),
  Placeholder.configure({
    placeholder: TASK_DESCRIPTION.placeholder,
    emptyEditorClass:
      'first:before:content-[attr(data-placeholder)] first:before:text-slate-400 first:before:float-left first:before:h-0 first:before:left-0 first:before:pointer-events-none',
  }),
];

interface IEditTaskDrawer {
  formControls: UseFormReturn<TCategoryCreationSchema>;
  open: boolean;
  setOpen: (value: boolean) => void;
  openConfirmationDrawer: () => void;
}

/**
 * A drawer component to create or edit a task
 */
const EditTaskDrawer = ({
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
        <DrawerTitle>Create task</DrawerTitle>
        <DrawerDescription
          className={'flex-1 flex flex-col items-start'}
          asChild
        >
          <div className={'overflow-y-scroll pb-1'}>
            {/* Category input field */}
            <Input
              {...register('category')}
              variant={errors.category ? 'destructive' : 'default'}
              type="text"
              placeholder={CATEGORY_NAME.placeholder}
              label={CATEGORY_NAME.label}
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

interface ICategoryCreationConfirmationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
  formControls: UseFormReturn<TCategoryCreationSchema>;
  closeConfirmationDrawer: () => void;
}

/**
 * A confirmation drawer component to confirm the task creation or update
 */
const ConfirmTaskDrawer = ({
  open,
  setOpen,
  formControls,
  closeConfirmationDrawer,
}: ICategoryCreationConfirmationDrawer) => {
  const { handleSubmit, watch } = formControls;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TCategoryCreationSchema> = async (data) => {
    setIsLoading(true);
    setOpen(true);

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //TODO: create the category and task
    if (data) {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
      console.log('Updating the task:', data);
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
                  {watch('category')}
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
              <Button type={'submit'} className={'flex-1'}>
                Publish
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface ICategoryCreationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // To create a new category
 * <TaskCreationDrawer open={open} setOpen={setOpen} type={'categoryCreation'}/>
 *
 */
export const CategoryCreationDrawer = ({
  open,
  setOpen,
}: ICategoryCreationDrawer) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const formControls = useForm({
    resolver: zodResolver(categoryCreationSchema),
    mode: 'all', // Trigger validation on both blur and change events
    defaultValues: {
      category: '',
      title: '',
      description: '',
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
        formControls={formControls}
        open={open}
        setOpen={setOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmTaskDrawer
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        formControls={formControls}
        closeConfirmationDrawer={closeConfirmationDrawer}
      />
    </>
  );
};
