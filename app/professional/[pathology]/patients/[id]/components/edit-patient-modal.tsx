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
  date_of_birth: string;
  gender: 'M' | 'F' | string | null;
  maiden_name: string | null;
  place_of_birth: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact: EmergencyContact | null;
  years_of_education: number | null;
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

  // Form state
  const [firstName, setFirstName] = useState(patient.first_name);
  const [lastName, setLastName] = useState(patient.last_name);
  const [dateOfBirth, setDateOfBirth] = useState(patient.date_of_birth);
  const [yearsOfEducation, setYearsOfEducation] = useState(patient.years_of_education?.toString() || "");
  const [gender, setGender] = useState(normalizeGender(patient.gender));
  const [maidenName, setMaidenName] = useState(patient.maiden_name || "");
  const [placeOfBirth, setPlaceOfBirth] = useState(patient.place_of_birth || "");
  const [email, setEmail] = useState(patient.email || "");
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
      setError("Le prenom est requis");
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
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          date_of_birth: dateOfBirth,
          years_of_education: yearsOfEducation ? parseInt(yearsOfEducation) : null,
          gender: gender || null,
          maiden_name: maidenName.trim() || null,
          place_of_birth: placeOfBirth.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          address: address.trim() || null,
          emergency_contact: emergencyContact,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise a jour");
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-brand" />
            Modifier le profil patient
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du patient. Les champs marques * sont obligatoires.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations personnelles
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prenom *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prenom"
                  required
                />
              </div>
              
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  max={getMaxDateOfBirth()}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">Le patient doit avoir au moins 15 ans</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsOfEducation">Annees d&apos;etudes (depuis le CP) *</Label>
                <Input
                  id="yearsOfEducation"
                  type="number"
                  min="0"
                  max="30"
                  value={yearsOfEducation}
                  onChange={(e) => setYearsOfEducation(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">
                  Nombre total d&apos;annees de scolarite
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Sexe a la naissance *</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="">Selectionner</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>

              {gender === 'F' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200 col-span-2">
                  <Label htmlFor="maidenName">Nom de jeune fille</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="maidenName"
                      value={maidenName}
                      onChange={(e) => setMaidenName(e.target.value)}
                      placeholder="Nom de jeune fille"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="placeOfBirth"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="Lieu de naissance"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Coordonnees
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telephone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse complete"
              />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact d'urgence
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="emergencyPhone">Telephone</Label>
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

