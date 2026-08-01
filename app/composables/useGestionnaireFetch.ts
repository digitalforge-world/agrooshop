/**
 * useGestionnaireFetch — Composable pour tous les appels API gestionnaire.
 */
export const useGestionnaireFetch = () => {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('agro_gestionnaire_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })

  const activeBoutiqueCookie = useCookie<number | null>('agro_active_boutique')

  const gestionnaireFetch = async <T = any>(
    endpoint: string,
    options: Parameters<typeof $fetch>[1] = {}
  ): Promise<T> => {
    const token = tokenCookie.value
    const activeBoutiqueId = activeBoutiqueCookie.value

    try {
      return await $fetch<T>(`${config.public.apiBaseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(activeBoutiqueId ? { 'X-Boutique-Id': String(activeBoutiqueId) } : {}),
          ...(options.headers as Record<string, string> || {})
        }
      })
    } catch (err: any) {
      const status = err?.status || err?.statusCode || err?.response?.status
      if (status === 401 && process.client) {
        const route = useRoute()
        if (route.path !== '/gestionnaire/login') {
          tokenCookie.value = null
          await navigateTo('/gestionnaire/login')
        }
      }
      throw err
    }
  }

  return { gestionnaireFetch, token: tokenCookie }
}
