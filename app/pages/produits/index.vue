<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    
    <!-- Page Header & Title -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Boutique en ligne</span>
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900">Catalogue des Produits</h1>
      </div>

      <!-- Sorting Select -->
      <div class="flex items-center gap-2">
        <label class="text-xs font-bold text-slate-500 uppercase">Trier par :</label>
        <select 
          v-model="catalogStore.sort"
          @change="fetchProducts"
          class="bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="latest">Plus récents</option>
          <option value="price_asc">Prix : Croissant</option>
          <option value="price_desc">Prix : Décroissant</option>
          <option value="name_asc">Nom : A - Z</option>
        </select>
      </div>
    </div>

    <!-- Main Content: Sidebar Filters + Products Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Sidebar Filters -->
      <aside class="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        <!-- Category Filter -->
        <div>
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Catégories</h3>
          <div class="space-y-1.5 text-xs font-semibold">
            <button 
              @click="filterCategory('')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', !catalogStore.selectedCategory ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              Toutes les catégories
            </button>
            <button 
              @click="filterCategory('intrants-agricoles')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'intrants-agricoles' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              🌾 Intrants Agricoles (Engrais)
            </button>
            <button 
              @click="filterCategory('produits-phytosanitaires')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'produits-phytosanitaires' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              🐛 Produits Phytosanitaires
            </button>
            <button 
              @click="filterCategory('systemes-irrigation')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'systemes-irrigation' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              💧 Systèmes d'Irrigation
            </button>
            <button 
              @click="filterCategory('semences')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'semences' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              🌱 Semences Certifiées
            </button>
            <button 
              @click="filterCategory('machines-agricoles')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'machines-agricoles' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              🚜 Machines Agricoles
            </button>
            <button 
              @click="filterCategory('quincaillerie')"
              :class="['w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer', catalogStore.selectedCategory === 'quincaillerie' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:bg-slate-100']"
            >
              🛠️ Quincaillerie & Outillage
            </button>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="pt-4 border-t border-slate-100">
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Prix (FCFA)</h3>
          <div class="grid grid-cols-2 gap-2">
            <input 
              v-model.number="catalogStore.minPrice"
              type="number"
              placeholder="Min"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <input 
              v-model.number="catalogStore.maxPrice"
              type="number"
              placeholder="Max"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button 
            @click="fetchProducts"
            class="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Filtrer
          </button>
        </div>

        <!-- Reset Button -->
        <button 
          @click="resetAllFilters"
          class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Réinitialiser les filtres
        </button>

      </aside>

      <!-- Right Products Grid -->
      <main class="lg:col-span-9 space-y-6">
        
        <!-- Active Filter Pills Bar -->
        <div v-if="catalogStore.selectedCategory || catalogStore.searchQuery" class="flex flex-wrap items-center gap-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
          <span class="text-xs font-bold text-emerald-800">Filtres actifs :</span>
          
          <span v-if="catalogStore.selectedCategory" class="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            Catégorie: {{ catalogStore.selectedCategory }}
            <button @click="filterCategory('')" class="font-bold">✕</button>
          </span>

          <span v-if="catalogStore.searchQuery" class="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
            Recherche: "{{ catalogStore.searchQuery }}"
            <button @click="catalogStore.setSearch(''); fetchProducts()" class="font-bold">✕</button>
          </span>
        </div>

        <!-- Loading / Grid State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <!-- Empty Products View -->
        <div v-else class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto text-2xl">
            🔍
          </div>
          <h3 class="text-lg font-bold text-slate-800">Aucun produit ne correspond à vos critères</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez de modifier vos filtres ou de réinitialiser la recherche.
          </p>
          <button 
            @click="resetAllFilters"
            class="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Réinitialiser
          </button>
        </div>

      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCatalogStore } from '~/stores/catalog'

const config = useRuntimeConfig()
const catalogStore = useCatalogStore()

const loading = ref(false)
const products = ref([])

const fetchProducts = async () => {
  loading.value = true
  try {
    let url = `${config.public.apiBaseUrl}/produits?sort=${catalogStore.sort}`
    if (catalogStore.selectedCategory) {
      url += `&category=${catalogStore.selectedCategory}`
    }
    if (catalogStore.searchQuery) {
      url += `&search=${encodeURIComponent(catalogStore.searchQuery)}`
    }
    if (catalogStore.minPrice) {
      url += `&min_price=${catalogStore.minPrice}`
    }
    if (catalogStore.maxPrice) {
      url += `&max_price=${catalogStore.maxPrice}`
    }

    const res = await $fetch(url)
    if (res && res.data && res.data.data) {
      products.value = res.data.data
    } else {
      products.value = fallbackProducts
    }
  } catch (e) {
    console.warn('API connection offline, displaying fallback test products', e)
    products.value = fallbackProducts
  } finally {
    loading.value = false
  }
}

