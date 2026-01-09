"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Clock, Filter } from "lucide-react";
import { PatientFull } from "@/lib/types/database.types";
import { calculateAge } from "@/lib/utils/date";
import Link from "next/link";

interface PatientSearchProps {
  pathology: string;
  initialPatients?: PatientFull[];
  onFilterChange?: (filtered: PatientFull[]) => void;
}

export function PatientSearch({ pathology, initialPatients = [], onFilterChange }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientFull[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    riskLevel: "",
    ageMin: "",
    ageMax: "",
    hasUpcomingVisit: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Close dropdown when clicking outside
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
        setSearchResults(data.patients || []);
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

  const applyFilters = (patients: PatientFull[]) => {
    let filtered = [...patients];

    if (filters.riskLevel) {
      // This would need risk level to be added to PatientFull type
      // For now, we'll skip this filter
    }

    if (filters.ageMin) {
      filtered = filtered.filter(p => calculateAge(p.date_of_birth) >= parseInt(filters.ageMin));
    }

    if (filters.ageMax) {
      filtered = filtered.filter(p => calculateAge(p.date_of_birth) <= parseInt(filters.ageMax));
    }

    if (filters.hasUpcomingVisit === "yes") {
      // This would need upcoming visit info in PatientFull
      // For now, we'll skip this filter
    }

    if (onFilterChange) {
      onFilterChange(filtered);
    }

    return filtered;
  };

  useEffect(() => {
    applyFilters(initialPatients);
  }, [filters, initialPatients]);

  const clearFilters = () => {
    setFilters({
      riskLevel: "",
      ageMin: "",
      ageMax: "",
      hasUpcomingVisit: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou NRM..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              className="pl-10 pr-10"
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
            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-slate-500 px-2 py-1 font-medium">
                  Resultats de recherche ({searchResults.length})
                </div>
                {searchResults.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/professional/${pathology}/patients/${patient.id}`}
                    onClick={() => setShowResults(false)}
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
                          {calculateAge(patient.date_of_birth)} ans
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
            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg p-4">
              <p className="text-sm text-slate-600 text-center">Recherche en cours...</p>
            </div>
          )}
        </div>

        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Filtres</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Effacer tout
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Niveau de risque
              </label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) =>
                  setFilters({ ...filters, riskLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  <SelectItem value="high">Eleve</SelectItem>
                  <SelectItem value="moderate">Modere</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="none">Aucun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Age min
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.ageMin}
                onChange={(e) =>
                  setFilters({ ...filters, ageMin: e.target.value })
                }
                min="0"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Age max
              </label>
              <Input
                type="number"
                placeholder="120"
                value={filters.ageMax}
                onChange={(e) =>
                  setFilters({ ...filters, ageMax: e.target.value })
                }
                min="0"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Visite a venir
              </label>
              <Select
                value={filters.hasUpcomingVisit}
                onValueChange={(value) =>
                  setFilters({ ...filters, hasUpcomingVisit: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="yes">Avec visite prevue</SelectItem>
                  <SelectItem value="no">Sans visite prevue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex gap-2 flex-wrap">
              {filters.riskLevel && (
                <Badge variant="secondary">
                  Risque : {filters.riskLevel}
                  <button
                    onClick={() => setFilters({ ...filters, riskLevel: "" })}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.ageMin && (
                <Badge variant="secondary">
                  Age min : {filters.ageMin}
                  <button
                    onClick={() => setFilters({ ...filters, ageMin: "" })}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.ageMax && (
                <Badge variant="secondary">
                  Age max : {filters.ageMax}
                  <button
                    onClick={() => setFilters({ ...filters, ageMax: "" })}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.hasUpcomingVisit && (
                <Badge variant="secondary">
                  {filters.hasUpcomingVisit === "yes" ? "Avec" : "Sans"} visite prevue
                  <button
                    onClick={() => setFilters({ ...filters, hasUpcomingVisit: "" })}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

