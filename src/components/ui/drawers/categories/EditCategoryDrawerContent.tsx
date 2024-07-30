import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { cn } from '@/lib/utils';
import { TaskDescriptionEditorForCategory } from '@/components/ui/drawers/tasks/task-description/TaskDescriptionEditorForCategory';
import { Button } from '@/components/ui/button';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import { useFormContext } from 'react-hook-form';
import { INPUT_TEXTS } from '@/constants/input-texts';
import { TCategoryCreationSchema } from '@/constants/schema';

const { CATEGORY_NAME, TASK_TITLE, TASK_DESCRIPTION } = INPUT_TEXTS;

interface IEditCategoryDrawerContent {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  openConfirmationDrawer: () => void;
}

export const EditCategoryDrawerContent = ({
  editOpen,
  setEditOpen,
  openConfirmationDrawer,
}: IEditCategoryDrawerContent) => {
  const {
    register,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useFormContext<TCategoryCreationSchema>();

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['name', 'task.title', 'task.description']);

    // Open the confirmation drawer if all the fields are valid
    if (isValid) {
      openConfirmationDrawer();
    }
  };

  return (
    <CommonDrawer
      title={'Create task'}
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
          {...register('name')}
          variant={errors.name ? 'destructive' : 'default'}
          type="text"
          placeholder={CATEGORY_NAME.placeholder}
          label={CATEGORY_NAME.label}
        />
        {errors.name?.message && <FormMessage message={errors.name.message} />}

        {/* Task title input field */}
        <Input
          {...register('task.title')}
          variant={errors.task?.title ? 'destructive' : 'default'}
          type="text"
          placeholder={TASK_TITLE.placeholder}
          label={TASK_TITLE.label}
          classNames={{
            label: 'mt-4',
          }}
        />
        {errors.task?.title?.message && (
          <FormMessage message={errors.task.title.message} />
        )}

        {/* Task description input field */}
        <div className={'pt-4 text-base'}>{TASK_DESCRIPTION.label}</div>
        <div
          className={cn(
            'group w-full flex flex-col mt-1.5 rounded-xl border border-slate-400 bg-background ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
            errors.task?.description
              ? 'border-destructive focus-within:ring-destructive'
              : 'border-input focus-within:ring-ring',
          )}
        >
          <TaskDescriptionEditorForCategory
            taskDescription={getValues('task.description') ?? ''}
          />
        </div>
        {errors.task?.description?.message && (
          <FormMessage message={errors.task.description.message} />
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
