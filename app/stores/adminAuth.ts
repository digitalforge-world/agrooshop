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
  const token = useCookie<string | null>('agro_admin_token', { maxAge: 60 * 60 * 24 * 7 })
  const admin = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const authError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const config = useRuntimeConfig()

  async function login(emailVal: string, passwordVal: string) {
    isLoading.value = true
    authError.value = null

    try {
      const res = await $fetch<{ success: boolean; data: { token: string; user: AdminUser } }>(
        `${config.public.apiBaseUrl}/admin/login`,
        {
          method: 'POST',
          body: {
            email: emailVal,
            mot_de_passe: passwordVal
          }
        }
      )

      if (res?.success && res.data?.token) {
        token.value = res.data.token
        admin.value = res.data.user
        return true
      } else {
        authError.value = "Identifiants administrateur incorrects."
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
      const res = await $fetch<{ success: boolean; data: { user: AdminUser } }>(
        `${config.public.apiBaseUrl}/admin/me`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )
      if (res?.data?.user) {
        admin.value = res.data.user
        return true
      }
    } catch (e) {
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

  return {
    token,
    admin,
    isLoading,
    authError,
    isAuthenticated,
    login,
    fetchMe,
    logout,
    SECRET_ADMIN_LOGIN_PATH
  }
})
