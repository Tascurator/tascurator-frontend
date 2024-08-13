'use client';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { api } from '@/lib/hono';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { RotationCycle } from '@/types/commons';

interface IRotationCyclesProps {
  shareHouseId: string;
  rotationCycle: RotationCycle;
}

interface IFormValues {
  repeat: RotationCycle;
}

export const RotationCycles = ({
  shareHouseId,
  rotationCycle,
}: IRotationCyclesProps) => {
  const path = usePathname();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<IFormValues>({
    defaultValues: {
      repeat:
        rotationCycle === RotationCycle.Weekly
          ? RotationCycle.Weekly
          : RotationCycle.Fortnightly,
    },
  });

  const selectedOption = watch('repeat');

  const getButtonVariant = (option: IFormValues['repeat']) => {
    return selectedOption === option ? 'default' : 'secondary';
  };

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Post the form data
    try {
      const res = await api.rotation[':shareHouseId'].$patch({
        param: {
          shareHouseId: shareHouseId,
        },
        json: {
          rotationCycle: data.repeat,
        },
      });
      const rotationCycleData = await res.json();

      if ('error' in rotationCycleData) {
        throw new Error(rotationCycleData.error);
      }
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: error.message,
        });
      }
    }
  };

  return (
    <>
      {<LoadingSpinner isLoading={isSubmitting} />}
      {/* Schedule */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>Repeat</p>
        <div className="flex flex-col items-center justify-between mt-6">
          <div className="flex justify-between gap-4 w-full">
            <Button
              className="rounded-full w-full"
              onClick={() => setValue('repeat', RotationCycle.Weekly)}
              variant={getButtonVariant(RotationCycle.Weekly)}
            >
              Weekly
            </Button>
            <Button
              className="rounded-full w-full"
              onClick={() => setValue('repeat', RotationCycle.Fortnightly)}
              variant={getButtonVariant(RotationCycle.Fortnightly)}
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
