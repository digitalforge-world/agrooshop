import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

export default defineNuxtRouteMiddleware((to) => {
  const store = useGestionnaireAuthStore()
  if (!store.isLoggedIn) {
    return navigateTo('/gestionnaire/login')
  }
})
