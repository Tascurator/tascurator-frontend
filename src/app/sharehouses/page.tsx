import Header from '@/components/ui/header';
import { Progress } from '@/components/ui/piechart';
import { LandlordDashboard } from '@/components/landlord-dashboard/Dropdown';

const ShareHousesPage = () => {
  const name = 'test';
  ('');
  return (
    <div>
      <Header type={'HeaderItemForTop'} pageTitle={''} />
      <div className="bg-primary-lightest rounded-md mt-4 px-4 pt-4 shadow-lg">
        <div className="flex justify-center">
          <div className="w-32 sm:w-48">
            <Progress progressPercent={50} />
          </div>
        </div>
        <LandlordDashboard name={name} />
      </div>
    </div>
  );
};

export default ShareHousesPage;
