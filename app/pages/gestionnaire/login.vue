<template>
  <div class="min-h-screen w-screen bg-slate-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
          <Store class="w-9 h-9" />
        </div>
        <h1 class="text-2xl font-black text-white">Espace Gestionnaire</h1>
        <p class="text-sm text-slate-400 mt-1">Connectez-vous à votre boutique AgroShop</p>
      </div>

      <!-- Form Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Adresse Email</label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="votre@email.com"
                class="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Mot de Passe</label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="store.authError" class="bg-red-950/50 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            {{ store.authError }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="store.isLoading"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span v-if="store.isLoading">
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2"></span>
              Connexion...
            </span>
            <span v-else class="flex items-center gap-2">
              <LogIn class="w-4 h-4" />
              Se Connecter
            </span>
          </button>
        </form>
      </div>

      <p class="text-center text-[11px] text-slate-600 mt-6">
        Accès réservé aux gestionnaires de boutique autorisés.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Store, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  layout: false,
  middleware: []
})

useHead({ title: 'Connexion Gestionnaire - AgroShop' })

const store = useGestionnaireAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  const ok = await store.login(email.value, password.value)
  if (ok) {
    router.push('/gestionnaire')
  }
}
</script>
