'use client';
import { Stepper } from '@/components/ui/stepper';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ISetupStepperProps {
  initialStep: number;
  maxSteps: number;
}

const SetupStepper = ({ initialStep, maxSteps }: ISetupStepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  switch (currentStep) {
    case 1:
      return (
        <div className="flex flex-col min-h-screen">
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <Button onClick={() => setCurrentStep(2)}>Next</Button>
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col min-h-screen">
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <div className="flex justify-center gap-4">
            <Button onClick={() => setCurrentStep(1)}>Back</Button>
            <Button onClick={() => setCurrentStep(3)}>Next</Button>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="flex flex-col min-h-screen">
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <Button onClick={() => setCurrentStep(2)}>Back</Button>
          <Button onClick={() => setCurrentStep(4)}>Next</Button>
        </div>
      );
    case 4:
      return (
        <div className="flex flex-col min-h-screen">
          <Stepper currentStep={currentStep} maxSteps={maxSteps} />
          <Button onClick={() => setCurrentStep(3)}>Back</Button>
          <Button onClick={() => setCurrentStep(1)}>Finish</Button>
        </div>
      );
    default:
      return <div>Invalid step</div>;
  }
};

export default SetupStepper;
