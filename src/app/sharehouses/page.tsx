import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Progress } from '@/components/ui/piechart';
import { LandlordDashboard } from '@/components/landlord-dashboard/LandlordDashboard';
import { FloatingActionButton } from '@/components/ui/floatingActionButton';
import { api } from '@/lib/hono';
import { headers } from 'next/headers';
import { CONSTRAINTS } from '@/constants/constraints';

const ShareHousesPage = async () => {
  // Fetch share house information with headers including cookies
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
      <Header type={'HeaderItemForTop'} pageTitle={''} />
      <div className="pb-20 px-6">
        <div className="flex items-center justify-end mt-4 mb-2 text-base">
          {shareHouses.length}/{CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT}
        </div>
        <div className="fixed z-10 bottom-6 right-6 sm:right-[calc(50%-18.5rem)]">
          <Link href={`/sharehouses/new`}>
            <FloatingActionButton />
          </Link>
        </div>
        {shareHouses.map((shareHouse) => (
          <div
            className="bg-primary-lightest rounded-md mb-4 px-4 pt-4 shadow-lg"
            key={shareHouse.id}
          >
            <Link href={`/sharehouses/${shareHouse.id}/`}>
              <div className="flex justify-center">
                <div className="w-32 sm:w-48">
                  <Progress progressPercent={shareHouse.progress} />
                </div>
              </div>
            </Link>
            <LandlordDashboard
              shareHouseName={shareHouse.name}
              shareHouseId={shareHouse.id}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ShareHousesPage;
