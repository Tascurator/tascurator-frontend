import { ICategory } from '@/types/commons';
import { generateRandomUUID } from '@/utils/genarate-uuid';

export const DefaultCategory: ICategory[] = [
  {
    id: generateRandomUUID(),
    name: 'Washroom',
    tasks: [
      {
        id: generateRandomUUID(),
        title: 'Cleaning Toilet',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p>Use <u>a toilet brush</u> to scrub the inside of the toilet bowl.</p></li><li class="[&amp;>p]:inline"><p>Wipe down the seat, lid, and exterior with <u>disinfectant</u>.</p></li></ol><p></p><ul class="list-disc pl-6"><li class="[&amp;>p]:inline"><p>The toilet brush and the disinfectant are located in the cabinet under the sink.</p></li></ul>',
      },
      {
        id: generateRandomUUID(),
        title: 'Cleaning Mirror',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p>Spray <u>glass cleaner</u> on the mirror.</p></li><li class="[&amp;>p]:inline"><p>Wipe it clean with a <u>microfiber cloth</u>, ensuring no streaks are left.</p></li></ol><p></p><ul class="list-disc pl-6"><li class="[&amp;>p]:inline"><p>The glass cleaner and the microfiber cloth are located in the cabinet under the sink.</p><p></p></li></ul><p></p><p></p><p></p>',
      },
    ],
  },
  {
    id: generateRandomUUID(),
    name: 'Kitchen',
    tasks: [
      {
        id: generateRandomUUID(),
        title: 'Cleaning Sink',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p><strong>Remove debris from the sink</strong>.</p></li><li class="[&amp;>p]:inline"><p>Scrub the sink with a sponge and some dish soap.</p></li></ol>',
      },
      {
        id: generateRandomUUID(),
        title: 'Cleaning Fridge',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p>Remove <strong>expired items</strong> from the fridge.</p></li><li class="[&amp;>p]:inline"><p>Wipe down shelves and drawers with a <u>mild cleaner</u></p></li></ol><p></p><ul class="list-disc pl-6"><li class="[&amp;>p]:inline"><p>The mild cleaner is in the cupboard.</p></li></ul>',
      },
    ],
  },
  {
    id: generateRandomUUID(),
    name: 'Liging Room',
    tasks: [
      {
        id: generateRandomUUID(),
        title: 'Vacuuming the floor',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p>Move small furniture out of the way.</p></li><li class="[&amp;>p]:inline"><p><u>Vacuum</u> the entire carpet, including corners and under furniture.</p><p></p></li></ol><p></p><ul class="list-disc pl-6"><li class="[&amp;>p]:inline"><p>The vacuum cleaner is stored in the closet near the entrance.</p></li></ul><p></p>',
      },
      {
        id: generateRandomUUID(),
        title: 'Dusting',
        description:
          '<ol class="list-decimal pl-6"><li class="[&amp;>p]:inline"><p>Use <u>a microfiber cloth</u> to dust all surfaces, including shelves and tables.</p></li><li class="[&amp;>p]:inline"><p>If the windows are dirty, clean them.</p></li></ol><p></p><ul class="list-disc pl-6"><li class="[&amp;>p]:inline"><p>The microfiber cloth is located in the cupboard in the kitchen.</p></li></ul>',
      },
    ],
  },
];