const filterCategory = (slug) => {
  catalogStore.setCategory(slug)
  fetchProducts()
}

const resetAllFilters = () => {
  catalogStore.resetFilters()
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})

watch(() => catalogStore.searchQuery, () => {
  fetchProducts()
})

// Fallback seed items
const fallbackProducts = [
  {
    id: 1,
    nom_commercial: 'Urée YARA 46% N',
    slug: 'uree-yara-46-n',
    description: 'Engrais azoté concentré idéal pour le maïs, riz et maraîchage.',
    composition: 'Urée granulée 46% Azote total.',
    prix_unitaire: 15000,
    unite_mesure: 'sac 50kg',
    stock_disponible: 1000,
    featured: true,
    url_image: 'storage/produits/urea.jpg',
    categories: [{ nom: 'Intrants / Urée' }]
  },
  {
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    description: 'Engrais équilibré pour le développement harmonieux des cultures.',
    composition: '15% N, 15% P2O5, 15% K2O.',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 750,
    featured: true,
    url_image: 'storage/produits/npk.jpg',
    categories: [{ nom: 'Intrants / NPK' }]
  },
  {
    id: 3,
    nom_commercial: 'Insecticide Katana 50 EC',
    slug: 'insecticide-katana-50-ec',
    description: 'Insecticide polyvalent contre chenilles et pucerons.',
    composition: 'Cyperméthrine 50 g/L.',
    prix_unitaire: 7500,
    unite_mesure: 'flacon 1L',
    stock_disponible: 300,
    featured: false,
    url_image: 'storage/produits/katana.jpg',
    categories: [{ nom: 'Phytosanitaire' }]
  },
  {
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    description: 'Maïs hybride à haut rendement résistant à la sécheresse.',
    composition: 'Semence certifiée Zea mays.',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    stock_disponible: 500,
    featured: true,
    url_image: 'storage/produits/mais_pan53.jpg',
    categories: [{ nom: 'Semences' }]
  },
  {
    id: 5,
    nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²',
    slug: 'kit-irrigation-goutte-a-goutte-500m2',
    description: 'Système d\'irrigation complet pour maraîchage et serres.',
    composition: 'Tuyaux PE 25mm, gaines 16mm, filtre à disque.',
    prix_unitaire: 85000,
    unite_mesure: 'kit complet',
    stock_disponible: 45,
    featured: true,
    url_image: 'storage/produits/irrigation_kit.jpg',
    categories: [{ nom: 'Irrigation' }]
  },
  {
    id: 6,
    nom_commercial: 'Atomiseur STIHL SR 450',
    slug: 'atomiseur-stihl-sr-450',
    description: 'Appareil de pulvérisation motorisé haute performance.',
    composition: 'Moteur 2T STIHL 63.3cm³, réservoir 14L.',
    prix_unitaire: 515000,
    unite_mesure: 'unité',
    stock_disponible: 25,
    featured: true,
    url_image: 'storage/produits/stihl.jpg',
    categories: [{ nom: 'Machines Agricoles' }]
  },
  {
    id: 7,
    nom_commercial: 'Brouette de Chantier Renforcée 90L',
    slug: 'brouette-de-chantier-renforcee-90l',
    description: 'Brouette professionnelle de quincaillerie pour transport lourd.',
    composition: 'Bac acier galvanisé 1mm, châssis 32mm.',
    prix_unitaire: 32000,
    unite_mesure: 'unité',
    stock_disponible: 120,
    featured: false,
    url_image: 'storage/produits/brouette.jpg',
    categories: [{ nom: 'Quincaillerie' }]
  },
  {
    id: 8,
    nom_commercial: 'Machette d\'Agriculture & Chantier 22"',
    slug: 'machette-agriculture-chantier-22',
    description: 'Outil de coupe en acier au carbone poli.',
    composition: 'Lame acier au carbone 55cm, manche antidérapant.',
    prix_unitaire: 4500,
    unite_mesure: 'unité',
    stock_disponible: 250,
    featured: true,
    url_image: 'storage/produits/machette.jpg',
    categories: [{ nom: 'Quincaillerie / Outillage' }]
  }
]
</script>
