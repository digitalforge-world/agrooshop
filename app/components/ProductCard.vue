<template>
  <div class="group bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 sm:hover:-translate-y-2 flex flex-col relative">
    
    <!-- Image with Clickable Modal Trigger -->
    <div 
      @click="openModal" 
      :class="['relative block w-full h-36 sm:h-48 rounded-t-xl sm:rounded-t-2xl overflow-hidden cursor-pointer', isFallback ? 'bg-gradient-to-b from-emerald-50/80 via-emerald-100/40 to-white' : 'bg-gray-50']"
      title="Cliquez pour voir la fiche produit détaillée"
    >
      <img 
        :src="imageUrl" 
        :alt="product.nom_commercial"
        :class="[
          'w-full h-full group-hover:scale-105 transition-transform duration-300',
          isFallback ? 'object-contain p-2 sm:p-3' : 'object-cover'
        ]"
        @error="handleImageError"
      />

      <!-- Hover Overlay Indicator -->
      <div class="hidden sm:flex absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center">
        <span class="px-3.5 py-1.5 bg-white/95 text-emerald-800 text-xs font-extrabold rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
          <Eye class="w-3.5 h-3.5 text-emerald-600" />
          <span>Voir la fiche</span>
        </span>
      </div>
      
      <!-- Stock Badge -->
      <span 
        v-if="stockBadge.show" 
        :class="['absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs', stockBadge.class]"
      >
        {{ stockBadge.label }}
      </span>
    </div>

    <!-- Body -->
    <div class="p-2.5 sm:p-4 flex-1 flex flex-col">
      <!-- Category -->
      <span class="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5 sm:mb-1">
        {{ mainCategory }}
      </span>

      <!-- Name (Modal Trigger) -->
      <div @click="openModal" class="cursor-pointer" title="Voir les détails de ce produit">
        <h3 class="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug mb-1">
          {{ product.nom_commercial }}
        </h3>
      </div>

      <!-- Specs -->
      <p v-if="product.composition" class="hidden sm:block text-xs text-gray-500 line-clamp-1 mb-auto">
        {{ product.composition }}
      </p>

      <!-- Price + Actions -->
      <div class="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-0">
          <span class="text-sm sm:text-lg font-extrabold text-gray-900">
            {{ Number(product.prix_unitaire).toLocaleString('fr-FR') }} <span class="text-[10px] sm:text-xs font-semibold text-gray-500">FCFA</span>
          </span>
          <span class="text-[9px] sm:text-[11px] text-gray-400 font-medium">/ {{ product.unite_mesure || 'unité' }}</span>
        </div>
        
        <button
          @click.stop="addToCart"
          :disabled="product.stock_disponible <= 0"
          :class="[
            'w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5',
            product.stock_disponible > 0 
              ? 'bg-emerald-800 hover:bg-emerald-700 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          <ShoppingCart class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ isAdded ? 'Ajouté au panier !' : 'Ajouter au panier' }}</span>
          <span class="sm:hidden">{{ isAdded ? 'Ajouté !' : 'Ajouter' }}</span>
        </button>
      </div>
    </div>

    <!-- Product Detail Interactive Modal -->
    <ProductDetailModal 
      :is-open="showModal" 
      :product="product" 
      @close="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import ProductDetailModal from '~/components/ProductDetailModal.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()
const isAdded = ref(false)
const isFallback = ref(false)
const showModal = ref(false)

const fallbackImage = '/images/Agroshopproduit .png'

const openModal = () => {
  showModal.value = true
  try {
    if (typeof window === 'undefined' || !props.product) return
    const config = useRuntimeConfig()
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'clic_produit',
        details: `Ouverture Fiche Produit: "${props.product.nom_commercial}" (${Number(props.product.prix_unitaire).toLocaleString('fr-FR')} FCFA)`
      }
    })
  } catch (e) {}
}

const { getImageUrl } = useMedia()

const imageUrl = computed(() => {
  const raw = props.product.image_principale?.url_image || props.product.url_image
  if (raw) {
    isFallback.value = false
    return getImageUrl(raw)
  }
  isFallback.value = true
  return fallbackImage
})

const handleImageError = (e) => {
  isFallback.value = true
  e.target.src = fallbackImage
}

const mainCategory = computed(() => {
  return props.product.categories?.[0]?.nom || 'Produit'
})

const stockBadge = computed(() => {
  const stock = props.product.stock_disponible ?? 0
  if (stock <= 0) return { show: true, label: 'Rupture de stock', class: 'bg-red-100 text-red-700 border border-red-200' }
  if (stock <= 10) return { show: true, label: `Plus que ${stock}`, class: 'bg-amber-100 text-amber-800 border border-amber-200' }
  return { show: false, label: '', class: '' }
})

const addToCart = () => {
  cartStore.addItem(props.product)
  isAdded.value = true
  setTimeout(() => { isAdded.value = false }, 1500)
}
</script>
