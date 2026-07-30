/**
 * Plugin gestionnaire-auth.client.ts
 * 
 * S'exécute UNIQUEMENT côté client (browser).
 * Ré-hydrate le store gestionnaire auth depuis le cookie au démarrage
 * pour éviter les déconnexions/redirections au refresh de page.
 */
export default defineNuxtPlugin(async () => {
  const gestionnaireStore = useGestionnaireAuthStore()

  if (gestionnaireStore.token && !gestionnaireStore.user) {
    await gestionnaireStore.fetchMe()
  }
})
