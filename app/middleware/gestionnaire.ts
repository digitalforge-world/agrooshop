import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const store = useGestionnaireAuthStore()
  const tokenCookie = useCookie('agro_gestionnaire_token')
  const isAuthenticated = store.isLoggedIn || !!tokenCookie.value

  if (to.path === '/gestionnaire/login') {
    if (isAuthenticated) {
      return navigateTo('/gestionnaire')
    }
    return
  }

  if (to.path.startsWith('/gestionnaire')) {
    if (!isAuthenticated) {
      return navigateTo('/gestionnaire/login')
    }
  }
})
