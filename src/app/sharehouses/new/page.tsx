import SetupStepper from '@/components/setup-sharehouse/SetupStepper';
import { ICategory, ITenant } from '@/types/commons';

const NewSharehousePage = () => {
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
  const tenants: ITenant[] = [];

  return (
    <SetupStepper
      initialStep={1}
      maxSteps={4}
      tenants={tenants}
      categories={categories}
    />
  );
};

export default NewSharehousePage;
