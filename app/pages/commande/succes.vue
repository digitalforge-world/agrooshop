<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col">
    
    <!-- Navbar -->
    <AppNavbar />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
      <div class="w-full max-w-lg">

        <!-- Loading State -->
        <div v-if="loading" class="text-center space-y-4">
          <div class="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="text-slate-500 text-sm">Vérification du paiement...</p>
        </div>

        <!-- Payment Cancelled -->
        <div v-else-if="isCancelled" class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center space-y-6">
          <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <span class="text-4xl">⚠️</span>
          </div>
          <div>
            <h1 class="text-2xl font-black text-slate-900">Paiement annulé</h1>
            <p class="text-slate-500 text-sm mt-2">Votre commande <strong class="text-slate-700">{{ refCode }}</strong> a été enregistrée mais le paiement n'a pas été complété.</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
            <p class="text-xs text-amber-800 leading-relaxed">
              Votre commande reste en attente. Vous pouvez contacter notre équipe pour finaliser votre paiement ou choisir de payer en espèces à la livraison.
            </p>
          </div>
          <div class="space-y-3">
            <a 
              :href="whatsappUrl" 
              target="_blank"
              class="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              📞 Contacter AgroShop sur WhatsApp
            </a>
            <NuxtLink 
              to="/"
              class="w-full flex items-center justify-center py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-all"
            >
              Retourner à la boutique
            </NuxtLink>
          </div>
        </div>

        <!-- Payment Success -->
        <div v-else class="space-y-5">

          <!-- Success Card -->
          <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center space-y-6">
            
            <!-- Icon + Confetti Effect -->
            <div class="relative inline-flex items-center justify-center">
              <div class="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce-slow">
                <svg class="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <!-- Decorative rings -->
              <div class="absolute inset-0 rounded-full border-2 border-emerald-200 scale-125 opacity-40 animate-ping"></div>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Paiement confirmé !</p>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900">Merci pour votre commande</h1>
              <p class="text-slate-500 text-sm">Votre paiement Mobile Money a été traité avec succès.</p>
            </div>

            <!-- Order Reference Badge -->
            <div class="inline-flex flex-col items-center gap-1">
              <span class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Référence de commande</span>
              <div class="px-6 py-2.5 bg-slate-900 text-emerald-400 font-black text-xl tracking-widest rounded-xl font-mono">
                {{ refCode }}
              </div>
            </div>

            <!-- Steps Timeline -->
            <div class="text-left space-y-3 pt-2">
              <div v-for="(step, i) in steps" :key="i" class="flex items-start gap-3">
                <div :class="['w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black mt-0.5', step.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400']">
                  {{ step.done ? '✓' : (i + 1) }}
                </div>
                <div>
                  <p :class="['text-xs font-bold', step.done ? 'text-slate-900' : 'text-slate-400']">{{ step.label }}</p>
                  <p class="text-[11px] text-slate-400">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact / Actions Card -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 class="text-sm font-bold text-slate-900">Et maintenant ?</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              Notre équipe va traiter votre commande et vous contacter très prochainement pour organiser la livraison. 
              Conservez votre référence de commande.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <a 
                :href="whatsappUrl" 
                target="_blank"
                class="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                💬 Confirmer sur WhatsApp
              </a>
              <NuxtLink 
                to="/"
                class="flex-1 flex items-center justify-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                🛒 Continuer mes achats
              </NuxtLink>
            </div>
          </div>

          <!-- Security Banner -->
          <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <span class="text-emerald-600 text-lg">🔒</span>
            <p class="text-[11px] text-slate-500">
              Paiement sécurisé traité par <strong class="text-slate-700">LeekPay</strong>. 
              Vos données bancaires ne sont jamais partagées avec AgroShop.
            </p>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

useHead({
  title: 'Commande confirmée — AgroShop Togo',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const config = useRuntimeConfig()

const loading = ref(false)
const refCode = computed(() => route.query.ref || '')
const isCancelled = computed(() => route.query.cancelled === '1')

const whatsappUrl = computed(() => {
  const phone = '22898706081'
  if (isCancelled.value) {
    const text = `Bonjour AgroShop,%0AJe souhaite finaliser ma commande N° ${refCode.value}. Mon paiement Mobile Money n'a pas abouti.`
    return `https://wa.me/${phone}?text=${text}`
  }
  const text = `Bonjour AgroShop,%0AMon paiement pour la commande N° ${refCode.value} a été effectué avec succès. Merci de confirmer la livraison.`
  return `https://wa.me/${phone}?text=${text}`
})

const steps = [
  { label: 'Commande enregistrée', desc: 'Votre commande a été créée dans notre système', done: true },
  { label: 'Paiement reçu', desc: 'Votre paiement Mobile Money a été confirmé', done: !isCancelled.value },
  { label: 'Traitement en cours', desc: 'Notre équipe prépare votre commande', done: false },
  { label: 'Livraison', desc: 'Livraison à votre adresse ou retrait en agence', done: false },
]
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2.5s ease-in-out infinite;
}
</style>
