// import {Header} from '@/components/ui/header';
import { ICardContentProps } from '@/types/commons';
import { api } from '@/lib/hono';
import { headers } from 'next/headers';
import DashboardTabs from '@/components/landlord-dashboard/DashboardTabs';

export interface IShareHousePageProps {
  params: {
    share_house_id: string;
    shareHouseName: string;
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
  params: {
    share_house_id,
    shareHouseName,
    nextStartDate,
    nextEndDate,
    cardContentNext,
  },
}: IShareHousePageProps) => {
  const res = await api.rotation.current[':shareHouseId'].$get(
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
    return <div>{data.error}</div>;
  }

  console.log('data', data);

  // console.log("⭐️ShareHousePage ID:", share_house_id);
  // console.log("⭐️ShareHousePage Name:", shareHouseName);

  // currentStartDate = "2022-01-01";
  // currentEndDate = "2022-01-07";
  // progressPercent = 50;
  nextStartDate = '2022-01-08';
  nextEndDate = '2022-01-14';

  // EXAMPLE: TENANTS
  // cardContentCurrent = [
  // 	{
  // 		category: null,
  // 		isComplete: false,
  // 		taskNum: 0,
  // 		completedTaskNum: 0,
  // 		tenant: "tom holland",
  // 	},
  // 	{
  // 		category: "Kitchen",
  // 		tenant: "Zendaya",
  // 		isComplete: true,
  // 		taskNum: 4,
  // 		completedTaskNum: 4,
  // 	},
  // 	{
  // 		category: "Bathroom",
  // 		tenant: "Akio",
  // 		isComplete: false,
  // 		taskNum: 9,
  // 		completedTaskNum: 3,
  // 	},
  // 	{
  // 		category: "Living room",
  // 		tenant: "Maaaatio",
  // 		isComplete: false,
  // 		taskNum: 7,
  // 		completedTaskNum: 2,
  // 	},
  // ];

  // // EXAMPLE: NO TENANTS
  // cardContentCurrent = [
  //   {
  //     category: null,
  //   }
  // ];

  cardContentNext = [
    {
      category: null,
      tenant: 'Matio',
      taskNum: 4,
    },
    {
      category: 'Bathroom',
      tenant: 'Akio',
      taskNum: 9,
    },
    {
      category: 'Living room',
      tenant: 'Maaaatio',
      taskNum: 7,
    },
  ];

  return (
    <>
      <div className="relative before:absolute before:top-0 before:left-0 before:bg-primary-lightest before:h-80 sm:before:h-96 before:w-full ">
        {/* <div className="relative z-10 p-6">
				</div> */}
        <DashboardTabs
          shareHouseId={share_house_id}
          shareHouseName={shareHouseName}
          progressPercent={data.progressRate as number}
          currentStartDate={data.startDate}
          currentEndDate={data.endDate}
          nextStartDate={nextStartDate}
          nextEndDate={nextEndDate}
          cardContentCurrent={data.categories}
          cardContentNext={cardContentNext}
        />
      </div>
    </>
  );
};

export default ShareHousePage;
