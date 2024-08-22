import { cn } from '@/lib/utils';
import { FC } from 'react';

interface IStep {
  currentStep: number;
  maxSteps: number;
}

/**
 * @example
 * ```ts
 *  const INITIAL_STEP = 1;
 *  const MAX_STEPS = 4;
 *  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
 *
 *  return (
 *    <Stepper currentStep={currentStep} maxSteps={MAX_STEPS} />
 *      <div className="flex mt-10 gap-4">
 *        <Button
 *          size="sm"
 *          onClick={() => setCurrentStep((prev) => prev - 1)}
 *          disabled={currentStep === INITIAL_STEP}
 *        >
 *          Previous
 *        </Button>
 *        <Button
 *          size="sm"
 *          onClick={() => setCurrentStep((prev) => prev + 1)}
 *          disabled={currentStep === MAX_STEPS}
 *        >
 *          Next
 *        </Button>
 *     </div>
 * )
 * ```
 */

const Stepper: FC<IStep> = ({ currentStep, maxSteps }: IStep) => {
  const steps: number[] = Array.from(
    { length: maxSteps },
    (_, index) => index + 1,
  );

  const width = `${(100 / (maxSteps - 1)) * (currentStep - 1)}%`;

  return (
    <div className="w-full max-w-2xl mx-auto px-1 pb-5">
      <div className="flex justify-between relative before:bg-slate-300 before:absolute before:h-[0.125rem] before:top-1/2 before:transform-y-1/2 before:w-full before:left-0">
        {steps.map((step: number) => (
          <div className="relative z-10" key={step}>
            <div
              className={cn(
                'size-5 rounded-full border-2 flex justify-center items-center',
                {
                  'bg-primary border-primary': currentStep >= step,
                  'bg-white border-slate-300': currentStep < step,
                },
              )}
            >
              <span
                className={cn('font-medium', {
                  'text-white text-xs': currentStep >= step,
                  'text-slate-300 text-xs': currentStep < step,
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
    </div>
  );
};

export { Stepper };
