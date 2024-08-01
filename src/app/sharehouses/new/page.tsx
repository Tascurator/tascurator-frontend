import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';
import { DefaultCategory } from '@/components/setup-sharehouse/DefaultCategory';
const NewSharehousePage = () => {
  const categories: ICategory[] = DefaultCategory;
  const tenants: ITenant[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'asd@ak.com',
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@bob.com',
    },
    {
      id: '3',
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
