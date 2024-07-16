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

interface ISetupStepperProps {
  initialStep: number;
  maxSteps: number;
  tenants: ITenant[];
  categories: ICategory[];
}

const SetupStepper = ({
  initialStep,
  maxSteps,
  tenants,
  categories,
}: ISetupStepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [shareHouseName, setShareHouseName] = useState<string>('');
  const handleNext = () => setCurrentStep(currentStep + 1);
  const handleBack = () => setCurrentStep(currentStep - 1);
  const handleOpen = () => setOpenDrawer(true);

  switch (currentStep) {
    case 1:
      return (
        <SetupContents
          title="Create share house name"
          currentStep={currentStep}
          maxSteps={maxSteps}
          onNext={handleNext}
          isNextDisabled={!shareHouseName}
        >
          <Input
            placeholder="Sample share house"
            value={shareHouseName}
            onChange={(e) => setShareHouseName(e.target.value)}
          />
        </SetupContents>
      );
    case 2:
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
                      category={category.name}
                      title={task.title}
                      description={task.description}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </SetupContents>
      );
    case 3:
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
        </SetupContents>
      );
    case 4:
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
            <DatePicker />
            <RotationCycle />
          </SetupContents>
          <SetupConfirmationDrawer open={openDrawer} setOpen={setOpenDrawer} />
        </>
      );
    default:
      return <div>Invalid step</div>;
  }
};

export default SetupStepper;
