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

interface IEditShareHousePageProps {
  params: {
    share_house_id: string;
  };
}

const EditShareHousePage = async ({
  params: { share_house_id },
}: IEditShareHousePageProps) => {
  const res = await api.sharehouse[':shareHouseId'].$get({
    param: {
      shareHouseId: share_house_id,
    },
  });

  const shareHouseManagement = await res.json();

  // Check for error in data and display it if found
  // TODO: Improve and implement the error message display
  if ('error' in shareHouseManagement) {
    return <div>{shareHouseManagement.error}</div>;
  }

  return (
    <>
      <Tabs defaultValue="Tasks" className="mt-4 mb-6">
        <TabsList>
          <TabsTrigger value="Tasks">Tasks</TabsTrigger>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="Tenants">Tenants</TabsTrigger>
        </TabsList>

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
