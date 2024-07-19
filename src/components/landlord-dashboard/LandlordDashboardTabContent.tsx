'use client';
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
  cardContents: ICardContentProps[];
  shareHouseId: string;
}

export const LandlordDashboardTabContent = ({
  tabType,
  startDate,
  endDate,
  progressPercent,
  cardContents,
  shareHouseId,
}: ILandlordDashboardTabContentProps) => {
  const renderCardContent = (
    content: ICardContentProps,
    index: Key,
    isCurrent: boolean,
  ) => {
    if (content.category === null && !content.tenant) {
      return (
        <div
          key={index}
          className="flex items-center justify-center flex-col w-full py-6"
        >
          <div className="pb-4">No tenants</div>
          <Link href={`/sharehouses/${shareHouseId}/edit?tab=Tenants`}>
            <Button>Add tenant</Button>
          </Link>
        </div>
      );
    } else if (content.category === null && content.tenant) {
      return (
        <CardContent
          key={index}
          tenant={content.tenant}
          isComplete={isCurrent}
          taskNum={0}
          completedTaskNum={0}
          category={'--'}
        />
      );
    }
    return (
      <CardContent
        key={index}
        category={content.category}
        tenant={content.tenant}
        isComplete={isCurrent ? content.isComplete : false}
        taskNum={content.taskNum}
        completedTaskNum={isCurrent ? content.completedTaskNum : 0}
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
        {cardContents.map((content, index) =>
          renderCardContent(content, index, tabType === 'current'),
        )}
      </Card>
    </TabsContent>
  );
};

export default LandlordDashboardTabContent;
