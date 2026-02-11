import { BriefNormsForAgeBand } from "../types";

export const BRIEF_NORMS_HETERO_80_93: BriefNormsForAgeBand = {
  ageBand: "80-93",
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

// B-19 (80–93) — Bloc 1 : scores bruts 30 → 25
Object.assign(BRIEF_NORMS_HETERO_80_93.scales.inhibition!, {
  24: { t: 115, p: ">99" },
  23: { t: 110, p: ">99" },
  22: { t: 106, p: ">99" },
  21: { t: 101, p: ">99" },
  20: { t: 96, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.flexibilite!, {
  18: { t: 85, p: ">99" },
  17: { t: 81, p: ">99" },
  16: { t: 77, p: ">99" },
  15: { t: 73, p: "99" },
  14: { t: 69, p: "97" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleEmotionnel!, {
  30: { t: 88, p: ">99" },
  29: { t: 86, p: ">99" },
  28: { t: 83, p: ">99" },
  27: { t: 81, p: ">99" },
  26: { t: 79, p: "99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.initiation!, {
  24: { t: 101, p: ">99" },
  23: { t: 97, p: ">99" },
  22: { t: 93, p: ">99" },
  21: { t: 89, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.memoireDeTravail!, {
  24: { t: 93, p: ">99" },
  23: { t: 89, p: ">99" },
  22: { t: 86, p: ">99" },
  21: { t: 83, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.planificationOrganisation!, {
  30: { t: 112, p: ">99" },
  29: { t: 108, p: ">99" },
  28: { t: 104, p: ">99" },
  27: { t: 101, p: ">99" },
  26: { t: 97, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeLaTache!, {
  24: { t: 94, p: ">99" },
  23: { t: 90, p: ">99" },
  22: { t: 87, p: ">99" },
  21: { t: 84, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.organisationDuMateriel!, {
  24: { t: 94, p: ">99" },
  23: { t: 90, p: ">99" },
  22: { t: 87, p: ">99" },
  21: { t: 84, p: ">99" },
});

// B-19 (80–93) — Bloc 2 : scores bruts 24 → 20
Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleEmotionnel!, {
  24: { t: 74, p: "99" },
  23: { t: 71, p: "99" },
  22: { t: 69, p: "97" },
  21: { t: 66, p: "93" },
  20: { t: 64, p: "89" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.initiation!, {
  20: { t: 89, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.memoireDeTravail!, {
  20: { t: 82, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.planificationOrganisation!, {
  24: { t: 93, p: ">99" },
  23: { t: 90, p: ">99" },
  22: { t: 86, p: ">99" },
  21: { t: 83, p: ">99" },
  20: { t: 79, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.organisationDuMateriel!, {
  20: { t: 81, p: "97" },
});

// B-19 (80–93) — Bloc 3 : scores bruts 19 → 15
Object.assign(BRIEF_NORMS_HETERO_80_93.scales.inhibition!, {
  19: { t: 92, p: ">99" },
  18: { t: 87, p: ">99" },
  17: { t: 82, p: ">99" },
  16: { t: 77, p: "99" },
  15: { t: 73, p: "97" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleEmotionnel!, {
  19: { t: 61, p: "84" },
  18: { t: 59, p: "83" },
  17: { t: 57, p: "80" },
  16: { t: 54, p: "74" },
  15: { t: 52, p: "64" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeSoi!, {
  18: { t: 97, p: ">99" },
  17: { t: 92, p: ">99" },
  16: { t: 87, p: ">99" },
  15: { t: 83, p: "99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.initiation!, {
  19: { t: 81, p: ">99" },
  18: { t: 77, p: ">99" },
  17: { t: 73, p: "99" },
  16: { t: 69, p: "97" },
  15: { t: 65, p: "91" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.memoireDeTravail!, {
  19: { t: 75, p: ">99" },
  18: { t: 72, p: "99" },
  17: { t: 68, p: "97" },
  16: { t: 65, p: "96" },
  15: { t: 61, p: "89" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.planificationOrganisation!, {
  19: { t: 68, p: "94" },
  18: { t: 65, p: "91" },
  17: { t: 61, p: "89" },
  16: { t: 57, p: "81" },
  15: { t: 54, p: "73" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeLaTache!, {
  19: { t: 99, p: ">99" },
  18: { t: 94, p: ">99" },
  17: { t: 89, p: ">99" },
  16: { t: 84, p: ">99" },
  15: { t: 79, p: ">99" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.organisationDuMateriel!, {
  19: { t: 78, p: "96" },
  18: { t: 74, p: "96" },
  17: { t: 71, p: "94" },
  16: { t: 68, p: "93" },
  15: { t: 65, p: "91" },
});

// B-19 (80–93) — Bloc 4 : scores bruts 14 → 10
Object.assign(BRIEF_NORMS_HETERO_80_93.scales.inhibition!, {
  14: { t: 68, p: "96" },
  13: { t: 63, p: "91" },
  12: { t: 59, p: "86" },
  11: { t: 54, p: "76" },
  10: { t: 49, p: "64" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.flexibilite!, {
  13: { t: 65, p: "94" },
  12: { t: 61, p: "91" },
  11: { t: 57, p: "79" },
  10: { t: 53, p: "69" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleEmotionnel!, {
  14: { t: 49, p: "57" },
  13: { t: 47, p: "54" },
  12: { t: 44, p: "44" },
  11: { t: 42, p: "36" },
  10: { t: 39, p: "16" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeSoi!, {
  14: { t: 83, p: "99" },
  13: { t: 78, p: "99" },
  12: { t: 73, p: "99" },
  11: { t: 69, p: "94" },
  10: { t: 64, p: "83" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.initiation!, {
  14: { t: 61, p: "89" },
  13: { t: 58, p: "80" },
  12: { t: 54, p: "69" },
  11: { t: 51, p: "61" },
  10: { t: 48, p: "57" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.memoireDeTravail!, {
  14: { t: 58, p: "80" },
  13: { t: 54, p: "73" },
  12: { t: 50, p: "63" },
  11: { t: 46, p: "56" },
  10: { t: 43, p: "41" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.planificationOrganisation!, {
  14: { t: 54, p: "73" },
  13: { t: 50, p: "63" },
  12: { t: 46, p: "56" },
  11: { t: 43, p: "41" },
  10: { t: 39, p: "17" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeLaTache!, {
  14: { t: 74, p: "99" },
  13: { t: 69, p: "96" },
  12: { t: 64, p: "96" },
  11: { t: 59, p: "96" },
  10: { t: 53, p: "87" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.organisationDuMateriel!, {
  14: { t: 62, p: "89" },
  13: { t: 58, p: "87" },
  12: { t: 55, p: "84" },
  11: { t: 52, p: "80" },
  10: { t: 49, p: "74" },
});

// B-19 (80–93) — Bloc 5 : scores bruts 9 → 6
Object.assign(BRIEF_NORMS_HETERO_80_93.scales.inhibition!, {
  9: { t: 44, p: "49" },
  8: { t: 40, p: "23" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.flexibilite!, {
  9: { t: 49, p: "57" },
  8: { t: 45, p: "44" },
  7: { t: 41, p: "27" },
  6: { t: 37, p: "14" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleEmotionnel!, {
  9: { t: 39, p: "16" },
  8: { t: 37, p: "15" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeSoi!, {
  9: { t: 55, p: "77" },
  8: { t: 50, p: "63" },
  7: { t: 45, p: "54" },
  6: { t: 40, p: "31" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.initiation!, {
  9: { t: 44, p: "40" },
  8: { t: 41, p: "26" },
  7: { t: 37, p: "16" },
  6: { t: 40, p: "31" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.memoireDeTravail!, {
  9: { t: 41, p: "26" },
  8: { t: 37, p: "16" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.planificationOrganisation!, {
  9: { t: 39, p: "17" },
  8: { t: 37, p: "16" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.controleDeLaTache!, {
  9: { t: 49, p: "74" },
  8: { t: 46, p: "53" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.scales.organisationDuMateriel!, {
  9: { t: 46, p: "53" },
  8: { t: 42, p: "27" },
});

// B-20 (80–93) — Bloc 1 : IM (120 → 90)
Object.assign(BRIEF_NORMS_HETERO_80_93.indices.IM!, {
  120: { t: 109, p: ">99" },
  119: { t: 108, p: ">99" },
  118: { t: 107, p: ">99" },
  117: { t: 106, p: ">99" },
  116: { t: 106, p: ">99" },
  115: { t: 105, p: ">99" },
  114: { t: 104, p: ">99" },
  113: { t: 103, p: ">99" },
  112: { t: 102, p: ">99" },
  111: { t: 101, p: ">99" },
  110: { t: 100, p: ">99" },
  109: { t: 99, p: ">99" },
  108: { t: 98, p: ">99" },
  107: { t: 97, p: ">99" },
  106: { t: 97, p: ">99" },
  105: { t: 96, p: ">99" },
  104: { t: 95, p: ">99" },
  103: { t: 94, p: ">99" },
  102: { t: 93, p: ">99" },
  101: { t: 92, p: ">99" },
  100: { t: 91, p: ">99" },
  99: { t: 90, p: ">99" },
  98: { t: 89, p: ">99" },
  97: { t: 88, p: ">99" },
  96: { t: 87, p: ">99" },
  95: { t: 87, p: ">99" },
  94: { t: 86, p: ">99" },
  93: { t: 85, p: ">99" },
  92: { t: 84, p: ">99" },
  91: { t: 83, p: ">99" },
  90: { t: 82, p: "99" },
});

// B-20 (80–93) — Bloc 2 : IRC & IM (89 → 59)
Object.assign(BRIEF_NORMS_HETERO_80_93.indices.IRC!, {
  89: { t: 102, p: ">99" },
  88: { t: 101, p: ">99" },
  87: { t: 100, p: ">99" },
  86: { t: 99, p: ">99" },
  85: { t: 98, p: ">99" },
  84: { t: 96, p: ">99" },
  83: { t: 95, p: ">99" },
  82: { t: 94, p: ">99" },
  81: { t: 93, p: ">99" },
  80: { t: 92, p: ">99" },
  79: { t: 91, p: ">99" },
  78: { t: 90, p: ">99" },
  77: { t: 89, p: ">99" },
  76: { t: 88, p: ">99" },
  75: { t: 87, p: ">99" },
  74: { t: 86, p: ">99" },
  73: { t: 85, p: ">99" },
  72: { t: 84, p: ">99" },
  71: { t: 83, p: ">99" },
  70: { t: 82, p: ">99" },
  69: { t: 80, p: ">99" },
  68: { t: 79, p: ">99" },
  67: { t: 78, p: ">99" },
  66: { t: 77, p: ">99" },
  65: { t: 76, p: ">99" },
  64: { t: 74, p: ">99" },
  63: { t: 73, p: ">99" },
  62: { t: 72, p: ">99" },
  61: { t: 71, p: ">99" },
  60: { t: 70, p: ">99" },
  59: { t: 69, p: "94" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.indices.IM!, {
  89: { t: 81, p: "99" },
  88: { t: 80, p: "99" },
  87: { t: 79, p: "99" },
  86: { t: 78, p: "99" },
  85: { t: 78, p: "99" },
  84: { t: 77, p: "99" },
  83: { t: 76, p: "99" },
  82: { t: 75, p: "97" },
  81: { t: 74, p: "97" },
  80: { t: 73, p: "97" },
  79: { t: 72, p: "97" },
  78: { t: 71, p: "97" },
  77: { t: 70, p: "97" },
  76: { t: 69, p: "97" },
  75: { t: 68, p: "94" },
  74: { t: 67, p: "94" },
  73: { t: 66, p: "94" },
  72: { t: 65, p: "94" },
  71: { t: 64, p: "90" },
  70: { t: 63, p: "89" },
  69: { t: 62, p: "86" },
  68: { t: 61, p: "86" },
  67: { t: 60, p: "86" },
  66: { t: 59, p: "84" },
  65: { t: 58, p: "81" },
  64: { t: 57, p: "77" },
  63: { t: 56, p: "76" },
  62: { t: 55, p: "76" },
  61: { t: 54, p: "73" },
  60: { t: 53, p: "69" },
  59: { t: 52, p: "65" },
});

// B-20 (80–93) — Bloc 3 : IRC & IM (58 → 30)
Object.assign(BRIEF_NORMS_HETERO_80_93.indices.IRC!, {
  58: { t: 63, p: "91" },
  57: { t: 62, p: "89" },
  56: { t: 61, p: "88" },
  55: { t: 60, p: "84" },
  54: { t: 59, p: "80" },
  53: { t: 58, p: "79" },
  52: { t: 57, p: "77" },
  51: { t: 56, p: "76" },
  50: { t: 55, p: "72" },
  49: { t: 54, p: "69" },
  48: { t: 53, p: "66" },
  47: { t: 52, p: "63" },
  46: { t: 51, p: "60" },
  45: { t: 50, p: "56" },
  44: { t: 49, p: "53" },
  43: { t: 48, p: "49" },
  42: { t: 47, p: "47" },
  41: { t: 46, p: "45" },
  40: { t: 45, p: "43" },
  39: { t: 44, p: "41" },
  38: { t: 42, p: "37" },
  37: { t: 41, p: "34" },
  36: { t: 40, p: "31" },
  35: { t: 39, p: "28" },
  34: { t: 38, p: "21" },
  33: { t: 37, p: "15" },
  32: { t: 36, p: "10" },
  31: { t: 35, p: "6" },
  30: { t: 34, p: "3" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.indices.IM!, {
  58: { t: 53, p: "70" },
  57: { t: 52, p: "67" },
  56: { t: 51, p: "61" },
  55: { t: 50, p: "60" },
  54: { t: 50, p: "59" },
  53: { t: 49, p: "54" },
  52: { t: 48, p: "54" },
  51: { t: 47, p: "50" },
  50: { t: 46, p: "44" },
  49: { t: 45, p: "41" },
  48: { t: 45, p: "41" },
  47: { t: 44, p: "33" },
  46: { t: 43, p: "30" },
  45: { t: 42, p: "26" },
  44: { t: 41, p: "21" },
  43: { t: 41, p: "21" },
  42: { t: 40, p: "16" },
  41: { t: 40, p: "16" },
  40: { t: 39, p: "11" },
  39: { t: 38, p: "7" },
  38: { t: 37, p: "3" },
  37: { t: 37, p: "3" },
  36: { t: 36, p: "3" },
  35: { t: 36, p: "3" },
  34: { t: 35, p: "3" },
  33: { t: 35, p: "3" },
  32: { t: 34, p: "3" },
  31: { t: 34, p: "3" },
  30: { t: 36, p: "3" },
});

// B-21 (80–93) — Bloc 1 : CEG (210 → 182)
Object.assign(BRIEF_NORMS_HETERO_80_93.composite.CEG!, {
  210: { t: 112, p: ">99" },
  209: { t: 111, p: ">99" },
  208: { t: 111, p: ">99" },
  207: { t: 110, p: ">99" },
  206: { t: 110, p: ">99" },
  205: { t: 109, p: ">99" },
  204: { t: 109, p: ">99" },
  203: { t: 108, p: ">99" },
  202: { t: 108, p: ">99" },
  201: { t: 107, p: ">99" },
  200: { t: 106, p: ">99" },
  199: { t: 106, p: ">99" },
  198: { t: 105, p: ">99" },
  197: { t: 105, p: ">99" },
  196: { t: 104, p: ">99" },
  195: { t: 104, p: ">99" },
  194: { t: 103, p: ">99" },
  193: { t: 103, p: ">99" },
  192: { t: 102, p: ">99" },
  191: { t: 102, p: ">99" },
  190: { t: 101, p: ">99" },
  189: { t: 100, p: ">99" },
  188: { t: 100, p: ">99" },
  187: { t: 99, p: ">99" },
  186: { t: 99, p: ">99" },
  185: { t: 98, p: ">99" },
  184: { t: 98, p: ">99" },
  183: { t: 97, p: ">99" },
  182: { t: 97, p: ">99" },
});

// B-21 (80–93) — Bloc 2 : CEG (181 → 153)
Object.assign(BRIEF_NORMS_HETERO_80_93.composite.CEG!, {
  181: { t: 96, p: ">99" },
  180: { t: 96, p: ">99" },
  179: { t: 95, p: ">99" },
  178: { t: 94, p: ">99" },
  177: { t: 94, p: ">99" },
  176: { t: 93, p: ">99" },
  175: { t: 93, p: ">99" },
  174: { t: 92, p: ">99" },
  173: { t: 92, p: ">99" },
  172: { t: 91, p: ">99" },
  171: { t: 91, p: ">99" },
  170: { t: 90, p: ">99" },
  169: { t: 90, p: ">99" },
  168: { t: 89, p: ">99" },
  167: { t: 88, p: ">99" },
  166: { t: 88, p: ">99" },
  165: { t: 87, p: ">99" },
  164: { t: 87, p: ">99" },
  163: { t: 86, p: ">99" },
  162: { t: 86, p: ">99" },
  161: { t: 85, p: ">99" },
  160: { t: 85, p: ">99" },
  159: { t: 84, p: ">99" },
  158: { t: 84, p: ">99" },
  157: { t: 83, p: ">99" },
  156: { t: 82, p: ">99" },
  155: { t: 82, p: ">99" },
  154: { t: 81, p: ">99" },
  153: { t: 81, p: ">99" },
});

// B-21 (80–93) — Bloc 3 : CEG (152 → 124)
Object.assign(BRIEF_NORMS_HETERO_80_93.composite.CEG!, {
  152: { t: 80, p: "99" },
  151: { t: 80, p: "99" },
  150: { t: 79, p: "99" },
  149: { t: 79, p: "99" },
  148: { t: 78, p: "99" },
  147: { t: 78, p: "99" },
  146: { t: 77, p: "99" },
  145: { t: 77, p: "99" },
  144: { t: 76, p: "99" },
  143: { t: 76, p: "99" },
  142: { t: 75, p: "98" },
  141: { t: 75, p: "98" },
  140: { t: 74, p: "98" },
  139: { t: 74, p: "98" },
  138: { t: 73, p: "98" },
  137: { t: 73, p: "98" },
  136: { t: 72, p: "98" },
  135: { t: 72, p: "98" },
  134: { t: 71, p: "98" },
  133: { t: 71, p: "98" },
  132: { t: 70, p: "97" },
  131: { t: 70, p: "97" },
  130: { t: 69, p: "97" },
  129: { t: 69, p: "97" },
  128: { t: 68, p: "97" },
  127: { t: 68, p: "97" },
  126: { t: 67, p: "96" },
  125: { t: 67, p: "96" },
  124: { t: 66, p: "96" },
});

// B-21 (80–93) — Bloc 4 : CEG (123 → 95)
Object.assign(BRIEF_NORMS_HETERO_80_93.composite.CEG!, {
  123: { t: 65, p: "94" },
  122: { t: 65, p: "94" },
  121: { t: 64, p: "94" },
  120: { t: 64, p: "92" },
  119: { t: 63, p: "92" },
  118: { t: 63, p: "90" },
  117: { t: 62, p: "90" },
  116: { t: 62, p: "90" },
  115: { t: 61, p: "87" },
  114: { t: 61, p: "87" },
  113: { t: 60, p: "85" },
  112: { t: 60, p: "85" },
  111: { t: 59, p: "82" },
  110: { t: 58, p: "80" },
  109: { t: 58, p: "80" },
  108: { t: 57, p: "77" },
  107: { t: 57, p: "77" },
  106: { t: 56, p: "73" },
  105: { t: 56, p: "73" },
  104: { t: 55, p: "69" },
  103: { t: 54, p: "66" },
  102: { t: 54, p: "66" },
  101: { t: 53, p: "66" },
  100: { t: 53, p: "66" },
  99: { t: 52, p: "63" },
  98: { t: 51, p: "59" },
  97: { t: 50, p: "47" },
  96: { t: 50, p: "47" },
  95: { t: 49, p: "44" },
});

// B-21 (80–93) — Bloc 5 : CEG 94 → 70
Object.assign(BRIEF_NORMS_HETERO_80_93.composite.CEG!, {
  94: { t: 49, p: "49" },
  93: { t: 48, p: "48" },
  92: { t: 48, p: "45" },
  91: { t: 47, p: "43" },
  90: { t: 47, p: "42" },
  89: { t: 46, p: "40" },
  88: { t: 46, p: "39" },
  87: { t: 45, p: "38" },
  86: { t: 45, p: "38" },
  85: { t: 44, p: "34" },
  84: { t: 44, p: "30" },
  83: { t: 43, p: "29" },
  82: { t: 43, p: "28" },
  81: { t: 42, p: "26" },
  80: { t: 42, p: "24" },
  79: { t: 41, p: "20" },
  78: { t: 41, p: "18" },
  77: { t: 40, p: "15" },
  76: { t: 40, p: "12" },
  75: { t: 39, p: "11" },
  74: { t: 39, p: "9" },
  73: { t: 38, p: "8" },
  72: { t: 38, p: "6" },
  71: { t: 37, p: "5" },
  70: { t: 36, p: "3" },
});

Object.assign(BRIEF_NORMS_HETERO_80_93.ic90!, {
  CEG: 4,
});
