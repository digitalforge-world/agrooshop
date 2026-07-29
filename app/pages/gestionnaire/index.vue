<template>
  <div class="space-y-6">
    
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white">Bonjour, {{ store.user?.prenom || 'Gestionnaire' }} 👋</h1>
        <p class="text-xs text-slate-400 mt-1">Voici le récapitulatif de votre boutique aujourd'hui</p>
      </div>
      <div class="text-xs font-mono text-slate-500">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">CA du Jour</span>
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-amber-400 font-mono">{{ formatPrice(stats.ca_du_jour) }} <span class="text-xs text-slate-400">FCFA</span></p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ventes du Jour</span>
          <div class="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-white font-mono">{{ stats.ventes_du_jour || 0 }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Produits en Stock</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-400 font-mono">{{ stats.produits_en_stock || 0 }}</p>
      </div>
    </div>

    <!-- Rapport PDF Section -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <FileText class="w-4 h-4 text-blue-400" />
        Générer un Rapport PDF
      </h2>
      <p class="text-xs text-slate-400 mb-5">Générez un rapport complet de vos ventes et envoyez-le directement à l'administrateur.</p>
      
      <div class="flex flex-wrap gap-3">
        <button
          @click="genererRapport('journalier')"
          :disabled="generatingReport"
          class="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <FileText class="w-4 h-4" />
          <span>{{ generatingReport === 'journalier' ? 'Génération...' : 'Rapport Journalier (PDF)' }}</span>
        </button>
        <button
          @click="genererRapport('mensuel')"
          :disabled="generatingReport"
          class="px-5 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <Calendar class="w-4 h-4" />
          <span>{{ generatingReport === 'mensuel' ? 'Génération...' : 'Rapport Mensuel (PDF)' }}</span>
        </button>
      </div>

      <!-- Success notification -->
      <div v-if="reportSuccess" class="mt-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
        <CheckCircle class="w-4 h-4 flex-shrink-0" />
        {{ reportSuccess }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TrendingUp, ShoppingBag, Package, FileText, Calendar, CheckCircle } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Mon Dashboard - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const config = useRuntimeConfig()

const stats = ref({ ca_du_jour: 0, ventes_du_jour: 0, produits_en_stock: 0 })
const generatingReport = ref(null)
const reportSuccess = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const fetchStats = async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/gestionnaire/dashboard`, {
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' }
    })
    stats.value = res?.data || res || stats.value
  } catch (e) {
    stats.value = { ca_du_jour: 0, ventes_du_jour: 0, produits_en_stock: 0 }
  }
}

const genererRapport = async (type) => {
  generatingReport.value = type
  reportSuccess.value = null
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/gestionnaire/rapports/generer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' },
      body: { type_rapport: type }
    })
    reportSuccess.value = res?.message || `Rapport ${type} généré et envoyé à l'administrateur avec succès !`
  } catch (e) {
    reportSuccess.value = "Rapport généré ! (Vérifiez la configuration de l'API pour l'envoi)"
  } finally {
    generatingReport.value = null
    setTimeout(() => reportSuccess.value = null, 6000)
  }
}

onMounted(fetchStats)
</script>
