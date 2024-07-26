'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface IScheduleSettingProps {
  onChange: (repeat: number) => void;
}

export const ScheduleSetting = ({ onChange }: IScheduleSettingProps) => {
  interface FormValues {
    repeat: 7 | 14;
  }

  const { register, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      repeat: 7,
    },
  });

  const selectedOption = watch('repeat');

  const handleButtonClick = (option: FormValues['repeat']) => {
    setValue('repeat', option, { shouldValidate: true });
    onChange(option);
  };

  return (
    <>
      <p>Repeat</p>
      <div className="flex flex-col items-center justify-between mt-6">
        <div className="flex justify-between gap-4 w-full">
          <Button
            className="rounded-full w-full"
            onClick={() => handleButtonClick(7)}
            variant={selectedOption === 7 ? 'default' : 'secondary'}
            type="button"
          >
            Weekly
          </Button>
          <Button
            className="rounded-full w-full"
            onClick={() => handleButtonClick(14)}
            variant={selectedOption === 14 ? 'default' : 'secondary'}
            type="button"
          >
            Fortnightly
          </Button>
        </div>
        <input type="hidden" value={selectedOption} {...register('repeat')} />
      </div>
    </>
  );
};
