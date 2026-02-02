// ============================================================================
// WAIS-IV Efficience Intellectuelle - Normative Tables
// ============================================================================
// Denney 2015 QI Estimation conversion tables and Barona Index coefficients
// For schizophrenia neuropsychological evaluation
// ============================================================================

/**
 * Index conversion entry with index value, percentile, and confidence interval
 */
export interface IndexConversion {
  index: number;
  percentile: string;
  ci95: string;
}

// ============================================================================
// QI (Full Scale IQ) Conversion Table
// ============================================================================
// Based on Denney 2015: QI = ((Σ7 subtests) × 10) / 7
// Sum of 7 standard scores: range 7-133
// However, after formula transformation, the sum_std stored is the direct sum (7-133)
// Converted to Index 40-160

export const QI_CONVERSION: Record<number, IndexConversion> = {
  // Sum range: 7-133 (7 subtests × 1-19 each)
  7: { index: 40, percentile: '<0.1', ci95: '38-50' },
  8: { index: 41, percentile: '<0.1', ci95: '39-51' },
  9: { index: 42, percentile: '<0.1', ci95: '40-52' },
  10: { index: 43, percentile: '<0.1', ci95: '41-53' },
  11: { index: 44, percentile: '<0.1', ci95: '42-54' },
  12: { index: 45, percentile: '<0.1', ci95: '43-55' },
  13: { index: 46, percentile: '<0.1', ci95: '44-56' },
  14: { index: 47, percentile: '<0.1', ci95: '45-57' },
  15: { index: 48, percentile: '<0.1', ci95: '46-58' },
  16: { index: 49, percentile: '<0.1', ci95: '47-59' },
  17: { index: 50, percentile: '<0.1', ci95: '48-60' },
  18: { index: 51, percentile: '<0.1', ci95: '49-61' },
  19: { index: 52, percentile: '0.1', ci95: '50-62' },
  20: { index: 53, percentile: '0.1', ci95: '51-63' },
  21: { index: 54, percentile: '0.1', ci95: '52-64' },
  22: { index: 55, percentile: '0.1', ci95: '53-65' },
  23: { index: 56, percentile: '0.2', ci95: '54-66' },
  24: { index: 57, percentile: '0.2', ci95: '55-67' },
  25: { index: 58, percentile: '0.3', ci95: '56-68' },
  26: { index: 59, percentile: '0.3', ci95: '57-69' },
  27: { index: 60, percentile: '0.4', ci95: '58-70' },
  28: { index: 61, percentile: '0.5', ci95: '59-71' },
  29: { index: 62, percentile: '0.6', ci95: '60-72' },
  30: { index: 63, percentile: '0.7', ci95: '61-73' },
  31: { index: 64, percentile: '0.8', ci95: '62-74' },
  32: { index: 65, percentile: '1', ci95: '63-75' },
  33: { index: 66, percentile: '1', ci95: '64-76' },
  34: { index: 67, percentile: '1', ci95: '65-77' },
  35: { index: 68, percentile: '2', ci95: '66-78' },
  36: { index: 69, percentile: '2', ci95: '67-79' },
  37: { index: 70, percentile: '2', ci95: '68-80' },
  38: { index: 71, percentile: '3', ci95: '69-81' },
  39: { index: 72, percentile: '3', ci95: '70-82' },
  40: { index: 73, percentile: '4', ci95: '71-83' },
  41: { index: 74, percentile: '4', ci95: '72-84' },
  42: { index: 75, percentile: '5', ci95: '73-85' },
  43: { index: 76, percentile: '5', ci95: '74-86' },
  44: { index: 77, percentile: '6', ci95: '75-87' },
  45: { index: 78, percentile: '7', ci95: '76-88' },
  46: { index: 79, percentile: '8', ci95: '77-89' },
  47: { index: 80, percentile: '9', ci95: '78-90' },
  48: { index: 81, percentile: '10', ci95: '79-91' },
  49: { index: 82, percentile: '12', ci95: '80-92' },
  50: { index: 83, percentile: '13', ci95: '81-93' },
  51: { index: 84, percentile: '14', ci95: '82-94' },
  52: { index: 85, percentile: '16', ci95: '83-95' },
  53: { index: 86, percentile: '18', ci95: '84-96' },
  54: { index: 87, percentile: '19', ci95: '85-97' },
  55: { index: 88, percentile: '21', ci95: '86-98' },
  56: { index: 89, percentile: '23', ci95: '87-99' },
  57: { index: 90, percentile: '25', ci95: '88-100' },
  58: { index: 91, percentile: '27', ci95: '89-101' },
  59: { index: 92, percentile: '30', ci95: '90-102' },
  60: { index: 93, percentile: '32', ci95: '91-103' },
  61: { index: 94, percentile: '34', ci95: '92-104' },
  62: { index: 95, percentile: '37', ci95: '93-105' },
  63: { index: 96, percentile: '39', ci95: '94-106' },
  64: { index: 97, percentile: '42', ci95: '95-107' },
  65: { index: 98, percentile: '45', ci95: '96-108' },
  66: { index: 99, percentile: '47', ci95: '97-109' },
  67: { index: 100, percentile: '50', ci95: '98-110' },
  68: { index: 101, percentile: '53', ci95: '99-111' },
  69: { index: 102, percentile: '55', ci95: '100-112' },
  70: { index: 103, percentile: '58', ci95: '101-113' },
  71: { index: 104, percentile: '61', ci95: '102-114' },
  72: { index: 105, percentile: '63', ci95: '103-115' },
  73: { index: 106, percentile: '66', ci95: '104-116' },
  74: { index: 107, percentile: '68', ci95: '105-117' },
  75: { index: 108, percentile: '70', ci95: '106-118' },
  76: { index: 109, percentile: '73', ci95: '107-119' },
  77: { index: 110, percentile: '75', ci95: '108-120' },
  78: { index: 111, percentile: '77', ci95: '109-121' },
  79: { index: 112, percentile: '79', ci95: '110-122' },
  80: { index: 113, percentile: '81', ci95: '111-123' },
  81: { index: 114, percentile: '82', ci95: '112-124' },
  82: { index: 115, percentile: '84', ci95: '113-125' },
  83: { index: 116, percentile: '86', ci95: '114-126' },
  84: { index: 117, percentile: '87', ci95: '115-127' },
  85: { index: 118, percentile: '88', ci95: '116-128' },
  86: { index: 119, percentile: '90', ci95: '117-129' },
  87: { index: 120, percentile: '91', ci95: '118-130' },
  88: { index: 121, percentile: '92', ci95: '119-131' },
  89: { index: 122, percentile: '93', ci95: '120-132' },
  90: { index: 123, percentile: '94', ci95: '121-133' },
  91: { index: 124, percentile: '95', ci95: '122-134' },
  92: { index: 125, percentile: '95', ci95: '123-135' },
  93: { index: 126, percentile: '96', ci95: '124-136' },
  94: { index: 127, percentile: '96', ci95: '125-137' },
  95: { index: 128, percentile: '97', ci95: '126-138' },
  96: { index: 129, percentile: '97', ci95: '127-139' },
  97: { index: 130, percentile: '98', ci95: '128-140' },
  98: { index: 131, percentile: '98', ci95: '129-141' },
  99: { index: 132, percentile: '98', ci95: '130-142' },
  100: { index: 133, percentile: '99', ci95: '131-143' },
  101: { index: 134, percentile: '99', ci95: '132-144' },
  102: { index: 135, percentile: '99', ci95: '133-145' },
  103: { index: 136, percentile: '99', ci95: '134-146' },
  104: { index: 137, percentile: '99', ci95: '135-147' },
  105: { index: 138, percentile: '99', ci95: '136-148' },
  106: { index: 139, percentile: '99.5', ci95: '137-149' },
  107: { index: 140, percentile: '99.6', ci95: '138-150' },
  108: { index: 141, percentile: '99.7', ci95: '139-151' },
  109: { index: 142, percentile: '99.7', ci95: '140-152' },
  110: { index: 143, percentile: '99.8', ci95: '141-153' },
  111: { index: 144, percentile: '99.8', ci95: '142-154' },
  112: { index: 145, percentile: '99.9', ci95: '143-155' },
  113: { index: 146, percentile: '99.9', ci95: '144-156' },
  114: { index: 147, percentile: '99.9', ci95: '145-157' },
  115: { index: 148, percentile: '99.9', ci95: '146-158' },
  116: { index: 149, percentile: '99.9', ci95: '147-159' },
  117: { index: 150, percentile: '>99.9', ci95: '148-160' },
  118: { index: 151, percentile: '>99.9', ci95: '149-160' },
  119: { index: 152, percentile: '>99.9', ci95: '150-160' },
  120: { index: 153, percentile: '>99.9', ci95: '151-160' },
  121: { index: 154, percentile: '>99.9', ci95: '152-160' },
  122: { index: 155, percentile: '>99.9', ci95: '153-160' },
  123: { index: 156, percentile: '>99.9', ci95: '154-160' },
  124: { index: 157, percentile: '>99.9', ci95: '155-160' },
  125: { index: 158, percentile: '>99.9', ci95: '156-160' },
  126: { index: 159, percentile: '>99.9', ci95: '157-160' },
  127: { index: 160, percentile: '>99.9', ci95: '158-160' },
  128: { index: 160, percentile: '>99.9', ci95: '158-160' },
  129: { index: 160, percentile: '>99.9', ci95: '158-160' },
  130: { index: 160, percentile: '>99.9', ci95: '158-160' },
  131: { index: 160, percentile: '>99.9', ci95: '158-160' },
  132: { index: 160, percentile: '>99.9', ci95: '158-160' },
  133: { index: 160, percentile: '>99.9', ci95: '158-160' },
};

