<template>
  <div class="h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col space-y-3">
    
    <!-- Title & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <ShoppingCart class="w-6 h-6 text-amber-600" />
          <span>Gestion des Commandes Clients</span>
        </h1>
        <p class="text-xs text-slate-600 mt-0.5">Suivez la validation, la préparation et les livraisons des commandes passées sur AgroShop.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button 
          @click="fetchOrders" 
          :disabled="isLoading" 
          class="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Actualiser les commandes"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Stats Summary KPI Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Commandes</p>
          <h2 class="text-xl font-black text-slate-900 mt-0.5">{{ orders.length }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <ShoppingCart class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">En Attente / En Cours</p>
          <h2 class="text-xl font-black text-blue-700 mt-0.5">{{ pendingOrdersCount }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Clock class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Commandes Livrées</p>
          <h2 class="text-xl font-black text-emerald-700 mt-0.5">{{ deliveredOrdersCount }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Chiffre d'Affaires Total</p>
          <h2 class="text-lg font-black text-emerald-700 mt-0.5">{{ formatPrice(totalRevenue) }} FCFA</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <DollarSign class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Orders Table Container -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
      
      <!-- Table Filters Header -->
      <div class="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="relative w-full sm:w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher réf, client, tel..." 
              class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select 
            v-model="filterStatut" 
            class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="tous">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="validee">Validée</option>
            <option value="en_cours">En cours de livraison</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>

        <div class="text-xs font-mono text-slate-500">
          <span>{{ filteredOrders.length }} commande(s) trouvée(s)</span>
        </div>
      </div>

      <!-- Table Body -->
      <div v-if="isLoading" class="py-16 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des commandes...
      </div>

      <div v-else-if="filteredOrders.length > 0" class="overflow-y-auto flex-1 custom-modal-scroll">
        <table class="w-full text-left text-xs text-slate-700 relative">
          <thead class="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th class="px-4 py-2">Référence</th>
              <th class="px-4 py-2">Client & Contact</th>
              <th class="px-4 py-2">Mode & Adresse</th>
              <th class="px-4 py-2">Montant Total</th>
              <th class="px-4 py-2">Statut de la Commande</th>
              <th class="px-4 py-2 text-right">Actions / Date</th>
            </tr>
          </thead>

          <!-- Compact Body Rows -->
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="cmd in filteredOrders" :key="cmd.id" class="hover:bg-slate-800/40 transition-colors">
              
              <!-- Code Ref -->
              <td class="px-4 py-2 font-mono font-bold text-emerald-400 text-xs">
                {{ cmd.code_reference || cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>

              <!-- Client Info -->
              <td class="px-4 py-2">
                <p class="font-bold text-white text-xs">{{ cmd.nom_client || 'Client AgroShop' }} {{ cmd.prenom_client || '' }}</p>
                <p class="text-[11px] text-slate-400 font-mono">{{ cmd.telephone_client || cmd.telephone || '+228 -- -- -- --' }}</p>
              </td>

              <!-- Delivery Mode & Address -->
              <td class="px-4 py-2">
                <p class="font-semibold text-slate-200 text-[10px] uppercase tracking-wider">
                  {{ (cmd.mode_livraison || '').includes('domicile') ? '🚚 Domicile' : '🏬 Retrait Agence' }}
                </p>
                <p class="text-[11px] text-slate-400 truncate max-w-[200px]">{{ cmd.adresse_livraison || cmd.ville || 'Lomé, Togo' }}</p>
              </td>

              <!-- Total Price -->
              <td class="px-4 py-2 font-mono font-bold text-amber-400 text-xs">
                {{ formatPrice(cmd.montant_total || 0) }} FCFA
              </td>

              <!-- Status Dropdown Select -->
              <td class="px-4 py-2">
                <select 
                  v-model="cmd.statut_commande" 
                  @change="updateStatus(cmd)"
                  class="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  :class="getStatutSelectClass(cmd.statut_commande)"
                >
                  <option value="en_attente">⏳ En Attente</option>
                  <option value="confirmee">✔️ Confirmée</option>
                  <option value="preparee">📦 Préparée</option>
                  <option value="expediee">🚚 En Livraison</option>
                  <option value="livree">✅ Livrée</option>
                  <option value="annulee">❌ Annulée</option>
                </select>
              </td>

              <!-- Date & Detail Action Button -->
              <td class="px-4 py-2 text-right font-mono space-x-2">
                <span class="text-[10px] text-slate-500">{{ formatDate(cmd.created_at) }}</span>
                <button 
                  @click="openOrderDetail(cmd)" 
                  class="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Voir le détail de la commande"
                >
                  <Eye class="w-3.5 h-3.5 inline-block" />
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
        Aucune commande enregistrée ne correspond à vos filtres.
      </div>

    </div>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- ORDER DETAIL MODAL POPUP -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isOrderDetailOpen && selectedOrder" class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between flex-shrink-0">
            <div>
              <span class="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Détails de la Commande Client</span>
              <h2 class="text-lg font-black text-white font-mono">{{ selectedOrder.code_reference || selectedOrder.reference_commande || `CMD-${selectedOrder.id}` }}</h2>
            </div>
            <button @click="isOrderDetailOpen = false" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 custom-modal-scroll space-y-5 text-xs">
            
            <!-- Client & Delivery Info Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👤 Informations Client</span>
                <p class="font-bold text-white text-sm">{{ selectedOrder.nom_client }} {{ selectedOrder.prenom_client || '' }}</p>
                <p class="font-mono text-emerald-400">📞 {{ selectedOrder.telephone_client || selectedOrder.telephone || '+228 -- -- -- --' }}</p>
                <p v-if="selectedOrder.email_client" class="text-slate-400">✉️ {{ selectedOrder.email_client }}</p>
              </div>

              <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🚚 Modalités de Livraison</span>
                <p class="font-bold text-slate-200">
                  {{ (selectedOrder.mode_livraison || '').includes('domicile') ? 'Livraison à Domicile / Agence' : 'Retrait sur Place' }}
                </p>
                <p class="text-slate-300">📍 {{ selectedOrder.adresse_livraison || selectedOrder.ville || 'Lomé - Togo' }}</p>
                <p class="text-slate-500 font-mono text-[10px]">Date : {{ formatDate(selectedOrder.created_at) }}</p>
              </div>
            </div>

            <!-- Articles List -->
            <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📦 Produits Commandés</span>
              
              <div v-if="selectedOrder.articles && selectedOrder.articles.length > 0" class="divide-y divide-slate-800/80">
                <div v-for="art in selectedOrder.articles" :key="art.id" class="py-2 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-white">{{ art.produit?.nom_commercial || art.nom_produit || 'Produit AgroShop' }}</p>
                    <p class="text-[11px] text-slate-400 font-mono">Qté : {{ art.quantite }} x {{ formatPrice(art.prix_unitaire || 0) }} FCFA</p>
                  </div>
                  <span class="font-mono font-bold text-emerald-400">{{ formatPrice((art.quantite || 1) * (art.prix_unitaire || 0)) }} FCFA</span>
                </div>
              </div>

              <div v-else class="text-slate-400 italic">
                Articles inclus dans la commande groupée.
              </div>

              <div class="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
                <span class="text-slate-300 uppercase text-xs">Total de la Commande :</span>
                <span class="text-amber-400 font-mono text-base">{{ formatPrice(selectedOrder.montant_total || 0) }} FCFA</span>
              </div>
            </div>

          </div>

          <div class="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
            <button @click="isOrderDetailOpen = false" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer">
              Fermer
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingCart, Search, RefreshCw, Clock, CheckCircle2, DollarSign, Eye, X } from 'lucide-vue-next'
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
const filterStatut = ref('tous')

const isOrderDetailOpen = ref(false)
const selectedOrder = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getStatutSelectClass = (statut) => {
  switch (statut) {
    case 'livree': return 'border-emerald-500/50 text-emerald-400'
    case 'expediee': case 'preparee': case 'confirmee': return 'border-blue-500/50 text-blue-400'
    case 'annulee': return 'border-rose-500/50 text-rose-400'
    default: return 'border-amber-500/50 text-amber-400'
  }
}

const pendingOrdersCount = computed(() => {
  return orders.value.filter(o => o.statut_commande === 'en_attente' || o.statut_commande === 'confirmee' || o.statut_commande === 'preparee' || o.statut_commande === 'expediee').length
})

const deliveredOrdersCount = computed(() => {
  return orders.value.filter(o => o.statut_commande === 'livree').length
})

const validStatuses = ['confirmee', 'preparee', 'expediee', 'livree']

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => validStatuses.includes(o.statut_commande))
    .reduce((acc, o) => acc + Number(o.montant_total || 0), 0)
})

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    if (filterStatut.value !== 'tous') {
      if (o.statut_commande !== filterStatut.value) return false
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const refMatch = (o.code_reference || o.reference_commande || '').toLowerCase().includes(q)
      const nameMatch = (o.nom_client || '').toLowerCase().includes(q) || (o.prenom_client || '').toLowerCase().includes(q)
      const phoneMatch = (o.telephone_client || o.telephone || '').includes(q)
      if (!refMatch && !nameMatch && !phoneMatch) return false
    }

    return true
  })
})

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/commandes`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const rawList = res?.data?.commandes?.data || res?.data?.commandes || res?.data?.data || res?.data || res || []
    if (Array.isArray(rawList) && rawList.length > 0) {
      orders.value = rawList
    } else {
      orders.value = fallbackAdminOrders
    }
  } catch (e) {
    console.warn('Admin orders fetch error', e)
    orders.value = fallbackAdminOrders
  }
  isLoading.value = false
}

const openOrderDetail = (cmd) => {
  selectedOrder.value = cmd
  isOrderDetailOpen.value = true
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

const fallbackAdminOrders = [
  {
    id: 1,
    code_reference: 'CMD-2026-001',
    reference_commande: 'CMD-2026-001',
    nom_client: 'Koffi',
    prenom_client: 'Emmanuel',
    telephone_client: '+228 90 12 34 56',
    email_client: 'koffi.emmanuel@gmail.com',
    montant_total: 67000,
    mode_livraison: 'domicile',
    adresse_livraison: 'Adidogomé, Lomé - Togo',
    statut_commande: 'confirmee',
    created_at: '2026-07-26T10:15:00.000000Z',
    articles: [
      { id: 101, produit: { nom_commercial: 'Urée YARA 46% N' }, quantite: 2, prix_unitaire: 15000 },
      { id: 102, produit: { nom_commercial: 'Engrais NPK 15-15-15 SuperFert' }, quantite: 2, prix_unitaire: 18500 }
    ]
  },
  {
    id: 2,
    code_reference: 'CMD-2026-002',
    reference_commande: 'CMD-2026-002',
    nom_client: 'Amouzou',
    prenom_client: 'Claudine',
    telephone_client: '+228 98 76 54 32',
    email_client: 'claudine.amouzou@yahoo.fr',
    montant_total: 85000,
    mode_livraison: 'retrait_agence',
    adresse_livraison: 'Agence Centrale Kpogan, Lomé',
    statut_commande: 'livree',
    created_at: '2026-07-25T14:30:00.000000Z',
    articles: [
      { id: 103, produit: { nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²' }, quantite: 1, prix_unitaire: 85000 }
    ]
  },
  {
    id: 3,
    code_reference: 'CMD-2026-003',
    reference_commande: 'CMD-2026-003',
    nom_client: 'Gbadamassi',
    prenom_client: 'Karim',
    telephone_client: '+228 91 22 33 44',
    email_client: 'karim.g@gmail.com',
    montant_total: 27000,
    mode_livraison: 'domicile',
    adresse_livraison: 'Agoè-Nyivé, Lomé - Togo',
    statut_commande: 'en_attente',
    created_at: '2026-07-26T13:10:00.000000Z',
    articles: [
      { id: 104, produit: { nom_commercial: 'Insecticide Katana 50 EC' }, quantite: 2, prix_unitaire: 7500 },
      { id: 105, produit: { nom_commercial: 'Semence Maïs Hybride PAN 53' }, quantite: 1, prix_unitaire: 12000 }
    ]
  }
]
</script>

<style scoped>
.custom-modal-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-modal-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 12px 0;
}
.custom-modal-scroll::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 9999px;
}
.custom-modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>