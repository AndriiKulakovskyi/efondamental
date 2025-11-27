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
      if (prev.patient_age && prev.years_of_education !== undefined && 
          prev.tmta_tps !== undefined && prev.tmta_err !== undefined &&
          prev.tmtb_tps !== undefined && prev.tmtb_err !== undefined &&
          prev.tmtb_err_persev !== undefined) {
        try {
          const tmtScores = calculateTmtScores({
            patient_age: Number(prev.patient_age),
            years_of_education: Number(prev.years_of_education),
            tmta_tps: Number(prev.tmta_tps),
            tmta_err: Number(prev.tmta_err),
            tmta_cor: prev.tmta_cor ? Number(prev.tmta_cor) : null,
            tmtb_tps: Number(prev.tmtb_tps),
            tmtb_err: Number(prev.tmtb_err),
            tmtb_cor: prev.tmtb_cor ? Number(prev.tmtb_cor) : null,
            tmtb_err_persev: Number(prev.tmtb_err_persev)
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

      // Compute Stroop scores if all required fields are available
      if (prev.patient_age && 
          prev.stroop_w_tot !== undefined && 
          prev.stroop_c_tot !== undefined &&
          prev.stroop_cw_tot !== undefined) {
        try {
          const stroopScores = calculateStroopScores({
            patient_age: Number(prev.patient_age),
            stroop_w_tot: Number(prev.stroop_w_tot),
            stroop_c_tot: Number(prev.stroop_c_tot),
            stroop_cw_tot: Number(prev.stroop_cw_tot)
          });

          // Update computed scores
          if (updated.stroop_w_tot_c !== stroopScores.stroop_w_tot_c) {
            updated.stroop_w_tot_c = stroopScores.stroop_w_tot_c;
            hasChanges = true;
          }
          if (updated.stroop_c_tot_c !== stroopScores.stroop_c_tot_c) {
            updated.stroop_c_tot_c = stroopScores.stroop_c_tot_c;
            hasChanges = true;
          }
          if (updated.stroop_cw_tot_c !== stroopScores.stroop_cw_tot_c) {
            updated.stroop_cw_tot_c = stroopScores.stroop_cw_tot_c;
            hasChanges = true;
          }
          if (updated.stroop_interf !== stroopScores.stroop_interf) {
            updated.stroop_interf = stroopScores.stroop_interf;
            hasChanges = true;
          }
          if (updated.stroop_w_note_t !== stroopScores.stroop_w_note_t) {
            updated.stroop_w_note_t = stroopScores.stroop_w_note_t;
            hasChanges = true;
          }
          if (updated.stroop_c_note_t !== stroopScores.stroop_c_note_t) {
            updated.stroop_c_note_t = stroopScores.stroop_c_note_t;
            hasChanges = true;
          }
          if (updated.stroop_cw_note_t !== stroopScores.stroop_cw_note_t) {
            updated.stroop_cw_note_t = stroopScores.stroop_cw_note_t;
            hasChanges = true;
          }
          if (updated.stroop_interf_note_t !== stroopScores.stroop_interf_note_t) {
            updated.stroop_interf_note_t = stroopScores.stroop_interf_note_t;
            hasChanges = true;
          }
          if (updated.stroop_w_note_t_corrigee !== stroopScores.stroop_w_note_t_corrigee) {
            updated.stroop_w_note_t_corrigee = stroopScores.stroop_w_note_t_corrigee;
            hasChanges = true;
          }
          if (updated.stroop_c_note_t_corrigee !== stroopScores.stroop_c_note_t_corrigee) {
            updated.stroop_c_note_t_corrigee = stroopScores.stroop_c_note_t_corrigee;
            hasChanges = true;
          }
          if (updated.stroop_cw_note_t_corrigee !== stroopScores.stroop_cw_note_t_corrigee) {
            updated.stroop_cw_note_t_corrigee = stroopScores.stroop_cw_note_t_corrigee;
            hasChanges = true;
          }
          if (updated.stroop_interf_note_tz !== stroopScores.stroop_interf_note_tz) {
            updated.stroop_interf_note_tz = stroopScores.stroop_interf_note_tz;
            hasChanges = true;
          }
        } catch (e) {
          // Ignore calculation errors (e.g., invalid values)
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
    responses.stroop_cw_tot
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
