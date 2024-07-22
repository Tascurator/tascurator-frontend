import { SetupStepper } from '@/components/setup-sharehouse/SetupStepper';
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
    {
      id: '3',
      name: 'Living Room',
      tasks: [
        {
          id: '5',
          title: 'Vacuum the carpet',
          description:
            'Your task is to vacuum the carpet. Make sure to move the furniture and get into the corners.',
        },
        {
          id: '6',
          title: 'Dust the shelves',
          description:
            'Your task is to dust the shelves. Use a microfiber cloth to remove any dust and dirt.',
        },
      ],
    },
    {
      id: '4',
      name: 'Bedroom',
      tasks: [
        {
          id: '7',
          title: 'Change the sheets',
          description:
            'Your task is to change the sheets. Make sure to wash the old sheets and put on fresh ones.',
        },
        {
          id: '8',
          title: 'Organize the closet',
          description:
            'Your task is to organize the closet. Make sure to fold and hang the clothes neatly.',
        },
        {
          id: '9',
          title: 'Dust the furniture',
          description:
            'Your task is to dust the furniture. Use a microfiber cloth to remove any dust and dirt.',
        },
      ],
    },
    {
      id: '5',
      name: 'Garden',
      tasks: [
        {
          id: '10',
          title: 'Mow the lawn',
          description:
            'Your task is to mow the lawn. Make sure to use the lawnmower and trim the edges.',
        },
        {
          id: '11',
          title: 'Water the plants',
          description:
            'Your task is to water the plants. Make sure to water them in the morning or evening.',
        },
      ],
    },
    {
      id: '6',
      name: 'Garage',
      tasks: [
        {
          id: '12',
          title: 'Sweep the floor',
          description:
            'Your task is to sweep the floor. Make sure to move the cars and get into the corners.',
        },
        {
          id: '13',
          title: 'Organize the tools',
          description:
            'Your task is to organize the tools. Make sure to put them back in their proper place.',
        },
      ],
    },
    {
      id: '7',
      name: 'Laundry Room',
      tasks: [
        {
          id: '14',
          title: 'Wash the clothes',
          description:
            'Your task is to wash the clothes. Make sure to separate the colors and use the right detergent.',
        },
        {
          id: '15',
          title: 'Fold the clothes',
          description:
            'Your task is to fold the clothes. Make sure to fold them neatly and put them away.',
        },
      ],
    },
    {
      id: '8',
      name: 'Storage Room',
      tasks: [
        {
          id: '16',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
        {
          id: '17',
          title: 'Clean the floor',
          description:
            'Your task is to clean the floor. Make sure to sweep and mop the floor.',
        },
      ],
    },
    {
      id: '9',
      name: 'Storage Room',
      tasks: [
        {
          id: '18',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '10',
      name: 'Storage Room',
      tasks: [
        {
          id: '19',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '11',
      name: 'Storage Room',
      tasks: [
        {
          id: '20',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '12',
      name: 'Storage Room',
      tasks: [
        {
          id: '21',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '13',
      name: 'Storage Room',
      tasks: [
        {
          id: '22',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '14',
      name: 'Storage Room',
      tasks: [
        {
          id: '23',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    {
      id: '15',
      name: 'Storage Roomtt',
      tasks: [
        {
          id: '24',
          title: 'Organize the shelves',
          description:
            'Your task is to organize the shelves. Make sure to put things back in their proper place.',
        },
      ],
    },
    // {
    //   id: '16',
    //   name: 'Storage Roomww',
    //   tasks: [
    //     {
    //       id: '25',
    //       title: 'Organize the shelves',
    //       description:
    //         'Your task is to organize the shelves. Make sure to put things back in their proper place.',
    //     },
    //   ],
    // },
  ];
  const tenants: ITenant[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'asd@ak.com',
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@bob.com',
    },
    {
      id: '3',
      name: 'Charlie',
      email: 'c@c.sof',
    },
    {
      id: '4',
      name: 'David',
      email: 'dav@asd.fon',
    },
    {
      id: '5',
      name: 'Eve',
      email: 'aod@aisdf.dsoa',
    },
    {
      id: '6',
      name: 'Frank',
      email: 'ajfdi@aisf.com',
    },
    {
      id: '7',
      name: 'Grace',
      email: 'aodfijsif@jfsi.vos',
    },
    {
      id: '8',
      name: 'Hank',
      email: 'adj@f.vw',
    },
    {
      id: '9',
      name: 'Ivy',
      email: 'sjdfi@sjfi.foe',
    },
    {
      id: '10',
      name: 'Jack',
      email: 'snidf@fji.vos',
    },
    {
      id: '11',
      name: 'Kate',
      email: 'wijf@fke.sfi',
    },
    {
      id: '12',
      name: 'Leo',
      email: 'sjdfimwif@sf.aov',
    },
    {
      id: '13',
      name: 'Mia',
      email: 'sjfiowiejfiwo@fsu.com',
    },
    {
      id: '14',
      name: 'Nina',
      email: 'sjdfijsdi@jfi.com',
    },
    {
      id: '15',
      name: 'Oscar',
      email: 'aji@if.vom',
    },
    {
      id: '16',
      name: 'Peter',
      email: 'afjaiodfioa@fs.fd',
    },
    {
      id: '17',
      name: 'Queen',
      email: 'sdjfi@sji.cs',
    },
    {
      id: '18',
      name: 'Rose',
      email: 'sjdf@o.fo',
    },
    {
      id: '19',
      name: 'Sam',
      email: 'jiji@fji.fos',
    },
    {
      id: '20',
      name: 'Tom',
      email: 'asd@osfk.cos',
    },
    {
      id: '21',
      name: 'Uma',
      email: 'jsif@co.co',
    },
  ];

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
