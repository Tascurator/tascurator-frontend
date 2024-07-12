import { AccordionAssignmentSheet } from '@/components/accordion-assignment-sheet/AccordionAssignmentSheet';
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

  const rotationData = {
    rotations: {
      // rotation 1
      1: {
        startDate: '12/1',
        endDate: '12/7',
        categories: [
          {
            id: '48e5edd4-8960-4be4-8b4c-86c8c31cb8f1',
            name: 'Cleaning',
            tasks: [
              {
                id: 'd7bd18d4-60c9-4fb7-b420-3139ed8cde64',
                title: 'Clean the kitchen',
                description: 'Ensure the kitchen is clean and tidy.',
                isCompleted: false,
              },
              {
                id: 'a7bd18d4-60c9-4fb7-b420-3139ed8cde64',
                title: 'Sample title',
                description: 'Sample description.',
                isCompleted: false,
              },
            ],
          },
        ],
      },

      // rotation 2
      2: {
        startDate: '12/8',
        endDate: '12/15',
        categories: [
          {
            id: '545ea4fe-83e1-4fb9-825e-408a03fd7fc0',
            name: 'Gardening',
            tasks: [
              {
                id: '1cee1481-5be6-41c1-b5e1-7e68a72d8177',
                title: 'Weed the garden',
              },
            ],
          },
        ],
      },
    },
  };

  return (
    <>
      <header className="bg-primary text-white">
        <div className="flex items-center h-14 py-4 px-4 text-xl">
          Your Tasks
        </div>
      </header>

      <div className="px-6">
        <AccordionAssignmentSheet rotationData={rotationData} />
      </div>
    </>
  );
};

export default AssignmentSheetPage;
