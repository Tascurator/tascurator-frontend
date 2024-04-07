'use client';
import React from 'react';

import { cn } from '@/lib/utils';

// ↓ Delete this import
import { Button } from '@/components/ui/button';
// ↑ Delete this import

interface Step {
  step: number;
}

interface StepperProps {
  steps: Step[];
}

const steps = [
  {
    step: 1,
  },
  {
    step: 2,
  },
  {
    step: 3,
  },
  {
    step: 4,
  },
];

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [activeStep, setActiveStep] = React.useState(1);

  const nextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const totalSteps = steps.length;

  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  return (
    <div className="w-full max-w-2xl mx-auto px-1 pb-10">
      <div className="flex justify-between relative before:bg-slate-300 before:absolute before:h-[0.125rem] before:top-1/2 before:transform-y-1/2 before:w-full before:left-0">
        {steps.map(({ step }) => (
          <div className="relative z-10" key={step}>
            <div
              className={cn(
                'size-5 rounded-full border-2 flex justify-center items-center',
                {
                  'bg-primary border-primary': activeStep >= step,
                  'bg-white border-slate-300': activeStep < step,
                },
              )}
            >
              <span
                className={cn({
                  'text-white text-xs': activeStep >= step,
                  'text-slate-300 text-xs': activeStep < step,
                })}
              >
                {step}
              </span>
            </div>
          </div>
        ))}
        <div
          className="absolute h-[0.125rem] bg-primary w-full top-1/2 transform-y-1/2 transition-all duration-200 ease-in delay-200 left-0"
          style={{ width: width }}
        ></div>
      </div>
      {/* Button components */}
      <div className="flex justify-between mt-28">
        <Button
          onClick={prevStep}
          variant={`${activeStep === 1 ? 'disable' : 'default'}`}
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          variant={`${activeStep === totalSteps ? 'disable' : 'default'}`}
        >
          Next
        </Button>
      </div>
      {/* End of Button components */}
    </div>
  );
};

export { Stepper, steps };
