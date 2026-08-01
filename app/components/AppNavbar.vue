<template>
  <header class="sticky top-0 z-50 w-full">

    <!-- ═══ TOP ANNOUNCEMENT BAR ═══ -->
    <div class="bg-emerald-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-6 sm:gap-10 text-xs font-medium">
        <div class="flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-300" />
          <span>Produits de qualité certifiée</span>
        </div>
        <div class="hidden sm:flex items-center gap-1.5">
          <Truck class="w-3.5 h-3.5 text-emerald-300" />
          <span>Livraison rapide partout au Togo</span>
        </div>
        <div class="hidden md:flex items-center gap-1.5">
          <Banknote class="w-3.5 h-3.5 text-emerald-300" />
          <span>Paiement à la livraison</span>
        </div>
      </div>
    </div>

    <!-- ═══ MAIN HEADER ═══ -->
    <div class="bg-white border-b border-gray-100 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="AgroShop Togo" 
            class="h-12 w-auto object-contain"
          />
        </NuxtLink>

        <!-- Modern Clean Desktop Search Bar -->
        <div class="hidden md:flex flex-1 max-w-xl mx-6">
          <div class="relative w-full flex items-center">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Rechercher un produit, engrais, semences..."
              class="w-full pl-10 pr-28 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <div class="absolute right-1.5 flex items-center gap-1.5">
              <button 
                @click="handleSearch" 
                class="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>Chercher</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Phone Support -->
          <div class="hidden lg:flex flex-col items-end">
            <span class="text-[10px] text-gray-500 font-medium">Besoin d'aide ?</span>
            <a href="tel:+22898706081" class="text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors">+228 98 70 60 81</a>
          </div>

          <!-- Mobile Search Trigger Button (Left of Cart) -->
          <button 
            @click="showMobileSearchModal = true"
            class="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer bg-slate-50 hover:bg-emerald-50 rounded-full"
            aria-label="Rechercher"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Cart Button with Wiggle/Shake Animation (100% radius) -->
          <button
            @click="cartStore.toggleCart()"
            :class="[
              'relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-emerald-700 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50 rounded-full',
              cartStore.isBouncing ? 'animate-wiggle-cart bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/50 shadow-md' : ''
            ]"
            aria-label="Panier"
          >
            <ShoppingCart class="w-5 h-5" />
            <span 
              v-if="cartStore.totalQuantity > 0"
              :class="[
                'absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs transition-transform duration-300',
                cartStore.isBouncing ? 'scale-125 bg-amber-500 font-black' : ''
              ]"
            >
              {{ cartStore.totalQuantity }}
            </span>
          </button>

        </div>
      </div>
    </div>

    <!-- ═══ NAVIGATION BAR ═══ -->
    <nav class="bg-emerald-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-11 justify-between lg:justify-start">

          <!-- All Categories Dropdown -->
          <div class="relative" @mouseenter="showCatMenu = true" @mouseleave="showCatMenu = false">
            <button class="flex items-center gap-2 h-11 px-5 bg-emerald-900 hover:bg-emerald-950 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer">
              <Menu class="w-4 h-4" />
              <span>TOUTES CATÉGORIES</span>
              <ChevronDown class="w-3 h-3" />
            </button>

            <!-- Dropdown Menu -->
            <div v-show="showCatMenu" class="absolute top-full left-0 w-64 bg-white rounded-b-xl shadow-xl border border-gray-200 py-2 z-50">
              <NuxtLink 
                v-for="cat in navCategories" :key="cat.slug"
                :to="`/produits?category=${cat.slug}`"
                class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                @click="showCatMenu = false"
              >
                <component :is="cat.icon" class="w-4 h-4 text-emerald-700" />
                <span>{{ cat.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Nav Links -->
          <div class="hidden lg:flex items-center gap-1 ml-4">
            <NuxtLink 
              v-for="link in navLinks" :key="link.to"
              :to="link.to" 
              class="h-11 px-4 flex items-center text-xs font-bold tracking-wider hover:bg-emerald-700 transition-colors rounded-md"
              active-class="bg-emerald-900/60"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileOpen = !mobileOpen" class="lg:hidden p-2 hover:bg-emerald-700 rounded cursor-pointer">
            <Menu class="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

    <!-- ═══ MOBILE MENU ═══ -->
    <div v-if="mobileOpen" class="lg:hidden bg-white border-b border-gray-200 shadow-xl">
      <div class="px-4 py-3 space-y-1">
        <NuxtLink 
          v-for="link in navLinks" :key="link.to"
          :to="link.to" 
          class="block px-3 py-2.5 text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- ═══ MOBILE SEARCH MODAL ═══ -->
    <ClientOnly>
      <Teleport to="body">
        <div 
          v-if="showMobileSearchModal"
          class="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          @click.self="showMobileSearchModal = false"
        >
          <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-4 mt-12 space-y-4 animate-in slide-in-from-top duration-300">
            
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <Search class="w-4 h-4 text-emerald-700" />
                <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Rechercher un produit</h3>
              </div>
              <button 
                type="button"
                @click="showMobileSearchModal = false" 
                class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div class="relative flex items-center">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearchModal"
                type="text"
                placeholder="Urée, NPK, semences, tuyaux..."
                class="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                autofocus
              />
              <button 
                type="button"
                @click="handleSearchModal"
                class="absolute right-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Chercher
              </button>
            </div>

          </div>
        </div>
      </Teleport>
    </ClientOnly>

  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Leaf, Search, ShoppingCart, Truck, ShieldCheck, Banknote,
  Menu, ChevronDown, Beaker, Bug, Droplets, Sprout, Tractor, Wrench, Sparkles
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useCatalogStore } from '~/stores/catalog'

const cartStore = useCartStore()
const catalogStore = useCatalogStore()
const router = useRouter()

const searchQuery = ref('')
const showCatMenu = ref(false)
const mobileOpen = ref(false)
const showMobileSearchModal = ref(false)

const navLinks = [
  { to: '/', label: 'ACCUEIL' },
  { to: '/produits', label: 'BOUTIQUE' },
  { to: '/blog', label: 'BLOG' },
  { to: '/blog', label: 'CONSEILS' },
  { to: '/contact', label: 'CONTACT' },
]

const navCategories = [
  { name: 'Intrants agricoles', slug: 'intrants-agricoles', icon: Beaker },
  { name: 'Produits phytosanitaires', slug: 'produits-phytosanitaires', icon: Bug },
  { name: 'Semences', slug: 'semences', icon: Sprout },
  { name: 'Systèmes d\'irrigation', slug: 'systemes-irrigation', icon: Droplets },
  { name: 'Machines agricoles', slug: 'machines-agricoles', icon: Tractor },
  { name: 'Quincaillerie agricole', slug: 'quincaillerie', icon: Wrench },
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    catalogStore.setSearch(searchQuery.value.trim())
    router.push('/produits')
    mobileOpen.value = false
  }
}

const handleSearchModal = () => {
  if (searchQuery.value.trim()) {
    catalogStore.setSearch(searchQuery.value.trim())
    router.push('/produits')
    showMobileSearchModal.value = false
  }
}
</script>

<style scoped>
@keyframes cartWiggle {
  0% { transform: scale(1) rotate(0deg); }
  15% { transform: scale(1.2) rotate(-15deg); }
  30% { transform: scale(1.2) rotate(15deg); }
  45% { transform: scale(1.2) rotate(-10deg); }
  60% { transform: scale(1.2) rotate(10deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.animate-wiggle-cart {
  animation: cartWiggle 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
