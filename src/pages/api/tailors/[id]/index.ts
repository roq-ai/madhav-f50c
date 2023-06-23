import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { tailorValidationSchema } from 'validationSchema/tailors';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.tailor
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTailorById();
    case 'PUT':
      return updateTailorById();
    case 'DELETE':
      return deleteTailorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTailorById() {
    const data = await prisma.tailor.findFirst(convertQueryToPrismaUtil(req.query, 'tailor'));
    return res.status(200).json(data);
  }

  async function updateTailorById() {
    await tailorValidationSchema.validate(req.body);
    const data = await prisma.tailor.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteTailorById() {
    const data = await prisma.tailor.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
