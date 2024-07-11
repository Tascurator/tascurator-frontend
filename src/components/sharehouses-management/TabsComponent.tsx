'use client';

import { useSearchParams } from 'next/navigation';
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
import { RotationCycle } from '@/components/sharehouses-management/RotationCycle';
import { ICategory } from '@/types/commons';

interface ITabsComponentProps {
  categories: ICategory[];
  tenants: { id: string; name: string; email: string }[];
}

const TabsComponent = ({ categories, tenants }: ITabsComponentProps) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'Tasks';

  return (
    <Tabs defaultValue={tab} className="mt-4 mb-6">
      <TabsList>
        <TabsTrigger value="Tasks">Tasks</TabsTrigger>
        <TabsTrigger value="Schedule">Schedule</TabsTrigger>
        <TabsTrigger value="Tenants">Tenants</TabsTrigger>
      </TabsList>

      <TabsContent value="Tasks">
        <ShareHouseManagementHead title={'Categories'} type={'categories'} />
        {categories.map((category) => (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            key={category.id}
          >
            <AccordionItem value={`item-${category.id}`}>
              <AccordionCategoryItem category={category} />
              <AccordionContent className={'space-y-4 bg-primary-lightest p-0'}>
                {category.tasks.map((task) => (
                  <AccordionTaskItem
                    key={task.id}
                    id={task.id}
                    category={category.name}
                    title={task.title}
                    description={task.description}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </TabsContent>

      <TabsContent value="Schedule">
        <RotationCycle />
      </TabsContent>

      <TabsContent value="Tenants">
        <ShareHouseManagementHead title={'Tenants'} type={'tenants'} />
        {tenants.length > 0 ? (
          <ul className="mt-6">
            {tenants.map((tenant) => (
              <li className="mb-4" key={tenant.id}>
                <TenantListItem tenant={tenant} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No tenant</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TabsComponent;
