import Link from 'next/link';
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
    return <div>{data.error}</div>;
  }

  // Extract 'shareHouses' from data
  const { shareHouses } = data;

  const renderShareHouses = () => {
    if (shareHouses.length === 0) {
      return (
        <div className="flex items-center justify-center">No share houses</div>
      );
    }

    return shareHouses.map((shareHouse) => (
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
    ));
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-end mt-4 mb-2 text-base">
        {shareHouses.length}/{CONSTRAINTS.SHAREHOUSE_MAX_AMOUNT}
      </div>
      <div className="fixed right-6 bottom-6">
        <Link href={`/sharehouses/new`}>
          <FloatingActionButton />
        </Link>
      </div>
      {renderShareHouses()}
    </div>
  );
};

export default ShareHousesPage;
