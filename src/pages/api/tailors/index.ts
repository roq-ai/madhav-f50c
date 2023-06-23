import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tailorValidationSchema } from 'validationSchema/tailors';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTailors();
    case 'POST':
      return createTailor();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTailors() {
    const data = await prisma.tailor
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'tailor'));
    return res.status(200).json(data);
  }

  async function createTailor() {
    await tailorValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.garment?.length > 0) {
      const create_garment = body.garment;
      body.garment = {
        create: create_garment,
      };
    } else {
      delete body.garment;
    }
    if (body?.order?.length > 0) {
      const create_order = body.order;
      body.order = {
        create: create_order,
      };
    } else {
      delete body.order;
    }
    const data = await prisma.tailor.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
