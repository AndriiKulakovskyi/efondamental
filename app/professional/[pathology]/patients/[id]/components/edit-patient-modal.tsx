"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, User, Phone, Mail, MapPin, Users } from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  marital_name: string | null;
  date_of_birth: string;
  gender: 'M' | 'F' | string | null;
  maiden_name: string | null;
  birth_city: string | null;
  birth_department: string | null;
  birth_country: string | null;
  hospital_id: string | null;
  social_security_number: string | null;
  email: string | null;
  phone: string | null;
  street_number_and_name: string | null;
  building_details: string | null;
  postal_code: string | null;
  city: string | null;
  phone_private: string | null;
  phone_professional: string | null;
  phone_mobile: string | null;
  address: string | null;
  emergency_contact: EmergencyContact | null;
  years_of_education: number | null;
  patient_sector: string | null;
  referred_by: string | null;
  visit_purpose: string | null;
  gp_report_consent: string | null;
  psychiatrist_report_consent: string | null;
  center_awareness_source: string | null;
}

interface EditPatientModalProps {
  patient: PatientData;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPatientModal({ patient, isOpen, onClose }: EditPatientModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize existing gender to M/F format
  const normalizeGender = (g: string | null): string => {
    if (!g) return "";
    const lower = g.toLowerCase();
    if (lower === 'm' || lower === 'male' || lower === 'homme') return 'M';
    if (lower === 'f' || lower === 'female' || lower === 'femme') return 'F';
    return g;
  };

  // Form state - Identité
  const [firstName, setFirstName] = useState(patient.first_name);
  const [lastName, setLastName] = useState(patient.last_name);
  const [maritalName, setMaritalName] = useState(patient.marital_name || "");
  const [dateOfBirth, setDateOfBirth] = useState(patient.date_of_birth);
  const [gender, setGender] = useState(normalizeGender(patient.gender));
  const [birthCity, setBirthCity] = useState(patient.birth_city || "");
  const [birthDepartment, setBirthDepartment] = useState(patient.birth_department || "");
  const [birthCountry, setBirthCountry] = useState(patient.birth_country || "France");
  const [hospitalId, setHospitalId] = useState(patient.hospital_id || "");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState(patient.social_security_number || "");
  const [yearsOfEducation, setYearsOfEducation] = useState(patient.years_of_education?.toString() || "");
  const [maidenName, setMaidenName] = useState(patient.maiden_name || "");

  // Form state - Coordonnées
  const [email, setEmail] = useState(patient.email || "");
  const [streetNumberAndName, setStreetNumberAndName] = useState(patient.street_number_and_name || "");
  const [buildingDetails, setBuildingDetails] = useState(patient.building_details || "");
  const [postalCode, setPostalCode] = useState(patient.postal_code || "");
  const [city, setCity] = useState(patient.city || "");
  const [phonePrivate, setPhonePrivate] = useState(patient.phone_private || "");
  const [phoneProfessional, setPhoneProfessional] = useState(patient.phone_professional || "");
  const [phoneMobile, setPhoneMobile] = useState(patient.phone_mobile || "");
  
  // Form state - Provenance
  const [patientSector, setPatientSector] = useState(patient.patient_sector || "");
  const [referredBy, setReferredBy] = useState(patient.referred_by || "");
  const [visitPurpose, setVisitPurpose] = useState(patient.visit_purpose || "");
  const [gpReportConsent, setGpReportConsent] = useState(patient.gp_report_consent || "");
  const [psychiatristReportConsent, setPsychiatristReportConsent] = useState(patient.psychiatrist_report_consent || "");
  const [centerAwarenessSource, setCenterAwarenessSource] = useState(patient.center_awareness_source || "");

  // Legacy field support (mapped to new fields if necessary)
  const [phone, setPhone] = useState(patient.phone || "");
  const [address, setAddress] = useState(patient.address || "");
  
  // Emergency contact state
  const [emergencyName, setEmergencyName] = useState(patient.emergency_contact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergency_contact?.phone || "");
  const [emergencyRelationship, setEmergencyRelationship] = useState(patient.emergency_contact?.relationship || "");

  // Calculate max date for date of birth (must be at least 15 years old)
  const getMaxDateOfBirth = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 15);
    return today.toISOString().split('T')[0];
  };

  const validateAge = (dob: string): boolean => {
    if (!dob) return false;
    const birthDate = new Date(dob);
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

    // Validation
    if (!firstName.trim()) {
      setError("Le prénom est requis");
      return;
    }
    if (!lastName.trim()) {
      setError("Le nom est requis");
      return;
    }
    if (!dateOfBirth) {
      setError("La date de naissance est requise");
      return;
    }
    if (!validateAge(dateOfBirth)) {
      setError("Le patient doit avoir au moins 15 ans");
      return;
    }
    if (!gender) {
      setError("Le sexe à la naissance est requis");
      return;
    }

    setIsLoading(true);

    try {
      // Build emergency contact object if any field is filled
      let emergencyContact: EmergencyContact | null = null;
      if (emergencyName || emergencyPhone || emergencyRelationship) {
        emergencyContact = {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelationship,
        };
      }

      const response = await fetch(`/api/professional/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Section: Identité
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          marital_name: maritalName.trim() || null,
          date_of_birth: dateOfBirth,
          gender: gender || null,
          maiden_name: maidenName.trim() || null,
          birth_city: birthCity.trim() || null,
          birth_department: birthDepartment.trim() || null,
          birth_country: birthCountry.trim() || null,
          hospital_id: hospitalId.trim() || null,
          social_security_number: socialSecurityNumber.trim() || null,
          years_of_education: yearsOfEducation ? parseInt(yearsOfEducation) : null,
          
          // Section: Coordonnées
          email: email.trim() || null,
          street_number_and_name: streetNumberAndName.trim() || null,
          building_details: buildingDetails.trim() || null,
          postal_code: postalCode.trim() || null,
          city: city.trim() || null,
          phone_private: phonePrivate.trim() || null,
          phone_professional: phoneProfessional.trim() || null,
          phone_mobile: phoneMobile.trim() || null,
          
          // Section: Provenance
          patient_sector: patientSector || null,
          referred_by: referredBy || null,
          visit_purpose: visitPurpose || null,
          gp_report_consent: gpReportConsent || null,
          psychiatrist_report_consent: psychiatristReportConsent || null,
          center_awareness_source: centerAwarenessSource || null,

          // Legacy / Misc
          emergency_contact: emergencyContact,
          // Update address/phone for backward compatibility if needed
          address: address.trim() || null,
          phone: phone.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      // Refresh the page data
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6 text-brand" />
            Modifier les informations patient
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations détaillées du patient. Les champs marqués * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          {/* Section: Identité */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">Identité</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maritalName">Nom marital</Label>
                <Input
                  id="maritalName"
                  value={maritalName}
                  onChange={(e) => setMaritalName(e.target.value)}
                  placeholder="Nom marital"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                <DatePicker
                  id="dateOfBirth"
                  value={dateOfBirth}
                  max={getMaxDateOfBirth()}
                  onChange={setDateOfBirth}
                  required
                  placeholder="Sélectionner la date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Sexe *</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>

              {gender === 'F' && (
                <div className="space-y-2">
                  <Label htmlFor="maidenName">Nom de jeune fille</Label>
                  <Input
                    id="maidenName"
                    value={maidenName}
                    onChange={(e) => setMaidenName(e.target.value)}
                    placeholder="Nom de jeune fille"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="birthCity">Ville de naissance</Label>
                <Input
                  id="birthCity"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  placeholder="Ville de naissance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDepartment">Département de naissance</Label>
                <Input
                  id="birthDepartment"
                  value={birthDepartment}
                  onChange={(e) => setBirthDepartment(e.target.value)}
                  placeholder="Département"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthCountry">Pays de naissance</Label>
                <Input
                  id="birthCountry"
                  value={birthCountry}
                  onChange={(e) => setBirthCountry(e.target.value)}
                  placeholder="Pays de naissance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalId">Numéro d'identification hospitalier</Label>
                <Input
                  id="hospitalId"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  placeholder="ID Hospitalier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialSecurityNumber">Numéro de Sécurité Sociale</Label>
                <Input
                  id="socialSecurityNumber"
                  value={socialSecurityNumber}
                  onChange={(e) => setSocialSecurityNumber(e.target.value)}
                  placeholder="Numéro de Sécurité Sociale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfEducation">Années d&apos;études (depuis le CP)</Label>
                <Input
                  id="yearsOfEducation"
                  type="number"
                  min="0"
                  max="30"
                  value={yearsOfEducation}
                  onChange={(e) => setYearsOfEducation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Coordonnées */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Mail className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">Coordonnées</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2 col-span-full">
                <Label htmlFor="streetNumberAndName">Numéro et nom de rue</Label>
                <Input
                  id="streetNumberAndName"
                  value={streetNumberAndName}
                  onChange={(e) => setStreetNumberAndName(e.target.value)}
                  placeholder="ex: 12 bis rue des Lilas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingDetails">Bâtiment, lieu-dit</Label>
                <Input
                  id="buildingDetails"
                  value={buildingDetails}
                  onChange={(e) => setBuildingDetails(e.target.value)}
                  placeholder="ex: Bâtiment A, 3ème étage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Code postal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ville"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phonePrivate">Téléphone privé</Label>
                <Input
                  id="phonePrivate"
                  type="tel"
                  value={phonePrivate}
                  onChange={(e) => setPhonePrivate(e.target.value)}
                  placeholder="Téléphone privé"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneProfessional">Téléphone professionnel</Label>
                <Input
                  id="phoneProfessional"
                  type="tel"
                  value={phoneProfessional}
                  onChange={(e) => setPhoneProfessional(e.target.value)}
                  placeholder="Téléphone professionnel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneMobile">Téléphone portable</Label>
                <Input
                  id="phoneMobile"
                  type="tel"
                  value={phoneMobile}
                  onChange={(e) => setPhoneMobile(e.target.value)}
                  placeholder="Téléphone portable"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
          </div>

          {/* Section: Provenance */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Users className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">Provenance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientSector">Secteur du patient</Label>
                <select
                  id="patientSector"
                  value={patientSector}
                  onChange={(e) => setPatientSector(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="secteur">Secteur du centre</option>
                  <option value="hors-secteur">Hors secteur du centre</option>
                  <option value="monaco">Caisse sociale Monaco</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredBy">Adressé(e) par</Label>
                <select
                  id="referredBy"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="psychiatre-liberal">Psychiatre libéral</option>
                  <option value="psychiatre-hospitalier-secteur">Psychiatre hospitalier du secteur du centre</option>
                  <option value="psychiatre-hospitalier-hors-secteur">Psychiatre hospitalier hors du secteur</option>
                  <option value="psychologue">Psychologue ou Psychothérapeute</option>
                  <option value="generaliste">Généraliste</option>
                  <option value="association">Association</option>
                  <option value="patient-lui-meme">Patient lui-même</option>
                  <option value="entourage">Entourage</option>
                  <option value="autres">Autres</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitPurpose">Objet de la visite</Label>
                <select
                  id="visitPurpose"
                  value={visitPurpose}
                  onChange={(e) => setVisitPurpose(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="avis-diagnostic">Avis diagnostic</option>
                  <option value="avis-therapeutique">Avis thérapeutique</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpReportConsent">Transmission au généraliste</Label>
                <select
                  id="gpReportConsent"
                  value={gpReportConsent}
                  onChange={(e) => setGpReportConsent(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                  <option value="ne-sais-pas">Ne sais pas</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="psychiatristReportConsent">Transmission au psychiatre</Label>
                <select
                  id="psychiatristReportConsent"
                  value={psychiatristReportConsent}
                  onChange={(e) => setPsychiatristReportConsent(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                  <option value="ne-sais-pas">Ne sais pas</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="centerAwarenessSource">Connaissance du centre</Label>
                <select
                  id="centerAwarenessSource"
                  value={centerAwarenessSource}
                  onChange={(e) => setCenterAwarenessSource(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner</option>
                  <option value="medecin-generaliste">Médecin généraliste</option>
                  <option value="association">Association</option>
                  <option value="psychiatre">Psychiatre</option>
                  <option value="internet">Internet</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Contact d'urgence (Existing) */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Phone className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">Contact d'urgence</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Nom</Label>
                <Input
                  id="emergencyName"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Nom du contact"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Téléphone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Lien</Label>
                <Input
                  id="emergencyRelationship"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  placeholder="ex: Conjoint, Parent"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="flex gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={isLoading}
              className="px-8 font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

