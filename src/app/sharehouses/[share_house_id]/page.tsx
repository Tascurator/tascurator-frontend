import Header from '@/components/ui/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandlordDashboardTabContent } from '@/components/landlord-dashboard/TabContent';
import { IShareHousePageProps } from '@/types/commons';

const ShareHousePage = ({
  params: {
    name,
    currentStartDate,
    currentEndDate,
    progressPercent,
    nextStartDate,
    nextEndDate,
    cardContentCurrent,
    cardContentNext,
  },
}: IShareHousePageProps) => {
  name = 'Share House Dayo';
  currentStartDate = '2022-01-01';
  currentEndDate = '2022-01-07';
  progressPercent = 50;
  nextStartDate = '2022-01-08';
  nextEndDate = '2022-01-14';

  cardContentCurrent = [
    {
      category: 'Kitchen',
      tenant: 'Matio',
      isComplete: false,
      taskNum: 4,
      completedTaskNum: 1,
    },
    {
      category: 'Bathroom',
      tenant: 'Akio',
      isComplete: false,
      taskNum: 9,
      completedTaskNum: 3,
    },
    {
      category: 'Living room',
      tenant: 'Maaaatio',
      isComplete: false,
      taskNum: 7,
      completedTaskNum: 2,
    },
  ];

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
      <Header type={'HeaderItemWithDropDown'} pageTitle={name} />
      <div className="relative before:absolute before:top-0 before:left-0 before:bg-primary-lightest before:h-80 sm:before:h-96 before:w-full ">
        <div className="relative z-10 p-6">
          <Tabs defaultValue="current">
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="next">Next</TabsTrigger>
            </TabsList>

            <div className="text-2xl flex justify-center mt-4">{name}</div>

            <LandlordDashboardTabContent
              tabType="current"
              progressPercent={progressPercent}
              startDate={currentStartDate}
              endDate={currentEndDate}
              cardContents={cardContentCurrent}
            />
            <LandlordDashboardTabContent
              tabType="next"
              progressPercent={0}
              startDate={nextStartDate}
              endDate={nextEndDate}
              cardContents={cardContentNext}
            />
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ShareHousePage;
