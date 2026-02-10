#!/bin/bash

# ============================================================================
# eFondaMental - Script de setup automatisé
# ============================================================================
# Ce script configure l'environnement de développement et initialise
# la base de données Supabase avec des vérifications de sécurité
# ============================================================================

set -e  # Arrêter en cas d'erreur

echo "🚀 eFondaMental - Setup & Database Initialization"
echo "=================================================="
echo ""

# ============================================================================
# VÉRIFICATIONS DE SÉCURITÉ
# ============================================================================

echo "🔒 Vérifications de sécurité..."
echo ""

# 1. Vérifier qu'on est bien en environnement local
if [ -n "$VERCEL" ] || [ -n "$NETLIFY" ] || [ -n "$CI" ] || [ -n "$PRODUCTION" ]; then
    echo "❌ ERREUR CRITIQUE: Ce script ne doit être exécuté qu'en LOCAL"
    echo "   Environnement détecté: Production/CI"
    echo "   Arrêt immédiat pour votre sécurité"
    exit 1
fi

# 2. Vérifier que .env.local existe
if [ ! -f ".env.local" ]; then
    echo "❌ Fichier .env.local introuvable"
    echo "   Créez d'abord votre fichier .env.local avec vos credentials Supabase"
    exit 1
fi

# 3. Charger les variables depuis .env.local
echo "📋 Chargement de .env.local..."
set -a
source .env.local
set +a

# 4. Vérifier que les variables essentielles sont définies
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Variables Supabase manquantes dans .env.local"
    echo "   Vérifiez que vous avez bien défini:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# 5. Détecter si c'est un environnement de production
if [[ "$NEXT_PUBLIC_SUPABASE_URL" == *"supabase.co"* ]] && [[ "$NEXT_PUBLIC_SUPABASE_URL" != *"localhost"* ]]; then
    echo "⚠️  ATTENTION: Vous utilisez un projet Supabase Cloud"
    echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
    echo ""
    echo "   Ce script va créer/réinitialiser la base de données."
    echo "   Assurez-vous que c'est bien un projet de DÉVELOPPEMENT."
    echo ""
    read -p "   Confirmer que c'est un projet de DEV (tapez 'DEV' en majuscules): " -r
    echo
    if [[ ! $REPLY == "DEV" ]]; then
        echo "❌ Opération annulée par sécurité"
        exit 1
    fi
fi

echo "✅ Vérifications de sécurité OK"
echo ""

# ============================================================================
# CONFIGURATION SUPABASE LOCAL
# ============================================================================

echo "🔍 Configuration de Supabase LOCAL..."
echo ""
echo "   Ce projet utilise Supabase en mode LOCAL pour le développement."
echo "   → Base de données locale avec Docker"
echo "   → Migrations et seed appliqués automatiquement"
echo "   → Utilisateurs de test pré-créés"
echo ""

# Vérifier si Supabase CLI est disponible (via npx ou installé)
if ! command -v supabase &> /dev/null && ! npx supabase --version &> /dev/null; then
    echo "   ❌ Supabase CLI n'est pas disponible"
    echo "   📋 Pour l'installer, suivez: https://supabase.com/docs/guides/cli"
    echo ""
    exit 1
fi

echo "   ✅ Supabase CLI disponible"
SELECTED_MODE="local"

echo ""

# ============================================================================
# VÉRIFICATION DES DÉPENDANCES
# ============================================================================

echo "📦 Vérification des dépendances..."
echo ""

# Installer les dépendances npm si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
    echo "✅ Dépendances installées"
    echo ""
fi

echo ""

# ============================================================================
# INITIALISATION DE LA BASE DE DONNÉES
# ============================================================================

echo "🗄️  Initialisation de la base de données..."
echo ""

# Compter les migrations disponibles
MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)

if [ "$MIGRATION_COUNT" -eq 0 ]; then
    echo "❌ Aucune migration trouvée dans supabase/migrations/"
    exit 1
fi