// ============================================================================
// ICV (Verbal Comprehension Index) Conversion Table
// ============================================================================
// Based on Denney 2015: ICV = (Info + Simil) × 3/2
// Sum range: 3-57 (after formula: 2 subtests × 1.5)

export const ICV_CONVERSION: Record<number, IndexConversion> = {
  3: { index: 50, percentile: '<0.1', ci95: '47-62' },
  4: { index: 52, percentile: '0.1', ci95: '49-64' },
  5: { index: 54, percentile: '0.1', ci95: '51-66' },
  6: { index: 56, percentile: '0.2', ci95: '53-68' },
  7: { index: 58, percentile: '0.3', ci95: '55-70' },
  8: { index: 60, percentile: '0.4', ci95: '57-72' },
  9: { index: 62, percentile: '0.6', ci95: '59-74' },
  10: { index: 64, percentile: '1', ci95: '61-76' },
  11: { index: 66, percentile: '1', ci95: '63-78' },
  12: { index: 68, percentile: '2', ci95: '65-80' },
  13: { index: 70, percentile: '2', ci95: '67-82' },
  14: { index: 72, percentile: '3', ci95: '69-84' },
  15: { index: 74, percentile: '4', ci95: '71-86' },
  16: { index: 76, percentile: '5', ci95: '73-88' },
  17: { index: 78, percentile: '7', ci95: '75-90' },
  18: { index: 80, percentile: '9', ci95: '77-92' },
  19: { index: 82, percentile: '12', ci95: '79-94' },
  20: { index: 84, percentile: '14', ci95: '81-96' },
  21: { index: 86, percentile: '18', ci95: '83-98' },
  22: { index: 88, percentile: '21', ci95: '85-100' },
  23: { index: 90, percentile: '25', ci95: '87-102' },
  24: { index: 92, percentile: '30', ci95: '89-104' },
  25: { index: 94, percentile: '34', ci95: '91-106' },
  26: { index: 96, percentile: '39', ci95: '93-108' },
  27: { index: 98, percentile: '45', ci95: '95-110' },
  28: { index: 100, percentile: '50', ci95: '97-112' },
  29: { index: 102, percentile: '55', ci95: '99-114' },
  30: { index: 104, percentile: '61', ci95: '101-116' },
  31: { index: 106, percentile: '66', ci95: '103-118' },
  32: { index: 108, percentile: '70', ci95: '105-120' },
  33: { index: 110, percentile: '75', ci95: '107-122' },
  34: { index: 112, percentile: '79', ci95: '109-124' },
  35: { index: 114, percentile: '82', ci95: '111-126' },
  36: { index: 116, percentile: '86', ci95: '113-128' },
  37: { index: 118, percentile: '88', ci95: '115-130' },
  38: { index: 120, percentile: '91', ci95: '117-132' },
  39: { index: 122, percentile: '93', ci95: '119-134' },
  40: { index: 124, percentile: '95', ci95: '121-136' },
  41: { index: 126, percentile: '96', ci95: '123-138' },
  42: { index: 128, percentile: '97', ci95: '125-140' },
  43: { index: 130, percentile: '98', ci95: '127-142' },
  44: { index: 132, percentile: '98', ci95: '129-144' },
  45: { index: 134, percentile: '99', ci95: '131-146' },
  46: { index: 136, percentile: '99', ci95: '133-148' },
  47: { index: 138, percentile: '99', ci95: '135-150' },
  48: { index: 140, percentile: '99.6', ci95: '137-150' },
  49: { index: 142, percentile: '99.7', ci95: '139-150' },
  50: { index: 144, percentile: '99.8', ci95: '141-150' },
  51: { index: 146, percentile: '99.9', ci95: '143-150' },
  52: { index: 148, percentile: '99.9', ci95: '145-150' },
  53: { index: 150, percentile: '>99.9', ci95: '147-150' },
  54: { index: 150, percentile: '>99.9', ci95: '147-150' },
  55: { index: 150, percentile: '>99.9', ci95: '147-150' },
  56: { index: 150, percentile: '>99.9', ci95: '147-150' },
  57: { index: 150, percentile: '>99.9', ci95: '147-150' },
};

