import { Lead } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <span
          className="cursor-pointer hover:underline font-medium"
          onClick={() => router.push(`/leads/${row.original.id}`)}
        >
          {row.getValue("name")}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "PhoneNumber",
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("stage") as string;
      const styles: Record<string, string> = {
        NEW: "bg-gray-100 text-gray-700",
        CONTACTED: "bg-purple-100 text-purple-700",
        QUALIFIED: "bg-blue-100 text-blue-700",
        NEGOTIATING: "bg-yellow-100 text-yellow-700",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${styles[stage]}`}
        >
          {stage}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const styles: Record<string, string> = {
        OPEN: "bg-green-100 text-green-700",
        WON: "bg-blue-100 text-blue-700",
        LOST: "bg-red-100 text-red-700",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
];
