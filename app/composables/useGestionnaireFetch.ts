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

  const gestionnaireFetch = async <T = any>(
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
        tokenCookie.value = null
        await navigateTo('/gestionnaire/login')
        throw err
      }
      throw err
    }
  }

  return { gestionnaireFetch, token: tokenCookie }
}
