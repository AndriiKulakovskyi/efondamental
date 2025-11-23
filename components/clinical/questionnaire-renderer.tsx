"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";

interface QuestionnaireRendererProps {
  questionnaire: QuestionnaireDefinition;
  initialResponses?: Record<string, any>;
  onSubmit: (responses: Record<string, any>) => Promise<void>;
  onSave?: (responses: Record<string, any>) => Promise<void>;
  readonly?: boolean;
}

export function QuestionnaireRenderer({
  questionnaire,
  initialResponses = {},
  onSubmit,
  onSave,
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
    responses.clairance_creatinine
  ]);

  const { visibleQuestions, requiredQuestions } = evaluateConditionalLogic(
    questionnaire,
    responses
  );

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setErrors([]);
  };

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

  const renderSection = (question: Question, questions: Question[]) => {
    const isExpanded = expandedSections.has(question.id);
    const completion = getSectionCompletion(question.id, questions);
    const hasHelp = !!question.help;
    
    return (
      <div key={question.id} className="border-b border-slate-200 pb-4 mb-6">
        <button
          type="button"
          onClick={() => toggleSection(question.id)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{question.text}</h3>
              {hasHelp && (
                <p className="text-sm text-slate-500 mt-1">{question.help}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {completion > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      completion === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 font-medium min-w-[3rem] text-right">
                  {completion}%
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
    );
  };

  const renderQuestion = (question: Question, skipSectionCheck = false) => {
    if (!visibleQuestions.includes(question.id)) {
      return null;
    }

    // Handle section rendering
    if (question.type === 'section') {
      return renderSection(question, questionnaire.questions);
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
        <Label htmlFor={question.id} className="text-sm font-medium">
          {question.text}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {question.help && (
          <div className="text-sm text-muted-foreground space-y-1">
            {question.help.split('\n').map((line, index) => (
              <p key={index} className={line.trim() === '' ? 'h-2' : ''}>
                {line || '\u00A0'}
              </p>
            ))}
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
            className={question.readonly ? "bg-slate-50 text-slate-700" : ""}
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
            className={question.readonly ? "bg-slate-50 text-slate-700" : ""}
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
            <SelectTrigger>
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
          <div className="flex justify-end gap-3 pt-4 border-t">
            {onSave && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                disabled={isSaving || isSubmitting}
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
            <Button type="submit" disabled={isSubmitting || isSaving}>
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {questionGroups.map((group, groupIndex) => {
        const isSectionExpanded = !group.section || expandedSections.has(group.section.id);
        const visibleGroupQuestions = group.questions.filter(q => visibleQuestions.includes(q.id));
        
        if (visibleGroupQuestions.length === 0 && group.section) {
          return null;
        }

        return (
          <div key={group.section?.id || `group-${groupIndex}`} className="space-y-4">
            {group.section && renderSection(group.section, questionnaire.questions)}
            
            {isSectionExpanded && visibleGroupQuestions.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div className={`grid gap-6 ${questionnaire.metadata?.singleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
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
                          <div key={`grouped-${question.id}`} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              {renderQuestion(question, true)}
                            </div>
                            <div>
                              {renderQuestion(nextQuestion, true)}
                            </div>
                          </div>
                        );
                      }
                      
                      rendered.add(question.id);
                      return (
                        <div key={question.id} className={question.type === 'date' ? 'md:col-span-2' : ''}>
                          {renderQuestion(question, true)}
                        </div>
                      );
                    });
                  })()}
                </div>
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
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onSave && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              disabled={isSaving || isSubmitting}
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
          <Button type="submit" disabled={isSubmitting || isSaving}>
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
