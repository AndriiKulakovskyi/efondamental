import { getUserContext } from "@/lib/rbac/middleware";
import { 
  getProfessionalStatistics, 
  getCenterStatistics,
  getVisitTypeStatistics,
  getDailyVisitActivity
} from "@/lib/services/statistics.service";
import { getPatientDemographics } from "@/lib/services/patient.service";
import { PathologyType, PATHOLOGY_NAMES, VISIT_TYPE_NAMES } from "@/lib/types/enums";
import { redirect } from "next/navigation";
import { StatisticsClient } from "./page-client";

export default async function StatisticsPage({
  params,
}: {
  params: Promise<{ pathology: string }>;
}) {
  const { pathology } = await params;
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const pathologyType = pathology as PathologyType;

  const [professionalStats, visitTypeStats, centerStats, demographics, dailyActivity] = await Promise.all([
    getProfessionalStatistics(context.user.id, context.profile.center_id, pathologyType),
    getVisitTypeStatistics(context.profile.center_id, context.user.id),
    getCenterStatistics(context.profile.center_id),
    getPatientDemographics(context.profile.center_id, pathologyType),
    getDailyVisitActivity(context.profile.center_id, context.user.id),
  ]);

  // Add visit type names to the stats
  const visitTypeStatsWithNames = visitTypeStats.map(stat => ({
    ...stat,
    visitTypeName: VISIT_TYPE_NAMES[stat.visitType as keyof typeof VISIT_TYPE_NAMES] || stat.visitType,
  }));

  return (
    <StatisticsClient
      pathologyName={PATHOLOGY_NAMES[pathologyType]}
      professionalStats={professionalStats}
      visitTypeStats={visitTypeStatsWithNames}
      centerStats={centerStats}
      demographics={demographics}
      dailyActivity={dailyActivity}
    />
  );
}


