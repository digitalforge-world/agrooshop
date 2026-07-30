import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GestionnaireUser {
  id: number
  nom: string
  prenom: string
  email: string
  telephone?: string
}

export interface Boutique {
  id: number
  nom: string
  type: string
  localisation?: string
}

export const useGestionnaireAuthStore = defineStore('gestionnaireAuth', () => {
  const token = useCookie<string | null>('agro_gestionnaire_token', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' })
  const user = useCookie<GestionnaireUser | null>('agro_gestionnaire_user', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' })
  const boutiques = useCookie<Boutique[]>('agro_gestionnaire_boutiques', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax', default: () => [] })
  const activeBoutiqueId = useCookie<number | null>('agro_active_boutique', { maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' })
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  // Boutique active = celle sélectionnée, ou la première par défaut
  const boutique = computed(() => {
    const list = boutiques.value || []
    if (activeBoutiqueId.value && list.length > 0) {
      return list.find(b => b.id === activeBoutiqueId.value) || list[0]
    }
    return list[0] || null
  })
  // Le gestionnaire gère-t-il plusieurs boutiques ?
  const hasMultipleBoutiques = computed(() => (boutiques.value || []).length > 1)

  const config = useRuntimeConfig()

  async function login(emailVal: string, passwordVal: string) {
    isLoading.value = true
    authError.value = null
    try {
      const res = await $fetch<any>(`${config.public.apiBaseUrl}/gestionnaire/login`, {
        method: 'POST',
        body: { email: emailVal, password: passwordVal }
      })

      const tokenVal = res?.token || res?.data?.token
      const userVal = res?.gestionnaire || res?.data?.gestionnaire
      const boutiquesVal: Boutique[] = res?.boutiques || res?.data?.boutiques || (res?.boutique ? [res.boutique] : [])

      if (tokenVal) {
        token.value = tokenVal
        user.value = userVal
        boutiques.value = boutiquesVal
        // Sélectionner la première boutique par défaut
        const firstBoutique = boutiquesVal[0]
        if (firstBoutique && !activeBoutiqueId.value) {
          activeBoutiqueId.value = firstBoutique.id
        }
        return true
      } else {
        authError.value = res?.message || "Identifiants incorrects."
        return false
      }
    } catch (err: any) {
      authError.value = err?.data?.message || err?.message || "Erreur de connexion."
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return false
    try {
      const res = await $fetch<any>(`${config.public.apiBaseUrl}/gestionnaire/me`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      const userVal = res?.gestionnaire || res?.data?.gestionnaire || res?.data?.user
      const boutiquesVal = res?.boutiques || res?.data?.boutiques || []
      if (userVal) {
        user.value = userVal
        if (boutiquesVal.length > 0) boutiques.value = boutiquesVal
        return true
      }
    } catch (e: any) {
      const status = e?.response?.status || e?.statusCode || e?.status
      if (status === 401 || status === 403) {
        logout()
      }
    }
    return false
  }

  function selectBoutique(boutiqueId: number) {
    activeBoutiqueId.value = boutiqueId
  }

  function logout() {
    token.value = null
    user.value = null
    boutiques.value = []
    activeBoutiqueId.value = null
    const router = useRouter()
    router.push('/gestionnaire/login')
  }

  const adminUser = computed(() => user.value)

  return {
    token,
    user,
    boutiques,
    boutique,
    activeBoutiqueId,
    hasMultipleBoutiques,
    isLoading,
    authError,
    isLoggedIn,
    adminUser,
    login,
    fetchMe,
    logout,
    selectBoutique,
  }
})
