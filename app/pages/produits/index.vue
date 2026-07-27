<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-6 sm:space-y-8">
    
    <!-- Page Header & Title -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-6">
      <div>
        <span class="text-[10px] sm:text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">Boutique en ligne AgroShop Togo</span>
        <h1 class="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">Catalogue des Produits & Matériel</h1>
      </div>

      <!-- Sorting Select & Mobile Category Trigger Button -->
      <div class="flex items-center gap-2">
        <!-- Mobile Category Modal Trigger Button -->
        <button 
          type="button"
          @click="openCategoryModal"
          class="lg:hidden flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Filtrer par catégorie"
        >
          <span>Catégories</span>
        </button>

        <label class="hidden sm:inline text-xs font-bold text-slate-500 uppercase">Trier par :</label>
        <select 
          v-model="catalogStore.sort"
          @change="fetchProducts"
          class="bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="latest">Plus récents</option>
          <option value="price_asc">Prix : Croissant</option>
          <option value="price_desc">Prix : Décroissant</option>
          <option value="name_asc">Nom : A - Z</option>
        </select>
      </div>
    </div>

    <!-- Main Content: Sidebar Filters + Products Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-h-[500px] lg:min-h-[850px]">
      
      <!-- Left Sidebar Filters (Hidden on Mobile, Sticky on Desktop) -->
      <aside class="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 lg:sticky lg:top-24">
        
        <!-- Category Filter -->
        <div>
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Catégories</h3>
          <div class="space-y-1.5 text-xs font-semibold">
            <button 
              @click="filterCategory('')"
              :class="['w-full text-left px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer', !catalogStore.selectedCategory ? 'bg-emerald-800 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100']"
            >
              Toutes les catégories
            </button>

            <!-- Dynamic or Static Category List -->
            <button 
              v-for="cat in availableCategories"
              :key="cat.slug"
              @click="filterCategory(cat.slug)"
              :class="['w-full text-left px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between', catalogStore.selectedCategory === cat.slug ? 'bg-emerald-800 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100']"
            >
              <span>{{ cat.icon || '📦' }} {{ cat.nom }}</span>
              <span v-if="cat.count" class="text-[10px] opacity-75">({{ cat.count }})</span>
            </button>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="pt-4 border-t border-slate-100">
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">Prix (FCFA)</h3>
          <div class="grid grid-cols-2 gap-2">
            <input 
              v-model.number="catalogStore.minPrice"
              @input="applyFiltersAndSort"
              type="number"
              placeholder="Min"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <input 
              v-model.number="catalogStore.maxPrice"
              @input="applyFiltersAndSort"
              type="number"
              placeholder="Max"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
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
      <main class="lg:col-span-9 space-y-6 min-h-[750px]">
        
        <!-- Active Filter Pills Bar -->
        <div v-if="catalogStore.selectedCategory || catalogStore.searchQuery || catalogStore.minPrice || catalogStore.maxPrice" class="flex flex-wrap items-center gap-2 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80">
          <span class="text-xs font-bold text-emerald-800">Filtres actifs :</span>
          
          <span v-if="catalogStore.selectedCategory" class="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs">
            Catégorie: {{ getCategoryLabel(catalogStore.selectedCategory) }}
            <button @click="filterCategory('')" class="font-bold cursor-pointer hover:text-emerald-200">✕</button>
          </span>

          <span v-if="catalogStore.minPrice || catalogStore.maxPrice" class="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs">
            Prix: {{ catalogStore.minPrice || 0 }} - {{ catalogStore.maxPrice || '∞' }} FCFA
            <button @click="catalogStore.minPrice = null; catalogStore.maxPrice = null; applyFiltersAndSort()" class="font-bold cursor-pointer hover:text-emerald-200">✕</button>
          </span>

          <span v-if="catalogStore.searchQuery" class="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs">
            Recherche: "{{ catalogStore.searchQuery }}"
            <button @click="catalogStore.setSearch(''); applyFiltersAndSort()" class="font-bold cursor-pointer hover:text-emerald-200">✕</button>
          </span>
        </div>

        <!-- Loading / Grid State -->
        <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          <div v-for="n in 6" :key="n" class="h-64 sm:h-80 bg-slate-200/60 rounded-xl sm:rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="filteredProductsList.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          <ProductCard 
            v-for="product in filteredProductsList" 
            :key="product.id" 
            :product="product" 
          />
        </div>

        <!-- Empty Products View -->
        <div v-else class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto text-2xl">
            🔍
          </div>
          <h3 class="text-lg font-bold text-slate-800">Aucun produit ne correspond à ce filtre</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
          </p>
          <button 
            @click="resetAllFilters"
            class="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Voir tous les produits
          </button>
        </div>

      </main>

    </div>

    <!-- Mobile Categories & Filters Modal (Teleported cleanly on client side) -->
    <ClientOnly>
      <Teleport to="body">
        <div 
          v-if="showMobileCategoryModal" 
          class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          @click.self="showMobileCategoryModal = false"
        >
          <div class="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-5 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div class="flex items-center gap-2">
                <span class="text-lg">🏷️</span>
                <h3 class="text-base font-extrabold text-slate-900">Catégories & Filtres</h3>
              </div>
              <button 
                type="button"
                @click="showMobileCategoryModal = false" 
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <!-- Category List -->
            <div class="space-y-2">
              <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Catégorie</label>
              <div class="space-y-1.5 text-xs font-semibold">
                <button 
                  type="button"
                  @click="filterCategory(''); showMobileCategoryModal = false"
                  :class="['w-full text-left px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between', !catalogStore.selectedCategory ? 'bg-emerald-800 text-white font-bold shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-slate-100']"
                >
                  <span>📦 Toutes les catégories</span>
                  <span v-if="!catalogStore.selectedCategory" class="text-emerald-200">✓</span>
                </button>
                <button 
                  type="button"
                  v-for="cat in availableCategories"
                  :key="cat.slug"
                  @click="filterCategory(cat.slug); showMobileCategoryModal = false"
                  :class="['w-full text-left px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between', catalogStore.selectedCategory === cat.slug ? 'bg-emerald-800 text-white font-bold shadow-xs' : 'text-slate-700 bg-slate-50 hover:bg-slate-100']"
                >
                  <span>{{ cat.icon || '📦' }} {{ cat.nom }}</span>
                  <span v-if="catalogStore.selectedCategory === cat.slug" class="text-emerald-200">✓</span>
                </button>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="pt-3 border-t border-slate-100 space-y-2">
              <label class="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Filtrer par Prix (FCFA)</label>
              <div class="grid grid-cols-2 gap-2">
                <input 
                  v-model.number="catalogStore.minPrice"
                  @input="applyFiltersAndSort"
                  type="number"
                  placeholder="Prix Min"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input 
                  v-model.number="catalogStore.maxPrice"
                  @input="applyFiltersAndSort"
                  type="number"
                  placeholder="Prix Max"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button 
                type="button"
                @click="resetAllFilters()"
                class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Réinitialiser
              </button>
              <button 
                type="button"
                @click="showMobileCategoryModal = false"
                class="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md text-center"
              >
                Voir les {{ filteredProductsList.length }} produits
              </button>
            </div>

          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '~/stores/catalog'
