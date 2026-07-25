export const useMedia = () => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.backendBaseUrl || 'http://localhost:8000'

  const getImageUrl = (path?: string | null, fallback = '/images/Agroshopproduit .png'): string => {
    if (!path || path === '/images/placeholder.jpg') return fallback
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    if (path.startsWith('/images/')) return path

    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${backendUrl}${cleanPath}`
  }

  return {
    backendUrl,
    getImageUrl
  }
}
