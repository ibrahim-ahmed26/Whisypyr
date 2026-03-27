import Dashboard from "../dashboard/page";
import { LeadsTable } from "./leads-page";

export default function Leads() {
  return (
    <Dashboard>
      <h1 className="px-8 font-bold text-3xl">My Leads</h1>
      <LeadsTable />
    </Dashboard>
  );
}
