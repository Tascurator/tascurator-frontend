import { CalendarClock } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';
import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
import { TenantListItem } from '@/components/ui/tenantList';
import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShareHouseManagementHead } from '@/components/ui/ShareHouseManagementHead';
import { RotationCycles } from '@/components/sharehouses-management/RotationCycles';
import { api } from '@/lib/hono';
import { CONSTRAINTS } from '@/constants/constraints';
import { convertToPDT, formatDate } from '@/utils/dates';
import { headers } from 'next/headers';

interface IEditShareHousePageProps {
  params: {
    share_house_id: string;
  };
}

const EditShareHousePage = async ({
  params: { share_house_id },
}: IEditShareHousePageProps) => {
  const res = await api.sharehouse[':shareHouseId'].$get(
    {
      param: {
        shareHouseId: share_house_id,
      },
    },
    {
      headers: {
        cookie: headers().get('cookie') || '', // Add cookies to headers
      },
    },
  );

  const shareHouseManagement = await res.json();

  // Check for error in data and display it if found
  if ('error' in shareHouseManagement) {
    throw new Error(shareHouseManagement.error);
  }

  const nextRotationStartDate = convertToPDT(
    new Date(shareHouseManagement.nextRotationStartDate),
  );

  return (
    <>
      <Tabs defaultValue="Tasks" className="mt-4 mb-6">
        <TabsList>
          <TabsTrigger value="Tasks">Tasks</TabsTrigger>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="Tenants">Tenants</TabsTrigger>
        </TabsList>

        <div className="flex gap-2 items-center mt-2 text-gray-600">
          <CalendarClock className="w-4 stroke-destructive" />
          <p className="text-sm flex-1">
            {`The edited information will take effect on `}
            <span className="font-medium text-sm">
              {formatDate(nextRotationStartDate)}
            </span>
            {`.`}
          </p>
        </div>

        {/* Tasks */}
        <TabsContent value="Tasks">
          <ShareHouseManagementHead
            shareHouseId={share_house_id}
            title={'Categories'}
            type={'categories'}
          />
          <div className="flex items-center justify-end mt-4 mb-2 text-base">
            {shareHouseManagement.categories.length}/
            {CONSTRAINTS.CATEGORY_MAX_AMOUNT}
          </div>
          {shareHouseManagement.categories.map((category) => (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              key={category.id}
            >
              <AccordionItem value={`item-${category.id}`}>
                <AccordionCategoryItem category={category} />

                <AccordionContent
                  className={'space-y-4 bg-primary-lightest p-0'}
                >
                  {category.tasks.map((task) => (
                    <AccordionTaskItem
                      key={task.id}
                      id={task.id}
                      category={{
                        id: category.id,
                        name: category.name,
                      }}
                      title={task.title}
                      description={task.description}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="Schedule">
          <RotationCycles
            shareHouseId={share_house_id}
            rotationCycle={shareHouseManagement.rotationCycle}
          />
        </TabsContent>

        {/* Tenants */}
        <TabsContent value="Tenants">
          <ShareHouseManagementHead
            shareHouseId={share_house_id}
            title={'Tenants'}
            type={'tenants'}
          />
          <div className="flex items-center justify-end mt-4 mb-2 text-base">
            {shareHouseManagement.tenants.length}/
            {CONSTRAINTS.TENANT_MAX_AMOUNT}
          </div>
          {shareHouseManagement.tenants.length > 0 ? (
            <ul>
              {shareHouseManagement.tenants.map((tenant) => (
                <li className="mb-4" key={tenant.id}>
                  <TenantListItem
                    shareHouseId={share_house_id}
                    tenant={tenant}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No tenant</p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EditShareHousePage;
