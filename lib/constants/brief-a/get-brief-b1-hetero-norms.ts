import { BRIEF_NORMS_HETERO } from "./hetero";
import { AgeBand, BriefNormsForAgeBand } from "./types";

export function getBriefB1HeteroNormsByAgeBand(
  ageBand: AgeBand,
): BriefNormsForAgeBand {
  return BRIEF_NORMS_HETERO[ageBand];
}
