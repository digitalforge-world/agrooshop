<template>
  <div class="space-y-6">
    
    <!-- Title Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white">Gestion des Commandes Clients</h1>
        <p class="text-xs text-slate-400 mt-1">Gérez le traitement, la validation et les livraisons des commandes AgroShop.</p>
      </div>

      <button @click="fetchOrders" class="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
      <div class="relative flex-1">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par référence, nom client, numéro de téléphone..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      <span class="text-xs font-mono text-slate-400">
        {{ filteredOrders.length }} commande(s)
      </span>
    </div>

    <!-- Orders Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      
      <div v-if="isLoading" class="py-12 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des commandes...
      </div>

      <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Référence</th>
              <th class="px-4 py-3">Client & Téléphone</th>
              <th class="px-4 py-3">Mode & Adresse</th>
              <th class="px-4 py-3">Montant Total</th>
              <th class="px-4 py-3">Changer le Statut</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="cmd in filteredOrders" :key="cmd.id" class="hover:bg-slate-800/40 transition-colors">
              
              <td class="px-4 py-3.5 font-mono font-bold text-emerald-400">
                {{ cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>

              <td class="px-4 py-3.5">
                <p class="font-bold text-white">{{ cmd.nom_client }} {{ cmd.prenom_client || '' }}</p>
                <p class="text-[11px] text-slate-400 font-mono">{{ cmd.telephone_client }}</p>
              </td>

              <td class="px-4 py-3.5 text-xs text-slate-300">
                <p class="font-semibold text-slate-200 uppercase text-[10px] tracking-wider">
                  {{ cmd.mode_livraison === 'domicile' ? '🚚 Livraison à Domicile' : '🏬 Retrait en Agence' }}
                </p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ cmd.adresse_livraison || 'Lomé' }}</p>
              </td>

              <td class="px-4 py-3.5 font-mono font-bold text-amber-400">
                {{ formatPrice(cmd.montant_total || 0) }} FCFA
              </td>

              <td class="px-4 py-3.5">
                <select 
                  v-model="cmd.statut_commande" 
                  @change="updateStatus(cmd)"
                  class="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="en_attente">⏳ En Attente</option>
                  <option value="en_cours">🚚 En cours de Livraison</option>
                  <option value="livree">✅ Livrée</option>
                  <option value="annulee">❌ Annulée</option>
                </select>
              </td>

              <td class="px-4 py-3.5 text-right font-mono text-[11px] text-slate-500">
                {{ formatDate(cmd.created_at) }}
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
        Aucune commande trouvée.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshCw } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/commandes',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Gestion des Commandes - AgroShop Admin'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isLoading = ref(true)
const orders = ref([])
const searchQuery = ref('')

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return orders.value
  const q = searchQuery.value.toLowerCase()
  return orders.value.filter(o => 
    o.reference_commande?.toLowerCase().includes(q) ||
    o.nom_client?.toLowerCase().includes(q) ||
    o.telephone_client?.includes(q)
  )
})

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/commandes`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    orders.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.warn('Admin orders fetch error', e)
  }
  isLoading.value = false
}

const updateStatus = async (cmd) => {
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/commandes/${cmd.id}/statut`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { statut_commande: cmd.statut_commande }
    })
  } catch (e) {
    console.warn('Order status update error', e)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
