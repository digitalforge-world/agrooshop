<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 font-sans text-slate-100 relative overflow-hidden">
    <!-- Ambient Background Grid Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md space-y-8">
      
      <!-- Security Badge Header -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded-full text-[11px] font-mono text-emerald-400 tracking-wider">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
          <span>SSO-GATEWAY-v4.2 // 256-BIT ENCRYPTED</span>
        </div>

        <div class="flex items-center justify-center gap-2 pt-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/50">
            <Sprout class="w-6 h-6" />
          </div>
          <span class="text-2xl font-black text-white tracking-wide">Agro<span class="text-[#8cc63f]">Shop</span></span>
        </div>

        <h1 class="text-xl font-bold text-slate-200">Portail Administrateur Sécurisé</h1>
        <p class="text-xs text-slate-400">Accès restreint au personnel habilité AgroShop Togo.</p>
      </div>

      <!-- Main Login Card -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">Email Administrateur</label>
            <div class="relative">
              <input 
                v-model="email" 
                type="email" 
                required 
                placeholder="admin@agroshop.tg"
                class="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <User class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">Mot de Passe</label>
              <span class="text-[10px] text-slate-500 font-mono">Token Sanctum v2</span>
            </div>
            <div class="relative">
              <input 
                v-model="password" 
                type="password" 
                required 
                placeholder="••••••••••••"
                class="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <Lock class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="authStore.authError" class="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{{ authStore.authError }}</span>
          </div>

          <button 
            type="submit" 
            :disabled="authStore.isLoading"
            class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span v-if="!authStore.isLoading">S'authentifier & Accéder</span>
            <span v-else class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              Vérification des identifiants...
            </span>
          </button>
        </form>

        <!-- Enterprise Footer Notice -->
        <div class="pt-4 border-t border-slate-800/80 text-center space-y-1">
          <p class="text-[11px] text-slate-500 font-mono">
            IP Logged: <span class="text-emerald-400">197.234.xx.xx (Lomé, TG)</span>
          </p>
          <p class="text-[10px] text-slate-600">
            Toute tentative d'accès non autorisée fait l'objet d'une journalisation de sécurité.
          </p>
        </div>

      </div>

      <div class="text-center text-xs text-slate-600 font-mono">
        © 2026 AgroShop TG — Enterprise Security Systems
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShieldCheck, Sprout, User, Lock, AlertCircle } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  layout: false
})

useHead({
  title: 'SSO Enterprise Gateway - AgroShop Admin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const email = ref('admin@agroshop.tg')
const password = ref('')

const authStore = useAdminAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin')
  }
}
</script>
