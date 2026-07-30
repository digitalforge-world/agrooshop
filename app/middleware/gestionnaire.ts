import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

export default defineNuxtRouteMiddleware((to) => {
  // ─── CRITICAL FIX: Skip middleware during SSR / static generation ───
  // Same issue as admin: during `nuxt generate`, cookies are not available
  // server-side, causing systematic redirection to login on every page reload.
  if (import.meta.server) return

  const store = useGestionnaireAuthStore()

  if (to.path === '/gestionnaire/login') {
    if (store.isLoggedIn) {
      return navigateTo('/gestionnaire')
    }
    return
  }

  if (to.path.startsWith('/gestionnaire')) {
    if (!store.isLoggedIn) {
      return navigateTo('/gestionnaire/login')
    }
  }
})
