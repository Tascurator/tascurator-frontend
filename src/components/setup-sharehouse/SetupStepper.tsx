'use client';
import { Stepper } from '@/components/ui/stepper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ICategory } from '@/types/commons';
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

interface ISetupStepperProps {
  initialStep: number;
  maxSteps: number;
}

const SetupStepper = ({ initialStep, maxSteps }: ISetupStepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const categories: ICategory[] = [
    {
      id: '1',
      name: 'Kitchen',
      tasks: [
        {
          id: '1',
          title: 'Mop the floor',
          description:
            'Your task is to mop the floor. You can use the mop in the storage room.',
        },
        {
          id: '2',
          title: 'Wipe the mirror',
          description:
            "Your task is to wipe the mirror. It's very important to keep the mirror clean.",
        },
      ],
    },
    {
      id: '2',
      name: 'Bathroom',
      tasks: [
        {
          id: '3',
          title: 'Clean the toilet',
          description:
            'Your task is to clean the toilet. Make sure to use the toilet brush and disinfectant.',
        },
        {
          id: '4',
          title: 'Scrub the shower tiles',
          description:
            'Your task is to scrub the shower tiles. Use the tile cleaner and a brush to remove any soap scum and mildew.',
        },
      ],
    },
  ];
  const tenants: {
    id: string;
    name?: string;
    email?: string;
  }[] = [];

  switch (currentStep) {
    case 1:
      return (
        <div className="flex flex-col min-h-screen mt-4">
          <h1 className="mb-4">Create share house name</h1>
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />

          <Input placeholder="Sample share house" />

          <div className="flex justify-center pt-24">
            <Button
              type={'button'}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col min-h-screen">
          <h1 className="mb-4">Create new category and task</h1>
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <ShareHouseManagementHead title={'Categories'} type={'categories'} />

          {categories.map((category) => (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              key={category.id}
            >
              <AccordionItem value={`item-${category.id}`}>
                <AccordionCategoryItem category={category} />

                <AccordionContent
                  className={'space-y-4 bg-primary-lightest p-0'}
                >
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

          <div className="flex justify-center gap-4 pt-24">
            <Button
              variant={'tertiary'}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </Button>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="flex flex-col min-h-screen">
          <h1 className="mb-4">Invite tenants</h1>
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <ShareHouseManagementHead title={'Tenants'} type={'tenants'} />
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
          <div className="flex justify-center gap-4 pt-24">
            <Button
              variant={'tertiary'}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </Button>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="flex flex-col min-h-screen">
          <h1 className="mb-4">Setup rotation cycle</h1>
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <h1>Start date</h1>
          <DatePicker />
          <RotationCycle />
          <div className="flex justify-center gap-4 pt-24">
            <Button
              variant="tertiary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
            <Button onClick={() => setOpenDrawer(true)}>Next</Button>
          </div>
          <SetupConfirmationDrawer open={openDrawer} setOpen={setOpenDrawer} />
        </div>
      );
    default:
      return <div>Invalid step</div>;
  }
};

export default SetupStepper;
