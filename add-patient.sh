#!/bin/bash

# ============================================================================
# Script de création d'un patient de test - DÉVELOPPEMENT LOCAL UNIQUEMENT
# Supporte les pathologies: Bipolaire et Schizophrénie
# ============================================================================

set -e

echo "🏥 Création d'un patient de test"
echo "================================="
echo ""

# ============================================================================
# CHOIX DE LA PATHOLOGIE
# ============================================================================

echo "🔍 Sélectionnez la pathologie:"
echo ""
echo "   1) Bipolaire"
echo "   2) Schizophrénie"
echo ""
read -p "   Votre choix (1/2): " -n 1 -r
echo
echo

if [[ $REPLY == "1" ]]; then
    PATHOLOGY_NAME="Bipolaire"
    PATHOLOGY_PREFIX="BP"
    CENTER_ID="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    PATHOLOGY_ID="11111111-1111-1111-1111-111111111111"
    DOCTOR_ID="00000000-0000-0000-0000-000000000020"
    DOCTOR_EMAIL="dr.lambert@efondamental.dev"
    DOCTOR_NAME="Dr. Lambert"
    VISIT_TEMPLATE_ID="b1000001-0000-0000-0000-000000000002"
    VISIT_TYPE="initial_evaluation"
    VISIT_NAME="Evaluation Initiale Bipolaire"
elif [[ $REPLY == "2" ]]; then
    PATHOLOGY_NAME="Schizophrénie"
    PATHOLOGY_PREFIX="SZ"
    CENTER_ID="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    PATHOLOGY_ID="22222222-2222-2222-2222-222222222222"
    DOCTOR_ID="00000000-0000-0000-0000-000000000023"
    DOCTOR_EMAIL="dr.roux@efondamental.dev"
    DOCTOR_NAME="Dr. Roux"
    VISIT_TEMPLATE_ID="b2000001-0000-0000-0000-000000000002"
    VISIT_TYPE="initial_evaluation"
    VISIT_NAME="Evaluation Initiale Schizophrenie"
else
    echo "❌ Choix invalide"
    exit 1
fi

echo "✅ Pathologie sélectionnée: $PATHOLOGY_NAME"
echo ""

# ============================================================================
# VÉRIFICATIONS DE SÉCURITÉ
# ============================================================================

echo "🔒 Vérifications de sécurité..."

# Vérifier qu'on est bien en environnement local
if [ -n "$VERCEL" ] || [ -n "$NETLIFY" ] || [ -n "$CI" ] || [ -n "$PRODUCTION" ]; then
    echo "❌ ERREUR: Ce script ne doit être exécuté qu'en LOCAL"
    exit 1
fi

# Vérifier que Supabase local est démarré
if ! npx supabase status &> /dev/null; then
    echo "❌ Supabase local n'est pas démarré"
    echo "   Démarrez-le avec: npx supabase start"
    exit 1
fi

echo "✅ Vérifications OK"
echo ""

# ============================================================================
# CONFIGURATION
# ============================================================================

DB_PORT="54322"
DB_URL="postgresql://postgres:postgres@127.0.0.1:${DB_PORT}/postgres"

# Données du patient (différentes par pathologie)
FIRST_NAME="First_name_test"
LAST_NAME="Last_name_test"
DATE_OF_BIRTH="2010-01-01"
YEARS_OF_EDUCATION="5"
MEDICAL_RECORD_NUMBER="${PATHOLOGY_PREFIX}123456"
GENDER="M"  # M ou F
BIRTH_CITY="Paris"

echo "📋 Données du patient:"
echo "   Prénom: $FIRST_NAME"
echo "   Nom: $LAST_NAME"
echo "   Date de naissance: $DATE_OF_BIRTH"
echo "   Années d'études: $YEARS_OF_EDUCATION"
echo "   Numéro de dossier: $MEDICAL_RECORD_NUMBER"
echo "   Sexe: $GENDER"
echo "   Lieu de naissance: $BIRTH_CITY"
echo "   Médecin assigné: $DOCTOR_NAME"
echo "   Pathologie: $PATHOLOGY_NAME"
echo ""

# ============================================================================
# CRÉATION DU PATIENT
# ============================================================================

echo "🔄 Création du patient..."

# Vérifier si le numéro de dossier existe déjà
EXISTING=$(psql "$DB_URL" -tAc "SELECT COUNT(*) FROM patients WHERE medical_record_number = '$MEDICAL_RECORD_NUMBER' AND deleted_at IS NULL;" 2>/dev/null || echo "0")

