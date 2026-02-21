"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertBanner } from "@/components/ui/alert-banner";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
}

interface PatientFormProps {
  pathology: string;
  doctors: Doctor[];
  currentUserId: string;
}

export function PatientForm({ pathology, doctors, currentUserId }: PatientFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    yearsOfEducation: "",
    medicalRecordNumber: "",
    gender: "",
    maidenName: "",
    placeOfBirth: "",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    assignedTo: currentUserId,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate max date for date of birth (must be at least 15 years old)
  const getMaxDateOfBirth = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 15);
    return today.toISOString().split('T')[0];
  };

  const validateAge = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate age >= 15
    if (!validateAge(formData.dateOfBirth)) {
      setError("Le patient doit avoir au moins 15 ans");
      return;
    }

    // Validate sex at birth is required
    if (!formData.gender) {
      setError("Le sexe a la naissance est requis");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/professional/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pathology,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Echec de la creation du patient");
      }

      const { patient } = await response.json();
      router.push(`/professional/${pathology}/patients/${patient.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm placeholder-slate-400";
  const inputWithIconClassName = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm placeholder-slate-400";
  const selectClassName = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%27http%3a%2f%2fwww.w3.org%2f2000%2fsvg%27%20fill%3d%27none%27%20viewBox%3d%270%200%2020%2020%27%3e%3cpath%20stroke%3d%27%236b7280%27%20stroke-linecap%3d%27round%27%20stroke-linejoin%3d%27round%27%20stroke-width%3d%271.5%27%20d%3d%27M6%208l4%204%204-4%27%2f%3e%3c%2fsvg%3e')] bg-[length:1.5em_1.5em] bg-[right_1rem_center] bg-no-repeat";

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* FORM SECTION 1: Informations Patient */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Informations Patient</h3>
          <p className="text-sm text-slate-400 mb-6">Informations de base sur le patient</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prenom */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Prenom <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Entrez le prenom"
                  className={inputWithIconClassName}
                  required
                />
              </div>
            </div>
            
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Entrez le nom"
                  className={inputWithIconClassName}
                  required
                />
              </div>
            </div>

            {/* Date de naissance */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date de naissance <span className="text-brand">*</span>
              </label>
              <DatePicker
                value={formData.dateOfBirth}
                max={getMaxDateOfBirth()}
                onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
                className={inputClassName}
                required
                placeholder="Sélectionner la date de naissance"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Le patient doit avoir au moins 15 ans</p>
            </div>

            {/* Annees d'etudes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Annees d&apos;etudes (depuis le CP) <span className="text-brand">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.yearsOfEducation}
                onChange={(e) => setFormData({ ...formData, yearsOfEducation: e.target.value })}
                placeholder="Ex: 12"
                className={inputClassName}
                required
              />
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                Nombre total d&apos;annees de scolarite (CP = 1ere annee)
              </p>
            </div>

            {/* Numero de dossier medical */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Numero de dossier medical <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm font-bold">#</span>
                <input
                  type="text"
                  value={formData.medicalRecordNumber}
                  onChange={(e) => setFormData({ ...formData, medicalRecordNumber: e.target.value.toUpperCase() })}
                  placeholder="Entrez le numero de dossier"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm font-mono"
                  required
                />
              </div>
            </div>

            {/* Sexe a la naissance */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sexe a la naissance <span className="text-brand">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={selectClassName}
                required
              >
                <option value="" disabled>Selectionner le sexe à la naissance</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            
            {/* Nom de jeune fille (Conditional) */}
            {formData.gender === 'F' && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom de jeune fille
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={formData.maidenName}
                    onChange={(e) => setFormData({ ...formData, maidenName: e.target.value })}
                    placeholder="Entrez le nom de jeune fille"
                    className={inputWithIconClassName}
                  />
                </div>
              </div>
            )}

            {/* Lieu de naissance */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lieu de naissance</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  placeholder="Entrez le lieu de naissance"
                  className={inputWithIconClassName}
                />
              </div>
            </div>

            {/* Medecin assigne (Full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Medecin assigne <span className="text-brand">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%27http%3a%2f%2fwww.w3.org%2f2000%2fsvg%27%20fill%3d%27none%27%20viewBox%3d%270%200%2020%2020%27%3e%3cpath%20stroke%3d%27%236b7280%27%20stroke-linecap%3d%27round%27%20stroke-linejoin%3d%27round%27%20stroke-width%3d%271.5%27%20d%3d%27M6%208l4%204%204-4%27%2f%3e%3c%2fsvg%3e')] bg-[length:1.5em_1.5em] bg-[right_1rem_center] bg-no-repeat"
                  required
                >
                  <option value="" disabled>Selectionner un medecin</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* FORM SECTION 2: Coordonnees */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Coordonnees</h3>
          <p className="text-sm text-slate-400 mb-6">Comment contacter le patient</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="patient@exemple.com"
                  className={inputWithIconClassName}
                />
              </div>
            </div>
            
            {/* Telephone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telephone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                  className={inputWithIconClassName}
                />
              </div>
            </div>

            {/* Adresse (Full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Entrez l'adresse complete"
                  className={inputWithIconClassName}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FORM SECTION 3: Contact d'urgence */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Contact d&apos;urgence</h3>
          <p className="text-sm text-slate-400 mb-6">Personne a contacter en cas d&apos;urgence</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du contact (Full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom du contact</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="Entrez le nom du contact"
                  className={inputWithIconClassName}
                />
              </div>
            </div>

            {/* Telephone du contact */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telephone du contact</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  placeholder="+33 1 23 45 67 89"
                  className={inputWithIconClassName}
                />
              </div>
            </div>

            {/* Lien de parente */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lien de parente</label>
              <select
                value={formData.emergencyContactRelationship}
                onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                className={selectClassName}
              >
                <option value="" disabled>Selectionner le lien</option>
                <option value="Conjoint">Conjoint(e)</option>
                <option value="Parent">Parent/Tuteur</option>
                <option value="Enfant">Enfant</option>
                <option value="Ami">Ami(e)</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && <AlertBanner type="error" message={error} />}

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creation...
              </>
            ) : (
              "Creer le patient"
            )}
          </button>
        </div>

        {/* Footer spacer */}
        <div className="h-16"></div>
      </div>
    </form>
  );
}
