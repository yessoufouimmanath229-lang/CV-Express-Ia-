# Guide de Déploiement - CV Express IA

Ce guide explique comment déployer la version Web de l'application CV Express IA.

## 1. Préparation du build Web

L'application utilise Expo. Pour générer les fichiers statiques pour le Web :

```bash
npx expo export --platform web
```

Les fichiers seront générés dans le dossier `dist`.

## 2. Déploiement sur Vercel (Recommandé)

Vercel est idéal pour les applications React/Expo Web.

### Étapes :
1. Connectez votre compte GitHub à [Vercel](https://vercel.com/).
2. Importez le dépôt `CV-Express-Ia-`.
3. Configurez les **Variables d'Environnement** dans le tableau de bord Vercel :
   - `EXPO_PUBLIC_OPENAI_API_KEY` : Votre clé API OpenAI.
   - `EXPO_PUBLIC_SUPABASE_URL` : L'URL de votre projet Supabase.
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` : La clé Anon de votre projet Supabase.
4. Paramètres de Build :
   - **Framework Preset**: `Other` ou `Create React App` (Expo Web est compatible).
   - **Build Command**: `npx expo export --platform web`
   - **Output Directory**: `dist`
5. Cliquez sur **Deploy**.

## 3. Déploiement sur Netlify

### Étapes :
1. Connectez votre compte GitHub à [Netlify](https://www.netlify.com/).
2. Sélectionnez le dépôt `CV-Express-Ia-`.
3. Configurez les variables d'environnement (identiques à Vercel).
4. Paramètres de Build :
   - **Build command**: `npx expo export --platform web`
   - **Publish directory**: `dist`
5. Cliquez sur **Deploy site**.

## 4. Gestion des Secrets

**IMPORTANT** : Ne commitez jamais votre fichier `.env` contenant de vraies clés API. 
L'application est configurée pour utiliser les variables préfixées par `EXPO_PUBLIC_`, ce qui permet à Expo de les inclure dans le bundle client lors du build. Assurez-vous qu'elles sont correctement définies sur votre plateforme de hosting.