import ProductCard from '~/components/ProductCard.vue'

const route = useRoute()
const config = useRuntimeConfig()
const catalogStore = useCatalogStore()

const showMobileCategoryModal = ref(false)

const openCategoryModal = () => {
  showMobileCategoryModal.value = true
}

const loading = ref(false)
const rawProducts = ref([])
const filteredProductsList = ref([])

const availableCategories = ref([
  { slug: 'intrants-agricoles', nom: 'Intrants Agricoles (Engrais)', icon: '🌾' },
  { slug: 'produits-phytosanitaires', nom: 'Produits Phytosanitaires', icon: '🐛' },
  { slug: 'systemes-irrigation', nom: "Systèmes d'Irrigation", icon: '💧' },
  { slug: 'semences', nom: 'Semences Certifiées', icon: '🌱' },
  { slug: 'machines-agricoles', nom: 'Machines Agricoles', icon: '🚜' },
  { slug: 'quincaillerie', nom: 'Quincaillerie & Outillage', icon: '🛠️' }
])

const getCategoryLabel = (slug) => {
  const found = availableCategories.value.find(c => c.slug === slug)
  return found ? found.nom : slug
}

const extractProductList = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (res.data && Array.isArray(res.data.data)) return res.data.data
  if (Array.isArray(res.produits)) return res.produits
  return []
}

const syncCategoryFromQuery = () => {
  if (route.query.category) {
    catalogStore.setCategory(String(route.query.category))
  } else if (route.query.search) {
    catalogStore.setSearch(String(route.query.search))
  }
}

