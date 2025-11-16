"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { PatientFull } from "@/lib/types/database.types";
import { calculateAge } from "@/lib/utils/date";
import Link from "next/link";

interface DashboardQuickSearchProps {
  pathology: string;
}

export function DashboardQuickSearch({ pathology }: DashboardQuickSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientFull[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const performSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/professional/patients/search?q=${encodeURIComponent(term)}&pathology=${pathology}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.patients?.slice(0, 5) || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, [pathology]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full md:w-80" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Quick search patient..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
          className="pl-10 pr-10 h-10"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-slate-200 shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-slate-500 px-2 py-1 font-medium">
              Top Results ({searchResults.length})
            </div>
            {searchResults.map((patient) => (
              <Link
                key={patient.id}
                href={`/professional/${pathology}/patients/${patient.id}`}
                onClick={() => {
                  setShowResults(false);
                  setSearchTerm("");
                }}
                className="block p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-sm text-slate-600">
                      MRN: <span className="font-mono">{patient.medical_record_number}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {calculateAge(patient.date_of_birth)} years
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {patient.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg border border-slate-200 shadow-lg p-4">
          <p className="text-sm text-slate-600 text-center">Searching...</p>
        </div>
      )}
    </div>
  );
}

