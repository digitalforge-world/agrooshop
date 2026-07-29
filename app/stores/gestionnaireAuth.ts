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
  const token = useCookie<string | null>('agro_gestionnaire_token', { maxAge: 60 * 60 * 24 * 7 })
  const user = ref<GestionnaireUser | null>(null)
  // Toutes les boutiques gérées par ce gestionnaire
  const boutiques = ref<Boutique[]>([])
  // Boutique actuellement active (sélectionnée)
  const activeBoutiqueId = useCookie<number | null>('agro_active_boutique', { maxAge: 60 * 60 * 24 * 7 })
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  // Boutique active = celle sélectionnée, ou la première par défaut
  const boutique = computed(() => {
    if (activeBoutiqueId.value && boutiques.value.length > 0) {
      return boutiques.value.find(b => b.id === activeBoutiqueId.value) || boutiques.value[0]
    }
    return boutiques.value[0] || null
  })
  // Le gestionnaire gère-t-il plusieurs boutiques ?
  const hasMultipleBoutiques = computed(() => boutiques.value.length > 1)

  const config = useRuntimeConfig()

  async function login(emailVal: string, passwordVal: string) {
    isLoading.value = true
    authError.value = null
    try {
      const res = await $fetch<any>(`${config.public.apiBaseUrl}/gestionnaire/login`, {
        method: 'POST',
        body: { email: emailVal, password: passwordVal }
      })

      const tokenVal = res?.token
      const userVal = res?.gestionnaire
      const boutiquesVal: Boutique[] = res?.boutiques || (res?.boutique ? [res.boutique] : [])

      if (tokenVal) {
        token.value = tokenVal
        user.value = userVal
        boutiques.value = boutiquesVal
        // Sélectionner la première boutique par défaut
        if (boutiquesVal.length > 0 && !activeBoutiqueId.value) {
          activeBoutiqueId.value = boutiquesVal[0].id
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

  function selectBoutique(boutiqueId: number) {
    activeBoutiqueId.value = boutiqueId
  }

  function logout() {
    token.value = null
    user.value = null
    boutiques.value = []
    activeBoutiqueId.value = null
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
    logout,
    selectBoutique,
  }
})
