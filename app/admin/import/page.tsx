"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileJson, AlertCircle, CheckCircle2, Loader2, Users, Calendar, FileText, AlertTriangle, UserRound } from "lucide-react";

interface Center {
  id: string;
  name: string;
  code: string;
}

interface Pathology {
  id: string;
  name: string;
  type: string;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ImportResult {
  success: boolean;
  importedPatients: number;
  importedVisits: number;
  importedResponses: number;
  errors: string[];
  warnings: string[];
}

interface PatientPreview {
  medical_record_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  visits_count: number;
  questionnaires_count: number;
}

export default function ImportPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>("");
  const [selectedPathology, setSelectedPathology] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [patientPreview, setPatientPreview] = useState<PatientPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch initial data (centers and pathologies)
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [centersRes, pathologiesRes] = await Promise.all([
          fetch("/api/admin/centers"),
          fetch("/api/admin/pathologies"),
        ]);
        
        if (centersRes.ok) {
          const centersData = await centersRes.json();
          setCenters(centersData.centers || []);
        }
        
        if (pathologiesRes.ok) {
          const pathologiesData = await pathologiesRes.json();
          setPathologies(pathologiesData.pathologies || []);
        }
      } catch (err) {
        setError("Failed to load configuration data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch doctors when center is selected
  useEffect(() => {
    async function fetchDoctors() {
      if (!selectedCenter) {
        setDoctors([]);
        setSelectedDoctor("");
        return;
      }

      setIsLoadingDoctors(true);
      try {
        const response = await fetch(`/api/admin/centers/${selectedCenter}/professionals`);
        if (response.ok) {
          const data = await response.json();
          // Filter for healthcare professionals only
          const healthcareProfessionals = (data.professionals || []).filter(
            (p: any) => p.role === 'healthcare_professional'
          );
          setDoctors(healthcareProfessionals);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        setDoctors([]);
      } finally {
        setIsLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, [selectedCenter]);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setError(null);
    setImportResult(null);
    setPatientPreview([]);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.endsWith(".json")) {
      setError("File must be in JSON format");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        
        // Support both array format and {patients: [...]} format
        const patients = Array.isArray(content) ? content : content.patients;
        
        if (!patients || !Array.isArray(patients)) {
          setError("Invalid JSON format: file must contain an array of patient objects");
          return;
        }
        
        // Generate preview
        const preview: PatientPreview[] = patients.map((p: any) => ({
          medical_record_number: p.medical_record_number || "N/A",
          first_name: p.first_name || "N/A",
          last_name: p.last_name || "N/A",
          date_of_birth: p.date_of_birth || "N/A",
          gender: p.gender || "N/A",
          visits_count: p.visits?.length || 0,
          questionnaires_count: p.visits?.reduce((sum: number, v: any) => 
            sum + (v.questionnaires?.length || 0), 0) || 0,
        }));
        setPatientPreview(preview);
      } catch (err) {
        setError("JSON parsing error: check file format");
      }
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const handleImport = async () => {
    if (!selectedCenter || !selectedPathology || !file) {
      setError("Please select a center, pathology, and upload a file");
      return;
    }

    setIsImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("centerId", selectedCenter);
      formData.append("pathologyId", selectedPathology);
      // Add optional doctor assignment
      if (selectedDoctor) {
        formData.append("assignedTo", selectedDoctor);
      }

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.validationErrors) {
          setError(`Validation failed: ${result.validationErrors.slice(0, 3).join(", ")}${result.validationErrors.length > 3 ? "..." : ""}`);
        } else {
          setError(result.error || "Import failed");
        }
        return;
      }

      setImportResult(result);
    } catch (err) {
      setError("Server connection error");
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPatientPreview([]);
    setImportResult(null);
    setError(null);
  };

  const totalVisits = patientPreview.reduce((sum, p) => sum + p.visits_count, 0);
  const totalQuestionnaires = patientPreview.reduce((sum, p) => sum + p.questionnaires_count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Import Data</h2>
        <p className="text-slate-600">Import existing patient data and follow-up visits</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : (
        <>
          {/* Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Select the target center, pathology, and optionally assign a doctor for imported patients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Center *</label>
                  <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a center" />
                    </SelectTrigger>
                    <SelectContent>
                      {centers.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.name} {center.code && `(${center.code})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Pathology *</label>
                  <Select value={selectedPathology} onValueChange={setSelectedPathology}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pathology" />
                    </SelectTrigger>
                    <SelectContent>
                      {pathologies.map((pathology) => (
                        <SelectItem key={pathology.id} value={pathology.id}>
                          {pathology.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Assign to Doctor
                    <span className="text-slate-400 font-normal ml-1">(optional)</span>
                  </label>
                  <Select 
                    value={selectedDoctor || "none"} 
                    onValueChange={(value) => setSelectedDoctor(value === "none" ? "" : value)}
                    disabled={!selectedCenter || isLoadingDoctors}
                  >
                    <SelectTrigger>
                      {isLoadingDoctors ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a doctor (optional)" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <span className="text-slate-500">No assignment</span>
                      </SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-slate-400" />
                            <span>Dr. {doctor.last_name} {doctor.first_name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCenter && doctors.length === 0 && !isLoadingDoctors && (
                    <p className="text-xs text-slate-500">No doctors available in this center</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data File</CardTitle>
              <CardDescription>
                Upload a JSON file containing patient data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : file
                    ? "border-green-300 bg-green-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                  <div className="space-y-2">
                    <FileJson className="h-12 w-12 mx-auto text-green-500" />
                    <p className="text-sm font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                      }}
                    >
                      Change file
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">
                      Drag and drop a JSON file here
                    </p>
                    <p className="text-xs text-slate-500">or click to select</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {patientPreview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  {patientPreview.length} patient(s) detected with {totalVisits} visit(s) total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{patientPreview.length}</p>
                      <p className="text-sm text-blue-600">Patients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{totalVisits}</p>
                      <p className="text-sm text-purple-600">Visits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-700">{totalQuestionnaires}</p>
                      <p className="text-sm text-green-600">Questionnaires</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 px-3 font-medium text-slate-700">MRN</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-700">Last Name</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-700">First Name</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-700">Date of Birth</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-700">Gender</th>
                        <th className="text-center py-2 px-3 font-medium text-slate-700">Visits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientPreview.slice(0, 10).map((patient, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-2 px-3 font-mono text-xs">{patient.medical_record_number}</td>
                          <td className="py-2 px-3">{patient.last_name}</td>
                          <td className="py-2 px-3">{patient.first_name}</td>
                          <td className="py-2 px-3">{patient.date_of_birth}</td>
                          <td className="py-2 px-3 capitalize">{patient.gender}</td>
                          <td className="py-2 px-3 text-center">{patient.visits_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {patientPreview.length > 10 && (
                    <p className="text-sm text-slate-500 mt-2 text-center">
                      ... and {patientPreview.length - 10} more patients
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <Card className={importResult.errors.length === 0 ? "border-green-300" : "border-amber-300"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importResult.errors.length === 0 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-green-700">Import Successful</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="text-amber-700">Import Completed with Issues</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-700">{importResult.importedPatients}</p>
                    <p className="text-sm text-slate-500">Patients Created</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-700">{importResult.importedVisits}</p>
                    <p className="text-sm text-slate-500">Visits Created</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-700">{importResult.importedResponses}</p>
                    <p className="text-sm text-slate-500">Responses Created</p>
                  </div>
                </div>

                {importResult.warnings && importResult.warnings.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-amber-700 mb-2">
                      Warnings ({importResult.warnings.length}):
                    </p>
                    <ul className="text-sm text-amber-600 space-y-1 max-h-32 overflow-y-auto bg-amber-50 p-3 rounded-lg">
                      {importResult.warnings.slice(0, 10).map((warn, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-400">-</span>
                          {warn}
                        </li>
                      ))}
                      {importResult.warnings.length > 10 && (
                        <li className="text-amber-500 font-medium">
                          ... and {importResult.warnings.length - 10} more warnings
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {importResult.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-red-700 mb-2">
                      Errors ({importResult.errors.length}):
                    </p>
                    <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto bg-red-50 p-3 rounded-lg">
                      {importResult.errors.slice(0, 10).map((err, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400">-</span>
                          {err}
                        </li>
                      ))}
                      {importResult.errors.length > 10 && (
                        <li className="text-red-500 font-medium">
                          ... and {importResult.errors.length - 10} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <Button onClick={resetForm} className="mt-4">
                  New Import
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Import Button */}
          {!importResult && patientPreview.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={!selectedCenter || !selectedPathology || isImporting}
                className="min-w-[200px]"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import {patientPreview.length} patient(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
