'use client';
import Header from '@/components/ui/header';
import { Stepper } from '@/components/ui/stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewSharehousePage = () => {
  const pageTitle = 'Setup';

  return (
    <div className="flex flex-col min-h-screen">
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={pageTitle} />
      <div className="px-6 pt-2">
        <h1 className="text-lg mb-5">Create share house name</h1>
        <Stepper currentStep={1} maxSteps={4} />
        <Input
          type="text"
          placeholder="Sample share house"
          classNames={{
            input: 'w-full mt-2',
          }}
        />
      </div>

      <div className="flex-grow" />

      <div className="flex justify-center p-14">
        <Button>Next</Button>
      </div>
    </div>
  );
};

export default NewSharehousePage;
