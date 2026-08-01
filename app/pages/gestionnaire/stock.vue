<template>
  <div class="space-y-6">
    
    <div>
      <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
        <Package class="w-6 h-6 text-emerald-600" />
        Mon Stock
      </h1>
      <p class="text-xs text-slate-500 mt-1">Inventaire de votre boutique — {{ store.boutique?.nom }}</p>
    </div>

    <!-- Search & Filter -->
    <div class="flex items-center gap-3 flex-wrap">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs" />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Produit</th>
              <th class="px-6 py-4">Catégorie</th>
              <th class="px-6 py-4">Stock Actuel</th>
              <th class="px-6 py-4">Seuil Alerte</th>
              <th class="px-6 py-4">Prix Unitaire</th>
              <th class="px-6 py-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">Chargement du stock...</td>
            </tr>
            <tr v-else-if="filteredStock.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">Aucun produit dans ce stock</td>
            </tr>
              <tr v-for="item in filteredStock" :key="item.produit_id" class="hover:bg-slate-50 transition-colors"
                :class="(item.quantite_en_stock ?? item.stock_disponible ?? 0) <= (item.stock_alerte || 10) ? 'bg-red-50/50' : ''"
              >
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900 text-sm">{{ item.produit?.nom_commercial }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ item.produit?.unite_mesure }}</p>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ item.produit?.categorie?.nom || '—' }}</td>
                <td class="px-6 py-4">
                  <span :class="(item.quantite_en_stock ?? item.stock_disponible ?? 0) <= (item.stock_alerte || 10) ? 'text-red-700 font-black' : 'text-emerald-700 font-bold'" class="text-sm font-mono">
                    {{ item.quantite_en_stock ?? item.stock_disponible ?? 0 }}
                  </span>
                  <span v-if="(item.quantite_en_stock ?? item.stock_disponible ?? 0) <= (item.stock_alerte || 10)" class="ml-2 text-[10px] text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full font-bold">ALERTE</span>
                </td>
                <td class="px-6 py-4 text-slate-500 font-mono">{{ item.stock_alerte || 10 }}</td>
                <td class="px-6 py-4 font-mono text-amber-700 font-bold">{{ formatPrice(item.produit?.prix_unitaire) }} FCFA</td>
                <td class="px-6 py-4 text-right">
                  <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold border border-slate-200">
                    Stock Géré par Admin
                  </span>
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
import { Package, Search } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire/stock',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Mon Stock - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const config = useRuntimeConfig()

const stock = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedItem = ref(null)
const newQuantity = ref(0)
const saving = ref(false)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const fetchStock = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/gestionnaire/stock`, {
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' }
    })
    stock.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) {
    stock.value = []
  } finally {
    loading.value = false
  }
}

const filteredStock = computed(() => {
  if (!searchQuery.value) return stock.value
  const q = searchQuery.value.toLowerCase()
  return stock.value.filter(i => i.produit?.nom_commercial?.toLowerCase().includes(q))
})

const ajusterStock = (item) => {
  selectedItem.value = item
  newQuantity.value = item.quantite_en_stock
}

const adjustQty = (delta, readOnly = false) => {
  if (readOnly) return newQuantity.value
  newQuantity.value = Math.max(0, newQuantity.value + delta)
}

const confirmerAjustement = async () => {
  saving.value = true
  try {
    await $fetch(`${config.public.apiBaseUrl}/gestionnaire/stock/ajuster/${selectedItem.value.produit_id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' },
      body: { quantite: newQuantity.value }
    })
    selectedItem.value.quantite_en_stock = newQuantity.value
    selectedItem.value = null
  } catch (e) {
    console.error('Erreur ajustement stock', e)
  } finally {
    saving.value = false
  }
}

onMounted(fetchStock)
</script>
