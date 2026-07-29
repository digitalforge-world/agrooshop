/**
 * Plugin gestionnaire-auth.client.ts
 * 
 * S'exécute côté client uniquement.
 * Recharge les données du gestionnaire depuis le cookie au démarrage
 * pour éviter la perte de session après refresh de page.
 */
export default defineNuxtPlugin(async () => {
  const store = useGestionnaireAuthStore()

  // Si token présent dans cookie mais user non chargé (après refresh)
  if (store.token && !store.user) {
    try {
      const config = useRuntimeConfig()
      const res = await $fetch<any>(`${config.public.apiBaseUrl}/gestionnaire/me`, {
        headers: { Authorization: `Bearer ${store.token}` }
      })

      if (res?.gestionnaire) {
        store.user = res.gestionnaire
        if (res?.boutiques?.length > 0) {
          store.boutiques = res.boutiques
          if (!store.activeBoutiqueId) {
            store.activeBoutiqueId = res.boutiques[0].id
          }
        }
      }
    } catch (e: any) {
      // Token invalide → déconnexion
      if (e?.status === 401 || e?.statusCode === 401) {
        store.token = null
        store.boutiques = []
        store.activeBoutiqueId = null
      }
    }
  }
})
