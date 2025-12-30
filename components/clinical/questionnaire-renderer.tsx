"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { Question } from "@/lib/types/database.types";
import {
  evaluateConditionalLogic,
  validateQuestionnaireResponse,
  calculateQuestionnaireProgress,
} from "@/lib/utils/questionnaire-logic";
import { calculateTmtScores } from "@/lib/services/tmt-scoring";
import { calculateStroopScores } from "@/lib/services/stroop-scoring";
import { calculateWais3DigitSpanScores } from "@/lib/services/wais3-digit-span-scoring";
import { Loader2, ChevronDown, Info } from "lucide-react";

interface QuestionnaireRendererProps {
  questionnaire: QuestionnaireDefinition;
  initialResponses?: Record<string, any>;
  onSubmit: (responses: Record<string, any>) => Promise<void>;
  onSave?: (responses: Record<string, any>) => Promise<void>;
  onResponseChange?: (responses: Record<string, any>) => void;
  readonly?: boolean;
}

// Stable empty object to use as default for initialResponses
const EMPTY_RESPONSES: Record<string, any> = {};

export function QuestionnaireRenderer({
  questionnaire,
  initialResponses,
  onSubmit,
  onSave,
  onResponseChange,
  readonly = false,
}: QuestionnaireRendererProps) {
  // Use stable empty object as default
  const stableInitialResponses = initialResponses ?? EMPTY_RESPONSES;
  
  // Initialize responses with defaults for date fields
  const initializeResponses = useCallback(() => {
    const initialized = { ...stableInitialResponses };
    questionnaire.questions.forEach((q) => {
      if (q.type === 'date' && q.metadata?.default === 'today' && !initialized[q.id]) {
        initialized[q.id] = new Date().toISOString().split('T')[0];
      }
    });
    return initialized;
  }, [stableInitialResponses, questionnaire.questions]);

  const [responses, setResponses] = useState<Record<string, any>>(initializeResponses);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track expanded sections (for collapsible sections)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Track if initial mount has happened
  const isInitialMount = useRef(true);
  
  // Initialize all sections as expanded by default
  useEffect(() => {
    const sectionIds = questionnaire.questions
      .filter(q => q.type === 'section')
      .map(q => q.id);
    setExpandedSections(new Set(sectionIds));
  }, [questionnaire.questions]);

  // Update responses when initialResponses changes (skip initial mount since useState handles it)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setResponses(initializeResponses());
  }, [initializeResponses]);

  // Compute derived fields (BMI, tension) when their dependencies change
  useEffect(() => {
    setResponses((prev) => {
      const updated = { ...prev };
      let hasChanges = false;

      // Compute BMI if height and weight are available
      if (prev.height_cm && prev.weight_kg) {
        const heightInMeters = prev.height_cm / 100;
        const calculatedBMI = prev.weight_kg / (heightInMeters * heightInMeters);
        const bmiRounded = Math.round(calculatedBMI * 100) / 100; // Round to 2 decimals
        if (updated.bmi !== bmiRounded) {
          updated.bmi = bmiRounded;
          hasChanges = true;
        }
      } else if (prev.bmi) {
        // Clear BMI if height or weight is missing
        delete updated.bmi;
        hasChanges = true;
      }

      // Compute tension_lying if both values are available
      if (prev.bp_lying_systolic && prev.bp_lying_diastolic) {
        const tensionLying = `${prev.bp_lying_systolic}/${prev.bp_lying_diastolic}`;
        if (updated.tension_lying !== tensionLying) {
          updated.tension_lying = tensionLying;
          hasChanges = true;
        }
      } else if (prev.tension_lying) {
        delete updated.tension_lying;
        hasChanges = true;
      }

      // Compute tension_standing if both values are available
      if (prev.bp_standing_systolic && prev.bp_standing_diastolic) {
        const tensionStanding = `${prev.bp_standing_systolic}/${prev.bp_standing_diastolic}`;
        if (updated.tension_standing !== tensionStanding) {
          updated.tension_standing = tensionStanding;
          hasChanges = true;
        }
      } else if (prev.tension_standing) {
        delete updated.tension_standing;
        hasChanges = true;
      }

      // Compute QTc (ECG) if QT and RR are available
      // Formula: QTc = QT / √RR (Bazett's formula)
      if (prev.qt_measured && prev.rr_measured) {
        const qtMeasured = parseFloat(prev.qt_measured);
        const rrMeasured = parseFloat(prev.rr_measured);
        if (qtMeasured > 0 && rrMeasured > 0) {
          const qtcCalculated = qtMeasured / Math.sqrt(rrMeasured);
          const qtcRounded = Math.round(qtcCalculated * 1000) / 1000; // Round to 3 decimals
          if (updated.qtc_calculated !== qtcRounded) {
            updated.qtc_calculated = qtcRounded;
            hasChanges = true;
          }
        }
      } else if (prev.qtc_calculated) {
        // Clear QTc if QT or RR is missing
        delete updated.qtc_calculated;
        hasChanges = true;
      }

      // Compute clairance_creatinine if creatinine, weight, age, and gender are available
      // Note: weight comes from physical params questionnaire, age/gender from patient profile
      // This will compute if weight is available in responses (e.g., from initialResponses that includes data from other questionnaires)
      if (prev.creatinine && prev.weight_kg && prev.patient_age && prev.patient_gender) {
        const creatinine = parseFloat(prev.creatinine);
        const weight = parseFloat(prev.weight_kg);
        const age = parseInt(prev.patient_age);
        const gender = prev.patient_gender?.toLowerCase();
        
        if (creatinine > 0 && weight > 0 && age > 0) {
          const isMale = gender === 'male' || gender === 'm' || gender === 'homme';
          const multiplier = isMale ? 1.23 : 1.04;
          const clearance = (multiplier * weight * (140 - age)) / creatinine;
          const roundedClearance = Math.round(clearance * 100) / 100;
          
          if (roundedClearance >= 10 && roundedClearance <= 200) {
            // Always update if value changed (recompute when creatinine changes)
            if (updated.clairance_creatinine !== roundedClearance) {
              updated.clairance_creatinine = roundedClearance;
              hasChanges = true;
            }
          } else {
            // Clear if value is out of range
            if (updated.clairance_creatinine !== undefined) {
              delete updated.clairance_creatinine;
              hasChanges = true;
            }
          }
        } else {
          // Clear if required values are invalid
          if (updated.clairance_creatinine !== undefined && !prev.clairance_creatinine) {
            // Only clear if it wasn't set server-side (keep server-side value if we can't compute)
          }
        }
      } else if (prev.clairance_creatinine) {
        // Keep server-side computed value if we don't have all required fields for client-side computation
        // Don't clear it
      }

      // Compute TMT scores if all required fields are available
      const tmtAge = Number(prev.patient_age);
      const tmtEdu = Number(prev.years_of_education);
      const tmtATps = Number(prev.tmta_tps);
      const tmtAErr = Number(prev.tmta_err);
      const tmtBTps = Number(prev.tmtb_tps);
      const tmtBErr = Number(prev.tmtb_err);
      const tmtBPersev = Number(prev.tmtb_err_persev);
      
      if (!isNaN(tmtAge) && tmtAge > 0 && 
          !isNaN(tmtEdu) && tmtEdu >= 0 && 
          !isNaN(tmtATps) && tmtATps >= 0 && 
          !isNaN(tmtAErr) && tmtAErr >= 0 &&
          !isNaN(tmtBTps) && tmtBTps >= 0 && 
          !isNaN(tmtBErr) && tmtBErr >= 0 &&
          !isNaN(tmtBPersev) && tmtBPersev >= 0) {
        try {
          const tmtScores = calculateTmtScores({
            patient_age: tmtAge,
            years_of_education: tmtEdu,
            tmta_tps: tmtATps,
            tmta_err: tmtAErr,
            tmta_cor: prev.tmta_cor ? Number(prev.tmta_cor) : null,
            tmtb_tps: tmtBTps,
            tmtb_err: tmtBErr,
            tmtb_cor: prev.tmtb_cor ? Number(prev.tmtb_cor) : null,
            tmtb_err_persev: tmtBPersev
          });

          // Update computed scores
          if (updated.tmta_errtot !== tmtScores.tmta_errtot) {
            updated.tmta_errtot = tmtScores.tmta_errtot;
            hasChanges = true;
          }
          if (updated.tmta_tps_z !== tmtScores.tmta_tps_z) {
            updated.tmta_tps_z = tmtScores.tmta_tps_z;
            hasChanges = true;
          }
          if (updated.tmta_tps_pc !== tmtScores.tmta_tps_pc) {
            updated.tmta_tps_pc = tmtScores.tmta_tps_pc;
            hasChanges = true;
          }
          if (updated.tmta_errtot_z !== tmtScores.tmta_errtot_z) {
            updated.tmta_errtot_z = tmtScores.tmta_errtot_z;
            hasChanges = true;
          }
          if (updated.tmtb_errtot !== tmtScores.tmtb_errtot) {
            updated.tmtb_errtot = tmtScores.tmtb_errtot;
            hasChanges = true;
          }
          if (updated.tmtb_tps_z !== tmtScores.tmtb_tps_z) {
            updated.tmtb_tps_z = tmtScores.tmtb_tps_z;
            hasChanges = true;
          }
          if (updated.tmtb_tps_pc !== tmtScores.tmtb_tps_pc) {
            updated.tmtb_tps_pc = tmtScores.tmtb_tps_pc;
            hasChanges = true;
          }
          if (updated.tmtb_errtot_z !== tmtScores.tmtb_errtot_z) {
            updated.tmtb_errtot_z = tmtScores.tmtb_errtot_z;
            hasChanges = true;
          }
          if (updated.tmt_b_a_tps !== tmtScores.tmt_b_a_tps) {
            updated.tmt_b_a_tps = tmtScores.tmt_b_a_tps;
            hasChanges = true;
          }
          if (updated.tmt_b_a_tps_z !== tmtScores.tmt_b_a_tps_z) {
            updated.tmt_b_a_tps_z = tmtScores.tmt_b_a_tps_z;
            hasChanges = true;
          }
        } catch (e) {
          // Ignore calculation errors (e.g., invalid values)
        }
      }

      // Compute Stroop scores progressively as fields are entered
      const stroopAge = Number(prev.patient_age);
      const stroopW = Number(prev.stroop_w_tot);
      const stroopC = Number(prev.stroop_c_tot);
      const stroopCW = Number(prev.stroop_cw_tot);
      
      // Helper to get age correction factor for Words
      const getWordCorrection = (age: number) => age < 45 ? 0 : (age < 65 ? 8 : 14);
      // Helper to get age correction factor for Colors
      const getColorCorrection = (age: number) => age < 45 ? 0 : (age < 65 ? 4 : 11);
      // Helper to get age correction factor for Color-Words
      const getColorWordCorrection = (age: number) => age < 45 ? 0 : (age < 65 ? 5 : 15);
      
      // T-score lookup tables
      const NOTET_MOTS = [48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168];
      const NOTET_COULEUR = [35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125];
      const NOTET_COULEURMOT = [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75];
      const NOTET_INTERF = [-30, -28, -26, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
      const NOTET_SCORET = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
      
      const lookupTScore = (rawScore: number, values: number[]) => {
        if (rawScore <= values[0]) return NOTET_SCORET[0];
        if (rawScore >= values[values.length - 1]) return NOTET_SCORET[NOTET_SCORET.length - 1];
        for (let i = 0; i < values.length - 1; i++) {
          if (rawScore >= values[i] && rawScore <= values[i + 1]) {
            const ratio = (rawScore - values[i]) / (values[i + 1] - values[i]);
            return Math.round(NOTET_SCORET[i] + ratio * (NOTET_SCORET[i + 1] - NOTET_SCORET[i]));
          }
        }
        return 50;
      };
      
      const tToZ = (t: number) => Number(((t - 50) / 10).toFixed(2));
      
      if (!isNaN(stroopAge) && stroopAge > 0) {
        // Compute Words scores if available
        if (!isNaN(stroopW) && stroopW >= 0) {
          const wCorrected = stroopW + getWordCorrection(stroopAge);
          if (updated.stroop_w_tot_c !== wCorrected) {
            updated.stroop_w_tot_c = wCorrected;
            hasChanges = true;
          }
          const wT = lookupTScore(wCorrected, NOTET_MOTS);
          if (updated.stroop_w_note_t !== wT) {
            updated.stroop_w_note_t = wT;
            hasChanges = true;
          }
          const wZ = tToZ(wT);
          if (updated.stroop_w_note_t_corrigee !== wZ) {
            updated.stroop_w_note_t_corrigee = wZ;
            hasChanges = true;
          }
        }
        
        // Compute Colors scores if available
        if (!isNaN(stroopC) && stroopC >= 0) {
          const cCorrected = stroopC + getColorCorrection(stroopAge);
          if (updated.stroop_c_tot_c !== cCorrected) {
            updated.stroop_c_tot_c = cCorrected;
            hasChanges = true;
          }
          const cT = lookupTScore(cCorrected, NOTET_COULEUR);
          if (updated.stroop_c_note_t !== cT) {
            updated.stroop_c_note_t = cT;
            hasChanges = true;
          }
          const cZ = tToZ(cT);
          if (updated.stroop_c_note_t_corrigee !== cZ) {
            updated.stroop_c_note_t_corrigee = cZ;
            hasChanges = true;
          }
        }
        
        // Compute Color-Words scores if available
        if (!isNaN(stroopCW) && stroopCW >= 0) {
          const cwCorrected = stroopCW + getColorWordCorrection(stroopAge);
          if (updated.stroop_cw_tot_c !== cwCorrected) {
            updated.stroop_cw_tot_c = cwCorrected;
            hasChanges = true;
          }
          const cwT = lookupTScore(cwCorrected, NOTET_COULEURMOT);
          if (updated.stroop_cw_note_t !== cwT) {
            updated.stroop_cw_note_t = cwT;
            hasChanges = true;
          }
          const cwZ = tToZ(cwT);
          if (updated.stroop_cw_note_t_corrigee !== cwZ) {
            updated.stroop_cw_note_t_corrigee = cwZ;
            hasChanges = true;
          }
        }
        
        // Compute Interference only when all three corrected scores are available
        if (!isNaN(stroopW) && stroopW >= 0 && 
            !isNaN(stroopC) && stroopC >= 0 && 
            !isNaN(stroopCW) && stroopCW >= 0) {
          const wC = stroopW + getWordCorrection(stroopAge);
          const cC = stroopC + getColorCorrection(stroopAge);
          const cwC = stroopCW + getColorWordCorrection(stroopAge);
          const predicted = (cC * wC) / (cC + wC);
          const interf = Number((cwC - predicted).toFixed(2));
          if (updated.stroop_interf !== interf) {
            updated.stroop_interf = interf;
            hasChanges = true;
          }
          const interfT = lookupTScore(interf, NOTET_INTERF);
          if (updated.stroop_interf_note_t !== interfT) {
            updated.stroop_interf_note_t = interfT;
            hasChanges = true;
          }
          const interfZ = tToZ(interfT);
          if (updated.stroop_interf_note_tz !== interfZ) {
            updated.stroop_interf_note_tz = interfZ;
            hasChanges = true;
          }
        }
      }

      // Compute COBRA total score (sum of q1-q16) - only for COBRA questionnaire
      // Check if this is COBRA by verifying all 16 COBRA-specific fields exist
      // This prevents conflict with other questionnaires that use q2, q3, etc. (like MDQ)
      const cobraFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16'];
      const hasAllCobraFields = cobraFields.every(f => prev[f] !== undefined || prev[f] === 0);
      if (hasAllCobraFields) {
        const cobraValues = cobraFields.map(f => prev[f]).filter(v => v !== undefined && v !== '' && !isNaN(Number(v)));
        if (cobraValues.length > 0) {
          const cobraTotal = cobraValues.reduce((sum, v) => sum + Number(v), 0);
          if (updated.total_score !== cobraTotal) {
            updated.total_score = cobraTotal;
            hasChanges = true;
          }
        }
      }

      // Compute WAIS4 Similitudes scores
      const simiAge = Number(prev.patient_age);
      const simiItems = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9',
                         'item10', 'item11', 'item12', 'item13', 'item14', 'item15', 'item16', 'item17', 'item18'];
      const simiValues = simiItems.map(f => prev[f]).filter(v => v !== undefined && v !== '' && !isNaN(Number(v)));
      
      if (simiValues.length > 0) {
        const simiRawTotal = simiValues.reduce((sum, v) => sum + Number(v), 0);
        if (updated.total_raw_score !== simiRawTotal) {
          updated.total_raw_score = simiRawTotal;
          hasChanges = true;
        }
        
        // If we have age, calculate standard score and standardized value
        if (!isNaN(simiAge) && simiAge >= 16 && simiAge <= 90) {
          // Age-based norm tables for Similitudes
          const SIMI_TAB: Record<string, string[]> = {
            age_16: ["0-4", "5-6", "7-8", "9-10", "11-12", "13-14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27", "28-29", "30-31", "32-33", "34-36"],
            age_18: ["0-4", "5-6", "7-8", "9-10", "11-12", "13-14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27", "28-29", "30-31", "32-33", "34-36"],
            age_20: ["0-9", "10-11", "12", "13", "14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27-28", "29-30", "31-32", "33", "34-35", "36"],
            age_25: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27-28", "29-30", "31-32", "33", "34-35", "36"],
            age_30: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27", "28", "29-30", "31-32", "33", "34-36"],
            age_35: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27", "28", "29-30", "31-32", "33", "34-36"],
            age_45: ["0-1", "2-3", "4-6", "7-9", "10-11", "12-13", "14-15", "16-17", "18-19", "20", "21-22", "23-24", "25", "26", "27", "28", "29-30", "31-32", "33-36"],
            age_55: ["0-1", "2-3", "4-6", "7-9", "10-11", "12-13", "14-15", "16-17", "18-19", "20", "21-22", "23-24", "25", "26", "27", "28", "29-30", "31-32", "33-36"],
            age_65: ["0-1", "2-3", "4-6", "7-9", "10", "11-12", "13-14", "15", "16-17", "18-19", "20-21", "22", "23-24", "25-26", "27", "28", "29-30", "31", "32-36"],
            age_70: ["0-1", "2-3", "4-6", "7-9", "10", "11-12", "13-14", "15", "16-17", "18-19", "20-21", "22", "23", "24", "25", "26-27", "28", "29", "30-36"],
            age_75: ["0", "1", "2", "3", "4-6", "7-9", "10-12", "13-15", "16-17", "18-19", "20", "21", "22", "23-24", "25", "26-27", "28", "29", "30-36"]
          };
          
          const getSimiAgeCategory = (age: number) => {
            if (age >= 16 && age <= 17) return 'age_16';
            if (age >= 18 && age <= 19) return 'age_18';
            if (age >= 20 && age <= 24) return 'age_20';
            if (age >= 25 && age <= 29) return 'age_25';
            if (age >= 30 && age <= 34) return 'age_30';
            if (age >= 35 && age <= 44) return 'age_35';
            if (age >= 45 && age <= 54) return 'age_45';
            if (age >= 55 && age <= 64) return 'age_55';
            if (age >= 65 && age <= 69) return 'age_65';
            if (age >= 70 && age <= 74) return 'age_70';
            return 'age_75';
          };
          
          const isInRange = (rawScore: number, rangeStr: string): boolean => {
            if (rangeStr.includes('-')) {
              const [min, max] = rangeStr.split('-').map(Number);
              return rawScore >= min && rawScore <= max;
            }
            return rawScore === Number(rangeStr);
          };
          
          const ageCat = getSimiAgeCategory(simiAge);
          const normTable = SIMI_TAB[ageCat];
          
          if (normTable) {
            let stdScore = 1;
            for (let i = 0; i < normTable.length; i++) {
              if (isInRange(simiRawTotal, normTable[i])) {
                stdScore = i + 1;
                break;
              }
            }
            if (simiRawTotal > 36) stdScore = 19;
            
            if (updated.standard_score !== stdScore) {
              updated.standard_score = stdScore;
              hasChanges = true;
            }
            
            const stdValue = Number(((stdScore - 10) / 3).toFixed(2));
            if (updated.standardized_value !== stdValue) {
              updated.standardized_value = stdValue;
              hasChanges = true;
            }
          }
        }
      }

      // Compute MATHYS sums progressively as fields are entered
      const isMathys = questionnaire.code === 'MATHYS';
      if (isMathys) {
        const isAnswered = (id: string) => prev[id] !== undefined && prev[id] !== null && prev[id] !== '';
        const reverseItems = [5, 6, 7, 8, 9, 10, 17, 18];
        const val = (id: string) => {
          const num = Number(prev[id]);
          const qNum = parseInt(id.replace('q', ''));
          return reverseItems.includes(qNum) ? 10 - num : num;
        };

        const emotionQs = ['q3', 'q7', 'q10', 'q18'];
        const motivationQs = ['q2', 'q11', 'q12', 'q15', 'q16', 'q17', 'q19'];
        const perceptionQs = ['q1', 'q6', 'q8', 'q13', 'q20'];
        const interactionQs = ['q4', 'q14'];
        const cognitionQs = ['q5', 'q9'];

        const sumEmotion = emotionQs.every(isAnswered) ? emotionQs.reduce((acc, q) => acc + val(q), 0) : undefined;
        const sumMotivation = motivationQs.every(isAnswered) ? motivationQs.reduce((acc, q) => acc + val(q), 0) : undefined;
        const sumPerception = perceptionQs.every(isAnswered) ? perceptionQs.reduce((acc, q) => acc + val(q), 0) : undefined;
        const sumInteraction = interactionQs.every(isAnswered) ? interactionQs.reduce((acc, q) => acc + val(q), 0) : undefined;
        const sumCognition = cognitionQs.every(isAnswered) ? cognitionQs.reduce((acc, q) => acc + val(q), 0) : undefined;

        if (updated.subscore_emotion !== sumEmotion) { updated.subscore_emotion = sumEmotion; hasChanges = true; }
        if (updated.subscore_motivation !== sumMotivation) { updated.subscore_motivation = sumMotivation; hasChanges = true; }
        if (updated.subscore_perception !== sumPerception) { updated.subscore_perception = sumPerception; hasChanges = true; }
        if (updated.subscore_interaction !== sumInteraction) { updated.subscore_interaction = sumInteraction; hasChanges = true; }
        if (updated.subscore_cognition !== sumCognition) { updated.subscore_cognition = sumCognition; hasChanges = true; }

        const allSubscores = [sumEmotion, sumMotivation, sumPerception, sumInteraction, sumCognition];
        const mathysTotal = allSubscores.every(s => s !== undefined) ? (sumEmotion! + sumMotivation! + sumPerception! + sumInteraction! + sumCognition!) : undefined;
        if (updated.total_score !== mathysTotal) { updated.total_score = mathysTotal; hasChanges = true; }
      }

      // Compute PSQI scores progressively
      const isPsqi = questionnaire.code === 'PSQI';
      if (isPsqi) {
        const isAnswered = (id: string) => prev[id] !== undefined && prev[id] !== null && prev[id] !== '';
        const isValidTime = (str: any) => typeof str === 'string' && /^\d{1,2}:\d{2}$/.test(str);
        
        const hhmmToHours = (str: any) => {
          if (!isValidTime(str)) return 0;
          const [h, m] = str.split(':').map(Number);
          return h + (m / 60);
        };

        // C1: Quality (q6)
        const c1 = isAnswered('q6') ? Number(prev.q6) : undefined;
        
        // C2: Latency (q2_minutes_to_sleep AND q5a)
        let c2: number | undefined = undefined;
        if (isAnswered('q2_minutes_to_sleep') && isAnswered('q5a')) {
          const q2min = Number(prev.q2_minutes_to_sleep);
          let lScore = 0;
          if (q2min <= 15) lScore = 0;
          else if (q2min <= 30) lScore = 1;
          else if (q2min <= 60) lScore = 2;
          else lScore = 3;
          c2 = Math.min(3, Math.floor((lScore + Number(prev.q5a)) / 2));
        }
        
        // C3: Duration (q4_hours_sleep)
        let c3: number | undefined = undefined;
        if (isValidTime(prev.q4_hours_sleep)) {
          const q4Hours = hhmmToHours(prev.q4_hours_sleep);
          if (q4Hours > 7) c3 = 0;
          else if (q4Hours >= 6) c3 = 1;
          else if (q4Hours >= 5) c3 = 2;
          else c3 = 3;
        }
        
        // C4: Efficiency (q1_bedtime, q3_waketime, q4_hours_sleep)
        let c4: number | undefined = undefined;
        if (isValidTime(prev.q1_bedtime) && isValidTime(prev.q3_waketime) && isValidTime(prev.q4_hours_sleep)) {
          const q1Time = hhmmToHours(prev.q1_bedtime);
          const q3Time = hhmmToHours(prev.q3_waketime);
          const q4Hours = hhmmToHours(prev.q4_hours_sleep);
          let tib = q3Time - q1Time;
          if (tib <= 0) tib += 24; 
          if (tib > 0) {
            const eff = (q4Hours / tib) * 100;
            if (eff >= 85) c4 = 0;
            else if (eff >= 75) c4 = 1;
            else if (eff >= 65) c4 = 2;
            else c4 = 3;
          }
        }

        // C5: Disturbances (q5b to q5j)
        const dFields = ['q5b', 'q5c', 'q5d', 'q5e', 'q5f', 'q5g', 'q5h', 'q5i', 'q5j'];
        let c5: number | undefined = undefined;
        if (dFields.every(isAnswered)) {
          const dSum = dFields.reduce((acc, f) => acc + Number(prev[f]), 0);
          if (dSum === 0) c5 = 0;
          else if (dSum <= 9) c5 = 1;
          else if (dSum <= 18) c5 = 2;
          else c5 = 3;
        }

        // C6: Medication (q7)
        const c6 = isAnswered('q7') ? Number(prev.q7) : undefined;

        // C7: Daytime dysfunction (q8 AND q9)
        let c7: number | undefined = undefined;
        if (isAnswered('q8') && isAnswered('q9')) {
          c7 = Math.min(3, Math.floor((Number(prev.q8) + Number(prev.q9)) / 2));
        }

        const components = [c1, c2, c3, c4, c5, c6, c7];
        const total = components.every(c => c !== undefined) ? components.reduce((acc, c) => acc! + c!, 0) : undefined;

        if (updated.c1_subjective_quality !== c1) { updated.c1_subjective_quality = c1; hasChanges = true; }
        if (updated.c2_latency !== c2) { updated.c2_latency = c2; hasChanges = true; }
        if (updated.c3_duration !== c3) { updated.c3_duration = c3; hasChanges = true; }
        if (updated.c4_efficiency !== c4) { updated.c4_efficiency = c4; hasChanges = true; }
        if (updated.c5_disturbances !== c5) { updated.c5_disturbances = c5; hasChanges = true; }
        if (updated.c6_medication !== c6) { updated.c6_medication = c6; hasChanges = true; }
        if (updated.c7_daytime_dysfunction !== c7) { updated.c7_daytime_dysfunction = c7; hasChanges = true; }
        if (updated.total_score !== total) { updated.total_score = total; hasChanges = true; }
      }

      // Compute SCIP Z-scores
      // Simple formula: Z = (raw_score - mean) / std for each subscale
      const SCIP_NORMS = {
        scipv01: { mean: 23.59, std: 2.87 },
        scipv02: { mean: 20.66, std: 2.45 },
        scipv03: { mean: 17.44, std: 4.74 },
        scipv04: { mean: 7.65, std: 1.90 },
        scipv05: { mean: 14.26, std: 2.25 }
      };
      
      const scipv01a = Number(prev.scipv01a);
      const scipv02a = Number(prev.scipv02a);
      const scipv03a = Number(prev.scipv03a);
      const scipv04a = Number(prev.scipv04a);
      const scipv05a = Number(prev.scipv05a);
      
      if (prev.scipv01a !== undefined && prev.scipv01a !== '' && !isNaN(scipv01a) && scipv01a >= 0) {
        const scipv01b = Number(((scipv01a - SCIP_NORMS.scipv01.mean) / SCIP_NORMS.scipv01.std).toFixed(2));
        if (updated.scipv01b !== scipv01b) {
          updated.scipv01b = scipv01b;
          hasChanges = true;
        }
      }
      
      if (prev.scipv02a !== undefined && prev.scipv02a !== '' && !isNaN(scipv02a) && scipv02a >= 0) {
        const scipv02b = Number(((scipv02a - SCIP_NORMS.scipv02.mean) / SCIP_NORMS.scipv02.std).toFixed(2));
        if (updated.scipv02b !== scipv02b) {
          updated.scipv02b = scipv02b;
          hasChanges = true;
        }
      }
      
      if (prev.scipv03a !== undefined && prev.scipv03a !== '' && !isNaN(scipv03a) && scipv03a >= 0) {
        const scipv03b = Number(((scipv03a - SCIP_NORMS.scipv03.mean) / SCIP_NORMS.scipv03.std).toFixed(2));
        if (updated.scipv03b !== scipv03b) {
          updated.scipv03b = scipv03b;
          hasChanges = true;
        }
      }
      
      if (prev.scipv04a !== undefined && prev.scipv04a !== '' && !isNaN(scipv04a) && scipv04a >= 0) {
        const scipv04b = Number(((scipv04a - SCIP_NORMS.scipv04.mean) / SCIP_NORMS.scipv04.std).toFixed(2));
        if (updated.scipv04b !== scipv04b) {
          updated.scipv04b = scipv04b;
          hasChanges = true;
        }
      }
      
      if (prev.scipv05a !== undefined && prev.scipv05a !== '' && !isNaN(scipv05a) && scipv05a >= 0) {
        const scipv05b = Number(((scipv05a - SCIP_NORMS.scipv05.mean) / SCIP_NORMS.scipv05.std).toFixed(2));
        if (updated.scipv05b !== scipv05b) {
          updated.scipv05b = scipv05b;
          hasChanges = true;
        }
      }

      // Compute Fluences Verbales scores progressively as fields are entered
      // Only execute for Fluences Verbales questionnaires
      if (questionnaire?.code === 'FLUENCES_VERBALES_FR' || questionnaire?.code === 'WAIS3_FLUENCES_VERBALES_FR') {
      const fvAge = Number(prev.patient_age);
      const fvEdu = Number(prev.years_of_education);
      const fvP = Number(prev.fv_p_tot_correct);
      const fvAnim = Number(prev.fv_anim_tot_correct);
      
      // Fluences Verbales norm tables
      const TAB_FLUENCE_P: Record<string, Record<string, number[]>> = {
        age_0: {
          edu_0: [5.9, 9, 14, 16.5, 22.75, 25.7, 28.35, 17.3, 6.4],
          edu_1: [10.8, 12, 14, 19, 24, 27.2, 31.2, 19.5, 6.3],
          edu_2: [13, 14, 19, 25, 28.75, 32.3, 34, 24, 6.6]
        },
        age_1: {
          edu_0: [8.2, 11, 15.5, 20, 25, 27.8, 31.8, 19.9, 6.9],
          edu_1: [10.1, 13.2, 16, 21, 25, 28.8, 30, 20.9, 5.9],
          edu_2: [15.5, 18, 22, 25, 30, 34, 37.5, 25.7, 6.3]
        },
        age_2: {
          edu_0: [6.5, 8, 12, 16, 20, 22, 25, 15.7, 5.6],
          edu_1: [9.75, 12, 14.75, 19, 24, 30, 32.25, 19.7, 6.7],
          edu_2: [12.25, 15.5, 19, 22, 26, 30, 31.25, 22.4, 5.5]
        }
      };
      
      const TAB_FLUENCE_ANIM: Record<string, Record<string, number[]>> = {
        age_0: {
          edu_0: [19, 21, 24.25, 31, 34, 38, 38.7, 29.5, 6],
          edu_1: [18.4, 19.8, 24, 29, 36, 40, 44.2, 29.9, 7.9],
          edu_2: [21, 24, 28, 34, 40, 45, 48.2, 34.2, 8.2]
        },
        age_1: {
          edu_0: [16, 20.4, 23, 26, 32, 42.6, 45.9, 28.2, 7.9],
          edu_1: [18.2, 21.4, 27, 32, 35, 40, 42.9, 31.3, 6.8],
          edu_2: [24.5, 27, 31.5, 36, 40, 47, 52.5, 36.8, 8.7]
        },
        age_2: {
          edu_0: [16, 17, 20, 24, 29.75, 33, 37, 24.7, 6.3],
          edu_1: [14.75, 17, 22, 26, 32, 37, 41, 26.8, 7.4],
          edu_2: [15.25, 21, 23.75, 30, 35.5, 39.5, 43.25, 29.7, 8.8]
        }
      };
      
      const getFvAgeCategory = (age: number) => age < 40 ? 'age_0' : (age < 60 ? 'age_1' : 'age_2');
      const getFvEduLevel = (years: number) => years < 6 ? 'edu_0' : (years < 12 ? 'edu_1' : 'edu_2');
      
      const calcFvZScore = (value: number, mean: number, stdDev: number) => 
        stdDev === 0 ? 0 : Number(((value - mean) / stdDev).toFixed(2));
      
      const calcFvPercentile = (value: number, norms: number[]) => {
        const [p5, p10, p25, p50, p75, p90, p95] = norms;
        if (value >= p95) return 95;
        if (value >= p90) return 90;
        if (value >= p75) return 75;
        if (value >= p50) return 50;
        if (value >= p25) return 25;
        if (value >= p10) return 10;
        if (value >= p5) return 5;
        return 1;
      };
      
      if (!isNaN(fvAge) && fvAge > 0 && !isNaN(fvEdu) && fvEdu >= 0) {
        const ageCat = getFvAgeCategory(fvAge);
        const eduLvl = getFvEduLevel(fvEdu);
        
        // Calculate rule violations for Lettre P
        const pDeriv = Number(prev.fv_p_deriv) || 0;
        const pIntrus = Number(prev.fv_p_intrus) || 0;
        const pPropres = Number(prev.fv_p_propres) || 0;
        const pRupregle = pDeriv + pIntrus + pPropres;
        if (updated.fv_p_tot_rupregle !== pRupregle) {
          updated.fv_p_tot_rupregle = pRupregle;
          hasChanges = true;
        }
        
        // Calculate rule violations for Animaux
        const animDeriv = Number(prev.fv_anim_deriv) || 0;
        const animIntrus = Number(prev.fv_anim_intrus) || 0;
        const animPropres = Number(prev.fv_anim_propres) || 0;
        const animRupregle = animDeriv + animIntrus + animPropres;
        if (updated.fv_anim_tot_rupregle !== animRupregle) {
          updated.fv_anim_tot_rupregle = animRupregle;
          hasChanges = true;
        }
        
        // Calculate Lettre P scores if available
        if (!isNaN(fvP) && fvP >= 0) {
          const normsP = TAB_FLUENCE_P[ageCat][eduLvl];
          const pZ = calcFvZScore(fvP, normsP[7], normsP[8]);
          if (updated.fv_p_tot_correct_z !== pZ) {
            updated.fv_p_tot_correct_z = pZ;
            hasChanges = true;
          }
          const pPc = calcFvPercentile(fvP, normsP);
          if (updated.fv_p_tot_correct_pc !== pPc) {
            updated.fv_p_tot_correct_pc = pPc;
            hasChanges = true;
          }
        }
        
        // Calculate Animaux scores if available
        if (!isNaN(fvAnim) && fvAnim >= 0) {
          const normsAnim = TAB_FLUENCE_ANIM[ageCat][eduLvl];
          const animZ = calcFvZScore(fvAnim, normsAnim[7], normsAnim[8]);
          if (updated.fv_anim_tot_correct_z !== animZ) {
            updated.fv_anim_tot_correct_z = animZ;
            hasChanges = true;
          }
          const animPc = calcFvPercentile(fvAnim, normsAnim);
          if (updated.fv_anim_tot_correct_pc !== animPc) {
            updated.fv_anim_tot_correct_pc = animPc;
            hasChanges = true;
          }
        }
      }
      } // End Fluences Verbales calculations

      // Compute WAIS-III Vocabulaire total score (sum of item1 to item33)
      const vocabItems = [
        'item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10',
        'item11', 'item12', 'item13', 'item14', 'item15', 'item16', 'item17', 'item18', 'item19', 'item20',
        'item21', 'item22', 'item23', 'item24', 'item25', 'item26', 'item27', 'item28', 'item29', 'item30',
        'item31', 'item32', 'item33'
      ];
      const vocabValues = vocabItems.map(f => prev[f]).filter(v => v !== undefined && v !== '' && !isNaN(Number(v)));
      
      if (vocabValues.length > 0) {
        const vocabRawTotal = vocabValues.reduce((sum, v) => sum + Number(v), 0);
        if (updated.total_raw_score !== vocabRawTotal) {
          updated.total_raw_score = vocabRawTotal;
          hasChanges = true;
        }
      }

      // Compute WAIS-III Matrices scores (for questionnaire with item_01 to item_26)
      const matricesAge = Number(prev.patient_age);
      const matricesItems = [
        'item_01', 'item_02', 'item_03', 'item_04', 'item_05', 'item_06', 'item_07', 'item_08', 'item_09', 'item_10',
        'item_11', 'item_12', 'item_13', 'item_14', 'item_15', 'item_16', 'item_17', 'item_18', 'item_19', 'item_20',
        'item_21', 'item_22', 'item_23', 'item_24', 'item_25', 'item_26'
      ];
      const matricesValues = matricesItems.map(f => prev[f]).filter(v => v !== undefined && v !== '' && !isNaN(Number(v)));
      
      // Only process if all 26 items are filled in
      if (matricesValues.length === 26 && !isNaN(matricesAge) && matricesAge >= 16) {
        const matricesRawTotal = matricesValues.reduce((sum, v) => sum + Number(v), 0);
        if (updated.total_raw_score !== matricesRawTotal) {
          updated.total_raw_score = matricesRawTotal;
          hasChanges = true;
        }
        
        // WAIS-III Matrices norm table (different from WAIS-IV)
        const WAIS3_MATRICES_NORMS: Record<string, number[]> = {
          '16-17': [7, 9, 10, 11, 13, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
          '18-19': [7, 9, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0, 0],
          '20-24': [7, 8, 10, 12, 14, 16, 18, 20, 21, 22, 23, 0, 24, 0, 25, 0, 26, 0, 0],
          '25-29': [7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0, 0],
          '30-34': [7, 9, 10, 12, 13, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
          '35-44': [5, 6, 7, 9, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 0, 25, 26, 0, 0],
          '45-54': [2, 4, 5, 6, 7, 9, 13, 15, 17, 19, 20, 21, 23, 24, 25, 0, 26, 0, 0],
          '55-64': [2, 3, 4, 5, 6, 8, 11, 14, 16, 17, 19, 21, 22, 0, 23, 24, 25, 26, 0],
          '65-69': [1, 2, 3, 4, 5, 6, 7, 11, 13, 16, 19, 20, 21, 22, 23, 24, 25, 26, 0],
          '70-74': [1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 15, 17, 18, 19, 20, 21, 23, 24, 26],
          '75-79': [1, 2, 3, 4, 0, 5, 6, 7, 8, 10, 12, 14, 16, 17, 19, 20, 21, 22, 26],
          '80+': [0, 1, 2, 0, 3, 4, 0, 5, 6, 8, 10, 12, 14, 16, 19, 20, 21, 22, 26]
        };
        
        const getMatricesAgeGroup = (age: number): string => {
          if (age >= 16 && age <= 17) return '16-17';
          if (age >= 18 && age <= 19) return '18-19';
          if (age >= 20 && age <= 24) return '20-24';
          if (age >= 25 && age <= 29) return '25-29';
          if (age >= 30 && age <= 34) return '30-34';
          if (age >= 35 && age <= 44) return '35-44';
          if (age >= 45 && age <= 54) return '45-54';
          if (age >= 55 && age <= 64) return '55-64';
          if (age >= 65 && age <= 69) return '65-69';
          if (age >= 70 && age <= 74) return '70-74';
          if (age >= 75 && age <= 79) return '75-79';
          return '80+';
        };
        
        const findMatricesStandardScore = (rawScore: number, ageGroup: string): number => {
          const norms = WAIS3_MATRICES_NORMS[ageGroup];
          if (!norms) return 10;
          
          for (let i = 0; i < norms.length; i++) {
            const maxRaw = norms[i];
            const ss = i + 1; // Standard scores 1-19
            if (maxRaw === 0) continue; // Skip invalid entries
            if (rawScore <= maxRaw) return ss;
          }
          return 19; // If exceeded all thresholds
        };
        
        const matAgeGroup = getMatricesAgeGroup(matricesAge);
        const matStdScore = findMatricesStandardScore(matricesRawTotal, matAgeGroup);
        
        if (updated.standard_score !== matStdScore) {
          updated.standard_score = matStdScore;
          hasChanges = true;
        }
        
        const matStdValue = Number(((matStdScore - 10) / 3).toFixed(2));
        if (updated.standardized_value !== matStdValue) {
          updated.standardized_value = matStdValue;
          hasChanges = true;
        }
      }

      // Compute WAIS-IV Code scores (WAIS-IV uses different norms than WAIS-III)
      // Only for WAIS4_CODE_FR questionnaire
      if (questionnaire?.code === 'WAIS4_CODE_FR') {
        const wais4Age = Number(prev.patient_age);
        const wais4CodTot = Number(prev.wais_cod_tot);
        const wais4CodErr = Number(prev.wais_cod_err);
        
        const hasWais4Age = !isNaN(wais4Age) && wais4Age >= 16 && wais4Age <= 90;
        const hasWais4CodTot = prev.wais_cod_tot !== undefined && prev.wais_cod_tot !== '' && !isNaN(wais4CodTot) && wais4CodTot >= 0;
        const hasWais4CodErr = prev.wais_cod_err !== undefined && prev.wais_cod_err !== '' && !isNaN(wais4CodErr) && wais4CodErr >= 0;
        
        // Only compute scores if BOTH fields are filled
        if (hasWais4Age && hasWais4CodTot && hasWais4CodErr) {
          // WAIS-IV Code norm tables
          const WAIS4_CODE_NORMS: Record<string, number[]> = {
            age_16: [32, 36, 40, 45, 51, 55, 58, 61, 64, 68, 72, 76, 81, 86, 92, 98, 101, 104, 135],
            age_18: [36, 40, 44, 48, 52, 56, 61, 66, 69, 72, 76, 81, 85, 90, 95, 98, 101, 104, 135],
            age_20: [38, 42, 46, 50, 54, 58, 64, 70, 74, 78, 81, 87, 92, 95, 98, 101, 104, 107, 135],
            age_25: [32, 36, 41, 46, 52, 56, 62, 68, 74, 78, 84, 88, 92, 98, 102, 106, 110, 114, 135],
            age_30: [31, 35, 40, 46, 52, 55, 59, 68, 73, 78, 83, 89, 94, 98, 102, 106, 110, 113, 135],
            age_35: [28, 32, 36, 42, 47, 52, 56, 61, 66, 72, 78, 82, 86, 90, 97, 103, 107, 110, 135],
            age_45: [22, 26, 30, 35, 43, 46, 50, 60, 66, 70, 73, 77, 81, 87, 93, 98, 104, 108, 135],
            age_55: [15, 20, 25, 29, 36, 41, 45, 50, 55, 62, 66, 71, 77, 82, 90, 96, 102, 106, 135],
            age_65: [14, 19, 23, 27, 32, 37, 42, 46, 49, 57, 63, 69, 73, 78, 88, 93, 97, 101, 135],
            age_70: [13, 17, 20, 23, 25, 28, 31, 37, 43, 47, 53, 58, 62, 67, 71, 74, 79, 85, 135],
            age_75: [10, 13, 16, 19, 22, 26, 30, 33, 37, 43, 48, 53, 57, 60, 67, 72, 77, 82, 135]
          };
          
          const getWais4AgeGroup = (age: number): string => {
            if (age >= 75) return 'age_75';
            if (age > 70) return 'age_70';
            if (age > 65) return 'age_65';
            if (age > 55) return 'age_55';
            if (age > 45) return 'age_45';
            if (age > 35) return 'age_35';
            if (age > 30) return 'age_30';
            if (age > 25) return 'age_25';
            if (age >= 20) return 'age_20';
            if (age >= 18) return 'age_18';
            return 'age_16';
          };
          
          // Raw score = total correct (errors not subtracted in WAIS-IV)
          const wais4CodBrut = wais4CodTot;
          updated.wais_cod_brut = wais4CodBrut;
          
          // Find standard score
          const ageGroup = getWais4AgeGroup(wais4Age);
          const norms = WAIS4_CODE_NORMS[ageGroup];
          let k = 0;
          while (k < 18 && wais4CodBrut > norms[k]) {
            k++;
          }
          const wais4CodStd = k + 1;
          updated.wais_cod_std = wais4CodStd;
          
          // Calculate standardized value (z-score)
          const wais4CodCr = Number(((wais4CodStd - 10) / 3).toFixed(2));
          updated.wais_cod_cr = wais4CodCr;
          
          hasChanges = true;
        } else {
          // Clear computed values if inputs are missing
          if (prev.wais_cod_brut !== undefined) {
            updated.wais_cod_brut = undefined;
            updated.wais_cod_std = undefined;
            updated.wais_cod_cr = undefined;
            hasChanges = true;
          }
        }
      }

      // Compute WAIS-III Code, Symboles & IVT scores
      // Check if this questionnaire has the Code/Symboles fields
      const hasCodeSymbFields = prev.wais_cod_tot !== undefined || prev.wais_symb_tot !== undefined;
      
      if (hasCodeSymbFields) {
        const codeSymbAge = Number(prev.patient_age);
        const codeTot = Number(prev.wais_cod_tot);
        const codeErr = Number(prev.wais_cod_err || 0);
        const symbTot = Number(prev.wais_symb_tot);
        const symbErr = Number(prev.wais_symb_err || 0);
        
        const hasCodeSymbAge = !isNaN(codeSymbAge) && codeSymbAge >= 16 && codeSymbAge <= 90;
        const hasCodeTot = prev.wais_cod_tot !== undefined && prev.wais_cod_tot !== '' && !isNaN(codeTot) && codeTot >= 0;
        const hasSymbTot = prev.wais_symb_tot !== undefined && prev.wais_symb_tot !== '' && !isNaN(symbTot) && symbTot >= 0;
        
        // WAIS-III Code norm tables
        const WAIS3_CODE_NORMS: Record<string, number[]> = {
          '16-17': [44, 48, 51, 53, 57, 64, 69, 74, 78, 82, 86, 91, 95, 99, 102, 105, 108, 111, 133],
          '18-19': [44, 48, 51, 53, 57, 64, 69, 74, 79, 84, 90, 95, 100, 104, 109, 114, 119, 124, 133],
          '20-24': [41, 45, 48, 50, 54, 61, 66, 72, 78, 83, 89, 94, 99, 103, 108, 113, 118, 123, 133],
          '25-29': [41, 45, 48, 50, 54, 61, 66, 72, 78, 83, 89, 94, 99, 103, 108, 113, 118, 123, 133],
          '30-34': [34, 39, 44, 49, 55, 59, 64, 69, 75, 82, 88, 91, 96, 100, 105, 108, 110, 114, 133],
          '35-44': [29, 34, 40, 45, 50, 55, 61, 66, 73, 79, 84, 88, 92, 97, 100, 103, 107, 111, 133],
          '45-54': [25, 30, 34, 39, 43, 49, 55, 61, 68, 74, 79, 85, 91, 93, 95, 98, 103, 108, 133],
          '55-64': [22, 25, 28, 31, 34, 41, 47, 52, 56, 62, 69, 74, 81, 86, 93, 96, 99, 103, 133],
          '65-69': [17, 21, 26, 29, 32, 38, 43, 50, 55, 59, 64, 69, 74, 81, 86, 92, 96, 101, 133],
          '70-74': [10, 14, 20, 25, 30, 33, 36, 40, 45, 51, 57, 63, 69, 74, 80, 83, 86, 90, 133],
          '75-79': [6, 9, 13, 20, 23, 26, 31, 36, 42, 47, 52, 56, 61, 66, 71, 77, 82, 87, 133],
          '80+': [1, 3, 5, 7, 12, 16, 20, 25, 32, 39, 46, 53, 58, 63, 66, 73, 80, 84, 133]
        };
        
        const WAIS3_SYMB_NORMS: Record<string, number[]> = {
          '16-17': [18, 20, 23, 26, 28, 30, 31, 32, 34, 36, 39, 42, 45, 48, 50, 52, 54, 56, 60],
          '18-19': [20, 22, 24, 25, 27, 29, 31, 34, 36, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
          '20-24': [19, 21, 23, 25, 27, 29, 31, 33, 35, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
          '25-29': [14, 16, 18, 20, 23, 25, 27, 30, 34, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
          '30-34': [13, 15, 17, 19, 21, 24, 26, 29, 31, 34, 38, 41, 43, 45, 48, 51, 54, 56, 60],
          '35-44': [10, 12, 14, 17, 20, 23, 26, 28, 31, 34, 37, 39, 41, 43, 46, 48, 51, 54, 60],
          '45-54': [10, 12, 14, 16, 18, 21, 23, 25, 28, 30, 32, 34, 38, 41, 44, 46, 48, 50, 60],
          '55-64': [7, 8, 10, 12, 14, 17, 20, 23, 25, 27, 29, 30, 32, 33, 35, 37, 39, 41, 60],
          '65-69': [6, 7, 9, 11, 13, 15, 17, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 60],
          '70-74': [1, 3, 4, 6, 8, 11, 14, 16, 18, 20, 23, 26, 29, 32, 34, 36, 38, 40, 60],
          '75-79': [1, 3, 4, 5, 7, 9, 11, 13, 15, 17, 19, 22, 25, 27, 30, 33, 35, 37, 60],
          '80+': [0, 1, 2, 3, 4, 5, 6, 8, 11, 14, 16, 19, 23, 27, 29, 31, 33, 34, 60]
        };
        
        const IVT_TABLE: Record<number, [number, string, string]> = {
          2: [50, '<0.1', '47-66'], 3: [50, '<0.1', '47-66'], 4: [54, '0.1', '51-70'],
          5: [58, '0.3', '54-73'], 6: [61, '0.5', '57-76'], 7: [64, '1', '60-78'],
          8: [67, '1', '62-81'], 9: [70, '2', '65-84'], 10: [73, '4', '67-86'],
          11: [75, '5', '69-88'], 12: [78, '7', '72-90'], 13: [81, '10', '74-93'],
          14: [84, '14', '77-96'], 15: [86, '18', '79-97'], 16: [89, '23', '81-100'],
          17: [91, '27', '83-102'], 18: [94, '34', '85-104'], 19: [97, '42', '88-107'],
          20: [100, '50', '91-109'], 21: [102, '55', '92-111'], 22: [105, '63', '95-114'],
          23: [108, '70', '98-116'], 24: [111, '77', '100-119'], 25: [114, '82', '103-121'],
          26: [116, '86', '104-123'], 27: [119, '90', '107-126'], 28: [122, '93', '110-128'],
          29: [124, '95', '111-130'], 30: [127, '96', '114-133'], 31: [130, '98', '116-135'],
          32: [133, '99', '119-138'], 33: [136, '99', '122-140'], 34: [140, '99.6', '125-144'],
          35: [143, '99.8', '128-146'], 36: [145, '99.9', '129-148'], 37: [148, '99.9', '132-151'],
          38: [150, '>99.9', '134-153']
        };
        
        const getCodeSymbAgeGroup = (age: number): string => {
          if (age >= 16 && age <= 17) return '16-17';
          if (age >= 18 && age <= 19) return '18-19';
          if (age >= 20 && age <= 24) return '20-24';
          if (age >= 25 && age <= 29) return '25-29';
          if (age >= 30 && age <= 34) return '30-34';
          if (age >= 35 && age <= 44) return '35-44';
          if (age >= 45 && age <= 54) return '45-54';
          if (age >= 55 && age <= 64) return '55-64';
          if (age >= 65 && age <= 69) return '65-69';
          if (age >= 70 && age <= 74) return '70-74';
          if (age >= 75 && age <= 79) return '75-79';
          return '80+';
        };
        
        const findCodeSymbStdScore = (rawScore: number, norms: number[]): number => {
          for (let i = 0; i < norms.length; i++) {
            if (rawScore <= norms[i]) return i + 1;
          }
          return 19;
        };
        
        if (hasCodeSymbAge && hasCodeTot) {
          const csAgeGroup = getCodeSymbAgeGroup(codeSymbAge);
          
          // Code subtest scoring - always recalculate
          const codeBrut = codeTot; // Raw score = total (errors ignored per spec)
          updated.wais_cod_brut = codeBrut;
          
          const codeStd = findCodeSymbStdScore(codeBrut, WAIS3_CODE_NORMS[csAgeGroup]);
          updated.wais_cod_std = codeStd;
          
          const codeCr = Number(((codeStd - 10) / 3).toFixed(2));
          updated.wais_cod_cr = codeCr;
          
          hasChanges = true;
          
          // Symboles subtest scoring (if data available)
          if (hasSymbTot) {
            const symbBrut = symbTot - symbErr;
            updated.wais_symb_brut = symbBrut;
            
            const symbStd = findCodeSymbStdScore(symbBrut, WAIS3_SYMB_NORMS[csAgeGroup]);
            updated.wais_symb_std = symbStd;
            
            const symbCr = Number(((symbStd - 10) / 3).toFixed(2));
            updated.wais_symb_cr = symbCr;
            
            // IVT calculation
            const sommeIvt = codeStd + symbStd;
            updated.wais_somme_ivt = sommeIvt;
            
            const clampedSum = Math.max(2, Math.min(38, sommeIvt));
            const ivtData = IVT_TABLE[clampedSum] || [100, '50', '91-109'];
            
            updated.wais_ivt = ivtData[0];
            updated.wais_ivt_rang = ivtData[1];
            updated.wais_ivt_95 = ivtData[2];
          }
        } else {
          // Clear computed values if inputs are missing
          if (prev.wais_cod_brut !== undefined) {
            updated.wais_cod_brut = undefined;
            updated.wais_cod_std = undefined;
            updated.wais_cod_cr = undefined;
            hasChanges = true;
          }
          if (prev.wais_symb_brut !== undefined) {
            updated.wais_symb_brut = undefined;
            updated.wais_symb_std = undefined;
            updated.wais_symb_cr = undefined;
            updated.wais_somme_ivt = undefined;
            updated.wais_ivt = undefined;
            updated.wais_ivt_rang = undefined;
            updated.wais_ivt_95 = undefined;
            hasChanges = true;
          }
        }
      }

      // Compute WAIS-III Digit Span scores
      const hasDigitSpanFields = prev.mcod_1a !== undefined || prev.mcoi_1a !== undefined;
      
      if (hasDigitSpanFields) {
        const dsAge = Number(prev.patient_age);
        const dsEducation = prev.education_level !== undefined ? Number(prev.education_level) : undefined;
        const hasValidAge = !isNaN(dsAge) && dsAge >= 16 && dsAge <= 90;
        
        // Check forward items
        const forwardItems = [
          prev.mcod_1a, prev.mcod_1b, prev.mcod_2a, prev.mcod_2b,
          prev.mcod_3a, prev.mcod_3b, prev.mcod_4a, prev.mcod_4b,
          prev.mcod_5a, prev.mcod_5b, prev.mcod_6a, prev.mcod_6b,
          prev.mcod_7a, prev.mcod_7b, prev.mcod_8a, prev.mcod_8b
        ];
        
        const backwardItems = [
          prev.mcoi_1a, prev.mcoi_1b, prev.mcoi_2a, prev.mcoi_2b,
          prev.mcoi_3a, prev.mcoi_3b, prev.mcoi_4a, prev.mcoi_4b,
          prev.mcoi_5a, prev.mcoi_5b, prev.mcoi_6a, prev.mcoi_6b,
          prev.mcoi_7a, prev.mcoi_7b
        ];
        
        const forwardComplete = forwardItems.every(v => v !== undefined && v !== '');
        const backwardComplete = backwardItems.every(v => v !== undefined && v !== '');
        
        // Calculate forward section scores if forward is complete
        if (forwardComplete && hasValidAge) {
          try {
            // Calculate forward raw score
            const wais_mcod_tot = forwardItems.reduce((sum, v) => sum + Number(v), 0);
            updated.wais_mcod_tot = wais_mcod_tot;
            
            // Calculate forward span
            let wais_mc_end = 0;
            if (Number(prev.mcod_1a) === 1 || Number(prev.mcod_1b) === 1) wais_mc_end = 2;
            if (Number(prev.mcod_2a) === 1 || Number(prev.mcod_2b) === 1) wais_mc_end = 3;
            if (Number(prev.mcod_3a) === 1 || Number(prev.mcod_3b) === 1) wais_mc_end = 4;
            if (Number(prev.mcod_4a) === 1 || Number(prev.mcod_4b) === 1) wais_mc_end = 5;
            if (Number(prev.mcod_5a) === 1 || Number(prev.mcod_5b) === 1) wais_mc_end = 6;
            if (Number(prev.mcod_6a) === 1 || Number(prev.mcod_6b) === 1) wais_mc_end = 7;
            if (Number(prev.mcod_7a) === 1 || Number(prev.mcod_7b) === 1) wais_mc_end = 8;
            if (Number(prev.mcod_8a) === 1 || Number(prev.mcod_8b) === 1) wais_mc_end = 9;
            updated.wais_mc_end = wais_mc_end;
            
            // Calculate forward z-score if education level is available
            if (dsEducation !== undefined) {
              const scores = calculateWais3DigitSpanScores({
                patient_age: dsAge,
                education_level: dsEducation,
                mcod_1a: Number(prev.mcod_1a), mcod_1b: Number(prev.mcod_1b),
                mcod_2a: Number(prev.mcod_2a), mcod_2b: Number(prev.mcod_2b),
                mcod_3a: Number(prev.mcod_3a), mcod_3b: Number(prev.mcod_3b),
                mcod_4a: Number(prev.mcod_4a), mcod_4b: Number(prev.mcod_4b),
                mcod_5a: Number(prev.mcod_5a), mcod_5b: Number(prev.mcod_5b),
                mcod_6a: Number(prev.mcod_6a), mcod_6b: Number(prev.mcod_6b),
                mcod_7a: Number(prev.mcod_7a), mcod_7b: Number(prev.mcod_7b),
                mcod_8a: Number(prev.mcod_8a), mcod_8b: Number(prev.mcod_8b),
                mcoi_1a: backwardComplete ? Number(prev.mcoi_1a) : 0, 
                mcoi_1b: backwardComplete ? Number(prev.mcoi_1b) : 0,
                mcoi_2a: backwardComplete ? Number(prev.mcoi_2a) : 0, 
                mcoi_2b: backwardComplete ? Number(prev.mcoi_2b) : 0,
                mcoi_3a: backwardComplete ? Number(prev.mcoi_3a) : 0, 
                mcoi_3b: backwardComplete ? Number(prev.mcoi_3b) : 0,
                mcoi_4a: backwardComplete ? Number(prev.mcoi_4a) : 0, 
                mcoi_4b: backwardComplete ? Number(prev.mcoi_4b) : 0,
                mcoi_5a: backwardComplete ? Number(prev.mcoi_5a) : 0, 
                mcoi_5b: backwardComplete ? Number(prev.mcoi_5b) : 0,
                mcoi_6a: backwardComplete ? Number(prev.mcoi_6a) : 0, 
                mcoi_6b: backwardComplete ? Number(prev.mcoi_6b) : 0,
                mcoi_7a: backwardComplete ? Number(prev.mcoi_7a) : 0, 
                mcoi_7b: backwardComplete ? Number(prev.mcoi_7b) : 0
              });
              updated.wais_mc_end_z = scores.wais_mc_end_z;
            }
            
            hasChanges = true;
          } catch (error) {
            console.error('Error calculating forward span scores:', error);
          }
        } else if (!forwardComplete) {
          // Clear forward scores if incomplete
          if (prev.wais_mcod_tot !== undefined) {
            updated.wais_mcod_tot = undefined;
            updated.wais_mc_end = undefined;
            updated.wais_mc_end_z = undefined;
            hasChanges = true;
          }
        }
        
        // Calculate backward section scores if backward is complete
        if (backwardComplete && hasValidAge) {
          try {
            // Calculate backward raw score
            const wais_mcoi_tot = backwardItems.reduce((sum, v) => sum + Number(v), 0);
            updated.wais_mcoi_tot = wais_mcoi_tot;
            
            // Calculate backward span
            let wais_mc_env = 0;
            if (Number(prev.mcoi_1a) === 1 || Number(prev.mcoi_1b) === 1) wais_mc_env = 2;
            if (Number(prev.mcoi_2a) === 1 || Number(prev.mcoi_2b) === 1) wais_mc_env = 3;
            if (Number(prev.mcoi_3a) === 1 || Number(prev.mcoi_3b) === 1) wais_mc_env = 4;
            if (Number(prev.mcoi_4a) === 1 || Number(prev.mcoi_4b) === 1) wais_mc_env = 5;
            if (Number(prev.mcoi_5a) === 1 || Number(prev.mcoi_5b) === 1) wais_mc_env = 6;
            if (Number(prev.mcoi_6a) === 1 || Number(prev.mcoi_6b) === 1) wais_mc_env = 7;
            if (Number(prev.mcoi_7a) === 1 || Number(prev.mcoi_7b) === 1) wais_mc_env = 8;
            updated.wais_mc_env = wais_mc_env;
            
            // Calculate backward z-score if education level is available
            if (dsEducation !== undefined) {
              const scores = calculateWais3DigitSpanScores({
                patient_age: dsAge,
                education_level: dsEducation,
                mcod_1a: forwardComplete ? Number(prev.mcod_1a) : 0, 
                mcod_1b: forwardComplete ? Number(prev.mcod_1b) : 0,
                mcod_2a: forwardComplete ? Number(prev.mcod_2a) : 0, 
                mcod_2b: forwardComplete ? Number(prev.mcod_2b) : 0,
                mcod_3a: forwardComplete ? Number(prev.mcod_3a) : 0, 
                mcod_3b: forwardComplete ? Number(prev.mcod_3b) : 0,
                mcod_4a: forwardComplete ? Number(prev.mcod_4a) : 0, 
                mcod_4b: forwardComplete ? Number(prev.mcod_4b) : 0,
                mcod_5a: forwardComplete ? Number(prev.mcod_5a) : 0, 
                mcod_5b: forwardComplete ? Number(prev.mcod_5b) : 0,
                mcod_6a: forwardComplete ? Number(prev.mcod_6a) : 0, 
                mcod_6b: forwardComplete ? Number(prev.mcod_6b) : 0,
                mcod_7a: forwardComplete ? Number(prev.mcod_7a) : 0, 
                mcod_7b: forwardComplete ? Number(prev.mcod_7b) : 0,
                mcod_8a: forwardComplete ? Number(prev.mcod_8a) : 0, 
                mcod_8b: forwardComplete ? Number(prev.mcod_8b) : 0,
                mcoi_1a: Number(prev.mcoi_1a), mcoi_1b: Number(prev.mcoi_1b),
                mcoi_2a: Number(prev.mcoi_2a), mcoi_2b: Number(prev.mcoi_2b),
                mcoi_3a: Number(prev.mcoi_3a), mcoi_3b: Number(prev.mcoi_3b),
                mcoi_4a: Number(prev.mcoi_4a), mcoi_4b: Number(prev.mcoi_4b),
                mcoi_5a: Number(prev.mcoi_5a), mcoi_5b: Number(prev.mcoi_5b),
                mcoi_6a: Number(prev.mcoi_6a), mcoi_6b: Number(prev.mcoi_6b),
                mcoi_7a: Number(prev.mcoi_7a), mcoi_7b: Number(prev.mcoi_7b)
              });
              updated.wais_mc_env_z = scores.wais_mc_env_z;
            }
            
            hasChanges = true;
          } catch (error) {
            console.error('Error calculating backward span scores:', error);
          }
        } else if (!backwardComplete) {
          // Clear backward scores if incomplete
          if (prev.wais_mcoi_tot !== undefined) {
            updated.wais_mcoi_tot = undefined;
            updated.wais_mc_env = undefined;
            updated.wais_mc_env_z = undefined;
            hasChanges = true;
          }
        }
        
        // Calculate total scores only if both sections are complete
        if (forwardComplete && backwardComplete && hasValidAge) {
          try {
            const scores = calculateWais3DigitSpanScores({
              patient_age: dsAge,
              education_level: dsEducation,
              mcod_1a: Number(prev.mcod_1a), mcod_1b: Number(prev.mcod_1b),
              mcod_2a: Number(prev.mcod_2a), mcod_2b: Number(prev.mcod_2b),
              mcod_3a: Number(prev.mcod_3a), mcod_3b: Number(prev.mcod_3b),
              mcod_4a: Number(prev.mcod_4a), mcod_4b: Number(prev.mcod_4b),
              mcod_5a: Number(prev.mcod_5a), mcod_5b: Number(prev.mcod_5b),
              mcod_6a: Number(prev.mcod_6a), mcod_6b: Number(prev.mcod_6b),
              mcod_7a: Number(prev.mcod_7a), mcod_7b: Number(prev.mcod_7b),
              mcod_8a: Number(prev.mcod_8a), mcod_8b: Number(prev.mcod_8b),
              mcoi_1a: Number(prev.mcoi_1a), mcoi_1b: Number(prev.mcoi_1b),
              mcoi_2a: Number(prev.mcoi_2a), mcoi_2b: Number(prev.mcoi_2b),
              mcoi_3a: Number(prev.mcoi_3a), mcoi_3b: Number(prev.mcoi_3b),
              mcoi_4a: Number(prev.mcoi_4a), mcoi_4b: Number(prev.mcoi_4b),
              mcoi_5a: Number(prev.mcoi_5a), mcoi_5b: Number(prev.mcoi_5b),
              mcoi_6a: Number(prev.mcoi_6a), mcoi_6b: Number(prev.mcoi_6b),
              mcoi_7a: Number(prev.mcoi_7a), mcoi_7b: Number(prev.mcoi_7b)
            });
            
            updated.wais_mc_tot = scores.wais_mc_tot;
            updated.wais_mc_emp = scores.wais_mc_emp;
            updated.wais_mc_std = scores.wais_mc_std;
            updated.wais_mc_cr = scores.wais_mc_cr;
            
            hasChanges = true;
          } catch (error) {
            console.error('Error calculating total scores:', error);
          }
        } else {
          // Clear total scores if both sections not complete
          if (prev.wais_mc_tot !== undefined) {
            updated.wais_mc_tot = undefined;
            updated.wais_mc_emp = undefined;
            updated.wais_mc_std = undefined;
            updated.wais_mc_cr = undefined;
            hasChanges = true;
          }
        }
      }

      // Compute MEM-III Spatial Span scores
      const hasSpatialFields = prev.odirect_1a !== undefined || prev.inverse_1a !== undefined;
      
      if (hasSpatialFields) {
        const spatialAge = Number(prev.patient_age);
        const hasValidAge = !isNaN(spatialAge) && spatialAge >= 16 && spatialAge <= 90;
        
        // Calculate forward raw score
        const forwardItems = [
          prev.odirect_1a, prev.odirect_1b, prev.odirect_2a, prev.odirect_2b,
          prev.odirect_3a, prev.odirect_3b, prev.odirect_4a, prev.odirect_4b,
          prev.odirect_5a, prev.odirect_5b, prev.odirect_6a, prev.odirect_6b,
          prev.odirect_7a, prev.odirect_7b, prev.odirect_8a, prev.odirect_8b
        ];
        const forwardSum = forwardItems.reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
        const allForwardValid = forwardItems.every((v) => v !== undefined && !isNaN(Number(v)));
        
        // Calculate backward raw score
        const backwardItems = [
          prev.inverse_1a, prev.inverse_1b, prev.inverse_2a, prev.inverse_2b,
          prev.inverse_3a, prev.inverse_3b, prev.inverse_4a, prev.inverse_4b,
          prev.inverse_5a, prev.inverse_5b, prev.inverse_6a, prev.inverse_6b,
          prev.inverse_7a, prev.inverse_7b, prev.inverse_8a, prev.inverse_8b
        ];
        const backwardSum = backwardItems.reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
        const allBackwardValid = backwardItems.every((v) => v !== undefined && !isNaN(Number(v)));
        
        if (allForwardValid || allBackwardValid) {
          hasChanges = true;
          
          if (allForwardValid) {
            updated.mspatiale_odirect_tot = forwardSum;
          }
          if (allBackwardValid) {
            updated.mspatiale_inverse_tot = backwardSum;
          }
          if (allForwardValid && allBackwardValid) {
            const totalBrut = forwardSum + backwardSum;
            updated.mspatiale_total_brut = totalBrut;
            
            // Calculate standard scores if age is valid
            if (hasValidAge) {
              const MEM3_ODIRECT_NORMS: Record<string, number[]> = {
                '16-17': [3, 4, 5, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 12, 13, 14, 15, 16],
                '18-19': [2, 3, 4, 5, 6, 0, 7, 8, 0, 9, 0, 10, 11, 0, 12, 13, 14, 15, 16],
                '20-24': [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 0, 10, 11, 0, 12, 13, 14, 15, 16],
                '25-29': [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 10, 11, 0, 12, 13, 14, 15, 0, 16],
                '30-34': [1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 0, 15, 16],
                '35-44': [1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 0, 15, 16],
                '45-54': [1, 2, 3, 4, 0, 5, 6, 0, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16],
                '55-64': [1, 2, 3, 4, 0, 5, 6, 0, 7, 8, 9, 0, 10, 0, 11, 12, 13, 14, 16],
                '65-69': [1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 0, 8, 9, 0, 10, 11, 12, 13, 16],
                '70-74': [1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 0, 8, 9, 0, 10, 11, 12, 13, 16],
                '75-79': [0, 1, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 0, 9, 10, 0, 11, 12, 16],
                '80+': [0, 1, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 0, 9, 10, 0, 11, 12, 16]
              };
              
              const MEM3_INVERSE_NORMS: Record<string, number[]> = {
                '16-17': [1, 2, 3, 4, 5, 6, 0, 7, 0, 8, 0, 9, 0, 10, 11, 12, 14, 15, 16],
                '18-19': [1, 2, 3, 4, 5, 6, 0, 7, 0, 8, 9, 0, 10, 0, 11, 12, 14, 15, 16],
                '20-24': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 0, 12, 13, 14, 16],
                '25-29': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 0, 12, 13, 14, 16],
                '30-34': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 0, 12, 13, 14, 16],
                '35-44': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 12, 13, 14, 15, 16],
                '45-54': [0, 1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 16],
                '55-64': [0, 1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 8, 9, 0, 10, 12, 13, 14, 16],
                '65-69': [0, 0, 1, 2, 0, 3, 4, 5, 0, 6, 7, 8, 0, 9, 10, 11, 12, 13, 16],
                '70-74': [0, 0, 0, 1, 2, 3, 4, 5, 0, 6, 7, 8, 0, 9, 10, 11, 12, 13, 16],
                '75-79': [0, 0, 0, 0, 1, 2, 3, 0, 4, 5, 6, 7, 8, 0, 9, 10, 11, 12, 16],
                '80+': [0, 0, 0, 0, 1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 0, 9, 10, 11, 16]
              };
              
              const MEM3_TOTAL_NORMS: Record<string, number[]> = {
                '16-17': [9, 10, 11, 12, 0, 13, 14, 15, 16, 17, 18, 19, 0, 20, 22, 23, 24, 26, 32],
                '18-19': [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 0, 20, 21, 23, 24, 25, 26, 32],
                '20-24': [7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 0, 20, 22, 24, 25, 26, 27, 32],
                '25-29': [7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 25, 26, 27, 28, 32],
                '30-34': [6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 23, 25, 26, 27, 28, 32],
                '35-44': [6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 23, 25, 26, 28, 0, 32],
                '45-54': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 26, 27, 32],
                '55-64': [6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15, 17, 18, 20, 21, 23, 24, 25, 32],
                '65-69': [4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 32],
                '70-74': [2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 22, 24, 32],
                '75-79': [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 18, 19, 20, 21, 23, 32],
                '80+': [2, 3, 4, 5, 6, 0, 8, 9, 10, 12, 13, 15, 16, 17, 18, 20, 21, 22, 32]
              };
              
              const getAgeGroup = (age: number): string => {
                if (age >= 16 && age <= 17) return '16-17';
                if (age >= 18 && age <= 19) return '18-19';
                if (age >= 20 && age <= 24) return '20-24';
                if (age >= 25 && age <= 29) return '25-29';
                if (age >= 30 && age <= 34) return '30-34';
                if (age >= 35 && age <= 44) return '35-44';
                if (age >= 45 && age <= 54) return '45-54';
                if (age >= 55 && age <= 64) return '55-64';
                if (age >= 65 && age <= 69) return '65-69';
                if (age >= 70 && age <= 74) return '70-74';
                if (age >= 75 && age <= 79) return '75-79';
                return '80+';
              };
              
              const findStdScore = (rawScore: number, norms: number[]): number => {
                for (let i = 0; i < norms.length; i++) {
                  const maxRaw = norms[i];
                  if (maxRaw === 0) continue;
                  if (rawScore <= maxRaw) return i + 1;
                }
                return 19;
              };
              
              const ageGroup = getAgeGroup(spatialAge);
              
              const odirectStd = findStdScore(forwardSum, MEM3_ODIRECT_NORMS[ageGroup]);
              updated.mspatiale_odirect_std = odirectStd;
              updated.mspatiale_odirect_cr = Number(((odirectStd - 10) / 3).toFixed(2));
              
              const inverseStd = findStdScore(backwardSum, MEM3_INVERSE_NORMS[ageGroup]);
              updated.mspatiale_inverse_std = inverseStd;
              updated.mspatiale_inverse_cr = Number(((inverseStd - 10) / 3).toFixed(2));
              
              const totalStd = findStdScore(totalBrut, MEM3_TOTAL_NORMS[ageGroup]);
              updated.mspatiale_total_std = totalStd;
              updated.mspatiale_total_cr = Number(((totalStd - 10) / 3).toFixed(2));
            }
          }
        }
      }

      // Compute CVLT scores (simple calculations only, complex scoring done on backend)
      const hasCvltFields = prev.trial_1 !== undefined || prev.trial_2 !== undefined;
      
      if (hasCvltFields) {
        // Calculate Lundi Total (sum of trials 1-5)
        if (prev.trial_1 !== undefined && prev.trial_2 !== undefined && 
            prev.trial_3 !== undefined && prev.trial_4 !== undefined && 
            prev.trial_5 !== undefined) {
          const trial1 = Number(prev.trial_1) || 0;
          const trial2 = Number(prev.trial_2) || 0;
          const trial3 = Number(prev.trial_3) || 0;
          const trial4 = Number(prev.trial_4) || 0;
          const trial5 = Number(prev.trial_5) || 0;
          
          const lundiTotal = trial1 + trial2 + trial3 + trial4 + trial5;
          
          if (updated.trials_1_5_total !== lundiTotal) {
            updated.trials_1_5_total = lundiTotal;
            hasChanges = true;
          }
        }
        
        // Note: Standard scores (trial_1_std, trial_5_std, etc.) and percentile calculations
        // are computed on the backend using complex regression formulas and lookup tables.
        // See the scoring JSON specification for details.
      }

      return hasChanges ? updated : prev;
    });
  }, [
    responses.height_cm,
    responses.weight_kg,
    responses.bp_lying_systolic,
    responses.bp_lying_diastolic,
    responses.bp_standing_systolic,
    responses.bp_standing_diastolic,
    responses.qt_measured,
    responses.rr_measured,
    responses.creatinine,
    responses.patient_age,
    responses.patient_gender,
    responses.clairance_creatinine,
    // TMT fields
    responses.years_of_education,
    responses.tmta_tps,
    responses.tmta_err,
    responses.tmta_cor,
    responses.tmtb_tps,
    responses.tmtb_err,
    responses.tmtb_cor,
    responses.tmtb_err_persev,
    // Stroop fields
    responses.stroop_w_tot,
    responses.stroop_c_tot,
    responses.stroop_cw_tot,
    // Fluences Verbales fields
    responses.fv_p_tot_correct,
    responses.fv_p_deriv,
    responses.fv_p_intrus,
    responses.fv_p_propres,
    responses.fv_anim_tot_correct,
    responses.fv_anim_deriv,
    responses.fv_anim_intrus,
    responses.fv_anim_propres,
    // COBRA fields
    responses.q1,
    responses.q2,
    responses.q3,
    responses.q4,
    responses.q5,
    responses.q6,
    responses.q7,
    responses.q8,
    responses.q9,
    responses.q10,
    responses.q11,
    responses.q12,
    responses.q13,
    responses.q14,
    responses.q15,
    responses.q16,
    // WAIS4 Similitudes fields
    responses.item1,
    responses.item2,
    responses.item3,
    responses.item4,
    responses.item5,
    responses.item6,
    responses.item7,
    responses.item8,
    responses.item9,
    responses.item10,
    responses.item11,
    responses.item12,
    responses.item13,
    responses.item14,
    responses.item15,
    responses.item16,
    responses.item17,
    responses.item18,
    // Test des Commissions fields
    responses.nsc,
    responses.com01,
    responses.com02,
    responses.com03,
    responses.com04,
    // SCIP fields
    responses.scipv01a,
    responses.scipv02a,
    responses.scipv03a,
    responses.scipv04a,
    responses.scipv05a,
    // WAIS-III Matrices fields
    responses.item_01,
    responses.item_02,
    responses.item_03,
    responses.item_04,
    responses.item_05,
    responses.item_06,
    responses.item_07,
    responses.item_08,
    responses.item_09,
    responses.item_10,
    responses.item_11,
    responses.item_12,
    responses.item_13,
    responses.item_14,
    responses.item_15,
    responses.item_16,
    responses.item_17,
    responses.item_18,
    responses.item_19,
    responses.item_20,
    responses.item_21,
    responses.item_22,
    responses.item_23,
    responses.item_24,
    responses.item_25,
    responses.item_26,
    // WAIS-III Code, Symboles & IVT fields
    responses.wais_cod_tot,
    responses.wais_cod_err,
    responses.wais_symb_tot,
    responses.wais_symb_err,
    // WAIS-III Digit Span fields
    responses.mcod_1a, responses.mcod_1b, responses.mcod_2a, responses.mcod_2b,
    responses.mcod_3a, responses.mcod_3b, responses.mcod_4a, responses.mcod_4b,
    responses.mcod_5a, responses.mcod_5b, responses.mcod_6a, responses.mcod_6b,
    responses.mcod_7a, responses.mcod_7b, responses.mcod_8a, responses.mcod_8b,
    responses.mcoi_1a, responses.mcoi_1b, responses.mcoi_2a, responses.mcoi_2b,
    responses.mcoi_3a, responses.mcoi_3b, responses.mcoi_4a, responses.mcoi_4b,
    responses.mcoi_5a, responses.mcoi_5b, responses.mcoi_6a, responses.mcoi_6b,
    responses.mcoi_7a, responses.mcoi_7b,
    // MEM-III Spatial Span fields
    responses.odirect_1a, responses.odirect_1b, responses.odirect_2a, responses.odirect_2b,
    responses.odirect_3a, responses.odirect_3b, responses.odirect_4a, responses.odirect_4b,
    responses.odirect_5a, responses.odirect_5b, responses.odirect_6a, responses.odirect_6b,
    responses.odirect_7a, responses.odirect_7b, responses.odirect_8a, responses.odirect_8b,
    responses.inverse_1a, responses.inverse_1b, responses.inverse_2a, responses.inverse_2b,
    responses.inverse_3a, responses.inverse_3b, responses.inverse_4a, responses.inverse_4b,
    responses.inverse_5a, responses.inverse_5b, responses.inverse_6a, responses.inverse_6b,
    responses.inverse_7a, responses.inverse_7b, responses.inverse_8a, responses.inverse_8b,
    // CVLT fields
    responses.trial_1, responses.trial_2, responses.trial_3, responses.trial_4, responses.trial_5,
    // MATHYS items
    responses.q1, responses.q2, responses.q3, responses.q4, responses.q5,
    responses.q6, responses.q7, responses.q8, responses.q9, responses.q10,
    responses.q11, responses.q12, responses.q13, responses.q14, responses.q15,
    responses.q16, responses.q17, responses.q18, responses.q19, responses.q20,
    // PSQI items
    responses.q1_bedtime, responses.q2_minutes_to_sleep, responses.q3_waketime, responses.q4_hours_sleep,
    responses.q5a, responses.q5b, responses.q5c, responses.q5d, responses.q5e, responses.q5f,
    responses.q5g, responses.q5h, responses.q5i, responses.q5j,
    responses.q6, responses.q7, responses.q8, responses.q9
  ]);

  // Separate useEffect for Rapport Total / HDL calculation (lipid profile)
  // Kept separate to avoid changing the size of the main useEffect dependency array
  useEffect(() => {
    setResponses((prev) => {
      const cholesterolTotal = prev.cholesterol_total ? parseFloat(prev.cholesterol_total) : 0;
      const hdl = prev.hdl ? parseFloat(prev.hdl) : 0;
      
      if (cholesterolTotal > 0 && hdl > 0) {
        const ratio = cholesterolTotal / hdl;
        const ratioRounded = Math.round(ratio * 100) / 100;
        if (prev.rapport_total_hdl !== ratioRounded) {
          return { ...prev, rapport_total_hdl: ratioRounded };
        }
      } else if (prev.rapport_total_hdl) {
        const { rapport_total_hdl, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, [responses.cholesterol_total, responses.hdl]);

  const { visibleQuestions, requiredQuestions } = evaluateConditionalLogic(
    questionnaire,
    responses
  );

  // Track previous responses to detect actual changes
  const prevResponsesRef = useRef<Record<string, any>>(stableInitialResponses);
  const isFirstRender = useRef(true);
  
  // Store onResponseChange in a ref to avoid it being a dependency
  const onResponseChangeRef = useRef(onResponseChange);
  useEffect(() => {
    onResponseChangeRef.current = onResponseChange;
  }, [onResponseChange]);
  
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [questionId]: value,
      };
      return updated;
    });
    setErrors([]);
  };
  
  // Notify parent of response changes via useEffect
  // Uses a ref for the callback to prevent it from triggering re-runs
  useEffect(() => {
    // Skip the very first render (when responses equals initialResponses)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevResponsesRef.current = responses;
      return;
    }
    
    // Only notify if responses actually changed (reference comparison)
    if (onResponseChangeRef.current && responses !== prevResponsesRef.current) {
      prevResponsesRef.current = responses;
      onResponseChangeRef.current(responses);
    }
  }, [responses]); // onResponseChange is now accessed via ref, not a dependency

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(responses);
    } catch (error) {
      setErrors(["Failed to save responses"]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateQuestionnaireResponse(questionnaire, responses);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(responses);
    } catch (error) {
      setErrors(["Failed to submit questionnaire"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate section completion percentage
  const getSectionCompletion = (sectionId: string, questions: Question[]): number => {
    // Get questions in this section
    const sectionIndex = questions.findIndex(q => q.id === sectionId);
    if (sectionIndex === -1) return 100;
    
    const nextSectionIndex = questions.findIndex((q, idx) => 
      idx > sectionIndex && q.type === 'section'
    );
    const endIndex = nextSectionIndex === -1 ? questions.length : nextSectionIndex;
    
    const sectionQuestions = questions.filter((q, idx) => 
      idx > sectionIndex && idx < endIndex
    );
    
    // Use shared calculation logic
    return calculateQuestionnaireProgress(sectionQuestions, responses, visibleQuestions);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderSection = (question: Question, questions: Question[], sectionNumber: number) => {
    const isExpanded = expandedSections.has(question.id);
    const completion = getSectionCompletion(question.id, questions);
    const hasHelp = !!question.help;
    
    return (
      <details 
        key={question.id} 
        open={isExpanded}
        className={`group bg-white border rounded-2xl shadow-sm mb-6 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'border-brand/30 shadow-lg shadow-brand/5' : 'border-slate-200'
        }`}
      >
        <summary 
          className="flex items-center justify-between p-6 cursor-pointer bg-white hover:bg-slate-50 transition select-none list-none"
          onClick={(e) => {
            e.preventDefault();
            toggleSection(question.id);
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
              {sectionNumber}
            </div>
            <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-brand' : 'text-slate-900'}`}>
              {question.text}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {completion > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      completion === 100 ? 'bg-brand' : 'bg-brand'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-brand min-w-[3rem] text-right">
                  {completion}%
                </span>
              </div>
            )}
            <ChevronDown className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </summary>
      </details>
    );
  };

  const renderInstructions = () => {
    if (!questionnaire.instructions) return null;
    
    return (
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Consignes</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              {questionnaire.instructions}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestion = (question: Question, skipSectionCheck = false) => {
    if (!visibleQuestions.includes(question.id)) {
      return null;
    }

    // Handle section rendering
    if (question.type === 'section') {
      // Calculate section number based on position in questions array
      const sectionNumber = questionnaire.questions
        .filter(q => q.type === 'section')
        .findIndex(q => q.id === question.id) + 1;
      return renderSection(question, questionnaire.questions, sectionNumber);
    }

    const isRequired = requiredQuestions.includes(question.id);
    const value = responses[question.id];
    
    // Check if this question belongs to a collapsed section (skip if called from grouped view)
    if (!skipSectionCheck) {
      const questionIndex = questionnaire.questions.findIndex(q => q.id === question.id);
      let currentSectionId: string | null = null;
      for (let i = questionIndex - 1; i >= 0; i--) {
        if (questionnaire.questions[i].type === 'section') {
          currentSectionId = questionnaire.questions[i].id;
          break;
        }
      }
      
      if (currentSectionId && !expandedSections.has(currentSectionId)) {
        return null;
      }
    }

    // Group related fields (e.g., HDL + HDL unit) in a grid
    const isUnitField = question.id.endsWith('_unit');
    const baseFieldId = isUnitField ? question.id.replace('_unit', '') : null;
    const baseFieldValue = baseFieldId ? responses[baseFieldId] : null;
    
    // Don't render unit field if base field is empty
    if (isUnitField && (!baseFieldValue || baseFieldValue === '')) {
      return null;
    }

    // Get indent class based on indentLevel
    const getIndentClass = (level?: number) => {
      switch (level) {
        case 1: return 'pl-8 border-l-4 border-slate-200';
        case 2: return 'pl-16 border-l-4 border-slate-300';
        case 3: return 'pl-24 border-l-4 border-slate-400';
        default: return '';
      }
    };

    return (
      <div key={question.id} className={`space-y-3 ${isUnitField ? 'col-span-1' : ''} ${getIndentClass(question.indentLevel)}`}>
        <Label htmlFor={question.id} className="text-base font-semibold text-slate-800">
          {question.text}
          {isRequired && <span className="text-brand ml-1">*</span>}
        </Label>
        
        {question.help && (
          <div className="text-sm text-slate-500 space-y-1">
            {/* Check if help text contains exclusion criteria or important info */}
            {question.help.toLowerCase().includes('critère') || question.help.toLowerCase().includes('exclusion') ? (
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>{question.help.includes(':') ? question.help.split(':')[0] + ':' : ''}</strong>
                  {question.help.includes(':') ? question.help.split(':').slice(1).join(':') : question.help}
                </p>
              </div>
            ) : (
              question.help.split('\n').map((line, index) => (
                <p key={index} className={line.trim() === '' ? 'h-2' : 'leading-relaxed'}>
                  {line || '\u00A0'}
                </p>
              ))
            )}
          </div>
        )}

        {question.type === "text" && !question.metadata?.displayOnly && (
          <div className="space-y-1">
            <Input
              id={question.id}
              type="text"
              value={value || ""}
              onChange={(e) => {
                let v = e.target.value;
                if (question.metadata?.placeholder === "HH:MM") {
                  // Strict digit-only extraction
                  const digits = v.replace(/[^\d]/g, '').substring(0, 4);
                  
                  // Validation logic
                  if (digits.length >= 1) {
                    const h1 = parseInt(digits[0]);
                    if (h1 > 2) { handleResponseChange(question.id, ""); return; }
                  }
                  
                  if (digits.length >= 2) {
                    const h = parseInt(digits.substring(0, 2));
                    const maxH = question.id.includes('hours_sleep') ? 24 : 23;
                    if (h > maxH) { handleResponseChange(question.id, ""); return; }
                  }
                  
                  if (digits.length >= 3) {
                    const m1 = parseInt(digits[2]);
                    if (m1 > 5) { handleResponseChange(question.id, digits.substring(0, 2) + ":"); return; }
                  }

                  // Auto-formatting HH:MM
                  if (digits.length > 2) {
                    v = digits.substring(0, 2) + ":" + digits.substring(2);
                  } else if (v.length === 2 && !v.includes(':') && e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType !== 'deleteContentBackward') {
                    v = digits + ":";
                  } else {
                    v = digits;
                  }
                }
                handleResponseChange(question.id, v);
              }}
              onBlur={(e) => {
                const val = e.target.value;
                if (question.metadata?.pattern) {
                  const regex = new RegExp(question.metadata.pattern);
                  if (val && !regex.test(val)) {
                    handleResponseChange(question.id, "");
                  }
                }
              }}
              placeholder={question.metadata?.placeholder || ""}
              disabled={readonly || question.readonly}
              required={isRequired}
              className={`bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand ${
                question.readonly ? "bg-slate-50 text-slate-700 font-medium" : ""
              } ${question.metadata?.pattern && value && !new RegExp(question.metadata.pattern).test(value) ? 'border-red-500 bg-red-50 text-red-600' : ''}`}
            />
            {question.metadata?.pattern && value && !new RegExp(question.metadata.pattern).test(value) && (
              <p className="text-[10px] text-red-500 font-medium px-2">Format invalide (Ex: 08:30)</p>
            )}
          </div>
        )}

        {question.type === "number" && (
          <Input
            id={question.id}
            type="text"
            inputMode="decimal"
            value={value ?? ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty, digits, decimal point, and negative sign
              if (inputValue === "" || /^-?\d*\.?\d*$/.test(inputValue)) {
                handleResponseChange(question.id, inputValue);
              }
            }}
            onBlur={(e) => {
              const inputValue = e.target.value;
              if (inputValue === "" || inputValue === "-" || inputValue === ".") {
                handleResponseChange(question.id, null);
                return;
              }
              const numValue = Number(inputValue);
              if (!isNaN(numValue)) {
                handleResponseChange(question.id, numValue);
              }
            }}
            disabled={readonly || question.readonly}
            required={isRequired}
            className={`bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand ${
              question.readonly ? "bg-slate-50 text-slate-700" : ""
            }`}
          />
        )}

        {question.type === "scale" && (
          <div className="space-y-2">
            {!value && value !== 0 ? (
              <div 
                className="w-full h-10 bg-slate-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300"
                onClick={() => handleResponseChange(question.id, question.min || 0)}
              >
                <span className="text-sm text-slate-500 font-medium">Cliquez pour noter (0 à 10)</span>
              </div>
            ) : (
              <>
                <Input
                  id={question.id}
                  type="range"
                  value={value}
                  onChange={(e) =>
                    handleResponseChange(question.id, Number(e.target.value))
                  }
                  min={question.min || 0}
                  max={question.max || 10}
                  step={question.metadata?.step || 1}
                  disabled={readonly}
                  required={isRequired}
                  className="w-full accent-brand"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="cursor-pointer hover:text-brand transition-colors" onClick={() => handleResponseChange(question.id, question.min || 0)}>
                    {question.minLabel || question.min}
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-brand bg-brand/10 px-3 py-1 rounded-full mb-1">
                      {value}
                    </span>
                    <button 
                      type="button" 
                      className="text-[10px] text-slate-400 hover:text-red-500 transition-colors underline"
                      onClick={() => handleResponseChange(question.id, null)}
                    >
                      Effacer
                    </button>
                  </div>
                  <span className="cursor-pointer hover:text-brand transition-colors" onClick={() => handleResponseChange(question.id, question.max || 10)}>
                    {question.maxLabel || question.max}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {question.type === "single_choice" && question.options && (
          <Select
            value={value !== undefined && value !== null ? value.toString() : ""}
            onValueChange={(val) => {
              // Try to convert to number if the option code is a number
              const numVal = Number(val);
              const finalVal = isNaN(numVal) ? val : numVal;
              handleResponseChange(question.id, finalVal);
            }}
            disabled={readonly || question.readonly}
            required={isRequired}
          >
            <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand">
              <SelectValue placeholder="Sélectionnez une option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => {
                // Handle both string options and object options {code, label, score}
                const optionValue = typeof option === 'string' ? option : option.code;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optionValue?.toString() || ''} value={optionValue?.toString() || ''}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              // Handle both string options and object options {code, label, score}
              const optionValue = typeof option === 'string' ? option : option.code;
              const optionLabel = typeof option === 'string' ? option : option.label;
              const checked = Array.isArray(value) && value.includes(optionValue);
              return (
                <div key={optionValue?.toString() || ''} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${optionValue}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = isChecked
                        ? [...currentValues, optionValue]
                        : currentValues.filter((v: any) => v !== optionValue);
                      handleResponseChange(question.id, newValues);
                    }}
                    disabled={readonly}
                  />
                  <label
                    htmlFor={`${question.id}-${optionValue}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {question.type === "boolean" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={question.id}
              checked={value === true}
              onCheckedChange={(isChecked) =>
                handleResponseChange(question.id, isChecked === true)
              }
              disabled={readonly}
            />
            <label
              htmlFor={question.id}
              className="text-sm font-normal cursor-pointer"
            >
              Oui
            </label>
          </div>
        )}

        {question.type === "date" && (
          <Input
            id={question.id}
            type="date"
            value={value || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            disabled={readonly}
            required={isRequired}
            className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        )}
      </div>
    );
  };

  // Group questions by sections for better organization
  const groupedQuestions = useCallback(() => {
    const groups: Array<{ section: Question | null; questions: Question[] }> = [];
    let currentSection: Question | null = null;
    let currentGroup: Question[] = [];

    questionnaire.questions.forEach((question) => {
      if (question.type === 'section') {
        // Save previous group
        if (currentGroup.length > 0 || currentSection) {
          groups.push({ section: currentSection, questions: currentGroup });
        }
        // Start new group
        currentSection = question;
        currentGroup = [];
      } else {
        currentGroup.push(question);
      }
    });

    // Add last group
    if (currentGroup.length > 0 || currentSection) {
      groups.push({ section: currentSection, questions: currentGroup });
    }

    return groups;
  }, [questionnaire.questions]);

  const questionGroups = groupedQuestions();
  const hasSections = questionnaire.questions.some(q => q.type === 'section');

  // If no sections, use simple rendering for backward compatibility
  if (!hasSections) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderInstructions()}
        <div className="space-y-6">
          {questionnaire.questions.map((question) => renderQuestion(question))}
        </div>
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2">
              Veuillez corriger les erreurs suivantes :
            </h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {!readonly && (
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            {onSave && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || isSaving}
              className="w-full sm:w-auto bg-brand hover:bg-brand-dark shadow-md shadow-brand/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer le questionnaire"
              )}
            </Button>
          </div>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderInstructions()}
      {questionGroups.map((group, groupIndex) => {
        const isSectionExpanded = !group.section || expandedSections.has(group.section.id);
        const visibleGroupQuestions = group.questions.filter(q => visibleQuestions.includes(q.id));
        
        if (visibleGroupQuestions.length === 0 && group.section) {
          return null;
        }

        return (
          <div key={group.section?.id || `group-${groupIndex}`}>
            {group.section && renderSection(group.section, questionnaire.questions, groupIndex + 1)}
            
            {isSectionExpanded && visibleGroupQuestions.length > 0 && (
              <div className="p-6 pt-2 border-t border-slate-100 space-y-8">
                {(() => {
                  const rendered = new Set<string>();
                  return visibleGroupQuestions.map((question, qIndex) => {
                    // Skip if already rendered as part of a grouped pair
                    if (rendered.has(question.id)) {
                      return null;
                    }
                    
                    const isUnitField = question.id.endsWith('_unit');
                    
                    // Skip unit fields - they're rendered with their base field
                    if (isUnitField) {
                      return null;
                    }
                    
                    // Check if next question is the unit field for this question
                    const nextQuestion = qIndex < visibleGroupQuestions.length - 1 ? visibleGroupQuestions[qIndex + 1] : null;
                    const isNextQuestionUnit = nextQuestion?.id === `${question.id}_unit`;
                    
                    // If next question is the unit field, render them together
                    if (isNextQuestionUnit && nextQuestion) {
                      rendered.add(question.id);
                      rendered.add(nextQuestion.id);
                      return (
                        <div key={`grouped-${question.id}`} className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            {renderQuestion(question, true)}
                          </div>
                          <div>
                            {renderQuestion(nextQuestion, true)}
                          </div>
                        </div>
                      );
                    }
                    
                    rendered.add(question.id);
                    return renderQuestion(question, true);
                  });
                })()}
              </div>
            )}
          </div>
        );
      })}

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Veuillez corriger les erreurs suivantes :
          </h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {!readonly && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          {onSave && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting || isSaving}
            className="w-full sm:w-auto bg-brand hover:bg-brand-dark shadow-md shadow-brand/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Envoyer le questionnaire"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