// ============================================================================
// IRP (Perceptual Reasoning Index) Conversion Table
// ============================================================================
// Based on Denney 2015: IRP = (Matrices + ComplImages) × 3/2
// Sum range: 3-57 (after formula: 2 subtests × 1.5)

export const IRP_CONVERSION: Record<number, IndexConversion> = {
  3: { index: 50, percentile: '<0.1', ci95: '47-64' },
  4: { index: 52, percentile: '0.1', ci95: '49-66' },
  5: { index: 54, percentile: '0.1', ci95: '51-68' },
  6: { index: 56, percentile: '0.2', ci95: '53-70' },
  7: { index: 58, percentile: '0.3', ci95: '55-72' },
  8: { index: 60, percentile: '0.4', ci95: '57-74' },
  9: { index: 62, percentile: '0.6', ci95: '59-76' },
  10: { index: 64, percentile: '1', ci95: '61-78' },
  11: { index: 66, percentile: '1', ci95: '63-80' },
  12: { index: 68, percentile: '2', ci95: '65-82' },
  13: { index: 70, percentile: '2', ci95: '67-84' },
  14: { index: 72, percentile: '3', ci95: '69-86' },
  15: { index: 74, percentile: '4', ci95: '71-88' },
  16: { index: 76, percentile: '5', ci95: '73-90' },
  17: { index: 78, percentile: '7', ci95: '75-92' },
  18: { index: 80, percentile: '9', ci95: '77-94' },
  19: { index: 82, percentile: '12', ci95: '79-96' },
  20: { index: 84, percentile: '14', ci95: '81-98' },
  21: { index: 86, percentile: '18', ci95: '83-100' },
  22: { index: 88, percentile: '21', ci95: '85-102' },
  23: { index: 90, percentile: '25', ci95: '87-104' },
  24: { index: 92, percentile: '30', ci95: '89-106' },
  25: { index: 94, percentile: '34', ci95: '91-108' },
  26: { index: 96, percentile: '39', ci95: '93-110' },
  27: { index: 98, percentile: '45', ci95: '95-112' },
  28: { index: 100, percentile: '50', ci95: '97-114' },
  29: { index: 102, percentile: '55', ci95: '99-116' },
  30: { index: 104, percentile: '61', ci95: '101-118' },
  31: { index: 106, percentile: '66', ci95: '103-120' },
  32: { index: 108, percentile: '70', ci95: '105-122' },
  33: { index: 110, percentile: '75', ci95: '107-124' },
  34: { index: 112, percentile: '79', ci95: '109-126' },
  35: { index: 114, percentile: '82', ci95: '111-128' },
  36: { index: 116, percentile: '86', ci95: '113-130' },
  37: { index: 118, percentile: '88', ci95: '115-132' },
  38: { index: 120, percentile: '91', ci95: '117-134' },
  39: { index: 122, percentile: '93', ci95: '119-136' },
  40: { index: 124, percentile: '95', ci95: '121-138' },
  41: { index: 126, percentile: '96', ci95: '123-140' },
  42: { index: 128, percentile: '97', ci95: '125-142' },
  43: { index: 130, percentile: '98', ci95: '127-144' },
  44: { index: 132, percentile: '98', ci95: '129-146' },
  45: { index: 134, percentile: '99', ci95: '131-148' },
  46: { index: 136, percentile: '99', ci95: '133-150' },
  47: { index: 138, percentile: '99', ci95: '135-150' },
  48: { index: 140, percentile: '99.6', ci95: '137-150' },
  49: { index: 142, percentile: '99.7', ci95: '139-150' },
  50: { index: 144, percentile: '99.8', ci95: '141-150' },
  51: { index: 146, percentile: '99.9', ci95: '143-150' },
  52: { index: 148, percentile: '99.9', ci95: '145-150' },
  53: { index: 150, percentile: '>99.9', ci95: '147-150' },
  54: { index: 150, percentile: '>99.9', ci95: '147-150' },
  55: { index: 150, percentile: '>99.9', ci95: '147-150' },
  56: { index: 150, percentile: '>99.9', ci95: '147-150' },
  57: { index: 150, percentile: '>99.9', ci95: '147-150' },
};

