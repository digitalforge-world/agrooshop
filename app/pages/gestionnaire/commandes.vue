<template>
  <div class="space-y-6">
    
    <!-- En-tête de la Page -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
          <ShoppingBag class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900">Commandes en Ligne</h1>
          <p class="text-xs text-slate-500 mt-0.5">
            Commandes clients affectées à votre boutique — <strong class="text-slate-700">{{ store.boutique?.nom || 'AgroShop' }}</strong>
          </p>
        </div>
      </div>

      <button
        @click="fetchCommandes"
        class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
      >
        <RefreshCw class="w-4 h-4" :class="loading ? 'animate-spin' : ''" />
        <span>Actualiser</span>
      </button>
    </div>

    <!-- Cards KPI -->
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
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Commandes du Jour</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
            📅
          </div>
        </div>
        <p class="text-2xl font-black text-slate-900 font-mono">{{ statsAujourdhui }}</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Livrées & Traitées</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
            ✅
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">{{ statsLivrees }}</p>
      </div>
    </div>

    <!-- Tabs de Sélection & Barre de Recherche -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <!-- Tab Buttons -->
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="activeTab = t.id"
            :class="activeTab === t.id ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span>{{ t.label }}</span>
            <span :class="activeTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'" class="px-2 py-0.5 rounded-full text-[10px] font-mono">
              {{ t.count }}
            </span>
          </button>
        </div>

        <!-- Champ de recherche -->
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par réf, client..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium transition-all"
          />
        </div>

      </div>
    </div>

    <!-- Tableau Moderne des Commandes -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Réf. Commande</th>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Client & Contact</th>
              <th class="px-6 py-4">Mode Livraison</th>
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
                Chargement des commandes...
              </td>
            </tr>
            <tr v-else-if="filteredCommandes.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-slate-500">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-xl">
                  🛒
                </div>
                <p class="font-bold text-slate-700 text-sm">Aucune commande dans cette section</p>
                <p class="text-xs text-slate-400 mt-1">Les commandes passées par les clients s'afficheront ici.</p>
              </td>
            </tr>
            <tr v-else v-for="c in filteredCommandes" :key="c.id" class="hover:bg-slate-50/80 transition-colors">
              
              <!-- Ref Commande -->
              <td class="px-6 py-4">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold">
                  {{ c.code_reference }}
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-slate-500 font-mono text-[11px]">
                {{ formatDate(c.created_at) }}
              </td>

              <!-- Client & Contact -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                    {{ (c.nom_client || 'C')[0] }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900">{{ c.nom_client || 'Client' }} {{ c.prenom_client || '' }}</p>
                    <p v-if="c.telephone" class="text-[10px] text-slate-500 font-mono">{{ c.telephone }}</p>
                  </div>
                </div>
              </td>

              <!-- Option Livraison -->
              <td class="px-6 py-4">
                <span v-if="c.type_livraison === 'domicile'" class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                  🚚 Domicile
                </span>
                <span v-else class="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
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

              <!-- Montant Total -->
              <td class="px-6 py-4 font-mono text-amber-600 font-black text-sm">
                {{ formatPrice(c.montant_total) }} FCFA
              </td>

              <!-- Statut Badge -->
              <td class="px-6 py-4">
                <span v-if="c.statut_commande === 'livree'" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                  <CheckCircle class="w-3 h-3 text-emerald-600" />
                  Livrée / Traitée
                </span>
                <span v-else-if="c.statut_commande === 'expediee'" class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                  🚚 En cours
                </span>
                <span v-else class="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                  ⏳ En attente
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openDetails(c)"
                    title="Voir les détails de la commande"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>Détails</span>
                  </button>

                  <button
                    v-if="c.statut_commande !== 'livree'"
                    @click="marquerLivree(c)"
                    title="Valider la commande"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle class="w-3.5 h-3.5" />
                    <span>Valider</span>
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Détails de Commande -->
    <div v-if="showModal && selectedCommande" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" @click.self="showModal = false">
      <div class="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiche Commande</span>
            <h3 class="text-base font-black text-slate-900 font-mono">{{ selectedCommande.code_reference }}</h3>
          </div>
          <button @click="showModal = false" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Body Modal -->
        <div class="p-6 space-y-5 text-xs">
          
          <!-- Grid Infos Client & Boutique -->
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Informations Client</p>
              <p class="font-bold text-slate-900 text-sm">{{ selectedCommande.nom_client }} {{ selectedCommande.prenom_client }}</p>
              <p class="text-slate-600 font-mono">{{ selectedCommande.telephone || 'Non renseigné' }}</p>
              <p v-if="selectedCommande.adresse_ligne1" class="text-slate-500 mt-1">{{ selectedCommande.adresse_ligne1 }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Boutique de Traitement</p>
              <p class="font-bold text-slate-900 text-sm">{{ selectedCommande.boutique?.nom || store.boutique?.nom || 'AgroShop' }}</p>
              <p class="text-slate-500">{{ selectedCommande.boutique?.adresse || 'Lomé, Togo' }}</p>
              <p class="text-[11px] text-emerald-700 font-bold mt-1">
                Type: {{ selectedCommande.type_livraison === 'domicile' ? '🚚 Livraison Domicile' : '🏢 Retrait Agence' }}
              </p>
            </div>
          </div>

          <!-- Table Articles -->
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Articles Commandés</p>
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-slate-50 uppercase text-[9px] font-mono text-slate-500 border-b border-slate-200">
                  <tr>
                    <th class="px-3 py-2">Produit</th>
                    <th class="px-3 py-2 text-center">Qté</th>
                    <th class="px-3 py-2 text-right">P.U</th>
                    <th class="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <tr v-for="art in selectedCommande.articles" :key="art.id">
                    <td class="px-3 py-2 font-bold text-slate-800">{{ art.nom_produit || art.produit?.nom_commercial || 'Produit' }}</td>
                    <td class="px-3 py-2 text-center font-mono font-bold">{{ art.quantite }}</td>
                    <td class="px-3 py-2 text-right font-mono">{{ formatPrice(art.prix_unitaire) }}</td>
                    <td class="px-3 py-2 text-right font-mono font-bold text-amber-600">{{ formatPrice(art.montant_ligne) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Total -->
          <div class="flex items-baseline justify-between pt-2 border-t border-slate-100">
            <span class="text-sm font-bold text-slate-900">Total Commande :</span>
            <span class="text-xl font-black text-amber-600 font-mono">{{ formatPrice(selectedCommande.montant_total) }} FCFA</span>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button @click="downloadPdf(selectedCommande)" class="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer">
            <Download class="w-4 h-4" /> 📄 Reçu PDF
          </button>

          <div class="flex gap-2">
            <button
              v-if="selectedCommande.statut_commande !== 'livree'"
              @click="marquerLivree(selectedCommande); showModal = false"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle class="w-4 h-4" />
              <span>Valider & Marquer Livrée</span>
            </button>
            <button @click="showModal = false" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer">
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingBag, Search, RefreshCw, CheckCircle, Eye, Download } from 'lucide-vue-next'
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

const showModal = ref(false)
const selectedCommande = ref(null)

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

const openDetails = (c) => {
  selectedCommande.value = c
  showModal.value = true
}

const marquerLivree = async (commande) => {
  try {
    await gestionnaireFetch(`/commandes/${commande.id}/statut`, {
      method: 'POST',
      body: { statut_commande: 'livree' }
    })
    commande.statut_commande = 'livree'
  } catch (e) {
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
