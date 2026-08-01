<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
        <ShoppingCart class="w-6 h-6 text-emerald-600" />
        Caisse / Enregistrer une Vente
      </h1>
      <p class="text-xs text-slate-500 mt-1">Sélectionnez les produits affectés à votre boutique et validez la vente avec impression du reçu</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <!-- Catalogue (à gauche) -->
      <div class="lg:col-span-3 space-y-4">
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un produit dans votre boutique..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          <div
            v-for="item in filteredStock"
            :key="item.produit_id"
            @click="addToCart(item)"
            class="bg-white border border-slate-200/80 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all hover:bg-emerald-50/30 group shadow-xs"
            :class="(item.quantite_en_stock ?? item.stock_disponible ?? 0) <= 0 ? 'opacity-40 cursor-not-allowed' : ''"
          >
            <p class="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2">{{ item.produit?.nom_commercial }}</p>
            <p class="text-[10px] text-slate-500 mt-1">Stock boutique: <span class="font-bold text-emerald-700 font-mono">{{ item.quantite_en_stock ?? item.stock_disponible ?? 0 }} {{ item.produit?.unite_mesure || 'unités' }}</span></p>
            <p class="text-sm font-black text-amber-600 font-mono mt-2">{{ formatPrice(item.produit?.prix_unitaire) }} <span class="text-[10px] text-slate-400 font-normal">FCFA</span></p>
          </div>
        </div>
      </div>

      <!-- Panier / Caisse (à droite) -->
      <div class="lg:col-span-2">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 sticky top-6 shadow-xs">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShoppingCart class="w-4 h-4 text-emerald-600" />
            Panier Caisse
          </h2>
          
          <!-- Empty cart -->
          <div v-if="cart.length === 0" class="py-8 text-center text-slate-400 text-xs">
            Cliquez sur un produit affecté à votre boutique pour l'ajouter
          </div>

          <!-- Cart items -->
          <div v-else class="space-y-2 mb-4 max-h-60 overflow-y-auto">
            <div v-for="(item, idx) in cart" :key="idx" class="flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-xl">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-900 truncate">{{ item.nom }}</p>
                <p class="text-[10px] text-slate-500 font-mono">{{ formatPrice(item.prix_unitaire) }} FCFA</p>
              </div>
              <div class="flex items-center gap-1.5">
                <button @click="changeQty(idx, -1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 flex items-center justify-center cursor-pointer">-</button>
                <span class="text-xs font-bold text-slate-900 w-5 text-center font-mono">{{ item.quantite }}</span>
                <button @click="changeQty(idx, 1)" class="w-6 h-6 rounded bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 flex items-center justify-center cursor-pointer">+</button>
              </div>
              <button @click="removeFromCart(idx)" class="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Total -->
          <div v-if="cart.length > 0" class="border-t border-slate-100 pt-3 mb-4">
            <div class="flex justify-between text-xs text-slate-500 mb-1">
              <span>{{ totalQty }} article(s)</span>
              <span>Sous-total</span>
            </div>
            <div class="flex justify-between items-baseline">
              <span class="text-sm font-bold text-slate-900">Total à encaisser</span>
              <span class="text-xl font-black text-amber-600 font-mono">{{ formatPrice(totalMontant) }} <span class="text-xs text-slate-400 font-normal">FCFA</span></span>
            </div>
          </div>

          <!-- Client Info -->
          <div v-if="cart.length > 0" class="space-y-3 mb-4">
            <input v-model="nomClient" type="text" placeholder="Nom du client (ex: Jean Koffi)" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white" />
            <input v-model="telephoneClient" type="tel" placeholder="Téléphone client (ex: +228 90 12 34 56)" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white" />
          </div>

          <!-- Success banner -->
          <div v-if="venteSuccess" class="mb-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            {{ venteSuccess }}
          </div>

          <!-- Validate button -->
          <button
            @click="validerVente"
            :disabled="cart.length === 0 || saving"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>{{ saving ? 'Enregistrement de la vente...' : '🧾 Encaisser & Générer le Reçu' }}</span>
          </button>
        </div>
      </div>

    </div>

    <!-- Modal Reçu de Caisse POS (Printable Ticket) -->
    <div v-if="showReceiptModal && receiptData" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div class="bg-white text-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 print:p-0 print:shadow-none print:w-full print:max-w-none">
        
        <!-- Ticket printable area -->
        <div id="printable-receipt" class="space-y-4 text-xs font-mono">
          <!-- Header -->
          <div class="text-center border-b border-dashed border-slate-300 pb-3">
            <h2 class="text-lg font-black tracking-wider uppercase">🌱 AGROSHOP TOGO</h2>
            <p class="text-[10px] text-slate-600 font-sans font-semibold">Produits Agricoles & Quincaillerie</p>
            <p class="text-[11px] font-bold text-slate-800 mt-1">{{ receiptData.boutique?.nom || 'Boutique Agroshop' }}</p>
            <p class="text-[10px] text-slate-500">{{ receiptData.boutique?.adresse || 'Lomé, Togo' }} | Tél: {{ receiptData.boutique?.telephone || '+228 90 00 00 00' }}</p>
          </div>

          <!-- Metadonnées Vente -->
          <div class="text-[11px] space-y-1 border-b border-dashed border-slate-300 pb-3">
            <div class="flex justify-between">
              <span class="text-slate-500">Réf. Reçu:</span>
              <span class="font-bold font-mono">{{ receiptData.code_reference }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Date & Heure:</span>
              <span>{{ new Date(receiptData.created_at || Date.now()).toLocaleString('fr-FR') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Client:</span>
              <span class="font-bold">{{ receiptData.nom_client || 'Client Comptoir' }} {{ receiptData.prenom_client || '' }}</span>
            </div>
            <div v-if="receiptData.telephone" class="flex justify-between">
              <span class="text-slate-500">Tél Client:</span>
              <span>{{ receiptData.telephone }}</span>
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
                <tr v-for="item in receiptData.articles" :key="item.id">
                  <td class="py-1.5 font-bold truncate max-w-[140px]">{{ item.produit?.nom_commercial || 'Produit' }}</td>
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
              <span>{{ formatPrice(receiptData.montant_total) }} FCFA</span>
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

        <!-- Buttons (Hidden in print) -->
        <div class="mt-6 flex gap-3 print:hidden">
          <button @click="printReceipt" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Printer class="w-4 h-4" /> Imprimer le Reçu
          </button>
          <button @click="showReceiptModal = false" class="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors">
            Fermer
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingCart, Search, X, CheckCircle, Printer } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire/ventes',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Caisse / Ventes - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const { gestionnaireFetch } = useGestionnaireFetch()

const stock = ref([])
const cart = ref([])
const searchQuery = ref('')
const nomClient = ref('')
const telephoneClient = ref('')
const saving = ref(false)
const venteSuccess = ref(null)
const showReceiptModal = ref(false)
const receiptData = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const fetchStock = async () => {
  try {
    const res = await gestionnaireFetch('/gestionnaire/stock')
    stock.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) { stock.value = [] }
}

const filteredStock = computed(() => {
  const s = stock.value.filter(i => (i.quantite_en_stock ?? i.stock_disponible ?? 0) > 0)
  if (!searchQuery.value) return s
  const q = searchQuery.value.toLowerCase()
  return s.filter(i => i.produit?.nom_commercial?.toLowerCase().includes(q))
})

const addToCart = (item) => {
  const availableStock = item.quantite_en_stock ?? item.stock_disponible ?? 0
  if (availableStock <= 0) return
  const existing = cart.value.find(c => c.produit_id === item.produit_id)
  if (existing) {
    if (existing.quantite < availableStock) existing.quantite++
  } else {
    cart.value.push({
      produit_id: item.produit_id,
      nom: item.produit?.nom_commercial,
      prix_unitaire: item.produit?.prix_unitaire,
      quantite: 1,
      max: availableStock
    })
  }
}

const changeQty = (idx, delta) => {
  const item = cart.value[idx]
  const newQ = item.quantite + delta
  if (newQ <= 0) { cart.value.splice(idx, 1); return }
  if (newQ > item.max) return
  item.quantite = newQ
}

const removeFromCart = (idx) => cart.value.splice(idx, 1)

const totalQty = computed(() => cart.value.reduce((s, i) => s + i.quantite, 0))
const totalMontant = computed(() => cart.value.reduce((s, i) => s + (i.prix_unitaire * i.quantite), 0))

const validerVente = async () => {
  if (cart.value.length === 0) return
  saving.value = true
  venteSuccess.value = null
  try {
    const body = {
      nom_client: nomClient.value || 'Client Comptoir',
      prenom_client: 'Comptoir',
      telephone: telephoneClient.value || '',
      articles: cart.value.map(i => ({ produit_id: i.produit_id, quantite: i.quantite, prix_unitaire: i.prix_unitaire }))
    }
    const res = await gestionnaireFetch('/gestionnaire/ventes', {
      method: 'POST',
      body
    })

    if (res?.commande) {
      receiptData.value = res.commande
      showReceiptModal.value = true
    }

    venteSuccess.value = `Vente de ${formatPrice(totalMontant.value)} FCFA enregistrée avec succès !`
    cart.value = []
    nomClient.value = ''
    telephoneClient.value = ''
    await fetchStock() // Rafraîchir le stock
    setTimeout(() => venteSuccess.value = null, 5000)
  } catch (e) {
    console.error('Erreur lors de la vente', e)
    alert(e?.data?.message || e?.message || "Erreur lors de l'enregistrement de la vente.")
  } finally {
    saving.value = false
  }
}

const printReceipt = () => {
  if (process.client) {
    window.print()
  }
}

onMounted(fetchStock)
</script>
