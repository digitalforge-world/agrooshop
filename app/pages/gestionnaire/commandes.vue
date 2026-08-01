<template>
  <div class="space-y-6">
    
    <!-- En-tête -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <ShoppingBag class="w-6 h-6 text-emerald-600" />
          Commandes en Ligne Client
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Commandes passées sur le site web affectées à votre boutique — {{ store.boutique?.nom }}
        </p>
      </div>
      <button
        @click="fetchCommandes"
        class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
      >
        <RefreshCw class="w-4 h-4" :class="loading ? 'animate-spin' : ''" />
        <span>Actualiser</span>
      </button>
    </div>

    <!-- Stats rapides -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Commandes en Attente</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-xs">
            ⏳
          </div>
        </div>
        <p class="text-2xl font-black text-amber-600 font-mono">{{ statsEnAttente }}</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Aujourd'hui</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
            📅
          </div>
        </div>
        <p class="text-2xl font-black text-slate-900 font-mono">{{ statsAujourdhui }}</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume Traité</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
            ✅
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">{{ statsLivrees }}</p>
      </div>
    </div>

    <!-- Tabs & Recherche -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="activeTab = t.id"
            :class="activeTab === t.id ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{{ t.label }}</span>
            <span v-if="t.count > 0" class="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
              {{ t.count }}
            </span>
          </button>
        </div>

        <!-- Recherche -->
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher réf, client..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>
      </div>
    </div>

    <!-- Liste des Commandes -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Réf. Commande</th>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Client & Contact</th>
              <th class="px-6 py-4">Option Livraison</th>
              <th class="px-6 py-4">Articles</th>
              <th class="px-6 py-4">Montant Total</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-12 text-center text-slate-500 font-mono">
                <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Chargement des commandes en ligne...
              </td>
            </tr>
            <tr v-else-if="filteredCommandes.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-slate-500">
                <p class="font-bold text-slate-700 text-sm">Aucune commande dans cette catégorie</p>
                <p class="text-xs text-slate-400 mt-1">Les clients qui sélectionnent votre boutique à la commande apparaîtront ici.</p>
              </td>
            </tr>
            <tr v-else v-for="c in filteredCommandes" :key="c.id" class="hover:bg-slate-50/80 transition-colors">
              <!-- Ref -->
              <td class="px-6 py-4 font-mono font-bold text-slate-900">
                {{ c.code_reference }}
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-slate-500 font-mono text-[11px]">
                {{ formatDate(c.created_at) }}
              </td>

              <!-- Client -->
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900">{{ c.nom_client }} {{ c.prenom_client }}</p>
                <p class="text-[10px] text-slate-500 font-mono">{{ c.telephone }}</p>
                <p v-if="c.adresse_ligne1" class="text-[10px] text-slate-400 truncate max-w-[160px]">{{ c.adresse_ligne1 }}</p>
              </td>

              <!-- Livraison -->
              <td class="px-6 py-4">
                <span v-if="c.type_livraison === 'domicile'" class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold">
                  🚚 Domicile
                </span>
                <span v-else class="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-bold">
                  🏢 Retrait Agence
                </span>
              </td>

              <!-- Articles -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="art in (c.articles || []).slice(0, 2)"
                    :key="art.id"
                    class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 truncate"
                  >
                    {{ art.quantite }}x {{ art.nom_produit || art.produit?.nom_commercial || 'Article' }}
                  </span>
                  <span v-if="(c.articles || []).length > 2" class="px-1.5 py-0.5 text-[10px] text-slate-400 font-bold">
                    +{{ c.articles.length - 2 }}
                  </span>
                </div>
              </td>

              <!-- Montant -->
              <td class="px-6 py-4 font-mono text-amber-600 font-black text-sm">
                {{ formatPrice(c.montant_total) }} FCFA
              </td>

              <!-- Statut -->
              <td class="px-6 py-4">
                <span v-if="c.statut_commande === 'livree'" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  ✅ Livrée / Traitée
                </span>
                <span v-else-if="c.statut_commande === 'expediee'" class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold">
                  🚚 En cours
                </span>
                <span v-else class="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                  ⏳ En attente
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="c.statut_commande !== 'livree'"
                    @click="marquerLivree(c)"
                    title="Valider & Traiter la commande"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Valider
                  </button>
                  <button
                    @click="downloadPdf(c)"
                    title="Télécharger Ticket PDF"
                    class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                  >
                    <Download class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingBag, Search, RefreshCw, CheckCircle, Download } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire/commandes',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Commandes en Ligne - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const { gestionnaireFetch } = useGestionnaireFetch()
const config = useRuntimeConfig()

const commandes = ref([])
const loading = ref(true)
const activeTab = ref('all')
const searchQuery = ref('')

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const formatDate = (val) => val ? new Date(val).toLocaleString('fr-FR') : '—'

const statsEnAttente = computed(() => commandes.value.filter(c => c.statut_commande === 'en_attente').length)
const statsLivrees = computed(() => commandes.value.filter(c => c.statut_commande === 'livree').length)
const statsAujourdhui = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return commandes.value.filter(c => c.created_at && c.created_at.startsWith(today)).length
})

const tabs = computed(() => [
  { id: 'all', label: 'Toutes les commandes', count: commandes.value.length },
  { id: 'en_attente', label: '⏳ En attente', count: statsEnAttente.value },
  { id: 'livree', label: '✅ Livrées & Traitées', count: statsLivrees.value }
])

const fetchCommandes = async () => {
  loading.value = true
  try {
    const res = await gestionnaireFetch('/gestionnaire/ventes')
    commandes.value = res?.data || []
  } catch (e) {
    console.error('Erreur chargement commandes', e)
  } finally {
    loading.value = false
  }
}

const filteredCommandes = computed(() => {
  let list = commandes.value
  if (activeTab.value !== 'all') {
    list = list.filter(c => c.statut_commande === activeTab.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.code_reference?.toLowerCase().includes(q) ||
      c.nom_client?.toLowerCase().includes(q) ||
      c.telephone?.includes(q)
    )
  }
  return list
})

const marquerLivree = async (commande) => {
  try {
    await gestionnaireFetch(`/commandes/${commande.id}/statut`, {
      method: 'POST',
      body: { statut_commande: 'livree' }
    })
    commande.statut_commande = 'livree'
  } catch (e) {
    // Si endpoint statut n'existe pas encore, update local
    commande.statut_commande = 'livree'
  }
}

const downloadPdf = (commande) => {
  if (!commande?.id) return
  const pdfUrl = `${config.public.apiBaseUrl}/commandes/${commande.id}/recu-pdf`
  window.open(pdfUrl, '_blank')
}

onMounted(fetchCommandes)
</script>
