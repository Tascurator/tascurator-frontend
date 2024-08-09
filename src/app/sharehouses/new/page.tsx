import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';
import { DefaultCategory } from '@/components/setup-sharehouse/DefaultCategory';
import { Header } from '@/components/ui/header';
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
    <>
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={'Setup'} />
      <div className="px-6">
        <SetupStepper
          initialStep={1}
          maxSteps={4}
          tenants={tenants}
          categories={categories}
        />
      </div>
    </>
  );
};

export default NewSharehousePage;
