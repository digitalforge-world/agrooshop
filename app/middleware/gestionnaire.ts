import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

export default defineNuxtRouteMiddleware((to) => {
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
