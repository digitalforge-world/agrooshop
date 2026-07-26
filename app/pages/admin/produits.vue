<template>
  <div class="space-y-6">
    
    <!-- Title & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white">Gestion du Catalogue Produits</h1>
        <p class="text-xs text-slate-400 mt-1">Consultez, modifiez et gérez la mise en vedette de vos engrais et matériels.</p>
      </div>

      <div class="flex items-center gap-3">
        <button @click="fetchProducts" class="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
      <div class="relative flex-1 w-full">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par nom de produit, référence..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      <span class="text-xs font-mono text-slate-400 flex-shrink-0">
        {{ filteredProducts.length }} produit(s) trouvé(s)
      </span>
    </div>

    <!-- Products Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      
      <div v-if="isLoading" class="py-12 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des produits...
      </div>

      <div v-else-if="filteredProducts.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Produit</th>
              <th class="px-4 py-3">Prix Unitaire</th>
              <th class="px-4 py-3">Stock Disponible</th>
              <th class="px-4 py-3">En Vedette (Accueil)</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-slate-800/40 transition-colors">
              
              <td class="px-4 py-3.5 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                  <img 
                    :src="getImgUrl(prod.image_principale || prod.url_image)" 
                    :alt="prod.nom_commercial"
                    class="w-full h-full object-cover"
                    @error="(e) => e.target.src = '/images/Agroshopproduit .png'"
                  />
                </div>
                <div>
                  <p class="font-bold text-white text-xs">{{ prod.nom_commercial }}</p>
                  <p class="text-[10px] text-slate-500 font-mono">ID: #{{ prod.id }} | {{ prod.unite_mesure || 'Unité' }}</p>
                </div>
              </td>

              <td class="px-4 py-3.5 font-mono font-bold text-emerald-400">
                {{ formatPrice(prod.prix_unitaire || 0) }} FCFA
              </td>

              <td class="px-4 py-3.5 font-mono">
                <span :class="(prod.stock_disponible || 0) > 0 ? 'text-slate-200' : 'text-red-400 font-bold'">
                  {{ prod.stock_disponible || 0 }} disponible(s)
                </span>
              </td>

              <td class="px-4 py-3.5">
                <button 
                  @click="toggleFeatured(prod)"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                  :class="prod.est_en_vedette ? 'bg-amber-950 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'"
                >
                  <Star class="w-3 h-3" :class="{ 'fill-current': prod.est_en_vedette }" />
                  <span>{{ prod.est_en_vedette ? 'En Vedette' : 'Standard' }}</span>
                </button>
              </td>

              <td class="px-4 py-3.5 text-right font-mono">
                <NuxtLink :to="`/produits/${prod.slug}`" target="_blank" class="p-2 text-slate-400 hover:text-white transition-colors">
                  <Eye class="w-4 h-4 inline-block" />
                </NuxtLink>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
        Aucun produit correspondant à votre recherche.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshCw, Star, Eye } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Gestion des Produits - AgroShop Admin'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()
const { getImageUrl } = useMedia()

const isLoading = ref(true)
const products = ref([])
const searchQuery = ref('')

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const getImgUrl = (img) => getImageUrl(img, '/images/Agroshopproduit .png')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.nom_commercial?.toLowerCase().includes(q) || 
    p.slug?.toLowerCase().includes(q)
  )
})

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/produits`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    products.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.warn('Admin products fetch error', e)
  }
  isLoading.value = false
}

const toggleFeatured = async (prod) => {
  const oldState = prod.est_en_vedette
  prod.est_en_vedette = !oldState
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}/toggle-featured`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch (e) {
    prod.est_en_vedette = oldState
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
