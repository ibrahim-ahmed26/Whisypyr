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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAddNote } from "@/app/services/activites/tanstack/useAddNote";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  page: number;
  pageSize: number;
};

export function NoteDialog({
  open,
  onOpenChange,
  leadId,
  page,
  pageSize,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: addNote, isPending } = useAddNote(leadId, page, pageSize);
  const router = useRouter();
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    addNote(`${title.trim()}\n${content.trim()}`, {
      onSuccess: () => {
        onOpenChange(false);
        setTitle("");
        setContent("");
        router.refresh();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Add a Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note-content">Note</Label>
            <Textarea
              id="note-content"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
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
            disabled={!title.trim() || !content.trim() || isPending}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isPending ? "Saving..." : "Add Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