// ============================================================================
// IMT (Working Memory Index) Conversion Table
// ============================================================================
// Based on Denney 2015: IMT = MemChiffres + Arithmetique
// Sum range: 2-38 (2 subtests: 1-19 each)

export const IMT_CONVERSION: Record<number, IndexConversion> = {
  2: { index: 50, percentile: '<0.1', ci95: '47-65' },
  3: { index: 52, percentile: '0.1', ci95: '49-67' },
  4: { index: 55, percentile: '0.1', ci95: '51-70' },
  5: { index: 58, percentile: '0.3', ci95: '54-72' },
  6: { index: 61, percentile: '0.5', ci95: '57-75' },
  7: { index: 64, percentile: '1', ci95: '59-77' },
  8: { index: 66, percentile: '1', ci95: '61-79' },
  9: { index: 69, percentile: '2', ci95: '64-82' },
  10: { index: 72, percentile: '3', ci95: '66-84' },
  11: { index: 75, percentile: '5', ci95: '69-87' },
  12: { index: 78, percentile: '7', ci95: '72-90' },
  13: { index: 81, percentile: '10', ci95: '74-92' },
  14: { index: 84, percentile: '14', ci95: '77-95' },
  15: { index: 86, percentile: '18', ci95: '79-97' },
  16: { index: 89, percentile: '23', ci95: '81-99' },
  17: { index: 92, percentile: '30', ci95: '84-102' },
  18: { index: 94, percentile: '34', ci95: '86-104' },
  19: { index: 97, percentile: '42', ci95: '88-106' },
  20: { index: 100, percentile: '50', ci95: '91-109' },
  21: { index: 102, percentile: '55', ci95: '93-111' },
  22: { index: 105, percentile: '63', ci95: '95-113' },
  23: { index: 108, percentile: '70', ci95: '98-116' },
  24: { index: 111, percentile: '77', ci95: '101-119' },
  25: { index: 114, percentile: '82', ci95: '103-121' },
  26: { index: 117, percentile: '87', ci95: '106-124' },
  27: { index: 120, percentile: '91', ci95: '109-127' },
  28: { index: 123, percentile: '94', ci95: '111-129' },
  29: { index: 126, percentile: '96', ci95: '114-132' },
  30: { index: 129, percentile: '97', ci95: '116-134' },
  31: { index: 131, percentile: '98', ci95: '118-136' },
  32: { index: 134, percentile: '99', ci95: '121-139' },
  33: { index: 137, percentile: '99', ci95: '123-141' },
  34: { index: 140, percentile: '99.6', ci95: '126-144' },
  35: { index: 143, percentile: '99.8', ci95: '129-147' },
  36: { index: 145, percentile: '99.9', ci95: '130-149' },
  37: { index: 148, percentile: '99.9', ci95: '133-150' },
  38: { index: 150, percentile: '>99.9', ci95: '135-150' },
};

