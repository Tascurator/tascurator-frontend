import { Progress } from '@/components/ui/piechart';
import { LandlordDashboard } from '@/components/landlord-dashboard/LandlordDashboard';
import Link from 'next/link';
import { FloatingActionButton } from '@/components/ui/floatingActionButton';

interface IShareHouse {
  shareHouseId: string;
  shareHouseName: string;
  progressPercent: number;
}

const ShareHousesPage = () => {
  const shareHouses: IShareHouse[] = [
    {
      shareHouseId: 'yourShareHouseId',
      shareHouseName: 'Sample Share House',
      progressPercent: 50,
    },
    {
      shareHouseId: 'yourShareHouseId2',
      shareHouseName: 'Sample Share House 2',
      progressPercent: 80,
    },
    {
      shareHouseId: 'yourShareHouseId3',
      shareHouseName: 'Sample Share House 3',
      progressPercent: 20,
    },
  ];

  const renderShareHouses = () => {
    if (shareHouses.length === 0) {
      return (
        <div className="flex items-center justify-center">No share houses</div>
      );
    }

    return shareHouses.map((shareHouse) => (
      <div
        className="bg-primary-lightest rounded-md mb-4 px-4 pt-4 shadow-lg"
        key={shareHouse.shareHouseId}
      >
        <Link href={`/sharehouses/${shareHouse.shareHouseId}/`}>
          <div className="flex justify-center">
            <div className="w-32 sm:w-48">
              <Progress progressPercent={shareHouse.progressPercent} />
            </div>
          </div>
        </Link>
        <LandlordDashboard
          shareHouseName={shareHouse.shareHouseName}
          shareHouseId={shareHouse.shareHouseId}
        />
      </div>
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-end mt-4 mb-2 text-base">
        {shareHouses.length}/10
      </div>
      <div className="fixed right-11 bottom-8">
        <Link href={`/sharehouses/new`}>
          <FloatingActionButton />
        </Link>
      </div>
      {renderShareHouses()}
    </div>
  );
};

export default ShareHousesPage;
