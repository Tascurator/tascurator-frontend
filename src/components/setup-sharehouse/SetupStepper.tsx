'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ICategory, ITenant } from '@/types/commons';
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
// import {
//   Accordion,
//   AccordionItem,
//   AccordionContent,
// } from '@/components/ui/accordion';
// import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
// import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';

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
    // console.log('addCategory', category);
    const newCategories = [...getValues().categories, category];
    setValue('categories', newCategories, { shouldValidate: true });
    console.log('getValues().categories', getValues().categories);
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
          onsubmitData={addCategory}
        />
        <p className="flex justify-end">
          {getValues().categories.length}/{CATEGORY_MAX_AMOUNT}
        </p>
        {/* {getValues().categories.map((category) => (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            key={category.id}
          >
            <AccordionItem value={`item-${category.id}`}>
              <AccordionCategoryItem category={category} />
              <AccordionContent className="space-y-4 bg-primary-lightest p-0">
                {category.tasks.map((task) => (
                  <AccordionTaskItem
                    key={task.id}
                    id={task.id}
                    category={category}
                    title={task.title}
                    description={task.description}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))} */}
        {errors.categories && (
          <p className="text-red-500 text-sm">{errors.categories.message}</p>
        )}
        {categories.length < 0 && (
          <p className="text-center">{categories.length}</p>
        )}
      </SetupContents>
    );
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
          type="tenants"
          shareHouseId=""
        />
        <p className="flex justify-end">
          {tenants.length}/{TENANT_MAX_AMOUNT}
        </p>
        {tenants.length > 0 ? (
          <ul className="mt-6">
            {tenants.map((tenant) => (
              <li className="mb-4" key={tenant.id}>
                <TenantListItem tenant={tenant} shareHouseId="" />
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