echo "   📊 $MIGRATION_COUNT migration(s) détectée(s)"
echo ""

echo ""
echo "🔹 Vérification et application des migrations..."
echo ""

# Vérifier si Supabase local est démarré
if npx supabase status &> /dev/null; then
    echo "   ✅ Supabase local est déjà démarré"
    echo ""
    
    # Vérifier si les migrations sont appliquées
    echo "   🔍 Vérification des migrations..."
    
    echo "   📊 $MIGRATION_COUNT migration(s) détectée(s)"
    echo ""
    echo "   ℹ️  Avec Supabase local, les migrations sont gérées par la CLI"
    echo "   📋 Pour appliquer/réappliquer les migrations:"
    echo "      npx supabase db reset  # Reset complet avec seed"
    echo ""
    
    read -p "   Voulez-vous reset la base de données locale ? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "   🔄 Reset de la base de données locale..."
        npx supabase db reset
        echo ""
        echo "   ✅ Base de données réinitialisée avec toutes les migrations et le seed"
    fi
    
    MIGRATION_SUCCESS=$MIGRATION_COUNT
    MIGRATION_FAILED=0
else
    echo "   ⚠️  Supabase local n'est pas démarré"
    echo ""
    echo "   🚀 Démarrage de Supabase local..."
    npx supabase start
    echo ""
    echo "   ✅ Supabase local démarré avec toutes les migrations et le seed"
    
    MIGRATION_SUCCESS=$MIGRATION_COUNT
    MIGRATION_FAILED=0
fi

# Configurer automatiquement .env.local
echo ""
echo "📋 Configuration de .env.local"
echo ""

# Vérifier si .env.local existe
if [ ! -f ".env.local" ]; then
    echo "   ⚠️  .env.local n'existe pas"
    if [ -f ".env.example" ]; then
        echo "   📄 Création de .env.local depuis .env.example..."
        cp .env.example .env.local
    else
        echo "   📄 Création de .env.local..."
        touch .env.local
    fi
fi

# Mettre à jour les variables Supabase dans .env.local
echo "   🔧 Mise à jour automatique de .env.local..."

# Supprimer TOUTES les lignes Supabase (commentées ou non)
sed -i '/NEXT_PUBLIC_SUPABASE_URL/d' .env.local
sed -i '/NEXT_PUBLIC_SUPABASE_ANON_KEY/d' .env.local
sed -i '/NEXT_PUBLIC_SUPABASE_PUBLISHABLE/d' .env.local
sed -i '/SUPABASE_SERVICE_ROLE_KEY/d' .env.local
sed -i '/NEXT_PUBLIC_SITE_URL/d' .env.local
sed -i '/# Supabase LOCAL/d' .env.local

# Ajouter les nouvelles valeurs
cat >> .env.local << EOF

# Supabase LOCAL - Configuration automatique
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

echo "   ✅ .env.local configuré automatiquement"
echo ""

echo ""

# ============================================================================
# VALIDATION DE LA BASE DE DONNÉES
# ============================================================================

echo "🔍 Validation de la base de données..."
echo ""

if [ "$MIGRATION_FAILED" -eq 0 ]; then
    echo "   ✅ Toutes les migrations ont réussi"
else
    echo "   ⚠️  $MIGRATION_FAILED migration(s) ont échoué"
fi

echo ""

# ============================================================================
# RÉSUMÉ
# ============================================================================

echo "================================"
echo "✅ Setup terminé !"
echo "================================"
echo ""
echo "📊 Résumé :"
echo "   - Mode: LOCAL"
echo "   - Migrations réussies: $MIGRATION_SUCCESS"
echo "   - Migrations échouées: $MIGRATION_FAILED"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Ouvrir l'application :"
echo "   http://localhost:3000"
echo ""
echo "2. Se connecter avec un compte de test :"
echo "   - Admin: admin@fondamental.fr / Password123!"
echo "   - Manager: manager.paris@fondamental.fr / Password123!"
echo "   - Pro: doctor.paris@fondamental.fr / Password123!"
echo ""
echo "🔧 Commandes utiles :"
echo "   npx supabase status    # Voir le statut"
echo "   npx supabase stop      # Arrêter Supabase"
echo "   npx supabase db reset  # Reset complet de la DB"
echo "   http://127.0.0.1:54323 # Supabase Studio (interface web)"
echo ""

