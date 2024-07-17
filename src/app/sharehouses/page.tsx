// import {Header} from '@/components/ui/header';
import { Progress } from '@/components/ui/piechart';
import { LandlordDashboard } from '@/components/landlord-dashboard/Dropdown';
import Link from 'next/link';
import { FloatingActionButton } from '@/components/ui/floatingActionButton';

interface IShareHouse {
  shareHouseId: string;
  shareHouseName: string;
  progressPercent: number;
}

const ShareHousesPage = () => {
  const shareHouses: IShareHouse[] = [
    // {
    //   shareHouseId: 'yourShareHouseId',
    //   shareHouseName: 'Sample Share House',
    //   progressPercent: 50,
    // },
    // {
    //   shareHouseId: 'yourShareHouseId2',
    //   shareHouseName: 'Sample Share House 2',
    //   progressPercent: 80,
    // },
    // {
    //   shareHouseId: 'yourShareHouseId3',
    //   shareHouseName: 'Sample Share House 3',
    //   progressPercent: 20,
    // },
  ];

  if (shareHouses.length === 0) {
    return (
      <>
        <div className="flex items-center justify-end mt-2">0/10</div>
        <div className="flex items-center justify-center mt-4">
          No share houses
        </div>
        <div className="absolute right-11 bottom-8">
          <FloatingActionButton />
        </div>
      </>
    );
  } else {
    return (
      <div>
        <div className="flex items-center justify-end mt-2">
          {shareHouses.length}/10
        </div>
        <div className="absolute right-11 bottom-8">
          <FloatingActionButton />
        </div>
        {shareHouses.map((shareHouse) => (
          <div
            className="bg-primary-lightest rounded-md my-4 px-4 pt-4 shadow-lg"
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
        ))}
        {/* <div className='fixed bottom-5 right-5 sm:'>
        <FloatingActionButton />
      </div> */}
      </div>
    );
  }
};

export default ShareHousesPage;
