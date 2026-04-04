import { prisma } from "@/app/lib/prisma";
import LeadDetailedPage from "@/components/LeadDetailedPage";

export default async function LeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const users = await prisma.profile.findMany({
    where: { role: "AGENT" },
  });
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      activities: {
        include: {
          actor: true,
        },
      },
      assignTo: true,
    },
  });

  if (!lead) return <p>Lead Not Found</p>;
  return (
    <>
      <LeadDetailedPage lead={lead} users={users} />
    </>
  );
}