const applyFiltersAndSort = () => {
  let list = [...rawProducts.value]
  const cat = catalogStore.selectedCategory?.toLowerCase()

  if (cat) {
    list = list.filter(p => {
      const pCats = p.categories || []
      const catNames = pCats.map(c => (c.slug || c.nom || '').toLowerCase()).join(' ')
      if (cat === 'intrants-agricoles' || cat === 'intrants') return catNames.includes('intrant') || catNames.includes('urée') || catNames.includes('npk') || catNames.includes('engrais')
      if (cat === 'produits-phytosanitaires' || cat === 'phytosanitaires') return catNames.includes('phyto') || catNames.includes('insecticide') || catNames.includes('herbicide')
      if (cat === 'systemes-irrigation' || cat === 'irrigation') return catNames.includes('irrigation') || catNames.includes('goutte')
      if (cat === 'semences') return catNames.includes('semence') || catNames.includes('maïs')
      if (cat === 'machines-agricoles' || cat === 'machines') return catNames.includes('machine') || catNames.includes('atomiseur') || catNames.includes('motoculteur')
      if (cat === 'quincaillerie') return catNames.includes('quincaillerie') || catNames.includes('outillage') || catNames.includes('brouette') || catNames.includes('machette')
      return catNames.includes(cat)
    })
  }

  if (catalogStore.searchQuery) {
    const q = catalogStore.searchQuery.toLowerCase()
    list = list.filter(p => 
      p.nom_commercial?.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q) ||
      p.composition?.toLowerCase().includes(q)
    )
  }

  if (catalogStore.minPrice) {
    list = list.filter(p => Number(p.prix_unitaire) >= catalogStore.minPrice)
  }
  if (catalogStore.maxPrice) {
    list = list.filter(p => Number(p.prix_unitaire) <= catalogStore.maxPrice)
  }

  // Sorting
  if (catalogStore.sort === 'price_asc') {
    list.sort((a, b) => Number(a.prix_unitaire) - Number(b.prix_unitaire))
  } else if (catalogStore.sort === 'price_desc') {
    list.sort((a, b) => Number(b.prix_unitaire) - Number(a.prix_unitaire))
  } else if (catalogStore.sort === 'name_asc') {
    list.sort((a, b) => a.nom_commercial.localeCompare(b.nom_commercial))
  }

  filteredProductsList.value = list
}

const fetchProducts = async () => {
  loading.value = true
  try {
    let url = `${config.public.apiBaseUrl}/produits?sort=${catalogStore.sort}&per_page=50`
    if (catalogStore.selectedCategory) {
      url += `&category=${catalogStore.selectedCategory}`
    }
    if (catalogStore.searchQuery) {
      url += `&search=${encodeURIComponent(catalogStore.searchQuery)}`
    }

    const res = await $fetch(url)
    const list = extractProductList(res)

    if (list && list.length > 0) {
      rawProducts.value = list
    } else {
      rawProducts.value = fallbackProducts
    }
  } catch (e) {
    console.warn('API connection offline, displaying fallback products', e)
    rawProducts.value = fallbackProducts
  } finally {
    applyFiltersAndSort()
    loading.value = false
  }
}

const filterCategory = (slug) => {
  catalogStore.setCategory(slug)
  applyFiltersAndSort()
  if (slug) {
    try {
      if (typeof window === 'undefined') return
      $fetch(`${config.public.apiBaseUrl}/track-visite`, {
        method: 'POST',
        body: {
          page: window.location.pathname,
          type_action: 'recherche',
          details: `Filtre par Catégorie: "${getCategoryLabel(slug)}"`
        }
      })
    } catch (e) {}
  }
}

const resetAllFilters = () => {
  catalogStore.resetFilters()
  fetchProducts()
}

onMounted(() => {
  syncCategoryFromQuery()
  fetchProducts()
})

watch(() => route.query.category, (newCat) => {
  if (newCat) {
    catalogStore.setCategory(String(newCat))
    applyFiltersAndSort()
  }
})

watch(() => catalogStore.searchQuery, (newQuery) => {
  applyFiltersAndSort()
  if (newQuery && newQuery.length >= 2) {
    try {
      if (typeof window === 'undefined') return
      $fetch(`${config.public.apiBaseUrl}/track-visite`, {
        method: 'POST',
        body: {
          page: window.location.pathname,
          type_action: 'recherche',
          details: `Recherche Catalogue: "${newQuery}"`
        }
      })
    } catch (e) {}
  }
})

watch([() => catalogStore.minPrice, () => catalogStore.maxPrice], () => {
  applyFiltersAndSort()
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
    categories: [{ nom: 'Intrants / Urée', slug: 'intrants-agricoles' }]
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
    categories: [{ nom: 'Intrants / NPK', slug: 'intrants-agricoles' }]
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
    categories: [{ nom: 'Phytosanitaire', slug: 'produits-phytosanitaires' }]
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
    categories: [{ nom: 'Semences', slug: 'semences' }]
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
    categories: [{ nom: 'Irrigation', slug: 'systemes-irrigation' }]
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
    categories: [{ nom: 'Machines Agricoles', slug: 'machines-agricoles' }]
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
    categories: [{ nom: 'Quincaillerie', slug: 'quincaillerie' }]
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
    categories: [{ nom: 'Quincaillerie / Outillage', slug: 'quincaillerie' }]
  }
]

useSeoMeta({
  title: 'Catalogue Produits Agricoles - AgroShop Togo | Engrais, Semences, Irrigations & Outils',
  description: 'Découvrez l\'ensemble du catalogue AgroShop Togo : engrais certifiés (NPK, Urée 46%), produits phytosanitaires, semences hybrides, systèmes d\'irrigation et outillages agricoles.',
  ogTitle: 'Catalogue Produits Agricoles - AgroShop Togo',
  ogDescription: 'Achetez vos intrants agricoles et équipements certifiés au Togo avec livraison rapide.',
  ogUrl: 'https://agroshoptg.store/produits',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
.grid-fade-move,
.grid-fade-enter-active,
.grid-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
</style>
