<template>
  <div class="space-y-8">
    
    <!-- Title & Refresh Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-white">Tableau de Bord Administration</h1>
        <p class="text-xs text-slate-400 mt-1">Données et métriques en temps réel issues de la base de données AgroShop.</p>
      </div>

      <button 
        @click="fetchDashboardData" 
        :disabled="isLoading"
        class="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-98"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Actualiser les Données</span>
      </button>
    </div>

    <!-- 4 Dynamic KPI Cards (Linked to Laravel Database) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Card 1: Total des Ventes -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total des Ventes</span>
          <div class="w-9 h-9 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
          {{ formatPrice(stats.total_ventes || stats.chiffre_affaires || 0) }} <span class="text-xs text-slate-400">FCFA</span>
        </p>
        <div class="text-[11px] text-slate-400 font-mono">
          Chiffre d'affaires cumulé
        </div>
      </div>

      <!-- Card 2: Commandes en Cours -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Commandes en Cours</span>
          <div class="w-9 h-9 rounded-xl bg-blue-950/60 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-white font-mono">
          {{ stats.commandes_en_cours || stats.commandes_attente || 0 }}
        </p>
        <div class="text-[11px] text-blue-400 font-mono flex items-center gap-1">
          <ShoppingCart class="w-3.5 h-3.5" />
          <span>En cours de traitement</span>
        </div>
      </div>

      <!-- Card 3: Clients Total -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Clients Total</span>
          <div class="w-9 h-9 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Users class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-white font-mono">
          {{ stats.clients_total || 0 }}
        </p>
        <div class="text-[11px] text-purple-400 font-mono">
          Acheteurs enregistrés dans la BDD
        </div>
      </div>

      <!-- Card 4: Produits Actifs -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Produits Actifs</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-emerald-400 font-mono">
          {{ stats.produits_actifs || stats.total_produits || 0 }}
        </p>
        <div class="text-[11px] text-emerald-400 font-mono">
          Catalogue agricole en ligne
        </div>
      </div>

    </div>

    <!-- Recent Orders Live Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-lg font-bold text-white">Dernières Commandes enregistrées</h2>
          <p class="text-xs text-slate-400">Transactions récentes synchronisées depuis la base de données</p>
        </div>
        <NuxtLink to="/admin/commandes" class="text-xs font-bold text-emerald-400 hover:underline">
          Toutes les Commandes →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 text-center text-xs text-slate-500 font-mono">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des données en cours...
      </div>

      <!-- Table Content -->
      <div v-else-if="recentOrders.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Code Réf</th>
              <th class="px-4 py-3">Nom Client</th>
              <th class="px-4 py-3">Téléphone</th>
              <th class="px-4 py-3">Montant Total</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="cmd in recentOrders" :key="cmd.id" class="hover:bg-slate-800/40 transition-colors">
              <td class="px-4 py-3.5 font-mono text-emerald-400 font-bold">
                {{ cmd.code_reference || cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>
              <td class="px-4 py-3.5 font-bold text-white">
                {{ cmd.nom_client }} {{ cmd.prenom_client || '' }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-400">
                {{ cmd.telephone || cmd.telephone_client || 'N/A' }}
              </td>
              <td class="px-4 py-3.5 font-mono font-bold text-amber-400">
                {{ formatPrice(cmd.montant_total || 0) }} FCFA
              </td>
              <td class="px-4 py-3.5">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border"
                  :class="getStatutBadgeClass(cmd.statut_commande)"
                >
                  {{ formatStatut(cmd.statut_commande) }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-right text-slate-500 font-mono text-[11px]">
                {{ formatDate(cmd.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
        Aucune commande récente enregistrée dans la base de données.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TrendingUp, Clock, Users, Package, ShoppingCart, RefreshCw } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Dashboard Administration - AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isLoading = ref(true)
const stats = ref({
  total_ventes: 0,
  commandes_en_cours: 0,
  clients_total: 0,
  produits_actifs: 0
})
const recentOrders = ref([])

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const formatStatut = (statut) => {
  switch (statut) {
    case 'livree': return 'Livrée'
    case 'expediee': return 'Expédiée'
    case 'preparee': return 'Préparée'
    case 'confirmee': return 'Confirmée'
    case 'en_attente': return 'En Attente'
    case 'annulee': return 'Annulée'
    default: return statut || 'En attente'
  }
}

const getStatutBadgeClass = (statut) => {
  switch (statut) {
    case 'livree': return 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
    case 'expediee': case 'preparee': case 'confirmee': return 'bg-blue-950 text-blue-400 border-blue-500/30'
    case 'annulee': return 'bg-red-950 text-red-400 border-red-500/30'
    default: return 'bg-amber-950 text-amber-400 border-amber-500/30'
  }
}

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (res?.data) {
      const data = res.data
      stats.value = data.stats || data.statistiques || data
      recentOrders.value = data.dernieres_commandes || []
    }
  } catch (e) {
    console.error('Erreur de chargement du dashboard', e)
  }
  isLoading.value = false
}

onMounted(() => {
  fetchDashboardData()
})
</script>
