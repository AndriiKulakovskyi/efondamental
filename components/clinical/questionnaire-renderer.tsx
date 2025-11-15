"use client";

import { useState, useEffect } from "react";
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
import { Questionnaire, Question } from "@/lib/types/database.types";
import {
  evaluateConditionalLogic,
  validateQuestionnaireResponse,
} from "@/lib/services/questionnaire.service";
import { Loader2 } from "lucide-react";

interface QuestionnaireRendererProps {
  questionnaire: Questionnaire;
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
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const renderQuestion = (question: Question) => {
    if (!visibleQuestions.includes(question.id)) {
      return null;
    }

    const isRequired = requiredQuestions.includes(question.id);
    const value = responses[question.id];

    return (
      <div key={question.id} className="space-y-3">
        <Label htmlFor={question.id} className="text-sm font-medium">
          {question.text}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {question.type === "text" && (
          <Input
            id={question.id}
            type="text"
            value={value || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            disabled={readonly}
            required={isRequired}
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
            disabled={readonly}
            required={isRequired}
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
            value={value || ""}
            onValueChange={(val) => handleResponseChange(question.id, val)}
            disabled={readonly}
            required={isRequired}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const checked = Array.isArray(value) && value.includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = isChecked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleResponseChange(question.id, newValues);
                    }}
                    disabled={readonly}
                  />
                  <label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
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
              Yes
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {questionnaire.questions.map((question) => renderQuestion(question))}
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Please correct the following errors:
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
                  Saving...
                </>
              ) : (
                "Save Progress"
              )}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isSaving}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Questionnaire"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}

