import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';
import { DefaultCategory } from '@/components/setup-sharehouse/DefaultCategory';
import { Header } from '@/components/ui/header';
import { api } from '@/lib/hono';
import { headers } from 'next/headers';

const NewSharehousePage = async () => {
  // Define categories and tenants
  const categories: ICategory[] = DefaultCategory;
  const tenants: ITenant[] = [];

  const res = await api.sharehouses.$get(
    {},
    {
      headers: {
        cookie: headers().get('cookie') || '', // Add cookies to headers
      },
    },
  );
  // Convert response to JSON
  const data = await res.json();

  // Check for error in data and display it if found
  if ('error' in data) {
    throw new Error(data.error);
  }

  // Extract 'shareHouses' from data
  const { shareHouses } = data;

  return (
    <>
      <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={'Setup'} />
      <div className="px-6">
        <SetupStepper
          initialStep={1}
          maxSteps={4}
          tenants={tenants}
          categories={categories}
          sharehouses={shareHouses}
        />
      </div>
    </>
  );
};

export default NewSharehousePage;
