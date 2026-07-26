export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const router = useRouter()

  const sendTrackingLog = async (page: string, typeAction: string = 'visite_page', details: any = null) => {
    try {
      // Don't track admin pages to avoid skewing public analytics
      if (page.startsWith('/admin')) return

      await $fetch(`${config.public.apiBaseUrl}/track-visite`, {
        method: 'POST',
        body: {
          page,
          type_action: typeAction,
          details
        }
      })
    } catch (e) {
      // Silent catch to prevent impacting user experience
    }
  }

  // Track initial page load and route changes
  router.afterEach((to) => {
    sendTrackingLog(to.fullPath, 'visite_page')
  })

  return {
    provide: {
      trackAction: (typeAction: string, details?: any) => {
        const currentPath = router.currentRoute.value.fullPath
        sendTrackingLog(currentPath, typeAction, details)
      }
    }
  }
})
