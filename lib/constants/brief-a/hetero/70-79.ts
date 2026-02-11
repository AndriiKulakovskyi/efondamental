import { BriefNormsForAgeBand } from "../types";

export const BRIEF_NORMS_HETERO_70_79: BriefNormsForAgeBand = {
  ageBand: "70-79",
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

// B-16 (70–79) — Bloc 1 : scores bruts 30 → 20
Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleEmotionnel!, {
  30: { t: 83, p: ">99" },
  29: { t: 80, p: ">99" },
  28: { t: 78, p: "99" },
  27: { t: 76, p: "98" },
  26: { t: 74, p: "98" },
  25: { t: 71, p: "98" },
  24: { t: 69, p: "97" },
  23: { t: 67, p: "97" },
  22: { t: 65, p: "94" },
  21: { t: 63, p: "90" },
  20: { t: 60, p: "88" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.planificationOrganisation!, {
  30: { t: 107, p: ">99" },
  29: { t: 104, p: ">99" },
  28: { t: 101, p: ">99" },
  27: { t: 97, p: ">99" },
  26: { t: 94, p: ">99" },
  25: { t: 91, p: ">99" },
  24: { t: 87, p: ">99" },
  23: { t: 84, p: "98" },
  22: { t: 81, p: "98" },
  21: { t: 77, p: "98" },
  20: { t: 74, p: "97" },
});

// À partir de 24
Object.assign(BRIEF_NORMS_HETERO_70_79.scales.inhibition!, {
  24: { t: 101, p: ">99" },
  23: { t: 97, p: ">99" },
  22: { t: 93, p: ">99" },
  21: { t: 90, p: ">99" },
  20: { t: 86, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.initiation!, {
  24: { t: 105, p: ">99" },
  23: { t: 100, p: ">99" },
  22: { t: 96, p: ">99" },
  21: { t: 92, p: "99" },
  20: { t: 88, p: "99" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.memoireDeTravail!, {
  24: { t: 99, p: ">99" },
  23: { t: 95, p: ">99" },
  22: { t: 92, p: ">99" },
  21: { t: 88, p: ">99" },
  20: { t: 84, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.organisationDuMateriel!, {
  24: { t: 92, p: ">99" },
  23: { t: 89, p: ">99" },
  22: { t: 86, p: ">99" },
  21: { t: 82, p: ">99" },
  20: { t: 79, p: ">99" },
});

// B-16 (70–79) — Bloc 2 : scores bruts 19 → 10
Object.assign(BRIEF_NORMS_HETERO_70_79.scales.inhibition!, {
  19: { t: 82, p: ">99" },
  18: { t: 78, p: "99" },
  17: { t: 74, p: "98" },
  16: { t: 70, p: "96" },
  15: { t: 66, p: "95" },
  14: { t: 63, p: "91" },
  13: { t: 59, p: "82" },
  12: { t: 55, p: "78" },
  11: { t: 51, p: "66" },
  10: { t: 47, p: "52" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.flexibilite!, {
  18: { t: 84, p: ">99" },
  17: { t: 80, p: ">99" },
  16: { t: 77, p: "99" },
  15: { t: 73, p: "98" },
  14: { t: 69, p: "97" },
  13: { t: 65, p: "94" },
  12: { t: 61, p: "91" },
  11: { t: 57, p: "83" },
  10: { t: 53, p: "68" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleEmotionnel!, {
  19: { t: 58, p: "82" },
  18: { t: 56, p: "76" },
  17: { t: 54, p: "65" },
  16: { t: 51, p: "59" },
  15: { t: 49, p: "51" },
  14: { t: 47, p: "44" },
  13: { t: 45, p: "42" },
  12: { t: 42, p: "38" },
  11: { t: 40, p: "29" },
  10: { t: 38, p: "15" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleDeSoi!, {
  18: { t: 94, p: ">99" },
  17: { t: 89, p: ">99" },
  16: { t: 85, p: ">99" },
  15: { t: 80, p: "99" },
  14: { t: 75, p: "99" },
  13: { t: 70, p: "97" },
  12: { t: 66, p: "96" },
  11: { t: 61, p: "94" },
  10: { t: 56, p: "80" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.initiation!, {
  19: { t: 84, p: "99" },
  18: { t: 80, p: "99" },
  17: { t: 76, p: "97" },
  16: { t: 72, p: "97" },
  15: { t: 68, p: "96" },
  14: { t: 64, p: "93" },
  13: { t: 60, p: "90" },
  12: { t: 56, p: "82" },
  11: { t: 52, p: "75" },
  10: { t: 48, p: "63" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.memoireDeTravail!, {
  19: { t: 80, p: "99" },
  18: { t: 76, p: "99" },
  17: { t: 73, p: "97" },
  16: { t: 69, p: "94" },
  15: { t: 65, p: "93" },
  14: { t: 61, p: "92" },
  13: { t: 57, p: "83" },
  12: { t: 54, p: "72" },
  11: { t: 50, p: "64" },
  10: { t: 46, p: "49" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.planificationOrganisation!, {
  19: { t: 71, p: "96" },
  18: { t: 67, p: "96" },
  17: { t: 64, p: "94" },
  16: { t: 61, p: "89" },
  15: { t: 57, p: "83" },
  14: { t: 54, p: "74" },
  13: { t: 51, p: "68" },
  12: { t: 47, p: "58" },
  11: { t: 44, p: "44" },
  10: { t: 41, p: "27" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleDeLaTache!, {
  18: { t: 102, p: ">99" },
  17: { t: 97, p: ">99" },
  16: { t: 91, p: ">99" },
  15: { t: 86, p: ">99" },
  14: { t: 80, p: ">99" },
  13: { t: 75, p: ">99" },
  12: { t: 69, p: "97" },
  11: { t: 64, p: "94" },
  10: { t: 58, p: "84" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.organisationDuMateriel!, {
  19: { t: 76, p: "99" },
  18: { t: 73, p: "96" },
  17: { t: 70, p: "94" },
  16: { t: 66, p: "93" },
  15: { t: 63, p: "90" },
  14: { t: 60, p: "84" },
  13: { t: 57, p: "80" },
  12: { t: 54, p: "75" },
  11: { t: 50, p: "68" },
  10: { t: 47, p: "62" },
});

// B-16 (70–79) — Bloc 3 : scores bruts 9 → 6
Object.assign(BRIEF_NORMS_HETERO_70_79.scales.inhibition!, {
  9: { t: 43, p: "43" },
  8: { t: 39, p: "23" },
  7: { t: 42, p: "32" },
  6: { t: 38, p: "19" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.flexibilite!, {
  9: { t: 49, p: "55" },
  8: { t: 46, p: "44" },
  7: { t: 42, p: "37" },
  6: { t: 38, p: "19" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleEmotionnel!, {
  9: { t: 49, p: "55" },
  8: { t: 46, p: "44" },
  7: { t: 42, p: "37" },
  6: { t: 38, p: "19" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleDeSoi!, {
  9: { t: 51, p: "63" },
  8: { t: 47, p: "49" },
  7: { t: 42, p: "34" },
  6: { t: 37, p: "19" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.initiation!, {
  9: { t: 48, p: "63" },
  8: { t: 44, p: "41" },
  7: { t: 40, p: "22" },
  6: { t: 37, p: "19" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.memoireDeTravail!, {
  9: { t: 42, p: "49" },
  8: { t: 43, p: "39" },
  7: { t: 41, p: "27" },
  6: { t: 38, p: "18" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.planificationOrganisation!, {
  9: { t: 41, p: "27" },
  8: { t: 38, p: "18" },
  7: { t: 42, p: "34" },
  6: { t: 38, p: "21" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.controleDeLaTache!, {
  9: { t: 52, p: "71" },
  8: { t: 47, p: "51" },
  7: { t: 41, p: "31" },
  6: { t: 36, p: "13" },
});

Object.assign(BRIEF_NORMS_HETERO_70_79.scales.organisationDuMateriel!, {
  9: { t: 44, p: "45" },
  8: { t: 41, p: "28" },
  7: { t: 41, p: "31" },
  6: { t: 36, p: "13" },
});

// IC 90 % — B-16 (70–79)
Object.assign(BRIEF_NORMS_HETERO_70_79.ic90!, {
  inhibition: 9,
  flexibilite: 7,
  controleEmotionnel: 5,
  controleDeSoi: 9,
  initiation: 9,
  memoireDeTravail: 8,
  planificationOrganisation: 7,
  controleDeLaTache: 10,
  organisationDuMateriel: 6,
});

// B-17 (70–79) — Bloc 1 : IRC (120 → 110)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IRC!, {
  120: { t: 112, p: ">99" },
  119: { t: 112, p: ">99" },
  118: { t: 111, p: ">99" },
  117: { t: 111, p: ">99" },
  116: { t: 110, p: ">99" },
  115: { t: 109, p: ">99" },
  114: { t: 107, p: ">99" },
  113: { t: 106, p: ">99" },
  112: { t: 105, p: ">99" },
  111: { t: 104, p: ">99" },
  110: { t: 103, p: ">99" },
});

// B-17 (70–79) — Bloc 1 : IM (120 → 110)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IM!, {
  120: { t: 83, p: "99" },
  119: { t: 83, p: "99" },
  118: { t: 82, p: "98" },
  117: { t: 81, p: "98" },
  116: { t: 81, p: "98" },
  115: { t: 80, p: "98" },
  114: { t: 79, p: "98" },
  113: { t: 78, p: "98" },
  112: { t: 77, p: "98" },
  111: { t: 76, p: "97" },
  110: { t: 75, p: "97" },
});

// B-17 (70–79) — Bloc 2 : IRC (109 → 100)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IRC!, {
  109: { t: 102, p: ">99" },
  108: { t: 101, p: ">99" },
  107: { t: 100, p: ">99" },
  106: { t: 99, p: ">99" },
  105: { t: 98, p: ">99" },
  104: { t: 97, p: ">99" },
  103: { t: 96, p: ">99" },
  102: { t: 95, p: ">99" },
  101: { t: 95, p: ">99" },
  100: { t: 94, p: ">99" },
});

// B-17 (70–79) — Bloc 2 : IM (109 → 100)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IM!, {
  109: { t: 74, p: "97" },
  108: { t: 73, p: "97" },
  107: { t: 72, p: "97" },
  106: { t: 71, p: "96" },
  105: { t: 70, p: "96" },
  104: { t: 69, p: "95" },
  103: { t: 68, p: "94" },
  102: { t: 67, p: "94" },
  101: { t: 66, p: "94" },
  100: { t: 65, p: "94" },
});

// B-17 (70–79) — Bloc 3 : IRC (99 → 90)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IRC!, {
  99: { t: 94, p: ">99" },
  98: { t: 93, p: ">99" },
  97: { t: 92, p: ">99" },
  96: { t: 91, p: ">99" },
  95: { t: 90, p: ">99" },
  94: { t: 89, p: "99" },
  93: { t: 88, p: "99" },
  92: { t: 87, p: "99" },
  91: { t: 86, p: "99" },
  90: { t: 85, p: "99" },
});

// B-17 (70–79) — Bloc 3 : IM (99 → 90)
Object.assign(BRIEF_NORMS_HETERO_70_79.indices.IM!, {
  99: { t: 64, p: "92" },
  98: { t: 63, p: "90" },
  97: { t: 62, p: "90" },
  96: { t: 62, p: "90" },
  95: { t: 61, p: "88" },
  94: { t: 60, p: "85" },
  93: { t: 59, p: "84" },
  92: { t: 58, p: "81" },
  91: { t: 57, p: "81" },
  90: { t: 56, p: "81" },
});

// IC 90 % — B-17 (70–79)
Object.assign(BRIEF_NORMS_HETERO_70_79.ic90!, {
  IRC: 4,
  IM: 5,
});

// B-18 (70–79) — Bloc 1 : CEG 210 → 182
Object.assign(BRIEF_NORMS_HETERO_70_79.composite.CEG!, {
  210: { t: 110, p: ">99" },
  209: { t: 109, p: ">99" },
  208: { t: 108, p: ">99" },
  207: { t: 108, p: ">99" },
  206: { t: 107, p: ">99" },
  205: { t: 107, p: ">99" },
  204: { t: 106, p: ">99" },
  203: { t: 106, p: ">99" },
  202: { t: 105, p: ">99" },
  201: { t: 105, p: ">99" },
  200: { t: 104, p: ">99" },
  199: { t: 104, p: ">99" },
  198: { t: 103, p: ">99" },
  197: { t: 103, p: ">99" },
  196: { t: 102, p: ">99" },
  195: { t: 102, p: ">99" },
  194: { t: 101, p: ">99" },
  193: { t: 101, p: ">99" },
  192: { t: 100, p: ">99" },
  191: { t: 99, p: ">99" },
  190: { t: 99, p: ">99" },
  189: { t: 98, p: ">99" },
  188: { t: 98, p: ">99" },
  187: { t: 97, p: ">99" },
  186: { t: 97, p: ">99" },
  185: { t: 96, p: ">99" },
  184: { t: 96, p: ">99" },
  183: { t: 95, p: ">99" },
  182: { t: 95, p: ">99" },
});

// B-18 (70–79) — Bloc 2 : CEG 181 → 153
Object.assign(BRIEF_NORMS_HETERO_70_79.composite.CEG!, {
  181: { t: 94, p: ">99" },
  180: { t: 94, p: ">99" },
  179: { t: 93, p: ">99" },
  178: { t: 93, p: ">99" },
  177: { t: 92, p: ">99" },
  176: { t: 92, p: ">99" },
  175: { t: 91, p: ">99" },
  174: { t: 90, p: ">99" },
  173: { t: 90, p: ">99" },
  172: { t: 89, p: ">99" },
  171: { t: 89, p: ">99" },
  170: { t: 88, p: ">99" },
  169: { t: 88, p: ">99" },
  168: { t: 87, p: ">99" },
  167: { t: 87, p: ">99" },
  166: { t: 86, p: ">99" },
  165: { t: 86, p: ">99" },
  164: { t: 85, p: ">99" },
  163: { t: 85, p: ">99" },
  162: { t: 84, p: ">99" },
  161: { t: 84, p: ">99" },
  160: { t: 83, p: ">99" },
  159: { t: 83, p: ">99" },
  158: { t: 82, p: ">99" },
  157: { t: 82, p: ">99" },
  156: { t: 81, p: ">99" },
  155: { t: 81, p: ">99" },
  154: { t: 80, p: ">99" },
  153: { t: 79, p: ">99" },
});

// B-18 (70–79) — Bloc 3 : CEG 152 → 124
Object.assign(BRIEF_NORMS_HETERO_70_79.composite.CEG!, {
  152: { t: 79, p: "98" },
  151: { t: 78, p: "98" },
  150: { t: 78, p: "98" },
  149: { t: 77, p: "98" },
  148: { t: 77, p: "98" },
  147: { t: 76, p: "98" },
  146: { t: 76, p: "98" },
  145: { t: 75, p: "98" },
  144: { t: 75, p: "98" },
  143: { t: 74, p: "98" },
  142: { t: 74, p: "98" },
  141: { t: 73, p: "96" },
  140: { t: 72, p: "96" },
  139: { t: 72, p: "96" },
  138: { t: 71, p: "96" },
  137: { t: 71, p: "96" },
  136: { t: 70, p: "96" },
  135: { t: 70, p: "96" },
  134: { t: 69, p: "96" },
  133: { t: 69, p: "96" },
  132: { t: 68, p: "96" },
  131: { t: 68, p: "96" },
  130: { t: 67, p: "96" },
  129: { t: 67, p: "96" },
  128: { t: 66, p: "95" },
  127: { t: 66, p: "95" },
  126: { t: 65, p: "94" },
  125: { t: 64, p: "93" },
  124: { t: 64, p: "92" },
});

// B-18 (70–79) — Bloc 4 : CEG 123 → 95
Object.assign(BRIEF_NORMS_HETERO_70_79.composite.CEG!, {
  123: { t: 63, p: "91" },
  122: { t: 63, p: "91" },
  121: { t: 62, p: "91" },
  120: { t: 62, p: "88" },
  119: { t: 61, p: "87" },
  118: { t: 61, p: "86" },
  117: { t: 60, p: "85" },
  116: { t: 60, p: "85" },
  115: { t: 59, p: "82" },
  114: { t: 59, p: "82" },
  113: { t: 58, p: "82" },
  112: { t: 58, p: "81" },
  111: { t: 57, p: "78" },
  110: { t: 56, p: "75" },
  109: { t: 55, p: "75" },
  108: { t: 55, p: "74" },
  107: { t: 54, p: "74" },
  106: { t: 54, p: "70" },
  105: { t: 53, p: "70" },
  104: { t: 53, p: "65" },
  103: { t: 52, p: "63" },
  102: { t: 52, p: "63" },
  101: { t: 52, p: "63" },
  100: { t: 52, p: "63" },
  99: { t: 51, p: "63" },
  98: { t: 50, p: "59" },
  97: { t: 49, p: "47" },
  96: { t: 49, p: "47" },
  95: { t: 48, p: "44" },
});

// B-18 (70–79) — Bloc 5 : CEG 94 → 70
Object.assign(BRIEF_NORMS_HETERO_70_79.composite.CEG!, {
  94: { t: 48, p: "49" },
  93: { t: 47, p: "48" },
  92: { t: 47, p: "45" },
  91: { t: 46, p: "43" },
  90: { t: 46, p: "42" },
  89: { t: 45, p: "40" },
  88: { t: 45, p: "39" },
  87: { t: 44, p: "38" },
  86: { t: 44, p: "38" },
  85: { t: 43, p: "34" },
  84: { t: 43, p: "30" },
  83: { t: 42, p: "29" },
  82: { t: 42, p: "28" },
  81: { t: 41, p: "26" },
  80: { t: 41, p: "24" },
  79: { t: 40, p: "20" },
  78: { t: 40, p: "18" },
  77: { t: 39, p: "15" },
  76: { t: 39, p: "12" },
  75: { t: 38, p: "11" },
  74: { t: 38, p: "9" },
  73: { t: 37, p: "8" },
  72: { t: 37, p: "6" },
  71: { t: 36, p: "5" },
  70: { t: 35, p: "0" },
});
