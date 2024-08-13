import { ICategory } from '@/types/commons';
import { randomUUID } from 'crypto';

export const DefaultCategory: ICategory[] = [
  {
    id: randomUUID(),
    name: 'Kitchen',
    tasks: [
      {
        id: randomUUID(),
        title: 'Clean the sink',
        description:
          '<li><ul>Scrub the sink with a sponge and bathroom cleaner. <u>Rinse thoroughly.</u></ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Clean the countertops',
        description:
          '<li><ul>Wipe down the countertops with a cloth and a mild cleaner.</ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Clean the stovetop',
        description:
          '<li><ul>Remove the grates and clean them with a sponge and soapy water.</ul></li>',
      },
    ],
  },
  {
    id: randomUUID(),
    name: 'Living Room',
    tasks: [
      {
        id: randomUUID(),
        title: 'Vacuum the floor',
        description: '<li><ul>Move furniture to vacuum underneath.</ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Dust the furniture',
        description:
          '<li><ul>Use a microfiber cloth to dust the furniture.</ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Clean the windows',
        description:
          '<li><ul>Wipe down the windows with a cloth and window cleaner.</ul></li>',
      },
    ],
  },
  {
    id: randomUUID(),
    name: 'Bathroom',
    tasks: [
      {
        id: randomUUID(),
        title: 'Clean the toilet',
        description:
          '<li><ul>Scrub the toilet bowl with a toilet brush and toilet cleaner.</ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Clean the shower',
        description:
          '<li><ul>Scrub the shower walls with a sponge and bathroom cleaner.</ul></li>',
      },
      {
        id: randomUUID(),
        title: 'Clean the sink',
        description:
          '<li><ul>Scrub the sink with a sponge and bathroom cleaner. <u>Rinse thoroughly.</u></ul></li>',
      },
    ],
  },
];
