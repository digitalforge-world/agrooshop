<template>
  <div class="space-y-6">
    
    <!-- En-tête -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <History class="w-6 h-6 text-emerald-600" />
          Historique des Ventes
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Journal complet des encaissements réalisés dans votre boutique — {{ store.boutique?.nom }}
        </p>
      </div>
      <NuxtLink
        to="/gestionnaire/ventes"
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
      >
        <ShoppingCart class="w-4 h-4" />
        <span>Nouvelle Vente Caisse</span>
      </NuxtLink>
    </div>

    <!-- Cards KPI -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Chiffre d'Affaires</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-amber-600 font-mono">
          {{ formatPrice(stats.ca_total) }} <span class="text-xs text-slate-400 font-normal">FCFA</span>
        </p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventes Réalisées</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Receipt class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-slate-900 font-mono">{{ stats.nombre_ventes || 0 }}</p>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Panier Moyen</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CreditCard class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">
          {{ formatPrice(stats.panier_moyen) }} <span class="text-xs text-slate-400 font-normal">FCFA</span>
        </p>
      </div>
    </div>

    <!-- Filtres & Recherche -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="relative sm:col-span-2">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            @input="debouncedFetch"
            type="text"
            placeholder="Rechercher par référence (ex: B3-A19), nom client ou téléphone..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
          />
        </div>

        <div class="relative">
          <Calendar class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            v-model="selectedDate"
            @change="fetchHistory"
            type="date"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-medium"
          />
        </div>
      </div>

      <div v-if="searchQuery || selectedDate" class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <span class="text-slate-500">Filtres actifs</span>
        <button @click="resetFilters" class="text-rose-600 font-bold hover:underline cursor-pointer">
          Réinitialiser les filtres
        </button>
      </div>
    </div>

    <!-- Tableau de l'Historique -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Réf. Reçu</th>
              <th class="px-6 py-4">Date & Heure</th>
              <th class="px-6 py-4">Client</th>
              <th class="px-6 py-4">Articles Vendus</th>
              <th class="px-6 py-4">Montant Total</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-12 text-center text-slate-500 font-mono">
                <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Chargement de l'historique...
              </td>
            </tr>
            <tr v-else-if="ventes.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                <p class="font-bold text-slate-700 text-sm">Aucune vente trouvée</p>
                <p class="text-xs text-slate-400 mt-1">Les ventes enregistrées en caisse s'afficheront ici.</p>
              </td>
            </tr>
            <tr v-else v-for="v in ventes" :key="v.id" class="hover:bg-slate-50/80 transition-colors">
              <!-- Réf -->
              <td class="px-6 py-4 font-mono font-bold text-slate-900">
                {{ v.code_reference }}
              </td>

              <!-- Date -->
              <td class="px-6 py-4 text-slate-500 font-mono text-[11px]">
                {{ formatDate(v.created_at) }}
              </td>

              <!-- Client -->
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900">{{ v.nom_client || 'Client Comptoir' }} {{ v.prenom_client || '' }}</p>
                <p v-if="v.telephone" class="text-[10px] text-slate-400 font-mono">{{ v.telephone }}</p>
              </td>

              <!-- Articles -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1 max-w-xs">
                  <span
                    v-for="art in (v.articles || []).slice(0, 3)"
                    :key="art.id"
                    class="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 truncate"
                  >
                    {{ art.quantite }}x {{ art.nom_produit || art.produit?.nom_commercial || 'Article' }}
                  </span>
                  <span v-if="(v.articles || []).length > 3" class="px-1.5 py-0.5 text-[10px] text-slate-400 font-bold">
                    +{{ v.articles.length - 3 }} autre(s)
                  </span>
                </div>
              </td>

              <!-- Montant -->
              <td class="px-6 py-4 font-mono text-amber-600 font-black text-sm">
                {{ formatPrice(v.montant_total) }} FCFA
              </td>

              <!-- Statut -->
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                  <CheckCircle class="w-3 h-3 text-emerald-600" />
                  Payé & Livré
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openReceipt(v)"
                    title="Voir Reçu Ticket"
                    class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="downloadPdf(v)"
                    title="Télécharger PDF 80mm"
                    class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer border border-emerald-200"
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

    <!-- Modal Reçu de Caisse POS (Printable Ticket) -->
    <div v-if="showReceiptModal && selectedVente" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white text-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 print:p-0 print:shadow-none print:w-full print:max-w-none">
        
        <!-- Ticket printable area -->
        <div id="printable-receipt" class="space-y-4 text-xs font-mono">
          <!-- Header -->
          <div class="text-center border-b border-dashed border-slate-300 pb-3">
            <h2 class="text-lg font-black tracking-wider uppercase">🌱 AGROSHOP TOGO</h2>
            <p class="text-[10px] text-slate-600 font-sans font-semibold">Produits Agricoles & Quincaillerie</p>
            <p class="text-[11px] font-bold text-slate-800 mt-1">{{ selectedVente.boutique?.nom || store.boutique?.nom || 'Boutique Agroshop' }}</p>
            <p class="text-[10px] text-slate-500">{{ selectedVente.boutique?.adresse || 'Lomé, Togo' }} | Tél: {{ selectedVente.boutique?.telephone || '+228 90 00 00 00' }}</p>
          </div>

          <!-- Metadonnées Vente -->
          <div class="text-[11px] space-y-1 border-b border-dashed border-slate-300 pb-3">
            <div class="flex justify-between">
              <span class="text-slate-500">Réf. Reçu:</span>
              <span class="font-bold font-mono">{{ selectedVente.code_reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Date & Heure:</span>
              <span>{{ formatDate(selectedVente.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Client:</span>
              <span class="font-bold">{{ selectedVente.nom_client || 'Client Comptoir' }} {{ selectedVente.prenom_client || '' }}</span>
            </div>
            <div v-if="selectedVente.telephone" class="flex justify-between">
              <span class="text-slate-500">Tél Client:</span>
              <span>{{ selectedVente.telephone }}</span>
            </div>
          </div>

          <!-- Table des Articles -->
          <div class="border-b border-dashed border-slate-300 pb-3">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <th class="pb-1">Art.</th>
                  <th class="pb-1 text-center">Qté</th>
                  <th class="pb-1 text-right">P.U</th>
                  <th class="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in selectedVente.articles" :key="item.id">
                  <td class="py-1.5 font-bold truncate max-w-[140px]">{{ item.nom_produit || item.produit?.nom_commercial || 'Produit' }}</td>
                  <td class="py-1.5 text-center font-semibold">{{ item.quantite }}</td>
                  <td class="py-1.5 text-right">{{ formatPrice(item.prix_unitaire) }}</td>
                  <td class="py-1.5 text-right font-bold">{{ formatPrice(item.montant_ligne) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totaux -->
          <div class="space-y-1 text-[12px] pt-1">
            <div class="flex justify-between font-black text-sm text-slate-900 border-t border-slate-900 pt-2">
              <span>TOTAL PAYÉ :</span>
              <span>{{ formatPrice(selectedVente.montant_total) }} FCFA</span>
            </div>
            <div class="flex justify-between text-[10px] text-slate-500">
              <span>Mode de règlement:</span>
              <span class="font-bold text-slate-700">Espèces (Comptoir)</span>
            </div>
          </div>

          <!-- Footer Ticket -->
          <div class="text-center pt-4 border-t border-dashed border-slate-300">
            <p class="text-[10px] font-bold text-slate-700">Merci pour votre confiance ! 🙏</p>
            <p class="text-[9px] text-slate-400 mt-0.5">Agroshop - La qualité au service de l'agriculture</p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-6 flex flex-wrap gap-2 print:hidden">
          <button @click="downloadPdf(selectedVente)" class="flex-1 min-w-[140px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer">
            <Download class="w-4 h-4" /> 📄 Reçu PDF
          </button>
          <button @click="printCurrentReceipt" class="py-3 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <Printer class="w-4 h-4" /> Imprimer
          </button>
          <button @click="showReceiptModal = false" class="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer">
            Fermer
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  History, ShoppingCart, TrendingUp, Receipt, CreditCard,
  Search, Calendar, CheckCircle, Eye, Download, Printer
} from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire/historique-ventes',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Historique des Ventes - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const { gestionnaireFetch } = useGestionnaireFetch()
const config = useRuntimeConfig()

const ventes = ref([])
const stats = ref({ ca_total: 0, nombre_ventes: 0, panier_moyen: 0 })
const loading = ref(true)

const searchQuery = ref('')
const selectedDate = ref('')

const showReceiptModal = ref(false)
const selectedVente = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const formatDate = (val) => val ? new Date(val).toLocaleString('fr-FR') : '—'

let timer = null
const debouncedFetch = () => {
  clearTimeout(timer)
  timer = setTimeout(fetchHistory, 300)
}

const fetchHistory = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (selectedDate.value) params.append('date', selectedDate.value)

    const url = `/gestionnaire/ventes?${params.toString()}`
    const res = await gestionnaireFetch(url)

    ventes.value = res?.data || []
    stats.value = res?.stats || { ca_total: 0, nombre_ventes: 0, panier_moyen: 0 }
  } catch (e) {
    console.error('Erreur historique', e)
    ventes.value = []
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedDate.value = ''
  fetchHistory()
}

const openReceipt = (vente) => {
  selectedVente.value = vente
  showReceiptModal.value = true
}

const downloadPdf = (vente) => {
  if (!vente?.id) return
  const pdfUrl = `${config.public.apiBaseUrl}/commandes/${vente.id}/recu-pdf`
  window.open(pdfUrl, '_blank')
}

const printCurrentReceipt = () => {
  if (process.client) window.print()
}

onMounted(fetchHistory)
</script>
