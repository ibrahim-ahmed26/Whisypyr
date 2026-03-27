"use client";

import { useState } from "react";
import { useLeads } from "@/app/services/lead/useLeads";
import { columns } from "@/components/Columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LeadsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: leads, isPending, isError } = useLeads(pageSize, page);
  if (isPending) return <p className="px-8 py-4">Loading...</p>;
  if (isError)
    return (
      <p className="px-8 py-4 text-red-400 font-bold">Something went wrong</p>
    );
  const totalPages = Math.ceil(leads.total / pageSize);
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      <DataTable columns={columns} data={leads.data} />
      <div className="flex items-center justify-end gap-2">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