// ============================================================================
// IVT (Processing Speed Index) Conversion Table
// ============================================================================
// Based on Denney 2015: IVT = Code × 2
// Sum range: 2-38 (1 subtest × 2)

export const IVT_CONVERSION: Record<number, IndexConversion> = {
  2: { index: 50, percentile: '<0.1', ci95: '47-65' },
  3: { index: 52, percentile: '0.1', ci95: '49-67' },
  4: { index: 55, percentile: '0.1', ci95: '51-70' },
  5: { index: 58, percentile: '0.3', ci95: '54-72' },
  6: { index: 61, percentile: '0.5', ci95: '57-75' },
  7: { index: 64, percentile: '1', ci95: '59-77' },
  8: { index: 66, percentile: '1', ci95: '61-79' },
  9: { index: 69, percentile: '2', ci95: '64-82' },
  10: { index: 72, percentile: '3', ci95: '66-84' },
  11: { index: 75, percentile: '5', ci95: '69-87' },
  12: { index: 78, percentile: '7', ci95: '72-90' },
  13: { index: 81, percentile: '10', ci95: '74-92' },
  14: { index: 84, percentile: '14', ci95: '77-95' },
  15: { index: 86, percentile: '18', ci95: '79-97' },
  16: { index: 89, percentile: '23', ci95: '81-99' },
  17: { index: 92, percentile: '30', ci95: '84-102' },
  18: { index: 94, percentile: '34', ci95: '86-104' },
  19: { index: 97, percentile: '42', ci95: '88-106' },
  20: { index: 100, percentile: '50', ci95: '91-109' },
  21: { index: 102, percentile: '55', ci95: '93-111' },
  22: { index: 105, percentile: '63', ci95: '95-113' },
  23: { index: 108, percentile: '70', ci95: '98-116' },
  24: { index: 111, percentile: '77', ci95: '101-119' },
  25: { index: 114, percentile: '82', ci95: '103-121' },
  26: { index: 117, percentile: '87', ci95: '106-124' },
  27: { index: 120, percentile: '91', ci95: '109-127' },
  28: { index: 123, percentile: '94', ci95: '111-129' },
  29: { index: 126, percentile: '96', ci95: '114-132' },
  30: { index: 129, percentile: '97', ci95: '116-134' },
  31: { index: 131, percentile: '98', ci95: '118-136' },
  32: { index: 134, percentile: '99', ci95: '121-139' },
  33: { index: 137, percentile: '99', ci95: '123-141' },
  34: { index: 140, percentile: '99.6', ci95: '126-144' },
  35: { index: 143, percentile: '99.8', ci95: '129-147' },
  36: { index: 145, percentile: '99.9', ci95: '130-149' },
  37: { index: 148, percentile: '99.9', ci95: '133-150' },
  38: { index: 150, percentile: '>99.9', ci95: '135-150' },
};

