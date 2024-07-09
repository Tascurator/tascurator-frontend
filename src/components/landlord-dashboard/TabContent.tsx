import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/piechart';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Key } from 'react';
import { ILandlordDashboardTabContentProps } from '@/types/commons';

const LandlordDashboardTabContent = ({
  tabType,
  startDate,
  endDate,
  progressPercent,
  cardContents,
}: ILandlordDashboardTabContentProps) => {
  return (
    <TabsContent value={tabType}>
      <div className="flex justify-center">
        <div className="w-32 sm:w-48">
          <Progress progressPercent={progressPercent} />
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader
          startDate={startDate}
          endDate={endDate}
          title={'Task assignment'}
        />
        {cardContents.map(
          (
            content: {
              category: string;
              tenant: string;
              isComplete: boolean;
              taskNum: number;
              completedTaskNum: number;
            },
            index: Key,
          ) => (
            <CardContent
              key={index}
              category={content.category}
              tenant={content.tenant}
              isComplete={content.isComplete}
              taskNum={content.taskNum}
              completedTaskNum={content.completedTaskNum}
            />
          ),
        )}
      </Card>
    </TabsContent>
  );
};

export { LandlordDashboardTabContent };
