<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-500">
      <NuxtLink to="/" class="hover:text-emerald-600">Accueil</NuxtLink>
      <span>/</span>
      <NuxtLink to="/produits" class="hover:text-emerald-600">Produits</NuxtLink>
      <span>/</span>
      <span class="text-slate-900 font-bold truncate max-w-xs">{{ product.nom_commercial }}</span>
    </nav>

    <!-- Main Product Layout (2 Cols: Left Gallery, Right Specs & Purchase) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- Gallery Left Col (5 Cols) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="w-full aspect-square bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden shadow-xs relative">
          <img 
            :src="selectedImageUrl" 
            :alt="product.nom_commercial" 
            class="w-full h-full object-contain"
            @error="(e) => e.target.src = fallbackImage"
          />
          <span 
            v-if="product.featured" 
            class="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-xs"
          >
            ⭐ Produit Vedette
          </span>
        </div>

        <!-- Thumbnails List -->
        <div v-if="productImages.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2">
          <button 
            v-for="(img, idx) in productImages" 
            :key="idx"
            @click="selectedImageIndex = idx"
            :class="['w-16 h-16 rounded-xl border p-1 bg-white flex-shrink-0 cursor-pointer overflow-hidden transition-all', selectedImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100']"
          >
            <img :src="getImgUrl(img)" class="w-full h-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Specs Right Col (7 Cols) -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Category & Stock Status -->
        <div class="flex items-center justify-between gap-4">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {{ mainCategoryName }}
          </span>
          
          <span 
            :class="[
              'text-xs font-bold px-3 py-1 rounded-full',
              product.stock_disponible > 10 ? 'bg-emerald-100 text-emerald-800' : product.stock_disponible > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            ]"
          >
            {{ product.stock_disponible > 0 ? `En Stock (${product.stock_disponible})` : 'Rupture de Stock' }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {{ product.nom_commercial }}
        </h1>

        <!-- Price Display -->
        <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-baseline gap-3">
          <span class="text-3xl font-black text-emerald-800 tracking-tight">
            {{ Number(product.prix_unitaire).toLocaleString('fr-FR') }} <span class="text-base font-bold text-emerald-600">FCFA</span>
          </span>
          <span class="text-xs font-semibold text-slate-500">
            / {{ product.unite_mesure || 'unité' }}
          </span>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Description & Présentation</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ product.description || 'Produit certifié disponible chez AgroShop au Togo.' }}
          </p>
        </div>

        <!-- Agronomic / Technical Specs Table -->
        <div v-if="product.composition || product.principes_actifs || product.dosage_recommande || product.mode_emploi" class="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">Caractéristiques Techniques & Fiche Agronomique</h3>
          
          <div v-if="product.composition" class="grid grid-cols-3 gap-2 text-xs border-b border-slate-100 pb-2">
            <span class="font-bold text-slate-500">Composition :</span>
            <span class="col-span-2 font-semibold text-slate-800">{{ product.composition }}</span>
          </div>

          <div v-if="product.principes_actifs" class="grid grid-cols-3 gap-2 text-xs border-b border-slate-100 pb-2">
            <span class="font-bold text-slate-500">Principes Actifs :</span>
            <span class="col-span-2 font-semibold text-slate-800">{{ product.principes_actifs }}</span>
          </div>

          <div v-if="product.dosage_recommande" class="grid grid-cols-3 gap-2 text-xs border-b border-slate-100 pb-2">
            <span class="font-bold text-slate-500">Dosage Recommandé :</span>
            <span class="col-span-2 font-semibold text-slate-800">{{ product.dosage_recommande }}</span>
          </div>

          <div v-if="product.mode_emploi" class="grid grid-cols-3 gap-2 text-xs border-b border-slate-100 pb-2">
            <span class="font-bold text-slate-500">Mode d'Emploi :</span>
            <span class="col-span-2 font-semibold text-slate-800">{{ product.mode_emploi }}</span>
          </div>

          <div v-if="product.precautions_usage" class="grid grid-cols-3 gap-2 text-xs">
            <span class="font-bold text-slate-500">Précautions :</span>
            <span class="col-span-2 font-semibold text-rose-700">{{ product.precautions_usage }}</span>
          </div>
        </div>

        <!-- Quantity & Add to Cart Action -->
        <div class="space-y-4 pt-4 border-t border-slate-200">
          <div class="flex items-center gap-4">
            <label class="text-xs font-bold text-slate-700 uppercase">Quantité :</label>
            <div class="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
              <button 
                @click="selectedQuantity = Math.max(1, selectedQuantity - 1)"
                class="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
              >-</button>
              <span class="px-4 py-2 text-sm font-bold text-slate-900">{{ selectedQuantity }}</span>
              <button 
                @click="selectedQuantity = Math.min(product.stock_disponible || 999, selectedQuantity + 1)"
                class="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
              >+</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              @click="addToCart"
              :disabled="product.stock_disponible <= 0"
              class="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart class="w-5 h-5" />
              <span>{{ isAdded ? 'Ajouté au Panier !' : 'Ajouter au Panier' }}</span>
            </button>

            <a
              :href="whatsappUrl"
              target="_blank"
              @click="trackWhatsappClick"
              class="w-full py-3.5 px-6 bg-lime-500 hover:bg-lime-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare class="w-5 h-5" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingCart, MessageSquare } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const config = useRuntimeConfig()
