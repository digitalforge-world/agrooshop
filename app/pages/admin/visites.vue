<template>
  <div class="space-y-8">
    
    <!-- Title & Top Header Action Buttons -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
          <Activity class="w-7 h-7 text-emerald-600" />
          <span>Analytique & Clics des Visiteurs</span>
        </h1>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-xs text-slate-600">Rapports d'activité et comportements des clients enregistrés par IP</p>
          <!-- Active Date Filter Pill Badge -->
          <span v-if="startDate || endDate" class="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
            <Calendar class="w-3 h-3" />
            <span>{{ startDate || 'Début' }} ➔ {{ endDate || 'Fin' }}</span>
          </span>
        </div>
      </div>

      <!-- Header Action Buttons Row (Pointed by User Arrow) -->
      <div class="flex items-center gap-3">
        
        <!-- Button 1: Filtrer par Date (Opens Filter Modal) -->
        <button 
          @click="isFilterModalOpen = true" 
          class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <Calendar class="w-4 h-4 text-emerald-600" />
          <span>Filtrer par Date</span>
          <span v-if="startDate || endDate" class="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        <!-- Button 2: Journal des Actions → -->
        <NuxtLink 
          to="/admin/visites/journal" 
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <ListFilter class="w-4 h-4" />
          <span>Journal des Actions →</span>
        </NuxtLink>

        <!-- Button 3: Actualiser les Clics -->
        <button 
          @click="fetchVisits" 
          :disabled="isLoading"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          <span>Actualiser</span>
        </button>

      </div>
    </div>

    <!-- 3 Core Visitor KPIs (Filtered by Date) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      
      <!-- Visites Totales -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Visites & Clics</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Eye class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 font-mono">{{ stats.total_visites || 0 }}</p>
        <div class="text-[11px] text-emerald-700 font-mono">
          Interactions enregistrées dans la période
        </div>
      </div>

      <!-- IP Uniques -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Visiteurs Uniques (IP)</span>
          <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <Globe class="w-4 h-4" />
          </div>
        </div>
        <p class="text-3xl font-black text-purple-700 font-mono">{{ stats.ips_uniques || 0 }}</p>
        <div class="text-[11px] text-slate-500 font-mono">
          Adresses IP distinctes enregistrées
        </div>
      </div>

      <!-- Top Page -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Page la plus populaire</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <FileText class="w-4 h-4" />
          </div>
        </div>
        <p class="text-lg font-black text-slate-900 truncate font-mono">{{ topPages[0]?.page_visitee || '/' }}</p>
        <div class="text-[11px] text-blue-700 font-mono">
          {{ topPages[0]?.total || 0 }} visites enregistrées
        </div>
      </div>

    </div>

    <!-- Top Visitors By IP Table (Click IP to open Modal) -->
    <div class="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 class="text-base font-bold text-slate-900 uppercase tracking-wider">Classement des Visiteurs par Adresse IP</h2>
          <p class="text-xs text-slate-500">Cliquez sur une adresse IP pour ouvrir le modal et voir la totalité de ses actions</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-600 border-b border-slate-200">
            <tr>
              <th class="px-5 py-3.5">Adresse IP Visiteur (Pays)</th>
              <th class="px-5 py-3.5">Total Actions</th>
              <th class="px-5 py-3.5">Pages Vues</th>
              <th class="px-5 py-3.5">Clics Produits</th>
              <th class="px-5 py-3.5">Ajouts Panier</th>
              <th class="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="visiteur in visiteursParIp" :key="visiteur.ip_adresse" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-5 py-3.5 font-mono">
                <button 
                  @click="openIpModal(visiteur.ip_adresse)" 
                  class="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-2 group"
                >
                  <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{{ visiteur.ip_formatted || `${visiteur.ip_adresse} (🇹🇬)` }}</span>
                  <ExternalLink class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </td>
              <td class="px-5 py-3.5 font-bold text-slate-900 font-mono text-sm">
                {{ visiteur.total_actions }}
              </td>
              <td class="px-5 py-3.5 font-mono text-slate-700">
                {{ visiteur.nb_pages || 0 }}
              </td>
              <td class="px-5 py-3.5 font-mono text-blue-700 font-bold">
                {{ visiteur.nb_clics_produits || 0 }}
              </td>
              <td class="px-5 py-3.5 font-mono text-amber-700 font-bold">
                {{ visiteur.nb_ajouts_panier || 0 }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <button 
                  @click="openIpModal(visiteur.ip_adresse)" 
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Voir Journal IP →
                </button>
              </td>
            </tr>
            <tr v-if="visiteursParIp.length === 0">
              <td colspan="6" class="px-5 py-8 text-center text-slate-500 font-mono">
                Aucune activité enregistrée sur cet intervalle de date.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: Date Range Filter Modal -->
    <Teleport to="body">
      <div v-if="isFilterModalOpen" class="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden flex flex-col text-slate-800">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar class="w-5 h-5 text-emerald-600" />
                <span>Filtrer les Rapports par Date</span>
              </h3>
              <p class="text-xs text-slate-500">Sélectionnez la période d'analyse pour évaluer les tendances clients</p>
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

          <!-- Custom Dates Picker -->
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

          <!-- Modal Action Footer Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-200">
            <button 
              @click="resetDates" 
              class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Réinitialiser
            </button>

            <button 
              @click="applyFilterModal" 
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Appliquer le Filtre
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Modal 2: IP Activity History Details Table -->
    <Teleport to="body">
      <div v-if="selectedIp" class="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Journal d'Activité de l'IP :</span>
                <span class="text-emerald-700 font-mono">{{ modalData?.ip_formatted || `${selectedIp} (🇹🇬)` }}</span>
              </h3>
              <p class="text-xs text-slate-500">Historique complet des clics et comportements de ce client</p>
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
          <div v-if="modalLoading" class="py-12 text-center text-xs text-slate-500 font-mono">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Chargement du journal IP...
          </div>

          <div v-else-if="modalData?.logs?.length > 0" class="flex-1 overflow-y-auto rounded-xl border border-slate-200">
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
import { Activity, Eye, Globe, FileText, RefreshCw, Calendar, ListFilter, ExternalLink, X } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/visites',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Analytique Visiteurs & IP - AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isLoading = ref(true)
const isFilterModalOpen = ref(false)
const startDate = ref('')
const endDate = ref('')

const stats = ref({ total_visites: 0, ips_uniques: 0 })
const topPages = ref([])
const visiteursParIp = ref([])

const selectedIp = ref(null)
const modalLoading = ref(false)
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
  fetchVisits()
}

const resetDates = () => {
  startDate.value = ''
  endDate.value = ''
  isFilterModalOpen.value = false
  fetchVisits()
}

const fetchVisits = async () => {
  isLoading.value = true
  try {
    const query = new URLSearchParams()
    if (startDate.value) query.append('start_date', startDate.value)
    if (endDate.value) query.append('end_date', endDate.value)

    const res = await $fetch(`${config.public.apiBaseUrl}/admin/visites?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (res?.data) {
      stats.value = res.data.stats || {}
      topPages.value = res.data.top_pages || []
      visiteursParIp.value = res.data.visiteurs_par_ip || []
    }
  } catch (e) {
    console.error('Erreur lors du chargement des visites', e)
  }
  isLoading.value = false
}

const openIpModal = async (ip) => {
  selectedIp.value = ip
  modalLoading.value = true
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
  modalLoading.value = false
}

onMounted(() => {
  fetchVisits()
})
</script>
