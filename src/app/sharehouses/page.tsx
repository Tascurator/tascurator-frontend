'use client';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@/components/ui/accordion';
import { AccordionTaskItem } from '@/components/ui/accordion/AccordionTaskItem';
import { Button } from '@/components/ui/button';
import { TenantListItem } from '@/components/ui/tenantList';
import { AccordionCategoryItem } from '@/components/ui/accordion/AccordionCategoryItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShareHouseManagementHead } from '@/components/ui/ShareHouseManagementHead';
import { SubmitHandler, useForm } from 'react-hook-form';

const ShareHousesPage = () => {
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

  interface FormValues {
    repeat: 'Weekly' | 'Fortnightly';
  }

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      repeat: 'Weekly',
    },
  });

  const selectedOption = watch('repeat');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  const handleButtonClick = (option: FormValues['repeat']) => {
    setValue('repeat', option);
  };

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

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionCategoryItem
                id={'1'}
                name={'Kitchen'}
                category={'Kitchen'}
              />
              <AccordionContent className={'space-y-4 bg-primary-lightest p-0'}>
                <AccordionTaskItem
                  id={'id1'}
                  category={'Kitchen'}
                  title={'Mop the floor'}
                  description={
                    'Your task is to mop the floor. You can use the mop in the storage room.'
                  }
                />
                <AccordionTaskItem
                  id={'id2'}
                  category={'Kitchen'}
                  title={'Wipe the mirror'}
                  description={
                    "Your task is to wipe the mirror. It's very important to keep the mirror clean."
                  }
                />
                <AccordionTaskItem
                  id={'id3'}
                  category={'Kitchen'}
                  title={'Clean the dishes'}
                  description={'Lorem ipsum dolor sit amet'}
                />
                <AccordionTaskItem
                  id={'id4'}
                  category={'Kitchen'}
                  title={'Refill the soap'}
                  description={'Lorem ipsum dolor sit amet'}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="Schedule">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>Repeat</p>
            <div className="flex flex-col items-center mt-6">
              <div className="flex justify-between gap-4 w-full">
                <Button
                  className="rounded-full w-full"
                  onClick={() => handleButtonClick('Weekly')}
                  variant={
                    selectedOption === 'Weekly' ? 'default' : 'secondary'
                  }
                >
                  Weekly
                </Button>
                <Button
                  className="rounded-full w-full"
                  onClick={() => handleButtonClick('Fortnightly')}
                  variant={
                    selectedOption === 'Fortnightly' ? 'default' : 'secondary'
                  }
                >
                  Fortnightly
                </Button>
              </div>
              <input
                type="hidden"
                value={selectedOption}
                {...register('repeat')}
              />
              <Button type="submit" className="mt-24">
                Submit
              </Button>
            </div>
          </form>
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

export default ShareHousesPage;
