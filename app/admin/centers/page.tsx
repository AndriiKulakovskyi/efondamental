import { getAllCenters, getCenterPathologies } from "@/lib/services/center.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PathologyType } from "@/lib/types/enums";
import { CentersListTable } from "./components/centers-list-table";

type CenterWithPathologies = {
  id: string;
  name: string;
  code: string;
  city: string | null;
  active: boolean;
  pathologies: PathologyType[];
};

export default async function CentersPage() {
  const centers = await getAllCenters();

  const centersWithPathologies: CenterWithPathologies[] = await Promise.all(
    centers.map(async (center) => {
      const pathologies = await getCenterPathologies(center.id);
      return {
        ...center,
        pathologies: pathologies.map((p) => p.type as PathologyType),
      };
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Centers</h2>
          <p className="text-slate-600">Manage Expert Centers across the platform</p>
        </div>
        <Link href="/admin/centers/new">
          <Button>Create Center</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <CentersListTable data={centersWithPathologies} />
      </div>
    </div>
  );
}

