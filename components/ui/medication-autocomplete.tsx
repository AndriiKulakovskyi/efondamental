"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchMedications, type Medicament, type Presentation } from "@/lib/services/medication-api.service";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface MedicationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (medication: Medicament, presentation?: Presentation) => void;
  className?: string; // Standard className prop
  placeholder?: string; // Standard placeholder
  required?: boolean; // Required prop
}

export function MedicationAutocomplete({
  value,
  onChange,
  onSelect,
  className,
  placeholder = "Rechercher un médicament...",
  required = false
}: MedicationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Medicament[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);


  // Use debounced input for search
  const debouncedSearch = useDebounce(inputValue, 500); // Slower debounce to avoid spamming API

  // Sync internal state with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search when debounced value changes
  useEffect(() => {
    // 1. Create AbortController
    const controller = new AbortController();
    let isMounted = true;

    async function performSearch() {
      // API requires min 3 chars
      if (debouncedSearch.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      // Don't search if the input value matches the currently selected value (avoid researching on selection)
      if (debouncedSearch === value && !isOpen) {
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      
      try {
        // 2. Pass signal to service
        const data = await searchMedications(debouncedSearch, controller.signal);
        
        // 3. Only update if component is mounted and this is the latest request
        if (isMounted) {
          setResults(data);
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error("Error searching medications:", error);
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    performSearch();

    // 4. Cleanup function cancels previous request
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedSearch]);

  const handleSelect = (medication: Medicament, presentation?: Presentation) => {
    let name = medication.elementPharmaceutique;
    
    if (presentation) {
      // Create a nice display name: NAME DOSAGE - PACKAGING
      const dosage = medication.composition?.[0]?.dosage ? ` ${medication.composition[0].dosage}` : "";
      name = `${name}${dosage}`;
    }
      
    setInputValue(name);
    onChange(name);
    onSelect?.(medication, presentation);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setResults([]);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value); // Allow free text input
    
    // Open dropdown when enough characters
    if (e.target.value.length >= 3) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Re-open if user backspaces
    if (e.key === 'Backspace' && inputValue.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (inputValue.length >= 3) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 bg-slate-50 border-slate-200 rounded-xl"
          placeholder={placeholder}
          required={required}
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Recherche en cours...</span>
            </div>
          ) : results && results.length > 0 ? (
            <div className="py-1">
              {results.map((med) => (
                <div key={med.cis}>
                  {/* If medication has presentations, list them properly */}
                  {med.presentation && med.presentation.length > 0 ? (
                    med.presentation.map((pres) => (
                      <button
                        key={pres.cip13}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0"
                        onClick={() => handleSelect(med, pres)}
                        type="button"
                      >
                        <div className="font-medium text-slate-900">
                          {med.elementPharmaceutique}
                          {med.composition?.[0]?.dosage && <span className="text-slate-600 font-normal"> {med.composition[0].dosage}</span>}
                        </div>
                        <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                           <span>{pres.libelle}</span>
                           {med.titulaire && <span className="text-slate-400">{med.titulaire}</span>}
                        </div>
                      </button>
                    ))
                  ) : (
                    // Fallback for medication without explicit presentation list (rare but possible in some APIs)
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
                      onClick={() => handleSelect(med)}
                      type="button"
                    >
                      <div className="font-medium text-slate-900">{med.elementPharmaceutique}</div>
                      <div className="text-xs text-slate-500">{med.titulaire}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
