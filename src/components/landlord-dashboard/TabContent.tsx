'use client';
import { TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/piechart';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Key } from 'react';
import { ILandlordDashboardTabContentProps } from '@/types/commons';
import { Button } from '../ui/button';
import Link from 'next/link';

const LandlordDashboardTabContent = ({
  tabType,
  startDate,
  endDate,
  progressPercent,
  cardContents,
  shareHouseId,
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
              category: string | null;
              tenant: string;
              isComplete: boolean;
              taskNum: number;
              completedTaskNum: number;
            },
            index: Key,
          ) => {
            if (content.category === null) {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center flex-col w-full py-4"
                >
                  <div>No tenants</div>
                  <Link href={`/sharehouses/${shareHouseId}/edit?tab=Tenants`}>
                    <Button>Add tenant</Button>
                  </Link>
                </div>
              );
            }
            return (
              <CardContent
                key={index}
                category={content.category}
                tenant={content.tenant}
                isComplete={content.isComplete}
                taskNum={content.taskNum}
                completedTaskNum={content.completedTaskNum}
              />
            );
          },
        )}
      </Card>
    </TabsContent>
  );
};

export { LandlordDashboardTabContent };
