<template>
  <div class="space-y-8">
    
    <!-- Title & Quick Stats Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-white">Tableau de Bord Administration</h1>
        <p class="text-xs text-slate-400 mt-1">Vue d'ensemble des ventes, stocks et activités de la plateforme AgroShop.</p>
      </div>

      <button 
        @click="fetchDashboardData" 
        :disabled="isLoading"
        class="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Actualiser les Données</span>
      </button>
    </div>

    <!-- 4 Key Performance Indicators (KPI Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Card 1: Total Commandes -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Commandes</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShoppingCart class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-white font-mono">{{ stats.total_commandes || 0 }}</p>
        <div class="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>{{ stats.commandes_livrees || 0 }} livrées avec succès</span>
        </div>
      </div>

      <!-- Card 2: Chiffre d'Affaires -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Ventes Totales</span>
          <div class="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
          {{ formatPrice(stats.chiffre_affaires || 0) }} FCFA
        </p>
        <div class="text-[11px] text-slate-400 font-mono">
          Basé sur l'ensemble des commandes
        </div>
      </div>

      <!-- Card 3: Catalogue Produits -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Produits Actifs</span>
          <div class="w-9 h-9 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-white font-mono">{{ stats.total_produits || 0 }}</p>
        <div class="text-[11px] text-blue-400 font-mono">
          Intrants, semences & matériel
        </div>
      </div>

      <!-- Card 4: Articles Blog -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Articles Blog</span>
          <div class="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <FileText class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-white font-mono">{{ stats.total_articles || 0 }}</p>
        <div class="text-[11px] text-purple-400 font-mono">
          Dossiers de conseils agronomiques
        </div>
      </div>

    </div>

    <!-- Recent Orders Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-lg font-bold text-white">Dernières Commandes Clients</h2>
          <p class="text-xs text-slate-400">Liste des requêtes de commande reçues en direct.</p>
        </div>
        <NuxtLink to="/admin/commandes" class="text-xs font-bold text-emerald-400 hover:underline">
          Voir Toutes les Commandes →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 text-center text-xs text-slate-500 font-mono">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des données du tableau de bord...
      </div>

      <!-- Table Content -->
      <div v-else-if="recentOrders.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Référence</th>
              <th class="px-4 py-3">Client</th>
              <th class="px-4 py-3">Téléphone</th>
              <th class="px-4 py-3">Montant Total</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="cmd in recentOrders" :key="cmd.id" class="hover:bg-slate-800/40 transition-colors">
              <td class="px-4 py-3.5 font-mono text-emerald-400 font-bold">
                {{ cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>
              <td class="px-4 py-3.5 font-bold text-white">
                {{ cmd.nom_client }} {{ cmd.prenom_client || '' }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-400">
                {{ cmd.telephone_client }}
              </td>
              <td class="px-4 py-3.5 font-mono font-bold text-amber-400">
                {{ formatPrice(cmd.montant_total || 0) }} FCFA
              </td>
              <td class="px-4 py-3.5">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border"
                  :class="getStatutBadgeClass(cmd.statut_commande)"
                >
                  {{ cmd.statut_commande }}
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
        Aucune commande enregistrée pour le moment.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ShoppingCart, TrendingUp, Package, FileText, CheckCircle2, RefreshCw } from 'lucide-vue-next'
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
const stats = ref({})
const recentOrders = ref([])

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getStatutBadgeClass = (statut) => {
  switch (statut) {
    case 'livree': return 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
    case 'en_cours': return 'bg-blue-950 text-blue-400 border-blue-500/30'
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
      stats.value = res.data.statistiques || res.data
      recentOrders.value = res.data.dernieres_commandes || []
    }
  } catch (e) {
    // Fallback if dashboard endpoint returns formatted differently
    try {
      const cmdRes = await $fetch(`${config.public.apiBaseUrl}/admin/commandes`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      recentOrders.value = cmdRes?.data?.data || cmdRes?.data || []
      stats.value.total_commandes = recentOrders.value.length
    } catch (err) {
      console.warn('Dashboard fetch error', err)
    }
  }
  isLoading.value = false
}

onMounted(() => {
  fetchDashboardData()
})
</script>
