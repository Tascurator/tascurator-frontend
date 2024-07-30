import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { cn } from '@/lib/utils';
import { TaskDescriptionEditor } from '@/components/ui/drawers/task-description/TaskDescriptionEditor';
import { Button } from '@/components/ui/button';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import { useFormContext } from 'react-hook-form';
import { type ICategoryWithoutTasks, ITask } from '@/types/commons';
import { INPUT_TEXTS } from '@/constants/input-texts';
import { TTaskSchema } from '@/components/ui/drawers/tasks/TaskDrawerContent';

const { CATEGORY_NAME, TASK_TITLE, TASK_DESCRIPTION } = INPUT_TEXTS;

interface ITaskDrawerContent {
  category: ICategoryWithoutTasks;
  task?: ITask;
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  openConfirmationDrawer: () => void;
}

export const EditTaskDrawerContent = ({
  category,
  task,
  editOpen,
  setEditOpen,
  openConfirmationDrawer,
}: ITaskDrawerContent) => {
  const {
    register,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useFormContext<TTaskSchema>();

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['categoryId', 'title', 'description']);

    // Open the confirmation drawer if all the fields are valid
    if (isValid) {
      openConfirmationDrawer();
    }
  };

  return (
    <CommonDrawer
      title={task?.id ? 'Edit task' : 'Create task'}
      open={editOpen}
      setOpen={setEditOpen}
      className={'h-[90%]'}
      onSubmit={null}
    >
      <DrawerDescription
        className={'flex-1 flex flex-col items-start overflow-y-auto pb-1'}
      >
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
          />
        </div>
        {errors.description?.message && (
          <FormMessage message={errors.description.message} />
        )}
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
    </CommonDrawer>
  );
};
