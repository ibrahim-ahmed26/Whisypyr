"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadsTable } from "./leads-page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCreateLeads } from "@/app/services/lead/tanstack/useCreateLeads";

export default function Leads() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateLeads(() => setOpen(false));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    mutate({
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phoneNumber: (form.elements.namedItem("phoneNumber") as HTMLInputElement)
        .value,
      note: (form.elements.namedItem("note") as HTMLTextAreaElement).value,
    });
  }

  return (
    <div>
      <div className="flex px-4 justify-between items-center">
        <h1 className="px-8 font-bold text-3xl">Leads</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white font-bold cursor-pointer hover:bg-blue-300"
        >
          + Create Lead
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Lead</DialogTitle>
            <DialogDescription>
              Fill in the lead details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <Input name="name" placeholder="Name" required />
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="phoneNumber" placeholder="Phone Number" required />
            <textarea
              name="note"
              placeholder="Add Notes..."
              className="rounded-xl px-2 mt-2 py-1"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-500 text-white"
            >
              {isPending ? "Creating..." : "Create Lead"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <LeadsTable />
    </div>
  );
}
