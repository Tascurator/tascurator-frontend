import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface SetupContentsProps {
  title: string;
  currentStep: number;
  maxSteps: number;
  onNext: () => void;
  onBack?: () => void;
  children?: ReactNode;
  isNextDisabled?: boolean;
  onOpen?: () => void;
}

const SetupContents = ({
  title,
  currentStep,
  maxSteps,
  onNext,
  onBack,
  children,
  isNextDisabled,
  onOpen,
}: SetupContentsProps) => {
  return (
    <div className="flex-1 flex flex-col justify-between h-full">
      <div>
        <h1 className="my-4">{title}</h1>
        <Stepper currentStep={currentStep} maxSteps={maxSteps} />

        {/* <div className="h-[1000px]">aaaaaaaaaaaaaaaa</div> */}
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

export { SetupContents };
