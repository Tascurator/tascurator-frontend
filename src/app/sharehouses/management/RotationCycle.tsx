'use client';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';

export const RotationCycle = () => {
  interface FormValues {
    repeat: 'Weekly' | 'Fortnightly';
  }

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      repeat: 'Weekly',
    },
  });

  const selectedOption = watch('repeat');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const handleButtonClick = (option: FormValues['repeat']) => {
    setValue('repeat', option);
  };

  return (
    <>
      {/* Schedule */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>Repeat</p>
        <div className="flex flex-col items-center mt-6">
          <div className="flex justify-between gap-4 w-full">
            <Button
              className="rounded-full w-full"
              onClick={() => handleButtonClick('Weekly')}
              variant={selectedOption === 'Weekly' ? 'default' : 'secondary'}
            >
              Weekly
            </Button>
            <Button
              className="rounded-full w-full"
              onClick={() => handleButtonClick('Fortnightly')}
              variant={
                selectedOption === 'Fortnightly' ? 'default' : 'secondary'
              }
            >
              Fortnightly
            </Button>
          </div>
          <input type="hidden" value={selectedOption} {...register('repeat')} />
          <Button type="submit" className="mt-24">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};
