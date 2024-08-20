'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ICategory, IShareHouse, ITask, ITenant } from '@/types/commons';
import { ShareHouseManagementHead } from '@/components/ui/ShareHouseManagementHead';
import { ScheduleSetting } from './ScheduleSetting';
import { TenantListItem } from '../ui/tenantList';
import { DatePicker } from '@/components/ui/datePicker';
import { SetupConfirmationDrawer } from '@/components/ui/drawers/SetupConfirmationDrawer';
import { SetupContents } from '@/components/setup-sharehouse/SetupContents';
import {
  shareHouseCreationSchema,
  TShareHouseCreationSchema,
} from '@/constants/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CONSTRAINTS } from '@/constants/constraints';
import { useToast } from '@/components/ui/use-toast';

import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';
import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';
import { convertToUTC, getToday } from '@/utils/dates';

const {
  CATEGORY_MAX_AMOUNT,
  CATEGORY_MIN_AMOUNT,
  TENANT_MAX_AMOUNT,
  TASK_MAX_AMOUNT,
  TASK_MIN_AMOUNT,
} = CONSTRAINTS;

interface ISetupStepperProps {
  initialStep: number;
  maxSteps: number;
  tenants: ITenant[];
  categories: ICategory[];
  sharehouses: IShareHouse[];
}
export const SetupStepper = ({
  initialStep,
  maxSteps,
  tenants,
  categories,
  sharehouses,
}: ISetupStepperProps) => {
  const formControls = useForm<TShareHouseCreationSchema>({
    resolver: zodResolver(shareHouseCreationSchema),
    defaultValues: {
      name: '',
      categories,
      tenants,
      startDate: getToday().toISOString(),
      rotationCycle: 7,
    },
    mode: 'onBlur',
  });

  const {
    register,
    trigger,
    formState: { errors },
    setValue,
    getValues,
  } = formControls;
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [open, setOpen] = useState(false);

  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleNext = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await trigger(['name']);
        sharehouses.map((sharehouse) => {
          if (sharehouse.name === getValues().name) {
            isValid = false;
            toast({
              description: 'Share house name already exists',
              variant: 'destructive',
            });
          }
        });
        break;
      case 2:
        isValid = await trigger(['categories']);
        break;
      case 3:
        isValid = await trigger(['tenants']);
        break;
      case 4:
        isValid = await trigger(['startDate', 'rotationCycle']);
        break;
      default:
        break;
    }
    if (isValid && currentStep === maxSteps) {
      setOpen(true);
    }
    if (isValid && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // step1: share house name
  const shareHouseNameSetting = () => {
    return (
      <SetupContents
        title="Share house name"
        currentStep={currentStep}
        maxSteps={maxSteps}
        onNext={handleNext}
      >
        <div className="mb-6">
          <Input
            label="Share house name"
            placeholder="Enter share house name"
            onError={() => errors.name?.message}
            {...register('name')}
          />
        </div>
        {errors.name?.message && (
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        )}
      </SetupContents>
    );
  };

  // a function to add a new category
  const addCategory = (category: ICategory) => {
    const transformedCategory = {
      id: category.id,
      name: category.name,
      tasks: category.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
      })),
    };

    // Update the categories in the form state
    const newCategories = [...getValues().categories, transformedCategory];
    // Update the form state with the new categories
    setValue('categories', newCategories, { shouldValidate: true });
  };

  // a function to add a new task
  const upsertTask = (task: ITask) => {
    const upsertTasks = getValues().categories.map((category) => {
      if (category.id === task.categoryId) {
        const existingTaskIndex = category.tasks.findIndex(
          (taskItem) => taskItem.id === task.id,
        );

        if (existingTaskIndex > -1) {
          // Update the task
          const updateTasks = category.tasks.map((tasks) =>
            tasks.id === task.id ? { ...task } : tasks,
          );
          return { ...category, tasks: updateTasks };
        } else {
          // Add the task
          return {
            ...category,
            tasks: [...category.tasks, task],
          };
        }
      }
      return category;
    });

    setValue('categories', upsertTasks, { shouldValidate: true });
  };

  // a function to update the category name
  const updateCategoryName = (categoryId: string, newName: string) => {
    const newCategories = getValues().categories.map((category) =>
      category.id === categoryId ? { ...category, name: newName } : category,
    );
    setValue('categories', newCategories, { shouldValidate: true });
  };

  // a function to delete a category
  const deleteCategory = (categoryId: string) => {
    if (getValues().categories.length <= CONSTRAINTS.CATEGORY_MIN_AMOUNT)
      return;

    // Remove the category from the form state
    const newCategories = getValues().categories.filter(
      (category) => category.id !== categoryId,
    );
    setValue('categories', newCategories, { shouldValidate: true });
  };

  // a function to delete a task
  const deleteTask = (taskId: string) => {
    // Get the categories from the form state
    const categories = getValues().categories;
    // Find the category that contains the task
    const category = categories.find(
      // Check if the task exists in the category
      (c) => c.tasks.findIndex((t) => t.id === taskId) !== -1,
    );
    // Return if the category is not found
    if (!category) return;

    /**
     * Don't allow deleting the last category with last task
     */
    if (categories.length === 1 && category.tasks.length === 1) return;

    /**
     * Delete the category itself when the number of the tasks is 1, meaning the landlord is deleting the last task
     */
    if (category.tasks.length === 1) {
      setValue(
        'categories',
        categories.filter((c) => c.id !== category.id),
        { shouldValidate: true },
      );
      return;
    }

    /**
     * Delete the task from the associated category
     */
    const updatedCategories = categories.map((category) => {
      return {
        ...category,
        tasks: category.tasks.filter((task) => task.id !== taskId),
      };
    });

    setValue('categories', updatedCategories, { shouldValidate: true });
  };

  // step2: category and task
  const categorySetting = () => {
    // Custom type guard to check if the error object is an array of category errors
    interface ITaskError {
      message: string;
    }
    // Custom type guard to check if the error object is an array of category errors
    interface ICategoryError {
      tasks: ITaskError;
    }

    // Custom type guard to check if the error object is an array of category errors
    function isCategoryErrorArray(value: unknown): value is ICategoryError[] {
      return Array.isArray(value) && value.every((item) => 'tasks' in item);
    }

    // Determine if the number of categories has reached the maximum
    const isMaxAmountOfCategory =
      getValues().categories.length === CATEGORY_MAX_AMOUNT;

    // Determine if the number of categories has reached the minimum
    const isMinAmountOfCategory =
      getValues().categories.length === CATEGORY_MIN_AMOUNT;

    return (
      <SetupContents
        title="Create new category and task"
        currentStep={currentStep}
        maxSteps={maxSteps}
        onNext={handleNext}
        onBack={handleBack}
      >
        <ShareHouseManagementHead
          title="Categories"
          type="setupCategories"
          shareHouseId=""
          onsubmitCategoryData={addCategory}
          categoryData={getValues().categories}
          isMaxAmount={isMaxAmountOfCategory}
        />
        <p className="flex justify-end">
          {getValues().categories.length}/{CATEGORY_MAX_AMOUNT}
        </p>
        {getValues().categories.map((category) => {
          // Determine if the number of tasks has reached the maximum
          const isMaxAmountOfTask = category.tasks.length === TASK_MAX_AMOUNT;
          // Determine if the number of tasks has reached the minimum
          const isMinAmountOfTask = category.tasks.length === TASK_MIN_AMOUNT;

          return (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              key={category.id}
            >
              <AccordionItem value={`item-${category.id}`}>
                <AccordionCategoryItem
                  category={category}
                  type="setup"
                  onUpdateName={updateCategoryName}
                  categoryData={getValues().categories}
                  onUpsertTask={upsertTask}
                  onDelete={deleteCategory}
                  taskAmount={category.tasks.length}
                  isMinAmountOfCategory={isMinAmountOfCategory}
                  isMaxAmountOfTask={isMaxAmountOfTask}
                />
                <AccordionContent className="space-y-4 bg-primary-lightest p-0">
                  {category.tasks.map((task) => (
                    <AccordionTaskItem
                      type="setup"
                      key={task.id}
                      id={task.id}
                      category={category}
                      title={task.title}
                      description={task.description}
                      onUpsertTask={upsertTask}
                      onDelete={deleteTask}
                      isMinAmountOfTask={isMinAmountOfTask}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
        {errors.categories && (
          <p className="text-red-500 text-sm">{errors.categories.message}</p>
        )}
        {isCategoryErrorArray(errors.categories) &&
          errors.categories.map(
            (categoryError, index) =>
              categoryError?.tasks?.message && (
                <p key={index} className="text-red-500 text-sm">
                  {categoryError.tasks.message}
                </p>
              ),
          )}
      </SetupContents>
    );
  };

  // a function to add a new tenant
  const addTenant = (tenant: ITenant) => {
    setValue('tenants', [...getValues().tenants, tenant], {
      shouldValidate: true,
    });
  };

  // a function to update the tenant
  const updateTenantInfo = (tenantId: string, newTenant: ITenant) => {
    // Update the tenant in the form state
    // Find the tenant to update
    const newTenants = getValues().tenants.map((tenant) =>
      tenant.id === tenantId ? newTenant : tenant,
    );
    setValue('tenants', newTenants, { shouldValidate: true });
  };
  // a function to delete a tenant
  const deleteTenant = (tenantId: string) => {
    const newTenants = getValues().tenants.filter(
      (tenant) => tenant.id !== tenantId,
    );
    setValue('tenants', newTenants, { shouldValidate: true });
  };

  // step3
  const tenantSetting = () => {
    // Determine if the number of tenants has reached the maximum
    const isMaxAmount = getValues().tenants.length === TENANT_MAX_AMOUNT;

    return (
      <SetupContents
        title="Invite tenants"
        currentStep={currentStep}
        maxSteps={maxSteps}
        onNext={handleNext}
        onBack={handleBack}
      >
        <ShareHouseManagementHead
          title="Tenants"
          type="setupTenants"
          shareHouseId=""
          onsubmitTenantData={addTenant}
          tenantData={getValues().tenants}
          isMaxAmount={isMaxAmount}
        />
        <p className="flex justify-end">
          {getValues().tenants.length}/{TENANT_MAX_AMOUNT}
        </p>
        {getValues().tenants.length > 0 ? (
          <ul className="mt-6">
            {getValues().tenants.map((tenant) => (
              <li className="mb-4" key={tenant.id}>
                <TenantListItem
                  tenant={tenant}
                  shareHouseId=""
                  type="setup"
                  onDelete={deleteTenant}
                  onUpdate={updateTenantInfo}
                  tenantData={getValues().tenants}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No tenant</p>
        )}
        {errors.tenants && (
          <p className="text-red-500 text-sm">{errors.tenants.message}</p>
        )}
      </SetupContents>
    );
  };

  // step4
  const scheduleSetting = () => {
    const startDate = convertToUTC(new Date(getValues().startDate)).toDate();

    const setDatePicker = (date: Date) => {
      if (!date) return;
      setValue('startDate', date.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    };

    const setRotationCycle = (repeat: number) => {
      setValue('rotationCycle', repeat, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    };

    return (
      <>
        <SetupContents
          title="Setup rotation cycle"
          currentStep={currentStep}
          maxSteps={maxSteps}
          onNext={handleNext}
          onBack={handleBack}
        >
          <div className="mb-6">
            <p className="mb-6">Start date</p>
            <DatePicker onChange={setDatePicker} selectedDate={startDate} />
          </div>
          <ScheduleSetting
            onChange={setRotationCycle}
            selectedOption={getValues().rotationCycle as 7 | 14}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
          {errors.rotationCycle && (
            <p className="text-red-500 text-sm">
              {errors.rotationCycle.message}
            </p>
          )}
        </SetupContents>
      </>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return shareHouseNameSetting();
      case 2:
        return categorySetting();
      case 3:
        return tenantSetting();
      case 4:
        return scheduleSetting();
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="w-full">
      {renderStep()}
      <SetupConfirmationDrawer
        open={open}
        setOpen={setOpen}
        form={formControls}
      />
    </div>
  );
};
