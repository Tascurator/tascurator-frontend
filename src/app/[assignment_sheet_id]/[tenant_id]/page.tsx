import { AssignmentList } from '@/components/assignment-list/AssignmentList';
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IAssignedData } from '@/types/commons';
interface IAssignmentSheetPageProps {
  params: {
    assignment_sheet_id: string;
    tenant_id: string;
  };
}

const AssignmentSheetPage = ({
  params: { assignment_sheet_id, tenant_id },
}: IAssignmentSheetPageProps) => {
  console.log(
    `Assignment Sheet ID: ${assignment_sheet_id}, Tenant ID: ${tenant_id}`,
  );

  const assignedData: IAssignedData = {
    assignments: [
      {
        tasks: [
          {
            id: 'd7bd18d4-60c9-4fb7-b420-3139ed8cde64',
            title: 'Clean the kitchen',
            description: 'Ensure the kitchen is clean and tidy.',
            isCompleted: false,
          },
          {
            id: '0cec5cb8-799f-4873-a724-a548276b7ba9',
            title: 'Vacuum living room',
            description: 'Vacuum the living room floor.',
            isCompleted: true,
          },
        ],
        tenant: {
          id: 'fbfdf800-4008-4a89-ba11-db4c5cb3be1c',
          name: 'Tenant One',
        },
        category: {
          id: '48e5edd4-8960-4be4-8b4c-86c8c31cb8f1',
          name: 'Cleaning',
        },
        tenantPlaceholderId: 0,
      },
      {
        tasks: [
          {
            id: '6c2ed89c-38d3-4049-b3a7-e500102f4d43',
            title: 'Water the plants',
            description: 'Water all plants in the garden.',
            isCompleted: false,
          },
          {
            id: 'faaefe46-4e05-46c9-9a8a-b89a0b8798ae',
            title: 'Mow the lawn',
            description: 'Mow the lawn in the garden.',
            isCompleted: true,
          },
          {
            id: '1cee1481-5be6-41c1-b5e1-7e68a72d8177',
            title: 'Weed the garden',
            description: 'Remove all weeds from the garden.',
            isCompleted: true,
          },
        ],
        tenant: {
          id: 'd4112897-4e34-4ee0-936d-2e06a6ef08b9',
          name: 'Tenant Two',
        },
        category: {
          id: '545ea4fe-83e1-4fb9-825e-408a03fd7fc0',
          name: 'Gardening',
        },
        tenantPlaceholderId: 1,
      },
      {
        tasks: [
          {
            id: '22d66725-859a-4f69-b4e8-1fa731276d9d',
            title: 'Buy groceries',
            description: 'Buy groceries for the house.',
            isCompleted: true,
          },
          {
            id: 'fb43cf49-5b1c-4490-a1c3-5d62ed1677c7',
            title: 'Buy toilet paper',
            description: 'Buy toilet paper for the house.',
            isCompleted: true,
          },
          {
            id: '277bcb97-d8fb-4e1e-85e9-190946a3caae',
            title: 'Buy cleaning supplies',
            description: 'Buy cleaning supplies for the house.',
            isCompleted: false,
          },
          {
            id: '4a4481d3-678d-42a5-81c3-60608e449944',
            title: 'Buy trash bags',
            description: 'Buy trash bags for the house.',
            isCompleted: true,
          },
          {
            id: 'eaa40f82-90f4-49fc-87a2-018397e62b46',
            title: 'Buy laundry detergent',
            description: 'Buy laundry detergent for the house.',
            isCompleted: false,
          },
        ],
        tenant: {
          id: 'b4aac7a1-8b3f-49d4-b819-09ebc7571840',
          name: 'Tenant Three',
        },
        category: {
          id: 'c5dbc512-d9b9-49cc-8cbc-8601549802dc',
          name: 'Grocery shopping',
        },
        tenantPlaceholderId: 2,
      },
      {
        tasks: [
          {
            id: '5610e318-6754-4abd-9a96-6062cb2825e4',
            title: 'Take out the trash',
            description: 'Take out the trash from the house.',
            isCompleted: false,
          },
          {
            id: 'f464bf15-eae3-4ce2-ae8f-b88465f7d928',
            title: 'Do the laundry',
            description: 'Do the laundry for the house.',
            isCompleted: false,
          },
          {
            id: 'edefa79b-7a63-48ec-8161-37c3dd393ed1',
            title: 'Clean the bathroom',
            description: 'Ensure the bathroom is clean and tidy.',
            isCompleted: false,
          },
          {
            id: 'a818addb-6c62-429a-af2e-3f4be945c2ca',
            title: 'Clean the living room',
            description: 'Ensure the living room is clean and tidy.',
            isCompleted: true,
          },
        ],
        tenant: {
          id: 'fbfdf800-4008-4a89-ba11-db4c5cb3be1c',
          name: 'Tenant One',
        },
        category: {
          id: '3115e435-369e-4e85-903d-613ef7952756',
          name: 'Miscellaneous',
        },
        tenantPlaceholderId: null,
      },
    ],
  };

  // console.log('assignedData', JSON.stringify(assignedData, null, 2));

  return (
    <>
      <header className="bg-primary text-white">
        <div className="flex items-center h-14 py-4 px-4 text-xl">
          Your Tasks
        </div>
      </header>

      <div className="px-6">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={'item-1'}
        >
          <AccordionItem value={`item-1`}>
            <AccordionTrigger scheduleDate={'12/31-01/07'}>
              Week 1
            </AccordionTrigger>
            <AccordionContent
              className={'bg-primary-lightest p-0 rounded-none'}
              asChild
            >
              <AssignmentList tenantId={tenant_id} assignments={assignedData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default AssignmentSheetPage;
