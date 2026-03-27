"use client";

import { useState } from "react";
import { useLeads } from "@/app/services/lead/useLeads";
import { columns } from "@/components/Columns";
import { DataTable } from "@/components/data-table";

export function LeadsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: leads, isPending, isError } = useLeads(pageSize, page);
  console.log(leads);
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;
  console.log(leads);
  return <DataTable columns={columns} data={leads} />;
}