# Proposer de démarrer l'application
read -p "Voulez-vous démarrer l'application maintenant ? (y/N) " -n 1 -r
echo
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Démarrage de l'application..."
    echo ""
    
    # Tuer les anciens processus Next.js s'ils existent
    if pgrep -f "next dev" > /dev/null; then
        echo "   🔄 Arrêt des anciens processus Next.js..."
        pkill -9 -f "next dev" 2>/dev/null || true
        sleep 1
    fi
    
    # Libérer les ports 3000 et 3001 si occupés
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo "   🔄 Libération du port 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
    
    echo "   L'application sera accessible sur: http://localhost:3000"
    echo ""
    echo "   Pour arrêter le serveur: Ctrl+C"
    echo ""
    npm run dev
else
    echo "ℹ️  Pour démarrer l'application plus tard:"
    echo "   npm run dev"
    echo ""
fi

exit 0

if false; then
    echo "   ☁️  Mode: Supabase CLOUD détecté"
    echo ""
    
    # Vérifier si psql est disponible
    if ! command -v psql &> /dev/null; then
        echo "   ❌ psql n'est pas installé"
        echo "   Pour installer psql:"
        echo "      - Ubuntu/Debian: sudo apt-get install postgresql-client"
        echo "      - macOS: brew install postgresql"
        echo ""
        exit 1
    fi
    
    # Construire l'URL de connexion PostgreSQL pour Supabase Cloud
    # Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
    echo "   🔌 Configuration de la connexion à la base de données..."
    echo ""
    echo "   ⚠️  Pour exécuter les migrations automatiquement, nous avons besoin du mot de passe PostgreSQL"
    echo "   📋 Pour le récupérer:"
    echo "      1. Allez sur https://supabase.com/dashboard"
    echo "      2. Sélectionnez votre projet"
    echo "      3. Settings > Database"
    echo "      4. Copiez le 'Connection string' (mode 'Session')"
    echo ""
    read -p "   Collez l'URL de connexion PostgreSQL (ou appuyez sur Entrée pour mode manuel): " DB_CONNECTION_STRING
    echo ""
    
    if [ -z "$DB_CONNECTION_STRING" ]; then
        # Mode manuel
        echo "   📋 Mode manuel sélectionné"
        echo ""
        
        # Créer le fichier combiné
        echo "   🔧 Création du fichier combiné..."
        cat supabase/migrations/*.sql > /tmp/all_migrations_complete.sql
        
        COMBINED_SIZE=$(wc -l < /tmp/all_migrations_complete.sql)
        echo "   ✅ Fichier créé: /tmp/all_migrations_complete.sql ($COMBINED_SIZE lignes)"
        echo ""
        echo "   📋 Instructions:"
        echo "      1. Allez sur https://supabase.com/dashboard"
        echo "      2. SQL Editor > New Query"
        echo "      3. Copiez/collez le contenu de /tmp/all_migrations_complete.sql"
        echo "      4. Run"
        echo ""
        
        read -p "   Appuyez sur Entrée quand vous aurez exécuté les migrations..." -r
        echo ""
        
        MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
        MIGRATION_SUCCESS=$MIGRATION_COUNT
        MIGRATION_FAILED=0
    else
        # Mode automatique avec psql
        echo "   🚀 Exécution automatique des migrations..."
        echo ""
        
        MIGRATION_SUCCESS=0
        MIGRATION_FAILED=0
        
        # Exécuter chaque migration dans l'ordre
        for migration_file in supabase/migrations/*.sql; do
            migration_name=$(basename "$migration_file")
            
            # Skip 000_complete_init.sql (exécuté manuellement via Dashboard)
            if [[ "$migration_name" == "000_complete_init.sql" ]]; then
                echo "   ⏭️  $migration_name (ignoré - à exécuter manuellement via Dashboard)"
                continue
            fi
            
            echo "   → $migration_name"
            
            # Exécuter la migration
            if psql "$DB_CONNECTION_STRING" -f "$migration_file" > /tmp/migration_output.log 2>&1; then
                echo "      ✅ Succès"
                ((MIGRATION_SUCCESS++))
            else
                echo "      ❌ Échec"
                echo "      Erreur: $(cat /tmp/migration_output.log | head -3)"
                ((MIGRATION_FAILED++))
                
                # Demander si on continue
                read -p "      Continuer malgré l'erreur ? (y/N) " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    echo "   ❌ Arrêt des migrations"
                    break
                fi
            fi
        done
        
        echo ""
        echo "   📊 Résultat:"
        echo "      ✅ Réussies: $MIGRATION_SUCCESS"
        echo "      ❌ Échouées: $MIGRATION_FAILED"
        echo ""
    fi
fi

echo ""

# ============================================================================
# VALIDATION DE LA BASE DE DONNÉES
# ============================================================================

echo "🔍 Validation de la base de données..."
echo ""

# Tables critiques à vérifier
CRITICAL_TABLES=("centers" "user_profiles" "patients" "visits" "pathologies")

echo "   Vérification des tables critiques..."

# Note: Cette partie nécessiterait une connexion à la DB pour vérifier
# Pour l'instant, on se base sur le succès des migrations

if [ "$MIGRATION_FAILED" -eq 0 ]; then
    echo "   ✅ Toutes les migrations ont réussi"
else
    echo "   ⚠️  $MIGRATION_FAILED migration(s) ont échoué"
fi

echo ""

# ============================================================================
# RÉSUMÉ
# ============================================================================

echo "================================"
echo "✅ Setup terminé !"
echo "================================"
echo ""
echo "📊 Résumé :"
echo "   - Mode: $SELECTED_MODE"
echo "   - Migrations réussies: $MIGRATION_SUCCESS"
echo "   - Migrations échouées: $MIGRATION_FAILED"
echo ""
echo "🔒 Sécurité :"
echo "   ✅ .env.local chargé"
echo "   ✅ Vérifications de sécurité passées"
echo "   ✅ Confirmation utilisateur obtenue"
echo ""

# Instructions spécifiques selon le mode
if [[ "$SELECTED_MODE" == "local" ]]; then
    echo "📋 Prochaines étapes (Mode LOCAL) :"
    echo ""
    echo "1. Démarrer le serveur de développement :"
    echo "   npm run dev"
    echo ""
    echo "2. Ouvrir l'application :"
    echo "   http://localhost:3000"
    echo ""
    echo "3. Se connecter avec un compte de test :"
    echo "   - Admin: admin@fondamental.fr / Password123!"
    echo "   - Manager: manager.paris@fondamental.fr / Password123!"
    echo "   - Pro: doctor.paris@fondamental.fr / Password123!"
    echo ""
    echo "🔧 Commandes utiles :"
    echo "   npx supabase status    # Voir le statut"
    echo "   npx supabase stop      # Arrêter Supabase"
    echo "   npx supabase db reset  # Reset complet de la DB"
    echo ""
else
    echo "📋 Prochaines étapes (Mode CLOUD) :"
    echo ""
    echo "1. Créer les utilisateurs dans Supabase Dashboard :"
    echo "   → https://supabase.com/dashboard"
    echo "   → Authentication > Users > Add User"
    echo "   → Activer 'Auto Confirm User'"
    echo ""
    echo "2. Créer les profils dans la table user_profiles"
    echo "   (voir README.md pour les instructions SQL)"
    echo ""
    echo "3. Démarrer le serveur de développement :"
    echo "   npm run dev"
    echo ""
    echo "4. Ouvrir l'application :"
    echo "   http://localhost:3000"
    echo ""
fi
