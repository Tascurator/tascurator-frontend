'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ICategory, ITenant } from '@/types/commons';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';
import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';
import { ShareHouseManagementHead } from '@/components/ui/ShareHouseManagementHead';
import { RotationCycle } from '@/components/sharehouses-management/RotationCycle';
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
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  // const [shareHouseName, setShareHouseName] = useState<string>('');

  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleOpen = () => setOpenDrawer(true);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TShareHouseCreationSchema>({
    resolver: zodResolver(shareHouseCreationSchema),
    defaultValues: {
      categories,
      tenants,
    },
  });

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['name']);
    } else if (currentStep === 2) {
      const values = getValues();
      if (values.categories.length < 1 || values.categories.length > 15) {
        return;
      } else {
        isValid = true;
      }
    } else if (currentStep === 3) {
      // console.log('trigger tenants');
      isValid = await trigger(['tenants']);
    } else if (currentStep === 4) {
      isValid = await trigger(['startDate', 'rotationCycle']);
    }
    if (isValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const onSubmit = (data: TShareHouseCreationSchema) => {
    console.log(data);
  };

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

  const categorySetting = () => {
    return (
      <SetupContents
        title="Create new category and task"
        currentStep={currentStep}
        maxSteps={maxSteps}
        onNext={handleNext}
        onBack={handleBack}
      >
        <ShareHouseManagementHead title="Categories" type="categories" />
        {categories.map((category) => (
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

  const tenantSetting = () => {
    return (
      <SetupContents
        title="Invite tenants"
        currentStep={currentStep}
        maxSteps={maxSteps}
        onNext={handleNext}
        onBack={handleBack}
      >
        <ShareHouseManagementHead title="Tenants" type="tenants" />
        {tenants.length > 0 ? (
          <ul className="mt-6">
            {tenants.map((tenant) => (
              <li className="mb-4" key={tenant.id}>
                <TenantListItem tenant={tenant} />
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

  const scheduleSetting = () => {
    return (
      <>
        <SetupContents
          title="Setup rotation cycle"
          currentStep={currentStep}
          maxSteps={maxSteps}
          onNext={handleNext}
          onBack={handleBack}
          onOpen={handleOpen}
        >
          <div className="mb-6">
            <p className="mb-6">Start date</p>
            <DatePicker />
          </div>
          <RotationCycle />
        </SetupContents>
        <SetupConfirmationDrawer open={openDrawer} setOpen={setOpenDrawer} />
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
      <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>
    </div>
  );
};