if [[ "$EXISTING" -gt 0 ]]; then
    echo "⚠️  Un patient avec le numéro de dossier $MEDICAL_RECORD_NUMBER existe déjà"
    read -p "   Voulez-vous le supprimer et en créer un nouveau ? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   🗑️  Suppression de l'ancien patient..."
        psql "$DB_URL" -c "DELETE FROM patients WHERE medical_record_number = '$MEDICAL_RECORD_NUMBER';" > /dev/null 2>&1
        echo "   ✅ Ancien patient supprimé"
    else
        echo "   ❌ Opération annulée"
        exit 1
    fi
fi

# Vérifier et créer l'entrée user_pathologies si nécessaire
echo "   🔧 Configuration de la pathologie pour le médecin..."
PATHO_EXISTS=$(psql "$DB_URL" -tAc "SELECT COUNT(*) FROM user_pathologies WHERE user_id = '$DOCTOR_ID' AND pathology_id = '$PATHOLOGY_ID';" 2>/dev/null || echo "0")

if [[ "$PATHO_EXISTS" -eq 0 ]]; then
    psql "$DB_URL" -c "INSERT INTO user_pathologies (user_id, pathology_id) VALUES ('$DOCTOR_ID', '$PATHOLOGY_ID') ON CONFLICT DO NOTHING;" > /dev/null 2>&1
    echo "   ✅ Pathologie activée pour $DOCTOR_NAME"
else
    echo "   ✅ Pathologie déjà activée pour $DOCTOR_NAME"
fi

# Créer le patient
PATIENT_ID=$(psql "$DB_URL" -tAc "
INSERT INTO patients (
    center_id,
    pathology_id,
    medical_record_number,
    first_name,
    last_name,
    date_of_birth,
    gender,
    years_of_education,
    birth_city,
    place_of_birth,
    created_by,
    assigned_to,
    active,
    metadata
) VALUES (
    '$CENTER_ID',
    '$PATHOLOGY_ID',
    '$MEDICAL_RECORD_NUMBER',
    '$FIRST_NAME',
    '$LAST_NAME',
    '$DATE_OF_BIRTH',
    '$GENDER',
    $YEARS_OF_EDUCATION,
    '$BIRTH_CITY',
    '$BIRTH_CITY',
    '$DOCTOR_ID',
    '$DOCTOR_ID',
    true,
    '{}'::jsonb
)
RETURNING id;
" 2>&1 | grep -E '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' | head -1)

# Vérifier si la création a réussi
if [[ $PATIENT_ID =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    echo "✅ Patient créé avec succès!"
    echo "   ID: $PATIENT_ID"
    echo ""
else
    echo "❌ Erreur lors de la création du patient:"
    echo "$PATIENT_ID"
    exit 1
fi

# ============================================================================
# CRÉATION D'UNE VISITE
# ============================================================================

echo "🔄 Création d'une visite d'évaluation initiale..."

SCHEDULED_DATE=$(date -d "+1 days" '+%Y-%m-%d 10:00:00')

VISIT_ID=$(psql "$DB_URL" -tAc "
INSERT INTO visits (
    patient_id,
    visit_template_id,
    visit_type,
    scheduled_date,
    status,
    conducted_by,
    created_by,
    metadata
) VALUES (
    '$PATIENT_ID',
    '$VISIT_TEMPLATE_ID',
    '$VISIT_TYPE',
    '$SCHEDULED_DATE',
    'scheduled',
    '$DOCTOR_ID',
    '$DOCTOR_ID',
    '{}'::jsonb
)
RETURNING id;
" 2>&1 | grep -E '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' | head -1)

if [[ $VISIT_ID =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    echo "✅ Visite créée avec succès!"
    echo "   ID: $VISIT_ID"
    echo "   Type: $VISIT_NAME"
    echo "   Date prévue: $SCHEDULED_DATE"
    echo ""
else
    echo "⚠️  Erreur lors de la création de la visite (patient créé quand même)"
    echo "$VISIT_ID"
fi

# ============================================================================
# RÉSUMÉ
# ============================================================================

echo "================================"
echo "✅ Création terminée!"
echo "================================"
echo ""
echo "📊 Résumé:"
echo "   Patient: $FIRST_NAME $LAST_NAME"
echo "   Numéro de dossier: $MEDICAL_RECORD_NUMBER"
echo "   Patient ID: $PATIENT_ID"
if [[ $VISIT_ID =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    echo "   Visite ID: $VISIT_ID"
fi
echo ""
echo "🔗 Accès:"
echo "   - Application: http://localhost:3000"
echo "   - Se connecter avec: $DOCTOR_EMAIL / Password123!"
echo "   - Supabase Studio: http://127.0.0.1:54323"
echo ""

exit 0
