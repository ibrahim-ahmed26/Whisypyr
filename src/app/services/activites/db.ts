import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function dbCreateActivites(
  activities: Prisma.ActivityCreateManyInput[],
  tx?: Prisma.TransactionClient,
) {
  const client = tx ?? prisma;

  const created = await Promise.all(
    activities.map((activity) =>
      client.activity.create({
        data: activity,
        select: {
          content: true,
          createdAt: true,
          type: true,
          id: true,
          actor: {
            select: {
              name: true,
            },
          },
        },
      }),
    ),
  );

  return created;
}
export async function dbGetActivitesByLeadId(
  where: Prisma.ActivityWhereInput,
  params: { page: number; pageSize: number },
) {
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        content: true,
        createdAt: true,
        type: true,
        id: true,
        actor: {
          select: {
            name: true,
          },
        },
      },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    prisma.activity.count({
      where,
    }),
  ]);
  return { activities, total };
}
