'use client';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface IScheduleSettingProps {
  onChange: (repeat: number) => void;
  selectedOption: 7 | 14;
}

export const ScheduleSetting = ({
  onChange,
  selectedOption,
}: IScheduleSettingProps) => {
  const { register, setValue } = useForm({
    defaultValues: {
      repeat: 7,
    },
  });

  const handleButtonClick = (option: 7 | 14) => {
    setValue('repeat', option, { shouldValidate: true });
    onChange(option);
  };

  return (
    <>
      <p>Rotation cycle</p>
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
