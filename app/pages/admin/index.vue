<template>
  <div class="space-y-8">
    
    <!-- Title & Refresh Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900">Tableau de Bord Administration</h1>
        <p class="text-xs text-slate-500 mt-1">Données et métriques en temps réel issues de la base de données AgroShop.</p>
      </div>

      <button 
        @click="fetchDashboardData" 
        :disabled="isLoading"
        class="px-4 py-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
      >
        <RefreshCw class="w-3.5 h-3.5 text-emerald-600" :class="{ 'animate-spin': isLoading }" />
        <span>Actualiser les Données</span>
      </button>
    </div>

    <!-- 4 Dynamic KPI Cards (AgroShop Fresh Theme) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- Card 1: Total des Ventes -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total des Ventes</span>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
          {{ formatPrice(stats.total_ventes || stats.chiffre_affaires || 0) }} <span class="text-xs font-sans text-slate-500 font-bold">FCFA</span>
        </p>
        <div class="text-[11px] text-slate-500 font-medium">
          Chiffre d'affaires cumulé
        </div>
      </div>

      <!-- Card 2: Commandes en Cours -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Commandes en Cours</span>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Clock class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 font-mono">
          {{ stats.commandes_en_cours || stats.commandes_attente || 0 }}
        </p>
        <div class="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
          <ShoppingCart class="w-3.5 h-3.5" />
          <span>En cours de traitement</span>
        </div>
      </div>

      <!-- Card 3: Clients Total -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Clients Total</span>
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Users class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 font-mono">
          {{ stats.clients_total || 0 }}
        </p>
        <div class="text-[11px] text-purple-600 font-semibold">
          Acheteurs enregistrés dans la BDD
        </div>
      </div>

      <!-- Card 4: Produits Actifs -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Produits Actifs</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Package class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-emerald-700 font-mono">
          {{ stats.produits_actifs || stats.total_produits || 0 }}
        </p>
        <div class="text-[11px] text-emerald-600 font-semibold">
          Catalogue agricole en ligne
        </div>
      </div>

    </div>

    <!-- Recent Orders Live Table -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Dernières Commandes enregistrées</h2>
          <p class="text-xs text-slate-500">Transactions récentes synchronisées depuis la base de données</p>
        </div>
        <NuxtLink to="/admin/commandes" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
          Toutes les Commandes →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 text-center text-xs text-slate-500 font-mono">
        <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des données en cours...
      </div>

      <!-- Table Content -->
      <div v-else-if="recentOrders.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Code Réf</th>
              <th class="px-4 py-3">Nom Client</th>
              <th class="px-4 py-3">Téléphone</th>
              <th class="px-4 py-3">Montant Total</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="cmd in recentOrders" :key="cmd.id" class="hover:bg-emerald-50/40 transition-colors">
              <td class="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                {{ cmd.code_reference || cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>
              <td class="px-4 py-3.5 font-bold text-slate-900">
                {{ cmd.nom_client }} {{ cmd.prenom_client || '' }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-600">
                {{ cmd.telephone || cmd.telephone_client || 'N/A' }}
              </td>
              <td class="px-4 py-3.5 font-mono font-bold text-slate-900">
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

    <!-- Chiffre d'Affaires par Boutique -->
    <div v-if="stats.ventes_par_boutique && stats.ventes_par_boutique.length > 0" class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs mt-8">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Chiffre d'Affaires par Boutique</h2>
          <p class="text-xs text-slate-500">Répartition des revenus entre les différentes succursales</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="b in stats.ventes_par_boutique" :key="b.boutique_nom" class="p-4 border border-emerald-100 rounded-xl bg-emerald-50/30 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-emerald-800 text-sm">{{ b.boutique_nom }}</h3>
            <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{{ b.boutique_type }}</p>
          </div>
          <div class="mt-4 flex items-end justify-between">
            <span class="text-xl font-black text-slate-900 font-mono">{{ formatPrice(b.ca_total) }} <span class="text-[10px] font-sans text-slate-500 font-bold">FCFA</span></span>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">{{ b.ventes_count }} Ventes</span>
          </div>
        </div>
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
  produits_actifs: 0,
  ventes_par_boutique: []
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
    case 'livree': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'expediee': case 'preparee': case 'confirmee': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'annulee': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const statsRes = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard/stats-generales`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    
    const oldRes = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (statsRes) {
      stats.value.total_ventes = statsRes.chiffre_affaires_global || 0
      stats.value.ventes_par_boutique = statsRes.ventes_par_boutique || []
      
      if (oldRes?.data) {
        stats.value.commandes_en_cours = oldRes.data.commandes_en_cours || oldRes.data.commandes_attente || 0
        stats.value.clients_total = oldRes.data.clients_total || 0
        stats.value.produits_actifs = oldRes.data.produits_actifs || oldRes.data.total_produits || 0
        recentOrders.value = oldRes.data.dernieres_commandes || []
      }
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
