import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt, { genSaltSync } from 'bcryptjs';
import { InitialAssignedData } from '@/services/InitialAssignedData';
import { getToday } from '@/utils/dates';

const prisma = new PrismaClient();

const createLandlord = async () => {
  let salt: number | string | undefined = process.env.PASSWORD_SALT_ROUNDS;

  if (!salt) {
    throw new Error('PASSWORD_SALT_ROUNDS environment variable is not set');
  }

  if (Number.isNaN(Number(salt))) {
    throw new Error(
      'PASSWORD_SALT_ROUNDS environment variable is not a number',
    );
  }

  salt = Number(salt);

  const hashedPassword = await bcrypt.hash('password', genSaltSync(salt));

  return prisma.landlord.create({
    data: {
      email: 'hoge@tascurator.com',
      password: hashedPassword,
    },
  });
};

const createAssignmentSheet = async () => {
  return prisma.assignmentSheet.create({
    data: {
      startDate: new Date('2025-01-01T00:00:00Z'),
      endDate: new Date('2025-01-08T00:00:00Z'),
      assignedData: '',
    },
  });
};

const createShareHouse = async (
  landlordId: string,
  assignmentSheetId: string,
  shareHouseName: string,
) => {
  return prisma.shareHouse.create({
    data: {
      name: shareHouseName,
      landlordId,
      assignmentSheetId,
    },
  });
};

interface ITask {
  title: string;
  description: string;
}

interface ICategory {
  name: string;
  tasks: ITask[];
}

const createRotationAssignment = async (
  shareHouseId: string,
  categories: ICategory[],
  placeholderCount: number,
) => {
  const tenantPlaceholders = Array.from(
    { length: placeholderCount },
    (_, index) => ({ index }),
  );

  return prisma.rotationAssignment.create({
    data: {
      shareHouseId,
      rotationCycle: 7,
      categories: {
        create: categories.map((category) => ({
          name: category.name,
          tasks: {
            create: category.tasks.map((task) => ({
              title: task.title,
              description: task.description,
            })),
          },
        })),
      },
      tenantPlaceholders: {
        create: tenantPlaceholders.map((placeholder) => ({
          index: placeholder.index,
        })),
      },
    },
  });
};

const createTenant = async (email: string, name: string) => {
  return prisma.tenant.create({
    data: {
      email,
      name,
      extraAssignedCount: 0,
    },
  });
};

const linkTenantToPlaceholder = async (
  rotationAssignmentId: string,
  index: number,
  tenantId: string,
) => {
  return prisma.tenantPlaceholder.update({
    where: {
      rotationAssignmentId_index: {
        rotationAssignmentId,
        index,
      },
    },
    data: {
      tenantId,
    },
  });
};

/**
 * Seed the database with the following data:
 * - 1 landlord
 * - 3 share houses with different configurations
 *   - Categories = Tenants
 *     - 4 categories with some tasks
 *     - 4 tenant placeholders
 *     - 4 tenants
 *   - Categories > Tenants
 *     - 4 categories with some tasks
 *     - 3 tenant placeholders
 *     - 3 tenants
 *   - Categories < Tenants
 *     - 3 categories with some tasks
 *     - 4 tenant placeholders
 *     - 4 tenants
 * - Each tenant is linked to a tenant placeholder
 * - Rotation assignment record and assignment sheet are created for each share house
 * - Assigned data is generated and set for each rotation assignment record
 */