// ============================================================================
// Barona Index Coefficients (Gregory, 1987)
// ============================================================================
// Formula: QIT_attendu = 0.16×Sexe + 4.27×Etude + 0.81×Profession + 0.18×Age + 78.26

/**
 * Barona Sex coefficients
 */
export const BARONA_SEX_COEFFICIENTS: Record<string, number> = {
  male: 2,
  female: 1,
  M: 2,
  F: 1,
  m: 2,
  f: 1,
  homme: 2,
  femme: 1,
  Homme: 2,
  Femme: 1,
};

/**
 * Barona Age coefficients
 * Maps age ranges to coefficient values
 */
export const BARONA_AGE_RANGES: { min: number; max: number; coefficient: number }[] = [
  { min: 16, max: 17, coefficient: 1 },
  { min: 18, max: 19, coefficient: 2 },
  { min: 20, max: 24, coefficient: 3 },
  { min: 25, max: 29, coefficient: 4 },
  { min: 30, max: 34, coefficient: 5 },
  { min: 35, max: 44, coefficient: 6 },
  { min: 45, max: 54, coefficient: 7 },
  { min: 55, max: 64, coefficient: 8 },
  { min: 65, max: 69, coefficient: 9 },
  { min: 70, max: 74, coefficient: 10 },
  { min: 75, max: 79, coefficient: 11 },
  { min: 80, max: 89, coefficient: 12 },
];

