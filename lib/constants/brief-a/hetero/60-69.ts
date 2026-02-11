import { BriefNormsForAgeBand } from "../types";

export const BRIEF_NORMS_HETERO_60_69: BriefNormsForAgeBand = {
  ageBand: "60-69",
  form: "hetero",
  scales: {
    controleEmotionnel: {},
    flexibilite: {},
    controleDeSoi: {},
    planificationOrganisation: {},
    inhibition: {},
    initiation: {},
    memoireDeTravail: {},
    controleDeLaTache: {},
    organisationDuMateriel: {},
  },
  indices: {
    IRC: {},
    IM: {},
  },
  composite: {
    CEG: {},
  },
  ic90: {},
};

// B-13 (60–69) — Bloc 1 : scores bruts 30 → 20
Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleEmotionnel!, {
  30: { t: 81, p: ">99" },
  29: { t: 79, p: ">99" },
  28: { t: 77, p: "99" },
  27: { t: 75, p: "98" },
  26: { t: 72, p: "98" },
  25: { t: 70, p: "96" },
  24: { t: 68, p: "94" },
  23: { t: 66, p: "93" },
  22: { t: 64, p: "92" },
  21: { t: 61, p: "90" },
  20: { t: 59, p: "85" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.planificationOrganisation!, {
  30: { t: 94, p: ">99" },
  29: { t: 92, p: ">99" },
  28: { t: 89, p: ">99" },
  27: { t: 86, p: ">99" },
  26: { t: 84, p: ">99" },
  25: { t: 81, p: ">99" },
  24: { t: 78, p: "99" },
  23: { t: 76, p: "98" },
  22: { t: 73, p: "96" },
  21: { t: 70, p: "94" },
  20: { t: 68, p: "93" },
});

// À partir de 24
Object.assign(BRIEF_NORMS_HETERO_60_69.scales.inhibition!, {
  24: { t: 102, p: ">99" },
  23: { t: 98, p: ">99" },
  22: { t: 94, p: ">99" },
  21: { t: 90, p: ">99" },
  20: { t: 86, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.initiation!, {
  24: { t: 93, p: ">99" },
  23: { t: 89, p: ">99" },
  22: { t: 86, p: ">99" },
  21: { t: 83, p: ">99" },
  20: { t: 79, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.memoireDeTravail!, {
  24: { t: 95, p: ">99" },
  23: { t: 92, p: ">99" },
  22: { t: 88, p: ">99" },
  21: { t: 85, p: ">99" },
  20: { t: 81, p: "99" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.organisationDuMateriel!, {
  24: { t: 86, p: ">99" },
  23: { t: 83, p: ">99" },
  22: { t: 81, p: ">99" },
  21: { t: 78, p: "99" },
  20: { t: 75, p: "98" },
});

// B-13 (60–69) — Bloc 2 : scores bruts 19 → 10
Object.assign(BRIEF_NORMS_HETERO_60_69.scales.inhibition!, {
  19: { t: 82, p: "99" },
  18: { t: 78, p: "99" },
  17: { t: 74, p: "99" },
  16: { t: 70, p: "97" },
  15: { t: 66, p: "95" },
  14: { t: 62, p: "91" },
  13: { t: 58, p: "83" },
  12: { t: 54, p: "72" },
  11: { t: 51, p: "65" },
  10: { t: 47, p: "58" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.flexibilite!, {
  18: { t: 85, p: ">99" },
  17: { t: 81, p: ">99" },
  16: { t: 77, p: ">99" },
  15: { t: 73, p: ">99" },
  14: { t: 69, p: "97" },
  13: { t: 65, p: "96" },
  12: { t: 61, p: "89" },
  11: { t: 57, p: "76" },
  10: { t: 53, p: "67" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleEmotionnel!, {
  19: { t: 57, p: "82" },
  18: { t: 55, p: "75" },
  17: { t: 53, p: "66" },
  16: { t: 51, p: "57" },
  15: { t: 48, p: "50" },
  14: { t: 46, p: "42" },
  13: { t: 44, p: "36" },
  12: { t: 42, p: "31" },
  11: { t: 40, p: "23" },
  10: { t: 37, p: "15" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleDeSoi!, {
  18: { t: 93, p: ">99" },
  17: { t: 89, p: ">99" },
  16: { t: 84, p: ">99" },
  15: { t: 80, p: ">99" },
  14: { t: 75, p: ">99" },
  13: { t: 71, p: "98" },
  12: { t: 66, p: "95" },
  11: { t: 62, p: "87" },
  10: { t: 57, p: "81" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.initiation!, {
  19: { t: 76, p: ">99" },
  18: { t: 73, p: "98" },
  17: { t: 69, p: "95" },
  16: { t: 66, p: "92" },
  15: { t: 63, p: "89" },
  14: { t: 59, p: "82" },
  13: { t: 56, p: "77" },
  12: { t: 53, p: "74" },
  11: { t: 49, p: "63" },
  10: { t: 46, p: "50" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.memoireDeTravail!, {
  19: { t: 78, p: "99" },
  18: { t: 74, p: "99" },
  17: { t: 71, p: "98" },
  16: { t: 67, p: "94" },
  15: { t: 64, p: "90" },
  14: { t: 60, p: "86" },
  13: { t: 57, p: "80" },
  12: { t: 53, p: "71" },
  11: { t: 50, p: "63" },
  10: { t: 46, p: "51" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.planificationOrganisation!, {
  19: { t: 65, p: "90" },
  18: { t: 62, p: "89" },
  17: { t: 59, p: "87" },
  16: { t: 57, p: "80" },
  15: { t: 54, p: "75" },
  14: { t: 51, p: "69" },
  13: { t: 49, p: "62" },
  12: { t: 46, p: "54" },
  11: { t: 43, p: "44" },
  10: { t: 41, p: "24" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleDeLaTache!, {
  18: { t: 96, p: ">99" },
  17: { t: 92, p: ">99" },
  16: { t: 87, p: ">99" },
  15: { t: 82, p: ">99" },
  14: { t: 77, p: "99" },
  13: { t: 72, p: "98" },
  12: { t: 67, p: "94" },
  11: { t: 62, p: "92" },
  10: { t: 58, p: "80" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.organisationDuMateriel!, {
  19: { t: 72, p: "98" },
  18: { t: 69, p: "96" },
  17: { t: 67, p: "91" },
  16: { t: 64, p: "89" },
  15: { t: 61, p: "84" },
  14: { t: 58, p: "80" },
  13: { t: 55, p: "76" },
  12: { t: 52, p: "71" },
  11: { t: 50, p: "68" },
  10: { t: 47, p: "62" },
});

// B-13 (60–69) — Bloc 3 : scores bruts 9 → 6
Object.assign(BRIEF_NORMS_HETERO_60_69.scales.inhibition!, {
  9: { t: 43, p: "37" },
  8: { t: 39, p: "17" },
  7: { t: 40, p: "20" },
  6: { t: 36, p: "12" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.flexibilite!, {
  9: { t: 49, p: "55" },
  8: { t: 45, p: "43" },
  7: { t: 40, p: "30" },
  6: { t: 36, p: "12" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleEmotionnel!, {
  9: { t: 49, p: "55" },
  8: { t: 45, p: "43" },
  7: { t: 40, p: "30" },
  6: { t: 36, p: "12" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleDeSoi!, {
  9: { t: 52, p: "59" },
  8: { t: 48, p: "57" },
  7: { t: 43, p: "37" },
  6: { t: 38, p: "21" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.initiation!, {
  9: { t: 50, p: "63" },
  8: { t: 43, p: "41" },
  7: { t: 39, p: "17" },
  6: { t: 39, p: "24" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.memoireDeTravail!, {
  9: { t: 51, p: "51" },
  8: { t: 43, p: "39" },
  7: { t: 39, p: "17" },
  6: { t: 38, p: "17" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.planificationOrganisation!, {
  9: { t: 41, p: "24" },
  8: { t: 43, p: "39" },
  7: { t: 39, p: "17" },
  6: { t: 38, p: "17" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.controleDeLaTache!, {
  9: { t: 53, p: "75" },
  8: { t: 48, p: "59" },
  7: { t: 43, p: "40" },
  6: { t: 38, p: "20" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.scales.organisationDuMateriel!, {
  9: { t: 44, p: "49" },
  8: { t: 41, p: "27" },
  7: { t: 43, p: "42" },
  6: { t: 38, p: "14" },
});

// IC 90 % — B-13 (60–69)
Object.assign(BRIEF_NORMS_HETERO_60_69.ic90!, {
  inhibition: 10,
  flexibilite: 7,
  controleEmotionnel: 5,
  controleDeSoi: 8,
  initiation: 7,
  memoireDeTravail: 7,
  planificationOrganisation: 6,
  controleDeLaTache: 9,
  organisationDuMateriel: 5,
});

// B-14 (60–69) — Bloc 1 : IRC & IM (120 → 110)
Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IRC!, {
  120: { t: 100, p: ">99" },
  119: { t: 99, p: ">99" },
  118: { t: 98, p: ">99" },
  117: { t: 97, p: ">99" },
  116: { t: 97, p: ">99" },
  115: { t: 96, p: ">99" },
  114: { t: 95, p: ">99" },
  113: { t: 94, p: ">99" },
  112: { t: 94, p: ">99" },
  111: { t: 93, p: ">99" },
  110: { t: 92, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IM!, {
  120: { t: 76, p: "98" },
  119: { t: 75, p: "98" },
  118: { t: 75, p: "98" },
  117: { t: 74, p: "98" },
  116: { t: 73, p: "97" },
  115: { t: 72, p: "97" },
  114: { t: 71, p: "96" },
  113: { t: 70, p: "95" },
  112: { t: 70, p: "94" },
  111: { t: 69, p: "93" },
  110: { t: 68, p: "92" },
});

// B-14 (60–69) — Bloc 2 : IRC & IM (109 → 100)
Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IRC!, {
  109: { t: 91, p: ">99" },
  108: { t: 90, p: ">99" },
  107: { t: 90, p: ">99" },
  106: { t: 89, p: ">99" },
  105: { t: 88, p: ">99" },
  104: { t: 87, p: ">99" },
  103: { t: 87, p: ">99" },
  102: { t: 86, p: ">99" },
  101: { t: 85, p: ">99" },
  100: { t: 84, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IM!, {
  109: { t: 67, p: "92" },
  108: { t: 67, p: "92" },
  107: { t: 66, p: "92" },
  106: { t: 66, p: "92" },
  105: { t: 65, p: "90" },
  104: { t: 64, p: "89" },
  103: { t: 64, p: "89" },
  102: { t: 63, p: "88" },
  101: { t: 62, p: "88" },
  100: { t: 61, p: "87" },
});

// B-14 (60–69) — Bloc 3 : IRC & IM (99 → 90)
Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IRC!, {
  99: { t: 84, p: ">99" },
  98: { t: 83, p: ">99" },
  97: { t: 82, p: ">99" },
  96: { t: 81, p: ">99" },
  95: { t: 80, p: "99" },
  94: { t: 80, p: "99" },
  93: { t: 79, p: "99" },
  92: { t: 78, p: "99" },
  91: { t: 77, p: "98" },
  90: { t: 77, p: "98" },
});

Object.assign(BRIEF_NORMS_HETERO_60_69.indices.IM!, {
  99: { t: 60, p: "86" },
  98: { t: 60, p: "82" },
  97: { t: 59, p: "81" },
  96: { t: 58, p: "79" },
  95: { t: 57, p: "77" },
  94: { t: 56, p: "76" },
  93: { t: 55, p: "75" },
  92: { t: 54, p: "74" },
  91: { t: 54, p: "71" },
  90: { t: 53, p: "69" },
});

// IC 90 % — B-14 (60–69)
Object.assign(BRIEF_NORMS_HETERO_60_69.ic90!, {
  IRC: 4,
  IM: 4,
});

// B-15 (60–69) — Bloc 1 : CEG 210 → 182
Object.assign(BRIEF_NORMS_HETERO_60_69.composite.CEG!, {
  210: { t: 104, p: ">99" },
  209: { t: 103, p: ">99" },
  208: { t: 103, p: ">99" },
  207: { t: 102, p: ">99" },
  206: { t: 102, p: ">99" },
  205: { t: 101, p: ">99" },
  204: { t: 101, p: ">99" },
  203: { t: 100, p: ">99" },
  202: { t: 100, p: ">99" },
  201: { t: 99, p: ">99" },
  200: { t: 99, p: ">99" },
  199: { t: 98, p: ">99" },
  198: { t: 98, p: ">99" },
  197: { t: 97, p: ">99" },
  196: { t: 97, p: ">99" },
  195: { t: 96, p: ">99" },
  194: { t: 96, p: ">99" },
  193: { t: 95, p: ">99" },
  192: { t: 95, p: ">99" },
  191: { t: 94, p: ">99" },
  190: { t: 94, p: ">99" },
  189: { t: 93, p: ">99" },
  188: { t: 93, p: ">99" },
  187: { t: 92, p: ">99" },
  186: { t: 92, p: ">99" },
  185: { t: 91, p: ">99" },
  184: { t: 91, p: ">99" },
  183: { t: 90, p: ">99" },
  182: { t: 90, p: ">99" },
});

// B-15 (60–69) — Bloc 2 : CEG 181 → 153
Object.assign(BRIEF_NORMS_HETERO_60_69.composite.CEG!, {
  181: { t: 89, p: ">99" },
  180: { t: 89, p: ">99" },
  179: { t: 88, p: ">99" },
  178: { t: 88, p: ">99" },
  177: { t: 87, p: ">99" },
  176: { t: 87, p: ">99" },
  175: { t: 86, p: ">99" },
  174: { t: 86, p: ">99" },
  173: { t: 85, p: ">99" },
  172: { t: 85, p: ">99" },
  171: { t: 84, p: ">99" },
  170: { t: 84, p: ">99" },
  169: { t: 83, p: ">99" },
  168: { t: 83, p: ">99" },
  167: { t: 82, p: ">99" },
  166: { t: 82, p: ">99" },
  165: { t: 81, p: ">99" },
  164: { t: 81, p: ">99" },
  163: { t: 80, p: ">99" },
  162: { t: 80, p: ">99" },
  161: { t: 79, p: ">99" },
  160: { t: 79, p: ">99" },
  159: { t: 78, p: ">99" },
  158: { t: 78, p: ">99" },
  157: { t: 77, p: ">99" },
  156: { t: 77, p: ">99" },
  155: { t: 76, p: "99" },
  154: { t: 76, p: "99" },
  153: { t: 75, p: "99" },
});

// B-15 (60–69) — Bloc 3 : CEG 152 → 124
Object.assign(BRIEF_NORMS_HETERO_60_69.composite.CEG!, {
  152: { t: 75, p: "99" },
  151: { t: 74, p: "99" },
  150: { t: 74, p: "99" },
  149: { t: 73, p: "99" },
  148: { t: 73, p: "99" },
  147: { t: 72, p: "98" },
  146: { t: 72, p: "98" },
  145: { t: 71, p: "98" },
  144: { t: 71, p: "98" },
  143: { t: 70, p: "97" },
  142: { t: 70, p: "97" },
  141: { t: 69, p: "97" },
  140: { t: 69, p: "96" },
  139: { t: 68, p: "96" },
  138: { t: 68, p: "96" },
  137: { t: 67, p: "95" },
  136: { t: 67, p: "95" },
  135: { t: 66, p: "95" },
  134: { t: 66, p: "94" },
  133: { t: 65, p: "94" },
  132: { t: 65, p: "94" },
  131: { t: 64, p: "93" },
  130: { t: 64, p: "93" },
  129: { t: 63, p: "92" },
  128: { t: 63, p: "92" },
  127: { t: 62, p: "91" },
  126: { t: 62, p: "91" },
  125: { t: 61, p: "90" },
  124: { t: 61, p: "90" },
});

// B-15 (60–69) — Bloc 4 : CEG 123 → 95
Object.assign(BRIEF_NORMS_HETERO_60_69.composite.CEG!, {
  123: { t: 60, p: "88" },
  122: { t: 60, p: "86" },
  121: { t: 59, p: "84" },
  120: { t: 59, p: "83" },
  119: { t: 58, p: "82" },
  118: { t: 58, p: "81" },
  117: { t: 57, p: "80" },
  116: { t: 57, p: "79" },
  115: { t: 56, p: "77" },
  114: { t: 56, p: "76" },
  113: { t: 55, p: "75" },
  112: { t: 55, p: "74" },
  111: { t: 54, p: "72" },
  110: { t: 54, p: "71" },
  109: { t: 53, p: "69" },
  108: { t: 53, p: "68" },
  107: { t: 52, p: "66" },
  106: { t: 52, p: "65" },
  105: { t: 51, p: "63" },
  104: { t: 51, p: "61" },
  103: { t: 50, p: "59" },
  102: { t: 50, p: "57" },
  101: { t: 49, p: "55" },
  100: { t: 49, p: "53" },
  99: { t: 48, p: "51" },
  98: { t: 48, p: "49" },
  97: { t: 47, p: "47" },
  96: { t: 47, p: "45" },
  95: { t: 46, p: "43" },
});

// B-15 (60–69) — Bloc 5 : CEG 94 → 70
Object.assign(BRIEF_NORMS_HETERO_60_69.composite.CEG!, {
  94: { t: 46, p: "41" },
  93: { t: 46, p: "39" },
  92: { t: 45, p: "37" },
  91: { t: 45, p: "35" },
  90: { t: 44, p: "33" },
  89: { t: 44, p: "31" },
  88: { t: 43, p: "29" },
  87: { t: 43, p: "27" },
  86: { t: 42, p: "25" },
  85: { t: 42, p: "23" },
  84: { t: 41, p: "21" },
  83: { t: 41, p: "20" },
  82: { t: 40, p: "18" },
  81: { t: 40, p: "16" },
  80: { t: 39, p: "14" },
  79: { t: 39, p: "12" },
  78: { t: 38, p: "11" },
  77: { t: 38, p: "10" },
  76: { t: 37, p: "9" },
  75: { t: 37, p: "8" },
  74: { t: 36, p: "7" },
  73: { t: 36, p: "6" },
  72: { t: 35, p: "5" },
  71: { t: 35, p: "4" },
  70: { t: 34, p: "3" },
});

// IC 90 % — B-15 (60–69)
Object.assign(BRIEF_NORMS_HETERO_60_69.ic90!, {
  CEG: 4,
});
