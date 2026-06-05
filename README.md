# CV Express IA

Génération instantanée de CV et lettres de motivation professionnels et personnalisés par IA.

## Choix Techniques

- **Framework :** React Native avec Expo (pour la rapidité de développement et le déploiement multiplateforme).
- **Langage :** TypeScript (pour la robustesse du code).
- **Génération PDF :** `expo-print` et `expo-sharing`.
- **Backend / IA :** Intégration directe des API LLM (OpenAI/Anthropic) via un backend Node.js (ou directement si sécurisé pour le MVP).
- **Formulaire :** `react-hook-form` avec `zod` pour la validation des données.

## Structure du Projet

- `assets/` : Images et polices.
- `src/` : Code source de l'application.
  - `components/` : Composants réutilisables.
  - `screens/` : Écrans de l'application.
  - `services/` : Logique métier (IA, PDF, API).
  - `utils/` : Fonctions utilitaires.
  - `types/` : Définitions TypeScript.

## Configuration

Le projet est hébergé sur GitHub : [CV-Express-Ia-](https://github.com/yessoufouimmanath229-lang/CV-Express-Ia-)

Pour activer la génération réelle via l'IA, créez un fichier `.env` à la racine du projet (voir `.env.example`) :
```env
EXPO_PUBLIC_OPENAI_API_KEY=votre_cle_api
```

## Déploiement

Pour des instructions détaillées sur le déploiement Web (Vercel/Netlify), consultez le fichier [DEPLOYMENT.md](./DEPLOYMENT.md).

## Fonctionnalités MVP

- **Formulaire intelligent :** Saisie guidée des expériences et compétences.
- **Génération IA :** Création automatique du résumé professionnel et de la lettre de motivation.
- **Modèles multiples :**
  - **Standard :** Optimisé ATS (Gratuit).
  - **Moderne, Créatif, Exécutif :** Designs Premium.
- **Export PDF :** Partage et téléchargement instantané.
- **Offre Premium :** Limite de 1 document pour les gratuits, illimité pour les membres Premium (4,99€/mois).

## Configuration Cloud (Optionnel)

Pour activer la synchronisation cloud (Supabase) :
1. Créez un projet sur [Supabase](https://supabase.com/).
2. Créez une table `documents` avec le SQL suivant :
   ```sql
   create table documents (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     title text,
     form_data jsonb not null,
     cv_data jsonb not null,
     template_id text default 'standard',
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now()
   );

   -- Activer RLS
   alter table documents enable row level security;

   -- Politique : Les utilisateurs ne peuvent voir que leurs propres documents
   create policy "Users can only access their own documents"
     on documents for all
     using (auth.uid() = user_id);
   ```
3. Copiez l'URL et la clé Anon dans votre fichier `.env`.