/**
 * Get Barona age coefficient from patient age
 */
export function getBaronaAgeCoefficient(age: number): number {
  for (const range of BARONA_AGE_RANGES) {
    if (age >= range.min && age <= range.max) {
      return range.coefficient;
    }
  }
  // Default for ages outside defined ranges
  if (age < 16) return 1;
  return 12; // 90+ years
}

/**
 * Barona Education level options with coefficients
 */
export const BARONA_EDUCATION_OPTIONS = [
  { code: 1, label: 'Sans diplôme', coefficient: 1 },
  { code: 2, label: 'CEP', coefficient: 2 },
  { code: 3, label: 'CAP BEP', coefficient: 3 },
  { code: 4, label: 'BAC technologique, pro et brevet professionnel', coefficient: 4 },
  { code: 5, label: 'BAC général', coefficient: 5 },
  { code: 6, label: 'Diplôme universitaire 1er cycle, BTS, DUT, diplômes des professions sociales et de la santé', coefficient: 6 },
  { code: 7, label: 'Diplôme universitaire 2e et 3e cycle, ingenieur grande école', coefficient: 7 },
];

/**
 * Barona Profession options with coefficients
 */
export const BARONA_PROFESSION_OPTIONS = [
  { code: 1, label: 'Ouvriers', coefficient: 1 },
  { code: 2, label: 'Employés', coefficient: 2 },
  { code: 3, label: 'Agriculteurs', coefficient: 3 },
  { code: 4, label: 'Artisans, commerçants', coefficient: 4 },
  { code: 5, label: 'Retraités', coefficient: 5 },
  { code: 6, label: 'Professions intermédiaires', coefficient: 6 },
  { code: 7, label: 'Professions intellectuelles supérieures', coefficient: 7 },
];

/**
 * Barona formula constants
 */
export const BARONA_CONSTANTS = {
  sexCoefficient: 0.16,
  educationCoefficient: 4.27,
  professionCoefficient: 0.81,
  ageCoefficient: 0.18,
  intercept: 78.26,
};

/**
 * Deterioration significance thresholds
 * For comparing expected vs observed IQ
 */
export const DETERIORATION_THRESHOLDS = {
  '1_percent': {
    QIT: 23,
    QIV: 26,
    QIP: 30,
  },
  '5_percent': {
    QIT: 19,
    QIV: 19,
    QIP: 21,
  },
  '10_percent': {
    QIT: 16,
    QIV: 16,
    QIP: 17,
  },
};

/**
 * Index interpretation ranges
 */
export const INDEX_INTERPRETATION_RANGES = [
  { min: 130, max: 160, label: 'Très supérieur', labelEn: 'Very Superior' },
  { min: 120, max: 129, label: 'Supérieur', labelEn: 'Superior' },
  { min: 110, max: 119, label: 'Moyenne haute', labelEn: 'High Average' },
  { min: 90, max: 109, label: 'Moyenne', labelEn: 'Average' },
  { min: 80, max: 89, label: 'Moyenne basse', labelEn: 'Low Average' },
  { min: 70, max: 79, label: 'Limite', labelEn: 'Borderline' },
  { min: 40, max: 69, label: 'Extrêmement bas', labelEn: 'Extremely Low' },
];

/**
 * Get interpretation label for an index value
 */
export function getIndexInterpretation(indexValue: number): string {
  for (const range of INDEX_INTERPRETATION_RANGES) {
    if (indexValue >= range.min && indexValue <= range.max) {
      return range.label;
    }
  }
  return 'Non classifiable';
}
