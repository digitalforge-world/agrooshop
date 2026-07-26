<template>
  <div 
    class="min-h-screen w-full bg-[#0066ff] bg-cover bg-center flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden select-none"
    style="background-image: url('/images/loginback.png');"
  >
    
    <!-- Dark/Blue Backdrop Overlay fallback if image is loading -->
    <div class="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px]"></div>

    <!-- Main Floating White Login Card (Pixel-Perfect Match to User Screenshot) -->
    <div class="relative z-10 w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.35)] space-y-6 text-slate-900 border border-slate-100/80">
      
      <!-- Logo AgroShop -->
      <div class="flex justify-center pt-1">
        <img 
          src="/logo.png" 
          alt="AgroShop Togo" 
          class="h-14 w-auto object-contain"
        />
      </div>

      <!-- Header Titles -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900">
          Bienvenue
        </h1>
        <p class="text-xs font-semibold text-slate-500">
          Connectez-vous pour accéder à votre espace administrateur
        </p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        
        <!-- Email Input -->
        <div class="space-y-1.5">
          <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Adresse Email</label>
          <div class="relative">
            <input 
              v-model="email" 
              type="email" 
              required 
              placeholder="admin@agroshop.tg"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
            />
            <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Mot de passe</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              required 
              placeholder="••••••••••••"
              class="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
            />
            <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Options Row (Remember me & Forgot Password) -->
        <div class="flex items-center justify-between text-xs pt-1">
          <label class="flex items-center gap-2 cursor-pointer text-slate-600 font-semibold select-none">
            <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded text-[#0066ff] focus:ring-[#0066ff] border-slate-300 accent-[#0066ff]" />
            <span>Se souvenir de moi</span>
          </label>
          <a href="#" @click.prevent="showForgotNotice" class="text-[#0066ff] font-bold hover:underline transition-colors">
            Mot de passe oublié ?
          </a>
        </div>

        <!-- Error Message Alert -->
        <div v-if="authStore.authError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold text-center">
          {{ authStore.authError }}
        </div>

        <!-- Submit Button (Sign in →) -->
        <button 
          type="submit" 
          :disabled="authStore.isLoading"
          class="w-full py-3.5 bg-[#0066ff] hover:bg-[#0052cc] text-[#ffffff] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
        >
          <span v-if="!authStore.isLoading" class="flex items-center gap-2">
            <span>Se Connecter</span>
            <ArrowRight class="w-4 h-4" />
          </span>
          <span v-else class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Authentification en cours...
          </span>
        </button>
      </form>

      <!-- Bottom Card Notice -->
      <div class="text-center text-[11px] text-slate-400 pt-2 font-medium">
        Portail de Sécurité — <span class="text-slate-600">AgroShop Togo</span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/auth/v1/sso-login-gateway-98f7a2b91c84',
  alias: ['/admin/login', '/admin/sso-gateway'],
  layout: false
})

useHead({
  title: 'Connexion Administrateur - AgroShop TG',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const email = ref('admin@agroshop.tg')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)

const authStore = useAdminAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/admin')
  }
}

const showForgotNotice = () => {
  alert("Pour réinitialiser votre mot de passe administrateur, veuillez contacter la direction technique d'AgroShop Togo.")
}
</script>
