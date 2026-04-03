"use client";
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
import { Prisma } from "@/generated/prisma/browser";
import { LeadStages, LeadStatus } from "@/generated/prisma/enums";
import { Input } from "./ui/input";
import { useUpdateLeads } from "@/app/services/lead/tanstack/useUpdateLeads";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteLeads } from "@/app/services/lead/tanstack/useDeleteLeads";
import { Timeline } from "./timeline";
type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    activities: {
      include: {
        actor: true;
      };
    };
    assignTo: true;
  };
}>;
export default function LeadDetailedPage({
  lead,
}: {
  lead: LeadWithRelations;
}) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateLeads();
  const { mutate: deleteMutate, isPending: isDeletePending } = useDeleteLeads();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);
  const [phone, setPhone] = useState(lead.phoneNumber);
  function handleStatusChange(status: LeadStatus) {
    mutate(
      { id: lead.id, data: { status } },
      { onSuccess: () => router.refresh() },
    );
  }
  function handleDelete() {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteMutate(lead.id);
    }
  }
  function handleStageChange(stage: LeadStages) {
    mutate(
      { id: lead.id, data: { stage } },
      { onSuccess: () => router.refresh() },
    );
  }
  function handleSave() {
    mutate(
      { id: lead.id, data: { name, email, phoneNumber: phone } },
      {
        onSuccess: () => {
          setIsEditing(false);
          router.refresh();
        },
      },
    );
  }
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
  const statusBadgeColors: Record<LeadStatus, string> = {
    OPEN: "text-blue-600 border-blue-300 bg-blue-50",
    WON: "text-green-600 border-green-300 bg-green-50",
    LOST: "text-red-600 border-red-300 bg-red-50",
  };
  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <Badge variant="outline" className={statusBadgeColors[lead.status]}>
            {lead.status}
          </Badge>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              onClick={handleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            Edit Lead
          </Button>
        )}
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
                {isEditing ? (
                  <div className="space-y-4">
                    <LeadEditRow
                      label="Full Name"
                      value={name}
                      onChange={setName}
                    />
                    <LeadEditRow
                      label="Email"
                      value={email}
                      onChange={setEmail}
                    />
                    <LeadEditRow
                      label="Phone"
                      value={phone}
                      onChange={setPhone}
                    />
                    <LeadInfoRow label="Created" value={createdAt} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <LeadInfoRow label="Full Name" value={lead.name} />
                    <LeadInfoRow label="Email" value={lead.email} />
                    <LeadInfoRow label="Phone" value={lead.phoneNumber} />
                    <LeadInfoRow label="Created" value={createdAt} />
                  </div>
                )}
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
                    <Select
                      defaultValue={lead.status}
                      onValueChange={handleStatusChange}
                    >
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
                    <Select
                      defaultValue={lead.stage}
                      onValueChange={handleStageChange}
                    >
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
          {lead.activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activities yet.</p>
          ) : (
            <Timeline leadId={lead.id} />
          )}
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
function LeadEditRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1 gap-4">
      <span className="text-sm text-muted-foreground w-24">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}
