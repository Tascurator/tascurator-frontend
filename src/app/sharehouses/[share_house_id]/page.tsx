import Header from '@/components/ui/header';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/piechart';

interface IShareHousePageProps {
  params: {
    share_house_id: string;
    name: string;
    currentStartDate: string;
    currentEndDate: string;
    progressPercent: number;
    nextStartDate: string;
    nextEndDate: string;
    cardContentCurrent: ICardContentProps[];
    cardContentNext: ICardContentProps[];
  };
}
interface ICardContentProps {
  category: string;
  tenant: string;
  isComplete: boolean;
  taskNum: number;
  completedTaskNum: number;
}

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
  name = 'Share House';
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
      <div className="h-screen">
        <div className="h-1/2 bg-primary-lightest">
          <div className="p-6">
            <Tabs defaultValue="current">
              <TabsList>
                <TabsTrigger value="current">Current</TabsTrigger>
                <TabsTrigger value="next">Next</TabsTrigger>
              </TabsList>

              <div className="text-2xl flex justify-center mt-4">{name}</div>

              {/* Current */}
              <TabsContent value="current">
                <div className="flex justify-center">
                  <div className="w-32 sm:w-48">
                    <Progress progressPercent={progressPercent} />
                  </div>
                </div>
                <Card className="mt-6">
                  <CardHeader
                    startDate={currentStartDate}
                    endDate={currentEndDate}
                    title={'Task assignment'}
                  />
                  {cardContentCurrent.map((content, index) => (
                    <CardContent
                      key={index}
                      category={content.category}
                      tenant={content.tenant}
                      isComplete={content.isComplete}
                      taskNum={content.taskNum}
                      completedTaskNum={content.completedTaskNum}
                    />
                  ))}
                </Card>
              </TabsContent>

              {/* Next */}
              <TabsContent value="next">
                <div className="flex justify-center">
                  <div className="w-32 sm:w-48">
                    <Progress progressPercent={0} />
                  </div>
                </div>

                <Card className="mt-6">
                  <CardHeader
                    startDate={nextStartDate}
                    endDate={nextEndDate}
                    title={'Task assignment'}
                  />

                  {cardContentNext.map((content, index) => (
                    <CardContent
                      key={index}
                      category={content.category}
                      tenant={content.tenant}
                      isComplete={false}
                      taskNum={content.taskNum}
                      completedTaskNum={content.completedTaskNum}
                    />
                  ))}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="h-1/2">
          {/* Other content or styling for the remaining half of the screen */}
        </div>
      </div>
    </>
  );
};

export default ShareHousePage;
