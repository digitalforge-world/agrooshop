<template>
  <div class="h-[calc(100vh-6rem)] flex flex-col space-y-6 overflow-hidden">
    
    <!-- Title & Top Header Action Buttons (Fixed Flex Header) -->
    <div class="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <NuxtLink to="/admin/visites" class="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:underline mb-2">
          <ArrowLeft class="w-4 h-4" />
          <span>Retour aux Statistiques Visiteurs</span>
        </NuxtLink>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <ListFilter class="w-7 h-7 text-emerald-600" />
          <span>Journal Complet des Clics & Actions</span>
        </h1>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-xs text-slate-600">Historique chronologique exhaustif de toutes les activités par intervalle de date et IP</p>
          <!-- Active Filter Pill Badges -->
          <span v-if="startDate || endDate || actionFilter || ipFilter" class="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
            <SlidersHorizontal class="w-3 h-3" />
            <span>Filtres Actifs</span>
          </span>
        </div>
      </div>

      <!-- Top Header Buttons Row -->
      <div class="flex items-center gap-3">
        
        <!-- Button 1: Filtrer le Journal (Opens Filter Modal) -->
        <button 
          @click="isFilterModalOpen = true" 
          class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <SlidersHorizontal class="w-4 h-4 text-emerald-600" />
          <span>Filtrer le Journal</span>
          <span v-if="startDate || endDate || actionFilter || ipFilter" class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        <!-- Button 2: Actualiser le Journal -->
        <button 
          @click="fetchLogs" 
          :disabled="isLoading"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          <span>Actualiser</span>
        </button>

      </div>
    </div>

    <!-- Full Actions Table Container (Independently Scrollable) -->
    <div class="flex-1 min-h-0 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-xs overflow-hidden">
      
      <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center text-xs text-slate-500 font-mono">
        <div class="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        Chargement du journal d'activités...
      </div>

      <div v-else-if="logs.length > 0" class="flex-1 overflow-y-auto rounded-2xl border border-slate-200">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th class="px-5 py-3.5">Heure / Date</th>
              <th class="px-5 py-3.5">Adresse IP (Pays)</th>
              <th class="px-5 py-3.5">Page</th>
              <th class="px-5 py-3.5">Type d'Action</th>
              <th class="px-5 py-3.5">Détails de l'Interaction</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-5 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                {{ formatDate(log.created_at) }}
              </td>
              <td class="px-5 py-3.5 font-mono whitespace-nowrap">
                <button 
                  @click="openIpModal(log.ip_adresse)" 
                  class="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{{ log.ip_formatted || `${log.ip_adresse} (🇹🇬)` }}</span>
                </button>
              </td>
              <td class="px-5 py-3.5 font-mono text-slate-900 whitespace-nowrap">
                {{ log.page_visitee }}
              </td>
              <td class="px-5 py-3.5 whitespace-nowrap">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border"
                  :class="getActionBadgeClass(log.type_action)"
                >
                  {{ log.type_action }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-slate-600 font-mono text-[11px]">
                {{ log.details || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="flex-1 flex items-center justify-center text-xs text-slate-500 font-mono">
        Aucune action enregistrée pour les critères sélectionnés.
      </div>

    </div>

    <!-- Modal 1: Journal Filter Modal -->
    <Teleport to="body">
      <div v-if="isFilterModalOpen" class="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden flex flex-col text-slate-800">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal class="w-5 h-5 text-emerald-600" />
                <span>Filtrer le Journal des Clics</span>
              </h3>
              <p class="text-xs text-slate-500">Combinez date, types d'actions et adresses IP pour afiner le rapport</p>
            </div>
            <button @click="isFilterModalOpen = false" class="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Quick Presets -->
          <div class="space-y-2">
            <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Périodes Préconisées</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                @click="setThisMonth" 
                class="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Ce Mois-ci
              </button>
              <button 
                @click="setLastMonth" 
                class="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Mois Dernier
              </button>
              <button 
                @click="setLast30Days" 
                class="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                30 Derniers Jours
              </button>
            </div>
          </div>

          <!-- Date pickers -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Date de Début</label>
              <input 
                v-model="startDate" 
                type="date" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
              />
            </div>
            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Date de Fin</label>
              <input 
                v-model="endDate" 
                type="date" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <!-- Action type & IP Filters -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Type d'Action</label>
              <select 
                v-model="actionFilter" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-medium"
              >
                <option value="">Toutes les actions</option>
                <option value="visite_page">Page vue (visite_page)</option>
                <option value="clic_produit">Clic Produit (clic_produit)</option>
                <option value="ajout_panier">Ajout Panier (ajout_panier)</option>
                <option value="modification_quantite">Quantité Panier (modification_quantite)</option>
                <option value="suppression_panier">Suppression Panier (suppression_panier)</option>
                <option value="acces_checkout">Accès Caisse (acces_checkout)</option>
                <option value="validation_commande">Commande Validée (validation_commande)</option>
                <option value="clic_whatsapp">Commande WhatsApp (clic_whatsapp)</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Adresse IP</label>
              <div class="relative">
                <input 
                  v-model="ipFilter" 
                  type="text" 
                  placeholder="Ex: 127.0.0.1" 
                  class="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />
                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <!-- Modal Action Footer Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-200">
            <button 
              @click="resetFilters" 
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Réinitialiser les Filtres
            </button>

            <button 
              @click="applyFilterModal" 
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Appliquer les Filtres
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Modal 2: IP Details Modal -->
    <Teleport to="body">
      <div v-if="selectedIp" class="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Historique IP :</span>
                <span class="text-emerald-700 font-mono">{{ modalData?.ip_formatted || selectedIp }}</span>
              </h3>
              <p class="text-xs text-slate-500">Synthèse de toutes les interactions de cet utilisateur</p>
            </div>
            <button @click="selectedIp = null" class="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- IP Stats -->
          <div class="grid grid-cols-4 gap-3">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Pages Vues</p>
              <p class="text-lg font-black text-slate-900 font-mono mt-1">{{ modalData?.stats?.nb_pages || 0 }}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Clics Produits</p>
              <p class="text-lg font-black text-blue-700 font-mono mt-1">{{ modalData?.stats?.nb_clics_produits || 0 }}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p class="text-[10px] font-bold text-slate-500 uppercase">Ajouts Panier</p>
              <p class="text-lg font-black text-amber-700 font-mono mt-1">{{ modalData?.stats?.nb_ajouts_panier || 0 }}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <p class="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</p>
              <p class="text-lg font-black text-emerald-700 font-mono mt-1">{{ modalData?.stats?.nb_whatsapp || 0 }}</p>
            </div>
          </div>

          <!-- IP Log Table -->
          <div v-if="modalData?.logs?.length > 0" class="flex-1 overflow-y-auto rounded-xl border border-slate-200">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th class="px-4 py-3">Heure / Date</th>
                  <th class="px-4 py-3">Page Visitée</th>
                  <th class="px-4 py-3">Type d'Action</th>
                  <th class="px-4 py-3">Détails de l'Interaction</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr v-for="item in modalData.logs" :key="item.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {{ formatDate(item.created_at) }}
                  </td>
                  <td class="px-4 py-3 font-mono text-slate-900 whitespace-nowrap">
                    {{ item.page_visitee }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase border" :class="getActionBadgeClass(item.type_action)">
                      {{ item.type_action }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-slate-600 font-mono text-[11px]">
                    {{ item.details || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
            Aucun détail supplémentaire disponible pour cette IP.
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, ListFilter, Calendar, Search, RefreshCw, SlidersHorizontal, X } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/visites/journal',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Journal Complet des Actions - AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isLoading = ref(true)
const isFilterModalOpen = ref(false)

const startDate = ref('')
const endDate = ref('')
const actionFilter = ref('')
const ipFilter = ref('')
const logs = ref([])

const selectedIp = ref(null)
const modalData = ref(null)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getActionBadgeClass = (action) => {
  switch (action) {
    case 'visite_page': return 'bg-slate-800 text-slate-300 border-slate-700'
    case 'clic_produit': return 'bg-blue-950 text-blue-400 border-blue-500/30'
    case 'ajout_panier': return 'bg-amber-950 text-amber-400 border-amber-500/30'
    case 'modification_quantite': return 'bg-indigo-950 text-indigo-400 border-indigo-500/30'
    case 'suppression_panier': return 'bg-rose-950 text-rose-400 border-rose-500/30'
    case 'acces_checkout': return 'bg-sky-950 text-sky-400 border-sky-500/30'
    case 'validation_commande': return 'bg-emerald-950 text-emerald-300 border-emerald-500/40 font-black'
    case 'clic_whatsapp': return 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
    case 'recherche': return 'bg-purple-950 text-purple-400 border-purple-500/30'
    default: return 'bg-slate-800 text-slate-300 border-slate-700'
  }
}

const setThisMonth = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = now.toISOString().split('T')[0]
}

const setLastMonth = () => {
  const now = new Date()
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  startDate.value = firstDayLastMonth.toISOString().split('T')[0]
  endDate.value = lastDayLastMonth.toISOString().split('T')[0]
}

const setLast30Days = () => {
  const now = new Date()
  const past30 = new Date()
  past30.setDate(now.getDate() - 30)
  startDate.value = past30.toISOString().split('T')[0]
  endDate.value = now.toISOString().split('T')[0]
}

const applyFilterModal = () => {
  isFilterModalOpen.value = false
  fetchLogs()
}

const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
  actionFilter.value = ''
  ipFilter.value = ''
  isFilterModalOpen.value = false
  fetchLogs()
}

const fetchLogs = async () => {
  isLoading.value = true
  try {
    const query = new URLSearchParams()
    if (startDate.value) query.append('start_date', startDate.value)
    if (endDate.value) query.append('end_date', endDate.value)
    if (actionFilter.value) query.append('type_action', actionFilter.value)
    if (ipFilter.value) query.append('ip', ipFilter.value)
    query.append('per_page', '50')

    const res = await $fetch(`${config.public.apiBaseUrl}/admin/visites?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (res?.data) {
      logs.value = res.data.logs?.data || res.data.logs || []
    }
  } catch (e) {
    console.error('Erreur du journal de logs', e)
  }
  isLoading.value = false
}

const openIpModal = async (ip) => {
  selectedIp.value = ip
  modalData.value = null
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/visites/ip-details?ip=${encodeURIComponent(ip)}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (res?.data) {
      modalData.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchLogs()
})
</script>
