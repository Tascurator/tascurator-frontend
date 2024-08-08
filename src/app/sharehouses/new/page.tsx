import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';
import { DefaultCategory } from '@/components/setup-sharehouse/DefaultCategory';
const NewSharehousePage = () => {
  const categories: ICategory[] = DefaultCategory;
  const tenants: ITenant[] = [
    {
      id: 'e35a6sf5-61f6-4ae7-8e1d-133ac6abf',
      name: 'Alice',
      email: 'asd@ak.com',
    },
    {
      id: 'e35a6b75-61f6-4ae7-j94s-133ac6abf',
      name: 'Bob',
      email: 'bob@bob.com',
    },
    {
      id: 'e0ta6b75-61f6-4ae7-8e1d-109ac6abf',
      name: 'Charlie',
      email: 'c@c.sof',
    },
  ];

  return (
    <SetupStepper
      initialStep={1}
      maxSteps={4}
      tenants={tenants}
      categories={categories}
    />
  );
};

export default NewSharehousePage;
