import { useAdminAuthStore, SECRET_ADMIN_LOGIN_PATH } from '~/stores/adminAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAdminAuthStore()

  // If already at secret login path
  if (to.path === SECRET_ADMIN_LOGIN_PATH) {
    if (store.isAuthenticated) {
      return navigateTo('/admin')
    }
    return
  }

  // Protecting all /admin routes
  if (to.path.startsWith('/admin')) {
    if (!store.isAuthenticated) {
      return navigateTo(SECRET_ADMIN_LOGIN_PATH)
    }
  }
})
