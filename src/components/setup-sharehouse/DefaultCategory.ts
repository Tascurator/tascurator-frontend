import { ICategory } from '@/types/commons';
import { randomUUID } from 'crypto';

export const DefaultCategory: ICategory[] = [
  {
    id: randomUUID(),
    name: 'Kitchen',
    tasks: [
      {
        id: randomUUID(),
        title: 'Mop the floor',
        description:
          '<ul><li>Your task is to mop the floor. <u>You can use the mop in the storage room</u>.</li></ul>',
      },
      {
        id: randomUUID(),
        title: 'Clean the oven',
        description:
          '<ul><li>Your task is to clean the oven. Make sure to use the oven cleaner and a sponge.</li></ul>',
      },
    ],
  },
  {
    id: randomUUID(),
    name: 'Bathroom',
    tasks: [
      {
        id: randomUUID(),
        title: 'Toilet',
        description:
          '<ul><li>Your task is to clean the toilet. Make sure to <b>use the toilet brush and disinfectant</b>.</li></ul>',
      },
      {
        id: randomUUID(),
        title: 'Scrub the tiles',
        description:
          '<ul><li>Your task is to scrub the shower tiles. Use the tile cleaner and a brush to remove any soap scum and mildew.</li></ul>',
      },
    ],
  },
  {
    id: randomUUID(),
    name: 'Liging Room',
    tasks: [
      {
        id: randomUUID(),
        title: 'Vacuum the carpet',
        description:
          '<ul><li>Your task is to vacuum the carpet. Make sure to <b>move the furniture</b> and get into the corners.</li></ul>',
      },
      {
        id: randomUUID(),
        title: 'Dust the shelves',
        description:
          '<ul><li>Your task is to dust the shelves. Use a <u>microfiber cloth</u> to remove any dust and dirt.</li></ul>',
      },
    ],
  },
];
