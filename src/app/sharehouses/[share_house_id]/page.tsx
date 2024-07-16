// import {Header} from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandlordDashboardTabContent } from '@/components/landlord-dashboard/TabContent';
import { ICardContentProps } from '@/types/commons';

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

const ShareHousePage = ({
  params: {
    share_house_id,
    shareHouseName,
    currentStartDate,
    currentEndDate,
    progressPercent,
    nextStartDate,
    nextEndDate,
    cardContentCurrent,
    cardContentNext,
  },
}: IShareHousePageProps) => {
  console.log('⭐️ShareHousePage ID:', share_house_id);
  console.log('⭐️ShareHousePage Name:', shareHouseName);

  currentStartDate = '2022-01-01';
  currentEndDate = '2022-01-07';
  progressPercent = 50;
  nextStartDate = '2022-01-08';
  nextEndDate = '2022-01-14';

  cardContentCurrent = [
    {
      category: null,
      isComplete: false,
      taskNum: 0,
      completedTaskNum: 0,
      tenant: '',
    },
  ];

  // cardContentCurrent = [
  //   {
  //     category: 'Kitchen',
  //     tenant: 'Matio',
  //     isComplete: true,
  //     taskNum: 4,
  //     completedTaskNum: 4,
  //   },
  //   {
  //     category: 'Bathroom',
  //     tenant: 'Akio',
  //     isComplete: false,
  //     taskNum: 9,
  //     completedTaskNum: 3,
  //   },
  //   {
  //     category: 'Living room',
  //     tenant: 'Maaaatio',
  //     isComplete: false,
  //     taskNum: 7,
  //     completedTaskNum: 2,
  //   },
  // ];

  cardContentNext = [
    {
      category: 'Kitchen',
      tenant: 'Matio',
      isComplete: false,
      taskNum: 4,
      completedTaskNum: 0,
    },
    {
      category: 'Bathroom',
      tenant: 'Akio',
      isComplete: false,
      taskNum: 9,
      completedTaskNum: 0,
    },
    {
      category: 'Living room',
      tenant: 'Maaaatio',
      isComplete: false,
      taskNum: 7,
      completedTaskNum: 0,
    },
  ];

  return (
    <>
      <div className="relative before:absolute before:top-0 before:left-0 before:bg-primary-lightest before:h-80 sm:before:h-96 before:w-full ">
        <div className="relative z-10 p-6">
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="next">Next</TabsTrigger>
            </TabsList>

            <div className="text-2xl flex justify-center mt-4">
              {shareHouseName}
            </div>

            <LandlordDashboardTabContent
              tabType="current"
              progressPercent={progressPercent}
              startDate={currentStartDate}
              endDate={currentEndDate}
              cardContents={cardContentCurrent}
              shareHouseId={share_house_id}
            />
            <LandlordDashboardTabContent
              tabType="next"
              progressPercent={0}
              startDate={nextStartDate}
              endDate={nextEndDate}
              cardContents={cardContentNext}
              shareHouseId={share_house_id}
            />
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ShareHousePage;
