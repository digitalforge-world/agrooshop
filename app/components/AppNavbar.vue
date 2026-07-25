<template>
  <header class="sticky top-0 z-50 w-full">

    <!-- ═══ TOP ANNOUNCEMENT BAR ═══ -->
    <div class="bg-emerald-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-6 sm:gap-10 text-xs font-medium">
        <div class="flex items-center gap-1.5">
          <Truck class="w-3.5 h-3.5 text-emerald-300" />
          <span>Livraison rapide partout au Togo</span>
        </div>
        <div class="hidden sm:flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-300" />
          <span>Produits de qualité certifiée</span>
        </div>
        <div class="hidden md:flex items-center gap-1.5">
          <Banknote class="w-3.5 h-3.5 text-emerald-300" />
          <span>Paiement à la livraison</span>
        </div>
      </div>
    </div>

    <!-- ═══ MAIN HEADER ═══ -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Leaf class="w-5 h-5" />
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-gray-900 tracking-tight leading-none">
              AGRO<span class="text-emerald-700">SHOP</span>
            </span>
            <span class="text-[10px] text-gray-500 font-medium">Cultivons l'avenir ensemble</span>
          </div>
        </NuxtLink>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-xl mx-6">
          <div class="flex w-full">
            <select class="px-3 py-2.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg text-xs text-gray-600 font-medium focus:outline-none cursor-pointer">
              <option>Toutes catégories</option>
              <option>Intrants agricoles</option>
              <option>Phytosanitaires</option>
              <option>Semences</option>
              <option>Irrigation</option>
              <option>Machines</option>
              <option>Quincaillerie</option>
            </select>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Rechercher un produit, une catégorie..."
              class="flex-1 px-4 py-2.5 border border-gray-300 border-r-0 text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
            />
            <button @click="handleSearch" class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-r-lg transition-colors cursor-pointer">
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <!-- Phone -->
          <div class="hidden lg:flex flex-col items-end">
            <span class="text-[10px] text-gray-500 font-medium">Besoin d'aide ?</span>
            <a href="tel:+22890807070" class="text-sm font-bold text-gray-900 hover:text-emerald-700 transition-colors">+228 90 80 70 70</a>
          </div>

          <!-- Wishlist -->
          <button class="hidden sm:flex relative p-2 text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer" aria-label="Favoris">
            <Heart class="w-5 h-5" />
          </button>

          <!-- Cart -->
          <button
            @click="cartStore.toggleCart()"
            class="relative p-2 text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
            aria-label="Panier"
          >
            <ShoppingCart class="w-5 h-5" />
            <span 
              v-if="cartStore.totalQuantity > 0"
              class="absolute -top-0.5 -right-0.5 bg-emerald-700 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center"
            >
              {{ cartStore.totalQuantity }}
            </span>
          </button>

          <!-- Account -->
          <button class="hidden sm:flex p-2 text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer" aria-label="Mon compte">
            <User class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ NAVIGATION BAR ═══ -->
    <nav class="bg-emerald-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-11 gap-0">

          <!-- All Categories Dropdown -->
          <div class="relative" @mouseenter="showCatMenu = true" @mouseleave="showCatMenu = false">
            <button class="flex items-center gap-2 h-11 px-5 bg-emerald-800 hover:bg-emerald-900 text-sm font-semibold transition-colors cursor-pointer">
              <Menu class="w-4 h-4" />
              <span>TOUTES CATÉGORIES</span>
              <ChevronDown class="w-3 h-3" />
            </button>

            <!-- Dropdown Menu -->
            <div v-show="showCatMenu" class="absolute top-full left-0 w-64 bg-white rounded-b-lg shadow-lg border border-gray-200 py-2 z-50">
              <NuxtLink 
                v-for="cat in navCategories" :key="cat.slug"
                :to="`/produits?category=${cat.slug}`"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                @click="showCatMenu = false"
              >
                <component :is="cat.icon" class="w-4 h-4 text-emerald-600" />
                <span>{{ cat.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Nav Links -->
          <div class="hidden lg:flex items-center gap-0">
            <NuxtLink 
              v-for="link in navLinks" :key="link.to"
              :to="link.to" 
              class="h-11 px-4 flex items-center text-sm font-medium hover:bg-emerald-600/60 transition-colors"
              active-class="bg-emerald-600/50"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileOpen = !mobileOpen" class="lg:hidden ml-auto p-2 hover:bg-emerald-600/50 rounded cursor-pointer">
            <Menu class="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

    <!-- ═══ MOBILE MENU ═══ -->
    <div v-if="mobileOpen" class="lg:hidden bg-white border-b border-gray-200 shadow-lg">
      <div class="px-4 py-3 space-y-1">
        <!-- Mobile Search -->
        <div class="flex md:hidden mb-3">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Rechercher..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none"
          />
          <button @click="handleSearch" class="px-3 py-2 bg-emerald-700 text-white rounded-r-lg cursor-pointer">
            <Search class="w-4 h-4" />
          </button>
        </div>

        <NuxtLink 
          v-for="link in navLinks" :key="link.to"
          :to="link.to" 
          class="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Leaf, Search, ShoppingCart, Heart, User, Truck, ShieldCheck, Banknote,
  Menu, ChevronDown, Beaker, Bug, Droplets, Sprout, Tractor, Wrench
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useCatalogStore } from '~/stores/catalog'

const cartStore = useCartStore()
const catalogStore = useCatalogStore()
const router = useRouter()

const searchQuery = ref('')
const showCatMenu = ref(false)
const mobileOpen = ref(false)

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
</script>
