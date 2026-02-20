'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseTapRtfAction, saveTapResponse } from '@/app/professional/questionnaires/tap-actions';
import type {
  AttentionSoutenueRow,
  FlexibiliteRow,
  SchizophreniaTapResponse,
} from '@/lib/questionnaires/schizophrenia/initial/neuropsy/tap/types';
import {
  ATTENTION_SOUTENUE_CONDITIONS,
  FLEXIBILITE_CONDITIONS,
  ATTENTION_SOUTENUE_COLUMNS,
  FLEXIBILITE_COLUMNS,
  createEmptyAttentionRow,
  createEmptyFlexibiliteRow,
} from '@/lib/questionnaires/schizophrenia/initial/neuropsy/tap/types';

interface TapQuestionnaireFormProps {
  visitId: string;
  patientId: string;
  pathology: string;
  existingData?: SchizophreniaTapResponse | null;
  patientAge?: number | null;
  doctorName?: string | null;
}

export function TapQuestionnaireForm({
  visitId,
  patientId,
  pathology,
  existingData,
  patientAge,
  doctorName,
}: TapQuestionnaireFormProps) {
  const router = useRouter();

  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  // Shared age (read-only, from patient profile)
  const [age] = useState<string>(existingData?.age?.toString() ?? patientAge?.toString() ?? '');

  // Attention soutenue metadata
  const [attExaminateur, setAttExaminateur] = useState(existingData?.attention_examinateur ?? doctorName ?? '');
  const [attDatePassation, setAttDatePassation] = useState(existingData?.attention_date_passation ?? todayFormatted);
  const [attNormes, setAttNormes] = useState(existingData?.attention_normes ?? 'Toutes');

  // Flexibilité metadata
  const [flexExaminateur, setFlexExaminateur] = useState(existingData?.flexibilite_examinateur ?? doctorName ?? '');
  const [flexDatePassation, setFlexDatePassation] = useState(existingData?.flexibilite_date_passation ?? todayFormatted);
  const [flexNormes, setFlexNormes] = useState(existingData?.flexibilite_normes ?? 'Toutes');

  // Attention soutenue data
  const [attentionRows, setAttentionRows] = useState<AttentionSoutenueRow[]>(
    existingData?.attention_results?.length
      ? existingData.attention_results
      : ATTENTION_SOUTENUE_CONDITIONS.map(c => createEmptyAttentionRow(c))
  );

  // Flexibilité data
  const [flexRows, setFlexRows] = useState<FlexibiliteRow[]>(
    existingData?.flexibilite_results?.length
      ? existingData.flexibilite_results
      : FLEXIBILITE_CONDITIONS.map(c => createEmptyFlexibiliteRow(c))
  );
  const [indexPrestationValeur, setIndexPrestationValeur] = useState<string>(
    existingData?.flexibilite_index_prestation_valeur?.toString() ?? ''
  );
  const [indexPrestationPercentile, setIndexPrestationPercentile] = useState<string>(
    existingData?.flexibilite_index_prestation_percentile?.toString() ?? ''
  );
  const [indexSpeedValeur, setIndexSpeedValeur] = useState<string>(
    existingData?.flexibilite_index_speed_accuracy_valeur?.toString() ?? ''
  );
  const [indexSpeedPercentile, setIndexSpeedPercentile] = useState<string>(
    existingData?.flexibilite_index_speed_accuracy_percentile?.toString() ?? ''
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingAttention, setIsParsingAttention] = useState(false);
  const [isParsingFlex, setIsParsingFlex] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attentionFileName, setAttentionFileName] = useState<string | null>(null);
  const [flexFileName, setFlexFileName] = useState<string | null>(null);

  const attentionFileRef = useRef<HTMLInputElement>(null);
  const flexFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (
    file: File,
    testType: 'attention' | 'flexibilite'
  ) => {
    const setter = testType === 'attention' ? setIsParsingAttention : setIsParsingFlex;
    setter(true);
    setErrorMessage(null);

    try {
      const content = await file.text();
      const result = await parseTapRtfAction(content);

      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? 'Erreur lors de l\'analyse du fichier.');
        setter(false);
        return;
      }

      const { data } = result;

      if (testType === 'attention') {
        if (data.metadata.examinateur) setAttExaminateur(data.metadata.examinateur);
        if (data.metadata.date_passation) setAttDatePassation(data.metadata.date_passation);
        if (data.metadata.normes) setAttNormes(data.metadata.normes);

        if (data.attentionRows) {
          setAttentionRows(prev => {
            const updated = [...prev];
            data.attentionRows!.forEach((parsed, idx) => {
              if (idx < updated.length) {
                updated[idx] = { ...updated[idx], ...parsed };
              }
            });
            return updated;
          });
        }
        setAttentionFileName(file.name);
      } else {
        if (data.metadata.examinateur) setFlexExaminateur(data.metadata.examinateur);
        if (data.metadata.date_passation) setFlexDatePassation(data.metadata.date_passation);
        if (data.metadata.normes) setFlexNormes(data.metadata.normes);

        if (data.flexibiliteRows) {
          setFlexRows(prev => {
            const updated = [...prev];
            data.flexibiliteRows!.forEach((parsed, idx) => {
              if (idx < updated.length) {
                updated[idx] = { ...updated[idx], ...parsed };
              }
            });
            return updated;
          });
        }
        if (data.globalIndices) {
          if (data.globalIndices.index_prestation_valeur !== null) {
            setIndexPrestationValeur(data.globalIndices.index_prestation_valeur.toString());
          }
          if (data.globalIndices.index_prestation_percentile !== null) {
            setIndexPrestationPercentile(data.globalIndices.index_prestation_percentile.toString());
          }
          if (data.globalIndices.index_speed_accuracy_valeur !== null) {
            setIndexSpeedValeur(data.globalIndices.index_speed_accuracy_valeur.toString());
          }
          if (data.globalIndices.index_speed_accuracy_percentile !== null) {
            setIndexSpeedPercentile(data.globalIndices.index_speed_accuracy_percentile.toString());
          }
        }
        setFlexFileName(file.name);
      }
    } catch {
      setErrorMessage('Erreur lors de la lecture du fichier.');
    } finally {
      setter(false);
    }
  }, []);

  const updateAttentionCell = useCallback((rowIdx: number, key: string, value: string) => {
    setAttentionRows(prev => {
      const updated = [...prev];
      const row = { ...updated[rowIdx] } as any;
      row[key] = value === '' ? null : (key === 'condition' ? value : parseInt(value, 10) || null);
      updated[rowIdx] = row;
      return updated;
    });
  }, []);

  const updateFlexCell = useCallback((rowIdx: number, key: string, value: string) => {
    setFlexRows(prev => {
      const updated = [...prev];
      const row = { ...updated[rowIdx] } as any;
      row[key] = value === '' ? null : (key === 'condition' ? value : parseInt(value, 10) || null);
      updated[rowIdx] = row;
      return updated;
    });
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    const result = await saveTapResponse({
      visitId,
      patientId,
      age: age ? parseInt(age, 10) : null,
      attention_examinateur: attExaminateur || null,
      attention_date_passation: attDatePassation || null,
      attention_normes: attNormes || null,
      attention_type_test: 'Couleur ou forme',
      attention_results: attentionRows,
      flexibilite_examinateur: flexExaminateur || null,
      flexibilite_date_passation: flexDatePassation || null,
      flexibilite_normes: flexNormes || null,
      flexibilite_type_test: 'Alternance lettres et chiffres',
      flexibilite_results: flexRows,
      flexibilite_index_prestation_valeur: indexPrestationValeur ? parseFloat(indexPrestationValeur) : null,
      flexibilite_index_prestation_percentile: indexPrestationPercentile ? parseInt(indexPrestationPercentile, 10) : null,
      flexibilite_index_speed_accuracy_valeur: indexSpeedValeur ? parseFloat(indexSpeedValeur) : null,
      flexibilite_index_speed_accuracy_percentile: indexSpeedPercentile ? parseInt(indexSpeedPercentile, 10) : null,
    });

    setIsSaving(false);

    if (result.success) {
      setSaveSuccess(true);
      router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
    } else {
      setErrorMessage(result.error ?? 'Erreur lors de la sauvegarde.');
    }
  }, [visitId, patientId, pathology, age, attExaminateur, attDatePassation, attNormes, attentionRows, flexExaminateur, flexDatePassation, flexNormes, flexRows, indexPrestationValeur, indexPrestationPercentile, indexSpeedValeur, indexSpeedPercentile, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">TEA/TAP</h1>
              <p className="text-sm text-gray-500">
                Test of Attentional Performance - Attention soutenue et Flexibilité
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Section 1: Attention soutenue */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">TAP - Attention soutenue</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Couleur ou forme</p>
              </div>
              <FileUploadZone
                accept=".rtf"
                isParsing={isParsingAttention}
                fileName={attentionFileName}
                inputRef={attentionFileRef}
                onFileSelect={file => handleFileUpload(file, 'attention')}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Metadata for Attention */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informations du test</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="att_examinateur" className="text-xs">Examinateur</Label>
                  <Input id="att_examinateur" value={attExaminateur} onChange={e => setAttExaminateur(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="att_date" className="text-xs">Date de passation</Label>
                  <Input id="att_date" value={attDatePassation} onChange={e => setAttDatePassation(e.target.value)} placeholder="20/02/2026" className="h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="att_age" className="text-xs">Âge</Label>
                  <Input id="att_age" type="number" value={age} readOnly disabled className="h-8 text-sm bg-gray-100" />
                </div>
                <div>
                  <Label htmlFor="att_normes" className="text-xs">Normes</Label>
                  <Input id="att_normes" value={attNormes} onChange={e => setAttNormes(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {ATTENTION_SOUTENUE_COLUMNS.map(col => (
                      <th key={col.key} className="border border-gray-200 px-2 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                        {col.label}
                        {('unit' in col && col.unit) ? <span className="text-gray-400 font-normal ml-1">({col.unit})</span> : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attentionRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      {ATTENTION_SOUTENUE_COLUMNS.map(col => (
                        <td key={col.key} className="border border-gray-200 px-1 py-1">
                          {col.key === 'condition' ? (
                            <span className="px-1 font-medium text-gray-700">{row.condition}</span>
                          ) : (
                            <input
                              type="number"
                              className="w-full px-1.5 py-1 text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 focus:bg-white rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={(row as any)[col.key] ?? ''}
                              onChange={e => updateAttentionCell(rowIdx, col.key, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Flexibilité */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">TAP - Flexibilité</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Alternance lettres et chiffres</p>
              </div>
              <FileUploadZone
                accept=".rtf"
                isParsing={isParsingFlex}
                fileName={flexFileName}
                inputRef={flexFileRef}
                onFileSelect={file => handleFileUpload(file, 'flexibilite')}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Metadata for Flexibilité */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informations du test</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="flex_examinateur" className="text-xs">Examinateur</Label>
                  <Input id="flex_examinateur" value={flexExaminateur} onChange={e => setFlexExaminateur(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="flex_date" className="text-xs">Date de passation</Label>
                  <Input id="flex_date" value={flexDatePassation} onChange={e => setFlexDatePassation(e.target.value)} placeholder="20/02/2026" className="h-8 text-sm" />
                </div>
                <div>
                  <Label htmlFor="flex_age" className="text-xs">Âge</Label>
                  <Input id="flex_age" type="number" value={age} readOnly disabled className="h-8 text-sm bg-gray-100" />
                </div>
                <div>
                  <Label htmlFor="flex_normes" className="text-xs">Normes</Label>
                  <Input id="flex_normes" value={flexNormes} onChange={e => setFlexNormes(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {FLEXIBILITE_COLUMNS.map(col => (
                      <th key={col.key} className="border border-gray-200 px-2 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                        {col.label}
                        {('unit' in col && col.unit) ? <span className="text-gray-400 font-normal ml-1">({col.unit})</span> : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flexRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      {FLEXIBILITE_COLUMNS.map(col => (
                        <td key={col.key} className="border border-gray-200 px-1 py-1">
                          {col.key === 'condition' ? (
                            <span className="px-1 font-medium text-gray-700">{row.condition}</span>
                          ) : (
                            <input
                              type="number"
                              className="w-full px-1.5 py-1 text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 focus:bg-white rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={(row as any)[col.key] ?? ''}
                              onChange={e => updateFlexCell(rowIdx, col.key, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Global Indices */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Indices globaux</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">Index de prestation d&apos;ensemble</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="Valeur"
                        value={indexPrestationValeur}
                        onChange={e => setIndexPrestationValeur(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">%</span>
                        <Input
                          type="number"
                          placeholder="%"
                          value={indexPrestationPercentile}
                          onChange={e => setIndexPrestationPercentile(e.target.value)}
                          className="h-8 text-sm w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-500">Index de speed-accuracy trade-off</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="Valeur"
                        value={indexSpeedValeur}
                        onChange={e => setIndexSpeedValeur(e.target.value)}
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">%</span>
                        <Input
                          type="number"
                          placeholder="%"
                          value={indexSpeedPercentile}
                          onChange={e => setIndexSpeedPercentile(e.target.value)}
                          className="h-8 text-sm w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom save button */}
        <div className="flex justify-end pb-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : null}
            {isSaving ? 'Sauvegarde...' : saveSuccess ? 'Sauvegardé !' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileUploadZone({
  accept,
  isParsing,
  fileName,
  inputRef,
  onFileSelect,
}: {
  accept: string;
  isParsing: boolean;
  fileName: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      {fileName && (
        <span className="text-xs text-green-600 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {fileName}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <Button
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isParsing}
        className="gap-2 bg-[#FF4A3F] hover:bg-[#e5423a] text-white"
      >
        {isParsing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        {isParsing ? 'Analyse...' : 'Importer RTF'}
      </Button>
    </div>
  );
}
