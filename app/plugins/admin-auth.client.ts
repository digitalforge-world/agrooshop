/**
 * Plugin admin-auth.client.ts
 * 
 * S'exécute UNIQUEMENT côté client (browser).
 * Ré-hydrate le store admin auth depuis le cookie au démarrage
 * pour éviter les 401 après refresh de page.
 * 
 * Logique :
 * - Si token dans cookie → tenter fetchMe() pour valider le token
 * - Si fetchMe() échoue (401) → le store purgera automatiquement le cookie
 */
export default defineNuxtPlugin(async () => {
  const adminStore = useAdminAuthStore()

  if (adminStore.token && !adminStore.admin) {
    // Token présent mais données admin absentes (après refresh)
    // On revalide le token auprès de l'API
    await adminStore.fetchMe()
  }
})
