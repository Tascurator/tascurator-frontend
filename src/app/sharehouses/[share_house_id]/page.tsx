// import {Header} from '@/components/ui/header';
import { Header } from '@/components/ui/header';
import { ICardContentProps } from '@/types/commons';
import { api } from '@/lib/hono';
import { headers } from 'next/headers';
import DashboardTabsManager from '@/components/landlord-dashboard/DashboardTabsManager';
import LandlordDashboardTabContent from '@/components/landlord-dashboard/LandlordDashboardTabContent';
import { formatDate, convertToPacificTime } from '@/utils/dates';

export interface IShareHousePageProps {
  params: {
    share_house_id: string;
    currentStartDate: string;
    currentEndDate: string;
    progressPercent: number;
    nextStartDate: string;
    nextEndDate: string;
    cardContentCurrent: ICardContentProps[];
    cardContentNext: ICardContentProps[];
  };
}

const ShareHousePage = async ({
  params: { share_house_id },
}: IShareHousePageProps) => {
  const res = await api.rotation[':shareHouseId'].$get(
    { param: { shareHouseId: share_house_id } },
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

  return (
    <>
      <Header
        type={'HeaderItemWithDropDown'}
        pageTitle={data.current.name}
        sharehouseId={share_house_id}
      />
      <div className="relative before:absolute before:top-0 before:left-0 before:bg-primary-lightest before:h-80 sm:before:h-96 before:w-full ">
        <DashboardTabsManager>
          <LandlordDashboardTabContent
            tabType="current"
            progressPercent={data.current.progressRate}
            startDate={formatDate(
              convertToPacificTime(new Date(data.current.startDate)),
            )}
            endDate={formatDate(
              convertToPacificTime(new Date(data.current.endDate)),
            )}
            cardContents={data.current.categories as ICardContentProps[]}
            shareHouseId={share_house_id}
          />
          <LandlordDashboardTabContent
            tabType="next"
            progressPercent={0}
            startDate={formatDate(
              convertToPacificTime(new Date(data.next.startDate)),
            )}
            endDate={formatDate(
              convertToPacificTime(new Date(data.next.endDate)),
            )}
            cardContents={data.next.categories as ICardContentProps[]}
            shareHouseId={share_house_id}
          />
        </DashboardTabsManager>
      </div>
    </>
  );
};

export default ShareHousePage;
