import { createMiddleware } from 'hono/factory';
import prisma from '@/lib/prisma';
import { THonoEnv } from '@/app/api/[[...route]]/route';

export const automaticRotationMiddleware = createMiddleware<THonoEnv>(
  async (c, next) => {
    const landlordId = c.get('session').user.id;

    /**
     * Retrieve all share houses that the landlord owns
     */
    const sharehouses = await prisma.shareHouse.findMany({
      where: { landlordId },
      include: {
        assignmentSheet: true,
        RotationAssignment: {
          select: {
            rotationCycle: true,
            categories: {
              include: {
                tasks: {
                  orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                },
              },
              orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            },
            tenantPlaceholders: {
              include: {
                tenant: true,
              },
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });

    /**
     * Set the share houses in the context
     */
    c.set('sharehouses', sharehouses);

    /**
     * TODO: Implement the automatic rotation logic here
     */

    await next();
  },
);
