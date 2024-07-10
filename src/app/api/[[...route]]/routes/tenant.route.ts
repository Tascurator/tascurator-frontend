import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { Tenant } from '@prisma/client';

import { tenantInvitationSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';

const app = new Hono();

export default app;

app.patch('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Updating tenant id: ${tenantId}` });
});

app.delete('/:tenantId', (c) => {
  const tenantId = c.req.param('tenantId');
  return c.json({ message: `Deleting tenant id: ${tenantId}` });
});

app.post(
  '/:shareHouseId',
  zValidator('json', tenantInvitationSchema),
  async (c) => {
    try {
      const shareHouseId = c.req.param('shareHouseId');
      const data = c.req.valid('json');

      const sanitizedEmail = data.email.toLowerCase().trim();
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
            email: data.email,
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
            email: data.email,
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
