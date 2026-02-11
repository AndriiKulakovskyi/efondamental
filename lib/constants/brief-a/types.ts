export type Percentile = string; // ex: ">99", "99", "84"

export type NormPoint = { t: number; p: Percentile };

export type NormMap = Record<number, NormPoint>;

export type BriefScaleKey =
  | "inhibition"
  | "flexibilite"
  | "controleEmotionnel"
  | "controleDeSoi"
  | "initiation"
  | "memoireDeTravail"
  | "planificationOrganisation"
  | "controleDeLaTache"
  | "organisationDuMateriel";

export type BriefIndexKey = "IRC" | "IM";

export type BriefCompositeKey = "CEG";

export type AgeBand =
  | "18-29"
  | "30-39"
  | "40-49"
  | "50-59"
  | "60-69"
  | "70-79"
  | "80-93";

export type BriefForm = "hetero";

export type BriefNormsForAgeBand = {
  ageBand: AgeBand;
  form: BriefForm;
  scales: Partial<Record<BriefScaleKey, NormMap>>;
  indices: Partial<Record<BriefIndexKey, NormMap>>;
  composite: Partial<Record<BriefCompositeKey, NormMap>>;
  ic90?: Partial<
    Record<BriefScaleKey | BriefIndexKey | BriefCompositeKey, number>
  >;
};

export type BriefNormsRegistry = Record<AgeBand, BriefNormsForAgeBand>;
