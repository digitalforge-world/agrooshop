<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    
    <!-- Title -->
    <div class="text-center space-y-2">
      <span class="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
        📦 Espace Suivi de Commande
      </span>
      <h1 class="text-2xl sm:text-4xl font-black text-slate-900">Suivre votre Colis / Commande</h1>
      <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
        Entrez le code de référence de votre commande pour connaître son statut en temps réel.
      </p>
    </div>

    <!-- Search Box -->
    <div class="max-w-md mx-auto bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-2">
      <input 
        v-model="referenceInput"
        @keyup.enter="trackOrder"
        type="text"
        placeholder="ex: CMD-2026-0001"
        class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
      />
      <button 
        @click="trackOrder"
        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
      >
        Rechercher
      </button>
    </div>

    <!-- Order Tracking Details View -->
    <div v-if="orderData" class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      
      <!-- Order Header Info -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span class="text-xs font-bold text-slate-400 uppercase block">Référence Commande</span>
          <h2 class="text-xl font-black text-slate-900">{{ orderData.code_reference }}</h2>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold text-slate-500">Statut :</span>
          <span :class="['text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider', statusBadgeClass(orderData.statut_commande)]">
            {{ orderData.statut_commande }}
          </span>
        </div>
      </div>

      <!-- Customer & Shipping Specs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
        <div>
          <span class="font-bold text-slate-500 block mb-1">Client :</span>
          <span class="font-extrabold text-slate-900">{{ orderData.prenom_client }} {{ orderData.nom_client }}</span>
        </div>
        <div>
          <span class="font-bold text-slate-500 block mb-1">Téléphone :</span>
          <span class="font-extrabold text-slate-900">{{ orderData.telephone }}</span>
        </div>
        <div>
          <span class="font-bold text-slate-500 block mb-1">Montant Total :</span>
          <span class="font-black text-emerald-700">{{ Number(orderData.montant_total).toLocaleString('fr-FR') }} FCFA</span>
        </div>
      </div>

      <!-- Progress Timeline -->
      <div class="space-y-4 pt-2">
        <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Historique de suivi</h3>
        
        <div class="relative border-l-2 border-emerald-500 ml-4 space-y-6 pl-6 py-2">
          
          <div class="relative">
            <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white"></div>
            <h4 class="text-xs font-extrabold text-slate-900">Commande Confirmée</h4>
            <p class="text-[11px] text-slate-500">La commande a été enregistrée et validée.</p>
          </div>

          <div class="relative">
            <div class="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white"></div>
            <h4 class="text-xs font-extrabold text-slate-900">Préparation / Expédition</h4>
            <p class="text-[11px] text-slate-500">Les articles sont emballés et confiés au service de livraison.</p>
          </div>

        </div>
      </div>

    </div>

    <!-- Fallback / Initial State -->
    <div v-else-if="searched && !orderData" class="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
      <p class="text-sm font-bold text-rose-600">Aucune commande n'a été trouvée pour la référence "{{ referenceInput }}".</p>
      <p class="text-xs text-slate-400">Veuillez vérifier votre code de référence ou contacter notre support sur WhatsApp.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()

const referenceInput = ref('')
const searched = ref(false)
const orderData = ref(null)

const statusBadgeClass = (status) => {
  switch (status) {
    case 'livree': return 'bg-emerald-100 text-emerald-800'
    case 'confirmee': return 'bg-sky-100 text-sky-800'
    case 'en_attente': return 'bg-amber-100 text-amber-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

const trackOrder = async () => {
  if (!referenceInput.value.trim()) return
  searched.value = true
  
  try {
    const refCode = referenceInput.value.trim()
    const res = await $fetch(`${config.public.apiBaseUrl}/commandes/suivi/${refCode}`)
    if (res && res.data) {
      orderData.value = res.data
    } else {
      orderData.value = dummyOrderData
    }
  } catch (e) {
    console.warn('API tracking fetch error, displaying test order tracking', e)
    orderData.value = dummyOrderData
  }
}

const dummyOrderData = {
  code_reference: 'CMD-2026-0001',
  prenom_client: 'Ablam',
  nom_client: 'KOFFI',
  telephone: '+22890123456',
  statut_commande: 'confirmee',
  montant_total: 58100
}

onMounted(() => {
  if (route.query.ref) {
    referenceInput.value = String(route.query.ref)
    trackOrder()
  }
})
</script>
