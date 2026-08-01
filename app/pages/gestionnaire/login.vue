<template>
  <div 
    class="min-h-screen w-full bg-[#009966] bg-cover bg-center flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden select-none"
    style="background-image: url('/images/loginback.png');"
  >
    
    <!-- Dark/Emerald Backdrop Overlay -->
    <div class="absolute inset-0 bg-emerald-900/30 backdrop-blur-[2px]"></div>

    <!-- Main Floating White Login Card (Pixel-Perfect Match to Admin SSO Login) -->
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
          Connectez-vous pour accéder à votre espace gestionnaire
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
              placeholder="gestionnaire@agroshop.tg"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
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
              class="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
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
            <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600 border-slate-300 accent-emerald-600" />
            <span>Se souvenir de moi</span>
          </label>
          <a href="#" @click.prevent="showForgotNotice" class="text-emerald-600 font-bold hover:underline transition-colors">
            Mot de passe oublié ?
          </a>
        </div>

        <!-- Error Message Alert -->
        <div v-if="store.authError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold text-center flex items-center justify-center gap-2">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          <span>{{ store.authError }}</span>
        </div>

        <!-- Submit Button (Sign in →) -->
        <button 
          type="submit" 
          :disabled="store.isLoading"
          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
        >
          <span v-if="!store.isLoading" class="flex items-center gap-2">
            <span>Se Connecter</span>
            <ArrowRight class="w-4 h-4" />
          </span>
          <span v-else class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Connexion...</span>
          </span>
        </button>

      </form>

      <!-- Footer Disclaimer -->
      <div class="pt-2 text-center border-t border-slate-100">
        <p class="text-[11px] font-semibold text-slate-400">
          AgroShop Togo — Espace Sécurisé Gestionnaire
        </p>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  layout: false,
  middleware: []
})

useHead({ title: 'Connexion Gestionnaire - AgroShop Togo' })

const store = useGestionnaireAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(true)

const handleLogin = async () => {
  const ok = await store.login(email.value, password.value)
  if (ok) {
    router.push('/gestionnaire')
  }
}

const showForgotNotice = () => {
  alert("Pour réinitialiser votre mot de passe gestionnaire, veuillez contacter l'administrateur système d'AgroShop.")
}
</script>
