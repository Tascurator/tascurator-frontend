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
import { RotationCycle } from '../../management/RotationCycle';
import { ICategory } from '@/types/commons';

interface IEditShareHousePageProps {
  params: {
    share_house_id: string;
  };
}

const EditShareHousePage = ({
  params: { share_house_id },
}: IEditShareHousePageProps) => {
  console.log('Share house ID:', share_house_id);

  const categories: ICategory[] = [
    {
      id: '1',
      name: 'Kitchen',
      tasks: [
        {
          id: '1',
          title: 'Mop the floor',
          description:
            'Your task is to mop the floor. You can use the mop in the storage room.',
        },
        {
          id: '2',
          title: 'Wipe the mirror',
          description:
            "Your task is to wipe the mirror. It's very important to keep the mirror clean.",
        },
      ],
    },
    {
      id: '2',
      name: 'Bathroom',
      tasks: [
        {
          id: '3',
          title: 'Clean the toilet',
          description:
            'Your task is to clean the toilet. Make sure to use the toilet brush and disinfectant.',
        },
        {
          id: '4',
          title: 'Scrub the shower tiles',
          description:
            'Your task is to scrub the shower tiles. Use the tile cleaner and a brush to remove any soap scum and mildew.',
        },
      ],
    },
  ];

  // TenantListItem
  const tenants = [
    {
      id: '1',
      name: 'Akio Matio',
      email: 'akio@matio.com',
    },
    {
      id: '2',
      name: 'Rina',
      email: 'rina@sample.com',
    },
    {
      id: '3',
      name: 'Yuki',
      email: 'yuki@sample.com',
    },
  ];

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
          <ShareHouseManagementHead title={'Category'} type={'category'} />

          {categories.map((category) => (
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

        {/* Schedule */}
        <TabsContent value="Schedule">
          <RotationCycle />
        </TabsContent>

        {/* Tenants */}
        <TabsContent value="Tenants">
          <ShareHouseManagementHead title={'Tenants'} type={'tenant'} />
          {tenants.length > 0 ? (
            <ul className="mt-6">
              {tenants.map((tenant) => (
                <li className="mb-4" key={tenant.id}>
                  <TenantListItem tenant={tenant} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center">No Tenants</p>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EditShareHousePage;
