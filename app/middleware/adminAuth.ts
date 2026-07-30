import { useAdminAuthStore, SECRET_ADMIN_LOGIN_PATH } from '~/stores/adminAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  // ─── CRITICAL FIX: Skip middleware during SSR / static generation ───
  // When using `nuxt generate`, this middleware runs server-side at build time
  // where there are NO browser cookies → token is always null → always redirects
  // to login. By skipping on server, auth is only enforced client-side where
  // cookies (useCookie) are properly hydrated.
  if (import.meta.server) return

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
