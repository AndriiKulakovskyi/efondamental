
import { z } from "zod";

// Types based on the API documentation
export interface Medicament {
  cis: number;
  elementPharmaceutique: string;
  formePharmaceutique: string;
  voiesAdministration: string[];
  statusAutorisation: string;
  typeProcedure: string;
  etatComercialisation: string;
  dateAMM: string;
  titulaire: string;
  surveillanceRenforce: string;
  composition: Composition[];
  generiques: any[];
  presentation: Presentation[];
  conditions: any[];
}

export interface Composition {
  cis: number;
  elementPharmaceutique: string;
  codeSubstance: number;
  denominationSubstance: string;
  dosage: string;
  referenceDosage: string;
  natureComposant: string;
}

export interface Presentation {
  cis: number;
  cip7: number;
  cip13: number;
  libelle: string;
  statusAdministratif: string;
  etatComercialisation: string;
  dateDeclaration: string;
  agreement: string;
  tauxRemboursement: string;
  prix: number;
}

const API_BASE_URL = "https://medicaments-api.giygas.dev";

const USE_PROXY = true;

/**
 * Search for medications by name
 * @param query The search query (medication name)
 * @returns Array of matching medications
 */
export async function searchMedications(query: string, signal?: AbortSignal): Promise<Medicament[]> {
  // API requires minimum 3 characters
  if (!query || query.length < 3) {
    return [];
  }

  try {
    let url: string;
    
    if (USE_PROXY) {
      // Use local manual proxy
      url = `/api/medications?q=${encodeURIComponent(query)}`;
    } else {
      url = `${API_BASE_URL}/medicament/${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, { signal });
    
    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        return [];
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error searching medications:", error);
    return [];
  }
}

/**
 * Get medication details by CIS code
 * @param cis The CIS code of the medication
 */
export async function getMedicationByCis(cis: number): Promise<Medicament | null> {
  try {
    let url: string;
    
    if (USE_PROXY) {
      url = `/api/medications?cis=${cis}`;
    } else {
      url = `${API_BASE_URL}/medicament/id/${cis}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error fetching medication details:", error);
    return null;
  }
}
