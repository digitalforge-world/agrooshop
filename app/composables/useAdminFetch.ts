/**
 * useAdminFetch — Composable pour tous les appels API admin.
 * 
 * Récupère directement le token depuis le cookie (sans dépendre du store Pinia)
 * afin d'éviter les problèmes de ré-hydratation SSR/CSR.
 * En cas de 401, redirige automatiquement vers la page de login.
 */
export const useAdminFetch = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('agro_admin_token')
  const SECRET_PATH = '/admin/auth/v1/sso-login-gateway-98f7a2b91c84'

  const adminFetch = async <T = any>(
    endpoint: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const token = tokenCookie.value

    try {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(options.headers as Record<string, string> || {})
        }
      })
    } catch (err: any) {
      const status = err?.status || err?.statusCode || err?.response?.status
      if (status === 401) {
        // Token expiré/invalide → purger et rediriger
        tokenCookie.value = null
        await navigateTo(SECRET_PATH)
        throw err
      }
      throw err
    }
  }

  return { adminFetch, token: tokenCookie }
}
