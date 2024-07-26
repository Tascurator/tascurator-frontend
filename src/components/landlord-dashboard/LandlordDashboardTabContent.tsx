import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/piechart';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Key } from 'react';
import { ICardContentProps } from '@/types/commons';
import { Button } from '../ui/button';
import Link from 'next/link';

interface ILandlordDashboardTabContentProps {
  tabType: string;
  startDate: string;
  endDate: string;
  progressPercent: number;
  cardContents: ICardContentProps[] | null;
  shareHouseId: string;
}

export const LandlordDashboardTabContent = ({
  tabType,
  startDate,
  endDate,
  progressPercent,
  cardContents = [],
  shareHouseId,
}: ILandlordDashboardTabContentProps) => {
  const renderCardContent = (
    content: ICardContentProps,
    index: Key,
    isCurrent: boolean,
  ) => {
    if (content.name === null) {
      return (
        <CardContent
          key={index}
          tenant={content.tenant}
          isComplete={isCurrent}
          maxTasks={0}
          completedTasks={0}
          name={'--'}
        />
      );
    }
    return (
      <CardContent
        key={index}
        name={content.name}
        tenant={content.tenant}
        isComplete={
          isCurrent ? content.completedTasks === content.maxTasks : false
        }
        maxTasks={content.maxTasks}
        completedTasks={isCurrent ? content.completedTasks : 0}
      />
    );
  };

  return (
    <TabsContent value={tabType}>
      <div className="flex justify-center">
        <div className="w-32 sm:w-48">
          <Progress
            progressPercent={tabType === 'current' ? progressPercent : 0}
          />
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader
          startDate={startDate}
          endDate={endDate}
          title={'Task assignment'}
        />
        {cardContents ? (
          cardContents.map((content, index) =>
            renderCardContent(content, index, tabType === 'current'),
          )
        ) : (
          <div className="flex items-center justify-center flex-col w-full py-6">
            <div className="pb-4">No tenants</div>
            <Link href={`/sharehouses/${shareHouseId}/edit?tab=Tenants`}>
              <Button>Add tenant</Button>
            </Link>
          </div>
        )}
      </Card>
    </TabsContent>
  );
};

export default LandlordDashboardTabContent;
