<template>
  <div class="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
    
    <!-- Image -->
    <NuxtLink :to="`/produits/${product.slug}`" class="relative block w-full h-48 bg-gray-50 overflow-hidden">
      <img 
        :src="imageUrl" 
        :alt="product.nom_commercial"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        @error="(e) => e.target.src = fallbackImage"
      />
      
      <!-- Stock Badge -->
      <span :class="['absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded', stockBadge.class]">
        {{ stockBadge.label }}
      </span>
    </NuxtLink>

    <!-- Body -->
    <div class="p-4 flex-1 flex flex-col">
      <!-- Category -->
      <span class="text-[11px] font-medium text-emerald-700 uppercase tracking-wide mb-1">
        {{ mainCategory }}
      </span>

      <!-- Name -->
      <NuxtLink :to="`/produits/${product.slug}`">
        <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-emerald-700 transition-colors leading-snug mb-2">
          {{ product.nom_commercial }}
        </h3>
      </NuxtLink>

      <!-- Specs -->
      <p v-if="product.composition" class="text-xs text-gray-400 line-clamp-1 mb-auto">
        {{ product.composition }}
      </p>

      <!-- Price + Actions -->
      <div class="mt-4 pt-3 border-t border-gray-100">
        <div class="flex items-baseline justify-between mb-3">
          <span class="text-lg font-bold text-gray-900">
            {{ Number(product.prix_unitaire).toLocaleString('fr-FR') }} <span class="text-xs font-medium text-gray-500">FCFA</span>
          </span>
          <span class="text-[11px] text-gray-400">/ {{ product.unite_mesure || 'unité' }}</span>
        </div>
        
        <button
          @click="addToCart"
          :disabled="product.stock_disponible <= 0"
          :class="[
            'w-full py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            product.stock_disponible > 0 
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          {{ isAdded ? 'Ajouté au panier !' : 'Ajouter au panier' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()
const isAdded = ref(false)

const fallbackImage = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=80'

const imageUrl = computed(() => {
  if (props.product.image_principale?.url_image) {
    const url = props.product.image_principale.url_image
    return url.startsWith('http') ? url : `http://localhost:8000/${url}`
  }
  if (props.product.url_image) {
    return props.product.url_image.startsWith('http') ? props.product.url_image : `http://localhost:8000/${props.product.url_image}`
  }
  return fallbackImage
})

const mainCategory = computed(() => {
  return props.product.categories?.[0]?.nom || 'Produit'
})

const stockBadge = computed(() => {
  const stock = props.product.stock_disponible ?? 0
  if (stock <= 0) return { label: 'Rupture de stock', class: 'bg-red-100 text-red-700' }
  if (stock <= 10) return { label: `Plus que ${stock}`, class: 'bg-amber-100 text-amber-700' }
  return { label: 'En stock', class: 'bg-emerald-100 text-emerald-700' }
})

const addToCart = () => {
  cartStore.addItem(props.product)
  isAdded.value = true
  setTimeout(() => { isAdded.value = false }, 1500)
}
</script>
