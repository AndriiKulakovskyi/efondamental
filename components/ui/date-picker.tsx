"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import type { Matcher } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  /** Date value as YYYY-MM-DD string (compatible with existing form state) */
  value: string;
  /** Callback with YYYY-MM-DD string */
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Max date as YYYY-MM-DD string */
  max?: string;
  /** Min date as YYYY-MM-DD string */
  min?: string;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  disabled = false,
  required = false,
  max,
  min,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Control the visible month to ensure we don't open on a fully disabled month
  const [month, setMonth] = React.useState<Date | undefined>(undefined);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const maxDate = React.useMemo(() => {
    if (!max) return undefined;
    const d = parse(max, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [max]);

  const minDate = React.useMemo(() => {
    if (!min) return undefined;
    const d = parse(min, "yyyy-MM-dd", new Date());
    return isValid(d) ? d : undefined;
  }, [min]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    setOpen(false);
  };

  const disabledMatcher = React.useMemo((): Matcher[] | undefined => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate]);

  // Wide navigation range for year/month dropdowns
  const fromBoundaryDate = minDate ?? new Date(1900, 0, 1);
  const toBoundaryDate = maxDate ?? undefined;
  const fromYear = fromBoundaryDate.getFullYear();
  const toYear = toBoundaryDate?.getFullYear() ?? new Date().getFullYear();

  // Initialize/adjust visible month when constraints or selection change
  React.useEffect(() => {
    const today = new Date();
    let initial = selectedDate ?? today;
    if (maxDate && initial > maxDate) initial = maxDate;
    if (minDate && initial < minDate) initial = minDate;
    // Only set if unset or now out of bounds
    if (!month || (maxDate && month > maxDate) || (minDate && month < minDate)) {
      setMonth(initial);
    }
  }, [selectedDate, minDate, maxDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate
            ? format(selectedDate, "d MMMM yyyy", { locale: fr })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledMatcher}
          month={month}
          onMonthChange={setMonth}
          fromDate={fromBoundaryDate}
          toDate={toBoundaryDate}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          locale={fr}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  /** Value as datetime-local string: YYYY-MM-DDTHH:mm */
  value: string;
  /** Callback with datetime-local string */
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Sélectionner date et heure",
  disabled = false,
  required = false,
  className,
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const { selectedDate, hours, minutes } = React.useMemo(() => {
    if (!value) return { selectedDate: undefined, hours: "09", minutes: "00" };
    const parts = value.split("T");
    const d = parse(parts[0], "yyyy-MM-dd", new Date());
    const timeParts = (parts[1] || "09:00").split(":");
    return {
      selectedDate: isValid(d) ? d : undefined,
      hours: timeParts[0] || "09",
      minutes: timeParts[1] || "00",
    };
  }, [value]);

  const buildValue = (date: Date | undefined, h: string, m: string) => {
    if (!date) return "";
    return `${format(date, "yyyy-MM-dd")}T${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(buildValue(date, hours, minutes));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeParts = e.target.value.split(":");
    if (timeParts.length === 2) {
      onChange(buildValue(selectedDate, timeParts[0], timeParts[1]));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate
            ? `${format(selectedDate, "d MMMM yyyy", { locale: fr })} à ${hours}:${minutes}`
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          locale={fr}
          required={required}
        />
        <div className="border-t p-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Heure
            <input
              type="time"
              value={`${hours}:${minutes}`}
              onChange={handleTimeChange}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}