const cartStore = useCartStore()

const selectedQuantity = ref(1)
const isAdded = ref(false)
const selectedImageIndex = ref(0)

const fallbackImage = '/images/Agroshopproduit .png'

const product = ref({
  id: 1,
  nom_commercial: 'Urée YARA 46% N',
  slug: 'uree-yara-46-n',
  description: 'Engrais azoté concentré contenant 46 % d’azote, idéal pour stimuler la croissance végétative des cultures de maïs, riz et maraîchage.',
  composition: 'Urée granulée contenant 46 % d\'Azote total (N).',
  principes_actifs: 'Azote (N) = 46 %.',
  mode_emploi: 'Appliquer au sol avant ou après semis, puis arroser pour faciliter la dissolution.',
  dosage_recommande: '50 à 100 kg/ha selon le type de culture.',
  precautions_usage: 'Conserver dans un endroit sec. Porter des gants.',
  prix_unitaire: 15000,
  unite_mesure: 'sac 50kg',
  stock_disponible: 1000,
  featured: true,
  url_image: 'storage/produits/urea.jpg',
  categories: [{ nom: 'Intrants Agricoles / Urée' }]
})

const { getImageUrl } = useMedia()

const getImgUrl = (img) => {
  const url = typeof img === 'string' ? img : img?.url_image
  return getImageUrl(url, fallbackImage)
}

const productImages = computed(() => {
  if (product.value.images && product.value.images.length > 0) {
    return product.value.images
  }
  return [product.value.image_principale?.url_image || product.value.url_image || fallbackImage]
})

const selectedImageUrl = computed(() => {
  return getImgUrl(productImages.value[selectedImageIndex.value] || fallbackImage)
})

const mainCategoryName = computed(() => {
  return product.value.categories?.[0]?.nom || 'Produit'
})

const whatsappUrl = computed(() => {
  const text = `Bonjour AgroShop,%0AJesouhaite commander le produit: ${product.value.nom_commercial} (${selectedQuantity.value}x sac(s) / unité(s) à ${Number(product.value.prix_unitaire).toLocaleString('fr-FR')} FCFA).%0AVeuillez confirmer la disponibilité.`
  const phone = useRuntimeConfig().public.whatsappNumber || '22898706081'
  return `https://wa.me/${phone}?text=${text}`
})

const trackWhatsappClick = () => {
  try {
    if (typeof window === 'undefined' || !product.value) return
    const total = Number(product.value.prix_unitaire) * selectedQuantity.value
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'clic_whatsapp',
        details: `Commande WhatsApp Fiche Produit: "${product.value.nom_commercial}" (x${selectedQuantity.value}) - ${total.toLocaleString('fr-FR')} FCFA`
      }
    })
  } catch (e) {}
}

const trackProductView = () => {
  try {
    if (typeof window === 'undefined' || !product.value) return
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'clic_produit',
        details: `Consultation Fiche Produit: "${product.value.nom_commercial}" (${Number(product.value.prix_unitaire).toLocaleString('fr-FR')} FCFA)`
      }
    })
  } catch (e) {}
}

const addToCart = () => {
  cartStore.addItem(product.value, selectedQuantity.value)
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 1500)
}

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await $fetch(`${config.public.apiBaseUrl}/produits/${slug}`)
    if (res && res.data) {
      product.value = res.data
      trackProductView()
    }
  } catch (e) {
    console.warn('API detail fetch error, using test product data', e)
  }
})
</script>
