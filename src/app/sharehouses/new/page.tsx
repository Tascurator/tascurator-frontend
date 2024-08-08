import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';
import { DefaultCategory } from '@/components/setup-sharehouse/DefaultCategory';
const NewSharehousePage = () => {
  const categories: ICategory[] = DefaultCategory;
  const tenants: ITenant[] = [
    // {
    //   id: 'eddd31de-5d39-40df-92d6-3ec017d8e9cd',
    //   name: 'test',
    //   email: 'test@tascurator.com',
    // },
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
