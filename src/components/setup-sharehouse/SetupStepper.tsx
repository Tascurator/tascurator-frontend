'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ICategory, ITask, ITenant } from '@/types/commons';
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

// comment out the following imports
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';
import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';

const { CATEGORY_MAX_AMOUNT, TENANT_MAX_AMOUNT } = CONSTRAINTS;

interface ISetupStepperProps {
  initialStep: number;
  maxSteps: number;
  tenants: ITenant[];
  categories: ICategory[];
}

export const SetupStepper = ({
  initialStep,
  maxSteps,
  tenants,
  categories,
}: ISetupStepperProps) => {
  const formControls = useForm<TShareHouseCreationSchema>({
    resolver: zodResolver(shareHouseCreationSchema),
    defaultValues: {
      name: '',
      categories,
      tenants,
      startDate: new Date().toISOString(),
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

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [open, setOpen] = useState(false);

  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['name']);
    } else if (currentStep === 2) {
      isValid = await trigger(['categories']);
    } else if (currentStep === 3) {
      isValid = await trigger(['tenants']);
    } else if (currentStep === 4) {
      isValid = await trigger(['startDate', 'rotationCycle']);
    }
    if (isValid && currentStep === maxSteps) {
      setOpen(true);
      // console.log('getValues()', getValues());
    }
    if (isValid && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // step1
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
    setValue('categories', newCategories, { shouldValidate: true });
    console.log('getValues().categories', newCategories);
  };

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

  const updateCategoryName = (categoryId: string, newName: string) => {
    const newCategories = getValues().categories.map((category) =>
      category.id === categoryId ? { ...category, name: newName } : category,
    );
    setValue('categories', newCategories, { shouldValidate: true });
  };

  const deleteCategory = (categoryId: string) => {
    if (getValues().categories.length <= CONSTRAINTS.CATEGORY_MIN_AMOUNT)
      return;

    const newCategories = getValues().categories.filter(
      (category) => category.id !== categoryId,
    );
    setValue('categories', newCategories, { shouldValidate: true });
  };

  const deleteTask = (taskId: string) => {
    const categories = getValues().categories;
    const category = categories.find(
      (c) => c.tasks.findIndex((t) => t.id === taskId) !== -1,
    );

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
    const updatedCategories = getValues().categories.map((category) => {
      return {
        ...category,
        tasks: category.tasks.filter((task) => task.id !== taskId),
      };
    });

    setValue('categories', updatedCategories, { shouldValidate: true });
  };

  // step2
  const categorySetting = () => {
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
        />
        <p className="flex justify-end">
          {getValues().categories.length}/{CATEGORY_MAX_AMOUNT}
        </p>
        {getValues().categories.map((category) => (
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
                onUpsertTask={upsertTask}
                onDelete={deleteCategory}
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
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        {errors.categories && (
          <p className="text-red-500 text-sm">{errors.categories.message}</p>
        )}
        {categories.length < 0 && (
          <p className="text-center">{categories.length}</p>
        )}
      </SetupContents>
    );
  };

  const addTenant = (tenant: ITenant) => {
    console.log('⭐️tenant', tenant);
    setValue('tenants', [...getValues().tenants, tenant], {
      shouldValidate: true,
    });
    console.log('getValues().tenants', getValues().tenants);
  };

  const updateTenantInfo = (tenantId: string, newTenant: ITenant) => {
    const newTenants = getValues().tenants.map((tenant) =>
      tenant.id === tenantId ? newTenant : tenant,
    );
    setValue('tenants', newTenants, { shouldValidate: true });
  };

  const deleteTenant = (tenantId: string) => {
    const newTenants = getValues().tenants.filter(
      (tenant) => tenant.id !== tenantId,
    );
    setValue('tenants', newTenants, { shouldValidate: true });
  };

  // step3
  const tenantSetting = () => {
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
            <DatePicker
              onChange={(date) => setValue('startDate', date.toISOString())}
            />
          </div>
          <ScheduleSetting
            onChange={(data) => setValue('rotationCycle', data)}
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
