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
} from "@/lib/utils/questionnaire-logic";
import { calculateTmtScores } from "@/lib/services/tmt-scoring";
import { calculateStroopScores } from "@/lib/services/stroop-scoring";
import { Loader2, ChevronDown, Info } from "lucide-react";

interface QuestionnaireRendererProps {
  questionnaire: QuestionnaireDefinition;
  initialResponses?: Record<string, any>;
  onSubmit: (responses: Record<string, any>) => Promise<void>;
  onSave?: (responses: Record<string, any>) => Promise<void>;
  onResponseChange?: (responses: Record<string, any>) => void;
  readonly?: boolean;
}

export function QuestionnaireRenderer({
  questionnaire,
  initialResponses = {},
  onSubmit,
  onSave,
  onResponseChange,
  readonly = false,
}: QuestionnaireRendererProps) {
  // Initialize responses with defaults for date fields
  const initializeResponses = useCallback(() => {
    const initialized = { ...initialResponses };
    questionnaire.questions.forEach((q) => {
      if (q.type === 'date' && q.metadata?.default === 'today' && !initialized[q.id]) {
        initialized[q.id] = new Date().toISOString().split('T')[0];
      }
    });
    return initialized;
  }, [initialResponses, questionnaire.questions]);

  const [responses, setResponses] = useState<Record<string, any>>(initializeResponses);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track expanded sections (for collapsible sections)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Initialize all sections as expanded by default
  useEffect(() => {
    const sectionIds = questionnaire.questions
      .filter(q => q.type === 'section')
      .map(q => q.id);
    setExpandedSections(new Set(sectionIds));
  }, [questionnaire.questions]);

  // Update responses when initialResponses changes
  useEffect(() => {
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
          if (updated.tmtb_err_persev_z !== tmtScores.tmtb_err_persev_z) {
            updated.tmtb_err_persev_z = tmtScores.tmtb_err_persev_z;
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

      // Compute COBRA total score (sum of q1-q16)
      const cobraFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16'];
      const cobraValues = cobraFields.map(f => prev[f]).filter(v => v !== undefined && v !== '' && !isNaN(Number(v)));
      if (cobraValues.length > 0) {
        const cobraTotal = cobraValues.reduce((sum, v) => sum + Number(v), 0);
        if (updated.total_score !== cobraTotal) {
          updated.total_score = cobraTotal;
          hasChanges = true;
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

      // Compute Fluences Verbales scores progressively as fields are entered
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
    responses.item18
  ]);

  const { visibleQuestions, requiredQuestions } = evaluateConditionalLogic(
    questionnaire,
    responses
  );

  // Track previous responses to detect actual changes
  const prevResponsesRef = useRef<Record<string, any>>(initialResponses);
  const isFirstRender = useRef(true);
  
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
  // This runs after state update is complete, avoiding the React warning
  useEffect(() => {
    // Skip the very first render (when responses equals initialResponses)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevResponsesRef.current = responses;
      return;
    }
    
    // Only notify if responses actually changed
    if (onResponseChange && responses !== prevResponsesRef.current) {
      prevResponsesRef.current = responses;
      onResponseChange(responses);
    }
  }, [responses, onResponseChange]);

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
    const sectionQuestions = questions.filter(q => {
      const sectionIndex = questions.findIndex(sq => sq.id === sectionId);
      if (sectionIndex === -1) return false;
      
      // Find next section or end of array
      const nextSectionIndex = questions.findIndex((sq, idx) => 
        idx > sectionIndex && sq.type === 'section'
      );
      const endIndex = nextSectionIndex === -1 ? questions.length : nextSectionIndex;
      
      // Check if question is between this section and next section
      const questionIndex = questions.findIndex(qq => qq.id === q.id);
      return questionIndex > sectionIndex && questionIndex < endIndex && q.type !== 'section';
    });
    
    // Filter out unit fields - they're part of their base field
    const nonUnitQuestions = sectionQuestions.filter(q => !q.id.endsWith('_unit'));
    
    const visibleSectionQuestions = nonUnitQuestions.filter(q => visibleQuestions.includes(q.id));
    if (visibleSectionQuestions.length === 0) return 100;
    
    const completedQuestions = visibleSectionQuestions.filter(q => {
      const value = responses[q.id];
      // For fields with unit selectors, check if base field has value
      const unitFieldId = `${q.id}_unit`;
      const hasUnitField = questions.some(sq => sq.id === unitFieldId);
      
      if (hasUnitField) {
        // If it has a unit field, both base and unit must be filled
        const unitValue = responses[unitFieldId];
        return value !== undefined && value !== null && value !== '' && 
               unitValue !== undefined && unitValue !== null && unitValue !== '';
      }
      
      return value !== undefined && value !== null && value !== '';
    });
    
    return Math.round((completedQuestions.length / visibleSectionQuestions.length) * 100);
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

    return (
      <div key={question.id} className={`space-y-3 ${isUnitField ? 'col-span-1' : ''}`}>
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

        {question.type === "text" && (
          <Input
            id={question.id}
            type="text"
            value={value || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            disabled={readonly || question.readonly}
            required={isRequired}
            className={`bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand ${
              question.readonly ? "bg-slate-50 text-slate-700" : ""
            }`}
          />
        )}

        {question.type === "number" && (
          <Input
            id={question.id}
            type="number"
            value={value || ""}
            onChange={(e) => handleResponseChange(question.id, Number(e.target.value))}
            min={question.min}
            max={question.max}
            disabled={readonly || question.readonly}
            required={isRequired}
            className={`bg-slate-50 border-slate-200 rounded-xl px-4 py-3.5 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand ${
              question.readonly ? "bg-slate-50 text-slate-700" : ""
            }`}
          />
        )}

        {question.type === "scale" && (
          <div className="space-y-2">
            <Input
              id={question.id}
              type="range"
              value={value || question.min || 0}
              onChange={(e) =>
                handleResponseChange(question.id, Number(e.target.value))
              }
              min={question.min || 0}
              max={question.max || 10}
              disabled={readonly}
              required={isRequired}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{question.minLabel || question.min}</span>
              <span className="font-semibold">{value || question.min || 0}</span>
              <span>{question.maxLabel || question.max}</span>
            </div>
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
            disabled={readonly}
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
