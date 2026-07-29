import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AdminUser {
  id: number
  nom: string
  prenom: string
  email: string
  role?: string
}

export const SECRET_ADMIN_LOGIN_PATH = '/admin/auth/v1/sso-login-gateway-98f7a2b91c84'

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = useCookie<string | null>('agro_admin_token', { 
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })
  const admin = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const config = useRuntimeConfig()

  async function login(emailVal: string, passwordVal: string) {
    isLoading.value = true
    authError.value = null

    try {
      const res = await $fetch<any>(
        `${config.public.apiBaseUrl}/admin/login`,
        {
          method: 'POST',
          body: {
            email: emailVal,
            password: passwordVal,
            mot_de_passe: passwordVal
          }
        }
      )

      const tokenVal = res?.data?.token || res?.token
      const adminVal = res?.data?.admin || res?.data?.user || res?.user

      if (tokenVal) {
        token.value = tokenVal
        admin.value = adminVal
        return true
      } else {
        authError.value = res?.message || "Identifiants administrateur incorrects."
        return false
      }
    } catch (err: any) {
      authError.value = err?.data?.message || err?.message || "Erreur de connexion à la passerelle d'administration."
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return false
    try {
      const res = await $fetch<any>(
        `${config.public.apiBaseUrl}/admin/me`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )
      // Le endpoint /me retourne data.user ou data directement
      const adminData = res?.data?.user || res?.data?.admin || res?.data || res?.user
      if (adminData) {
        admin.value = adminData
        return true
      }
    } catch (e) {
      // Token invalide : on le purge pour forcer une reconnexion
      token.value = null
      admin.value = null
    }
    return false
  }

  function logout() {
    token.value = null
    admin.value = null
    const router = useRouter()
    router.push(SECRET_ADMIN_LOGIN_PATH)
  }

  // Alias pour la compatibilité avec le layout (utilise authStore.adminUser)
  const adminUser = admin

  return {
    token,
    admin,
    adminUser,
    isLoading,
    authError,
    isAuthenticated,
    login,
    fetchMe,
    logout,
    SECRET_ADMIN_LOGIN_PATH
  }
})
