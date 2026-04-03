"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLogCall } from "@/app/services/activites/tanstack/useLogCall";
import { useRouter } from "next/navigation";

const OUTCOMES = [
  { value: "connected", label: "Connected" },
  { value: "no_answer", label: "No Answer" },
  { value: "voicemail", label: "Voicemail" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  page: number;
  pageSize: number;
};

export function CallLogDialog({
  open,
  onOpenChange,
  leadId,
  page,
  pageSize,
}: Props) {
  const [outcome, setOutcome] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const { mutate: logCall, isPending } = useLogCall(leadId, page, pageSize);
  const router = useRouter();
  const handleSubmit = () => {
    if (!outcome) return;
    const fullContent = `${outcome}${content.trim() ? ` • ${content.trim()}` : ""}`;
    logCall(fullContent, {
      onSuccess: () => {
        onOpenChange(false);
        setOutcome(null);
        setContent("");
        router.refresh();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Log a Call</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <div className="flex gap-2">
              {OUTCOMES.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOutcome(o.value)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    outcome === o.value
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="call-notes">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="call-notes"
              placeholder="What was discussed..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!outcome || isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? "Saving..." : "Log Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
