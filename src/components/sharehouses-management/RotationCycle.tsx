'use client';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IRotationCycleProps {
  rotationCycle: number;
}

export const RotationCycle = ({ rotationCycle }: IRotationCycleProps) => {
  const [isLoading, setIsLoading] = useState(false);

  interface FormValues {
    repeat: 'Weekly' | 'Fortnightly';
  }

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      repeat: rotationCycle === 7 ? 'Weekly' : 'Fortnightly',
    },
  });

  const selectedOption = watch('repeat');

  const getButtonVariant = (option: FormValues['repeat']) => {
    return selectedOption === option ? 'default' : 'secondary';
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the name based on the id
    if (data) {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
    } else {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        description: 'error!',
      });
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      {/* Schedule */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>Repeat</p>
        <div className="flex flex-col items-center justify-between mt-6">
          <div className="flex justify-between gap-4 w-full">
            <Button
              className="rounded-full w-full"
              onClick={() => setValue('repeat', 'Weekly')}
              variant={getButtonVariant('Weekly')}
            >
              Weekly
            </Button>
            <Button
              className="rounded-full w-full"
              onClick={() => setValue('repeat', 'Fortnightly')}
              variant={getButtonVariant('Fortnightly')}
            >
              Fortnightly
            </Button>
          </div>
          <input type="hidden" value={selectedOption} {...register('repeat')} />
        </div>
      </form>
    </>
  );
};
