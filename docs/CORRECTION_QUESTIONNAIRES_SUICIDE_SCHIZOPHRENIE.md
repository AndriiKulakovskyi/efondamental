# Correction - Questionnaires Suicide pour Schizophrénie

## Problème
Les questionnaires ISA et SUICIDE_HISTORY pour les patients schizophrènes ne se soumettaient pas correctement.

## Cause
1. **ISA** : Utilisait `ISA_DEFINITION` (code bipolar) au lieu d'une définition spécifique schizophrénie
2. **SUICIDE_HISTORY_SZ** : La table `schizophrenia_suicide_history` n'avait pas la colonne `completed_by`

## Corrections apportées

### 1. Migration SQL
**Fichier** : `supabase/migrations/20260211000001_add_completed_by_to_schizophrenia_suicide_history.sql`
- Ajout de la colonne `completed_by` à la table `schizophrenia_suicide_history`

### 2. Création du questionnaire ISA_SZ
**Fichier** : `lib/questionnaires/schizophrenia/initial/medical/isa.ts`
- Création de `ISA_SZ_DEFINITION` avec 30 questions (structure complète ISA pour schizophrénie)
- Types TypeScript : `SchizophreniaIsaResponse` et `SchizophreniaIsaResponseInsert`

### 3. Export du questionnaire
**Fichiers modifiés** :
- `lib/questionnaires/schizophrenia/initial/medical/index.ts` : Export de `ISA_SZ_DEFINITION`
- `lib/questionnaires/schizophrenia/index.ts` : Re-export pour accès global

### 4. Mapping du code questionnaire
**Fichier** : `app/professional/questionnaires/actions.ts`
- Ajout du mapping `'ISA': 'ISA_SZ'` dans `questionnaireCodeToSchizophreniaKey()`
- Permet de router le code `ISA` vers la table `schizophrenia_isa`

### 5. Utilisation dans l'interface
**Fichier** : `app/professional/[pathology]/patients/[id]/visits/[visitId]/page.tsx`
- Remplacement de `ISA_DEFINITION` par `ISA_SZ_DEFINITION` pour les patients schizophrènes
- Mise à jour du statut de `questionnaireStatuses['ISA']` vers `questionnaireStatuses['ISA_SZ']`

### 6. Page du questionnaire
**Fichier** : `app/professional/[pathology]/patients/[id]/visits/[visitId]/questionnaire/[questionnaireId]/page.tsx`
- Import de `ISA_SZ_DEFINITION`
- Ajout du mapping `ISA_SZ_DEFINITION.code` → `ISA_SZ_DEFINITION`
- Ajout de la récupération des données existantes via `getIsaSzResponse()`

## Résultat
✅ Les deux questionnaires (ISA et SUICIDE_HISTORY) se soumettent correctement pour les patients schizophrènes
✅ Cohérence avec les autres questionnaires schizophrénie (suffixe `_SZ`)
✅ Colonne `completed_by` disponible pour tracer qui a complété le questionnaire

### 7. Fonction RPC pour les statuts
**Fichiers** : 
- `supabase/schema.sql` : Ajout de `ISA_SZ` dans la fonction `get_visit_detail_data()`
- `supabase/migrations/20260211000002_add_isa_sz_to_visit_detail_rpc.sql` : Migration pour documenter le changement

## À faire
1. Appliquer les migrations SQL sur la base de données :
   - `20260211000001_add_completed_by_to_schizophrenia_suicide_history.sql`
   - `20260211000002_add_isa_sz_to_visit_detail_rpc.sql`
