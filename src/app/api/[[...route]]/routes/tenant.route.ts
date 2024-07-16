import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Tenant } from '@prisma/client';

import { tenantInvitationSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';

const app = new Hono();

export default app;

app.patch(
  '/:tenantId',
  zValidator('json', tenantInvitationSchema.pick({ name: true })),
  async (c) => {
    try {
      const tenantId = c.req.param('tenantId');
      const data = c.req.valid('json');

      const tenant = await prisma.tenant.findUnique({
        where: {
          id: tenantId,
        },
      });

      if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

      const updateTenant = await prisma.tenant.update({
        where: {
          id: tenantId,
        },
        data: {
          name: data.name,
        },
      });

      return c.json(updateTenant, 201);
    } catch (error) {
      console.error('Error updating tenant:', error);
      return c.json({ error: 'An error occurred while updating  tenant' }, 500);
    }
  },
);

app.delete('/:tenantId', async (c) => {
  try {
    const tenantId = c.req.param('tenantId');
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });
    if (!tenant) return c.json({ error: 'Tenant not found' }, 404);

    const deleteTenant = await prisma.tenant.delete({
      where: {
        id: tenantId,
      },
    });
    return c.json(deleteTenant, 201);
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return c.json({ error: 'An error occurred while deleting  tenant' }, 500);
  }
});

app.post(
  '/:shareHouseId',
  zValidator('json', tenantInvitationSchema),
  async (c) => {
    try {
      const shareHouseId = c.req.param('shareHouseId');
      const data = c.req.valid('json');

      const sanitizedEmail = data.email.toLowerCase();
      const existingTenant = await prisma.tenant.findUnique({
        where: {
          email: sanitizedEmail,
        },
      });

      if (existingTenant)
        return c.json({ error: 'Tenant with this email already exists' }, 400);

      const rotationAssignment = await prisma.rotationAssignment.findUnique({
        where: {
          shareHouseId: shareHouseId,
        },
        include: {
          tenantPlaceholders: true,
        },
      });

      if (!rotationAssignment)
        return c.json(
          { error: 'RotationAssignment not found for the given shareHouseId' },
          404,
        );

      const availableTenantPlaceholder =
        rotationAssignment.tenantPlaceholders.find(
          (tenantPlaceholder) => tenantPlaceholder.tenantId === null,
        );

      let newTenant: Tenant;

      if (availableTenantPlaceholder) {
        newTenant = await prisma.tenant.create({
          data: {
            name: data.name,
            email: sanitizedEmail,
            extraAssignedCount: 0,
            tenantPlaceholders: {
              connect: {
                rotationAssignmentId_index: {
                  rotationAssignmentId:
                    availableTenantPlaceholder.rotationAssignmentId,
                  index: availableTenantPlaceholder.index,
                },
              },
            },
          },
        });
      } else {
        const lastIndex = rotationAssignment.tenantPlaceholders.length;
        newTenant = await prisma.tenant.create({
          data: {
            name: data.name,
            email: sanitizedEmail,
            extraAssignedCount: 0,
            tenantPlaceholders: {
              create: {
                rotationAssignmentId: rotationAssignment.id,
                index: lastIndex,
              },
            },
          },
        });
      }

      return c.json(newTenant, 201);
    } catch (error) {
      console.error('Error creating tenant:', error);
      return c.json(
        { error: 'An error occurred while creating the tenant' },
        500,
      );
    }
  },
);

app.get('/:assignmentSheetId/:tenantId', (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');
  return c.json({
    message: `Assignment sheet id: ${assignmentSheetId}, tenant id: ${tenantId}`,
  });
});

app.patch('/:assignmentSheetId/:tenantId', (c) => {
  const assignmentSheetId = c.req.param('assignmentSheetId');
  const tenantId = c.req.param('tenantId');
  return c.json({
    message: `Updating assignment sheet id: ${assignmentSheetId}, tenant id: ${tenantId}`,
  });
});
