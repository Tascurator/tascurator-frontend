import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ISetupContentsProps {
  title: string;
  currentStep: number;
  maxSteps: number;
  onNext: () => void;
  onBack?: () => void;
  children?: ReactNode;
  isNextDisabled?: boolean;
  onOpen?: () => void;
}

export const SetupContents = ({
  title,
  currentStep,
  maxSteps,
  onNext,
  onBack,
  children,
  isNextDisabled,
  onOpen,
}: ISetupContentsProps) => {
  return (
    <div className="flex flex-col justify-between min-h-[calc(100dvh-56px)]">
      <div>
        <h1 className="my-4">{title}</h1>
        <Stepper currentStep={currentStep} maxSteps={maxSteps} />

        {children}
      </div>
      <div className="flex justify-center gap-4 py-4">
        {onBack && (
          <Button variant={'tertiary'} onClick={onBack}>
            Back
          </Button>
        )}
        {onOpen ? (
          <Button onClick={onOpen} disabled={isNextDisabled}>
            Next
          </Button>
        ) : (
          <Button onClick={onNext} disabled={isNextDisabled}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
