<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-black text-white flex items-center gap-2">
        <ShoppingCart class="w-6 h-6 text-emerald-400" />
        Caisse / Enregistrer une Vente
      </h1>
      <p class="text-xs text-slate-400 mt-1">Sélectionnez les produits et validez la vente en caisse</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <!-- Catalogue (à gauche) -->
      <div class="lg:col-span-3 space-y-4">
        <div class="relative">
          <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..." class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          <div
            v-for="item in filteredStock"
            :key="item.produit_id"
            @click="addToCart(item)"
            class="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-800/70 group"
            :class="item.quantite_en_stock <= 0 ? 'opacity-40 cursor-not-allowed' : ''"
          >
            <p class="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors line-clamp-2">{{ item.produit?.nom_commercial }}</p>
            <p class="text-[10px] text-slate-500 mt-1">Stock: {{ item.quantite_en_stock }} {{ item.produit?.unite_mesure }}</p>
            <p class="text-sm font-black text-amber-400 font-mono mt-2">{{ formatPrice(item.produit?.prix_unitaire) }} <span class="text-[10px] text-slate-400">FCFA</span></p>
          </div>
        </div>
      </div>

      <!-- Panier / Caisse (à droite) -->
      <div class="lg:col-span-2">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-6">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShoppingCart class="w-4 h-4 text-emerald-400" />
            Panier
          </h2>
          
          <!-- Empty cart -->
          <div v-if="cart.length === 0" class="py-8 text-center text-slate-600 text-xs">
            Cliquez sur un produit pour l'ajouter
          </div>

          <!-- Cart items -->
          <div v-else class="space-y-2 mb-4">
            <div v-for="(item, idx) in cart" :key="idx" class="flex items-center gap-3 p-2 bg-slate-800/50 rounded-xl">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-white truncate">{{ item.nom }}</p>
                <p class="text-[10px] text-slate-500">{{ formatPrice(item.prix_unitaire) }} FCFA</p>
              </div>
              <div class="flex items-center gap-1.5">
                <button @click="changeQty(idx, -1)" class="w-6 h-6 rounded bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 flex items-center justify-center">-</button>
                <span class="text-xs font-bold text-white w-5 text-center">{{ item.quantite }}</span>
                <button @click="changeQty(idx, 1)" class="w-6 h-6 rounded bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 flex items-center justify-center">+</button>
              </div>
              <button @click="removeFromCart(idx)" class="p-1 text-slate-500 hover:text-red-400 transition-colors">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Total -->
          <div v-if="cart.length > 0" class="border-t border-slate-800 pt-3 mb-4">
            <div class="flex justify-between text-xs text-slate-400 mb-1">
              <span>{{ totalQty }} article(s)</span>
              <span>Sous-total</span>
            </div>
            <div class="flex justify-between items-baseline">
              <span class="text-sm font-bold text-white">Total</span>
              <span class="text-xl font-black text-amber-400 font-mono">{{ formatPrice(totalMontant) }} <span class="text-xs text-slate-400">FCFA</span></span>
            </div>
          </div>

          <!-- Client Info -->
          <div v-if="cart.length > 0" class="space-y-3 mb-4">
            <input v-model="nomClient" type="text" placeholder="Nom du client (optionnel)" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input v-model="telephoneClient" type="tel" placeholder="Téléphone (optionnel)" class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>

          <!-- Success -->
          <div v-if="venteSuccess" class="mb-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            {{ venteSuccess }}
          </div>

          <!-- Validate -->
          <button
            @click="validerVente"
            :disabled="cart.length === 0 || saving"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-colors"
          >
            {{ saving ? 'Enregistrement...' : '✅ Valider la Vente' }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ShoppingCart, Search, X, CheckCircle } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire/ventes',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Caisse / Ventes - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const config = useRuntimeConfig()

const stock = ref([])
const cart = ref([])
const searchQuery = ref('')
const nomClient = ref('')
const telephoneClient = ref('')
const saving = ref(false)
const venteSuccess = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const fetchStock = async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/gestionnaire/stock`, {
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' }
    })
    stock.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) { stock.value = [] }
}

const filteredStock = computed(() => {
  const s = stock.value.filter(i => i.quantite_en_stock > 0)
  if (!searchQuery.value) return s
  const q = searchQuery.value.toLowerCase()
  return s.filter(i => i.produit?.nom_commercial?.toLowerCase().includes(q))
})

const addToCart = (item) => {
  if (item.quantite_en_stock <= 0) return
  const existing = cart.value.find(c => c.produit_id === item.produit_id)
  if (existing) {
    if (existing.quantite < item.quantite_en_stock) existing.quantite++
  } else {
    cart.value.push({
      produit_id: item.produit_id,
      nom: item.produit?.nom_commercial,
      prix_unitaire: item.produit?.prix_unitaire,
      quantite: 1,
      max: item.quantite_en_stock
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
  saving.value = true
  venteSuccess.value = null
  try {
    const body = {
      nom_client: nomClient.value || 'Client Comptoir',
      telephone_client: telephoneClient.value,
      items: cart.value.map(i => ({ produit_id: i.produit_id, quantite: i.quantite, prix_unitaire: i.prix_unitaire }))
    }
    await $fetch(`${config.public.apiBaseUrl}/gestionnaire/ventes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' },
      body
    })
    venteSuccess.value = `Vente de ${formatPrice(totalMontant.value)} FCFA enregistrée avec succès !`
    cart.value = []
    nomClient.value = ''
    telephoneClient.value = ''
    await fetchStock() // Rafraîchir le stock
    setTimeout(() => venteSuccess.value = null, 5000)
  } catch (e) {
    console.error('Erreur lors de la vente', e)
  } finally {
    saving.value = false
  }
}

onMounted(fetchStock)
</script>