const main = async () => {
  console.log(`🌱 Seeding database...\n`);

  const landlord = await createLandlord();
  console.log('✅ Created landlord\n');

  const categories: ICategory[] = [
    {
      name: 'Cleaning',
      tasks: [
        {
          title: 'Clean the kitchen',
          description: 'Ensure the kitchen is clean and tidy.',
        },
        {
          title: 'Vacuum living room',
          description: 'Vacuum the living room floor.',
        },
      ],
    },
    {
      name: 'Gardening',
      tasks: [
        {
          title: 'Water the plants',
          description: 'Water all plants in the garden.',
        },
        { title: 'Mow the lawn', description: 'Mow the lawn in the garden.' },
        {
          title: 'Weed the garden',
          description: 'Remove all weeds from the garden.',
        },
      ],
    },
    {
      name: 'Grocery shopping',
      tasks: [
        {
          title: 'Buy groceries',
          description: 'Buy groceries for the house.',
        },
        {
          title: 'Buy toilet paper',
          description: 'Buy toilet paper for the house.',
        },
        {
          title: 'Buy cleaning supplies',
          description: 'Buy cleaning supplies for the house.',
        },
        {
          title: 'Buy trash bags',
          description: 'Buy trash bags for the house.',
        },
        {
          title: 'Buy laundry detergent',
          description: 'Buy laundry detergent for the house.',
        },
      ],
    },
    {
      name: 'Miscellaneous',
      tasks: [
        {
          title: 'Take out the trash',
          description: 'Take out the trash from the house.',
        },
        {
          title: 'Do the laundry',
          description: 'Do the laundry for the house.',
        },
        {
          title: 'Clean the bathroom',
          description: 'Ensure the bathroom is clean and tidy.',
        },
        {
          title: 'Clean the living room',
          description: 'Ensure the living room is clean and tidy.',
        },
      ],
    },
  ];

  // It will create 3 share houses with different configurations
  const shareHouseNames = [
    'Categories = Tenants',
    'Categories > Tenants',
    'Categories < Tenants',
  ];

  for (let i = 0; i < shareHouseNames.length; i++) {
    console.log(
      '------------------------------------------------------------\n',
    );

    const shareHouseName = shareHouseNames[i];
    // For the third share house, only use the first two categories
    const shareHouseCategories = i === 2 ? categories.slice(0, 3) : categories;

    console.log(`▶️ Start creating share house with name: ${shareHouseName}`);

    const assignmentSheet = await createAssignmentSheet();
    console.log('✅ Created assignment sheet');

    const shareHouse = await createShareHouse(
      landlord.id,
      assignmentSheet.id,
      shareHouseName,
    );
    console.log('✅ Created share house');

    const rotationAssignment = await createRotationAssignment(
      shareHouse.id,
      shareHouseCategories,
      4,
    );
    console.log(
      `✅ Created rotation assignment with ${shareHouseCategories.length} categories and 4 tenant placeholders`,
    );

    const tenant1 = await createTenant(
      `tenant1+${i}@example.com`,
      'Tenant One',
    );
    const tenant2 = await createTenant(
      `tenant2+${i}@example.com`,
      'Tenant Two',
    );
    const tenant3 = await createTenant(
      `tenant3+${i}@example.com`,
      'Tenant Three',
    );
    await linkTenantToPlaceholder(rotationAssignment.id, 0, tenant1.id);
    await linkTenantToPlaceholder(rotationAssignment.id, 1, tenant2.id);
    await linkTenantToPlaceholder(rotationAssignment.id, 2, tenant3.id);

    if (i !== 1) {
      const tenant4 = await createTenant(
        `tenant4+${i}@example.com`,
        'Tenant Four',
      );
      await linkTenantToPlaceholder(rotationAssignment.id, 3, tenant4.id);
    }
    console.log(
      `✅ Created ${i !== 1 ? 4 : 3} tenants and linked to tenant placeholders`,
    );

    const sharehouse = await prisma.shareHouse.findUnique({
      where: { id: shareHouse.id },
      select: {
        assignmentSheet: true,
        RotationAssignment: {
          select: {
            rotationCycle: true,
            categories: {
              include: { tasks: true },
            },
            tenantPlaceholders: {
              include: {
                tenant: true,
              },
            },
          },
        },
      },
    });

    if (!sharehouse || !sharehouse.RotationAssignment) {
      throw new Error('Share house not found');
    }

    const assignedData = new InitialAssignedData(
      sharehouse,
      getToday(),
      sharehouse.RotationAssignment.rotationCycle,
    ).getAssignedData();

    console.log(
      '✅ Generated assigned data\n',
      JSON.stringify(assignedData, null, 2),
    );

    await prisma.assignmentSheet.update({
      where: { id: assignmentSheet.id },
      data: {
        assignedData: assignedData as unknown as Prisma.JsonArray,
      },
    });
    console.log('✅ Updated assignment sheet with assigned data');

    console.log(`🎉 Finished creating share house: ${shareHouseName}`);
    console.log(
      '\n------------------------------------------------------------',
    );
  }

  console.log('\n🎉🎉🎉🎉 Seeding successful! Yay! 🎉🎉🎉🎉');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
