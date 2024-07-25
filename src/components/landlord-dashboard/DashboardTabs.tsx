import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandlordDashboardTabContent } from '@/components/landlord-dashboard/LandlordDashboardTabContent';
import { ICardContentProps } from '@/types/commons';

interface DashboardTabsProps {
  shareHouseId: string;
  shareHouseName: string;
  progressPercent: number;
  currentStartDate: string;
  currentEndDate: string;
  nextStartDate: string;
  nextEndDate: string;
  cardContentCurrent: ICardContentProps[];
  cardContentNext: ICardContentProps[];
}

export default function DashboardTabs({
  shareHouseId,
  shareHouseName,
  progressPercent,
  currentStartDate,
  currentEndDate,
  nextStartDate,
  nextEndDate,
  cardContentCurrent,
  cardContentNext,
}: DashboardTabsProps) {
  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formattedDate;
  };

  return (
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
          startDate={formatDate(currentStartDate)}
          endDate={formatDate(currentEndDate)}
          cardContents={cardContentCurrent}
          shareHouseId={shareHouseId}
        />
        <LandlordDashboardTabContent
          tabType="next"
          progressPercent={0}
          startDate={formatDate(nextStartDate)}
          endDate={formatDate(nextEndDate)}
          cardContents={cardContentNext}
          shareHouseId={shareHouseId}
        />
      </Tabs>
    </div>
  );
}
