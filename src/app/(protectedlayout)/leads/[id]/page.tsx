import { prisma } from "@/app/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadStages, LeadStatus } from "@/generated/prisma/enums";

export default async function LeadDetailedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const createdAt = new Date(lead.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const statusColors: Record<LeadStatus, string> = {
    OPEN: "text-blue-600",
    WON: "text-green-600",
    LOST: "text-red-600",
  };

  const stageColors: Record<LeadStages, string> = {
    NEW: "text-purple-600",
    CONTACTED: "text-yellow-600",
    QUALIFIED: "text-green-600",
    NEGOTIATING: "text-orange-600",
  };
  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <Badge
            variant="outline"
            className="text-green-600 border-green-300 bg-green-50 font-medium"
          >
            {lead.status}
          </Badge>
        </div>
        <Button variant="outline">Edit Lead</Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="overview">
          <div className="flex gap-6 mt-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Lead Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <LeadInfoRow label="Full Name" value={lead.name} />
                  <LeadInfoRow label="Email" value={lead.email} />
                  <LeadInfoRow label="Phone" value={lead.phoneNumber} />
                  <LeadInfoRow label="Created" value={createdAt} />
                </div>
              </CardContent>
            </Card>

            <div className="w-80 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Status &amp; Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select defaultValue={lead.status}>
                      <SelectTrigger className={statusColors[lead.status]}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LeadStatus.OPEN}>Open</SelectItem>
                        <SelectItem value={LeadStatus.WON}>Won</SelectItem>
                        <SelectItem value={LeadStatus.LOST}>Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stage</p>
                    <Select defaultValue={lead.stage}>
                      <SelectTrigger className={stageColors[lead.stage]}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LeadStages.NEW}>New</SelectItem>
                        <SelectItem value={LeadStages.CONTACTED}>
                          Contacted
                        </SelectItem>
                        <SelectItem value={LeadStages.QUALIFIED}>
                          Qualified
                        </SelectItem>
                        <SelectItem value={LeadStages.NEGOTIATING}>
                          Negotiating
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Assigned Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.assignTo ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {lead.assignTo.name?.charAt(0) ?? "S"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {lead.assignTo.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.assignTo.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No agent assigned
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <div className="mt-6 space-y-4">
            {lead.activities.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No activities yet.
              </p>
            ) : (
              lead.activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {activity.actor.name?.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {activity.actor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.actor.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="reminders">
          <p className="mt-6 text-sm text-muted-foreground">
            No reminders set.
          </p>
        </TabsContent>
        <TabsContent value="ai">
          <p className="mt-6 text-sm text-muted-foreground">
            AI features coming soon.
          </p>
        </TabsContent>
        <TabsContent value="files">
          <p className="mt-6 text-sm text-muted-foreground">
            No files uploaded.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeadInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
