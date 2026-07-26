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

    <!-- Main Product Layout (2 Cols: Left Gallery Slider, Right Specs & Purchase) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- Gallery Left Col (5 Cols) - Sticky Interactive Slider -->
      <div class="lg:col-span-5 space-y-4 lg:sticky lg:top-28 self-start z-20">
        
        <!-- Main Animated Image Slider Box -->
        <div 
          class="w-full aspect-square bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden shadow-xs relative group"
          @mouseenter="stopAutoSlide"
          @mouseleave="startAutoSlide"
        >
          <Transition name="slide-fade" mode="out-in">
            <img 
              :key="selectedImageIndex"
              :src="selectedImageUrl" 
              :alt="product.nom_commercial" 
              class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              @error="(e) => e.target.src = fallbackImage"
            />
          </Transition>

          <!-- Vedette Badge -->
          <span 
            v-if="product.featured || product.est_en_vedette" 
            class="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10"
          >
            ⭐ Produit Vedette
          </span>

          <!-- Left / Right Slider Control Arrows -->
          <div v-if="productImages.length > 1" class="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
            <button 
              @click="prevImage" 
              class="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-90"
              title="Image précédente"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>

            <button 
              @click="nextImage" 
              class="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-lg active:scale-90"
              title="Image suivante"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>

          <!-- Pagination Dots Overlay -->
          <div v-if="productImages.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full z-10">
            <button 
              v-for="(_, idx) in productImages" 
              :key="idx"
              @click="selectedImageIndex = idx"
              :class="['h-2 rounded-full transition-all cursor-pointer', selectedImageIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/60 hover:bg-white']"
            ></button>
          </div>
        </div>

        <!-- Thumbnails Ribbon with Active Ring -->
        <div v-if="productImages.length > 1" class="flex items-center gap-3 overflow-x-auto pb-2">
          <button 
            v-for="(img, idx) in productImages" 
            :key="idx"
            @click="selectedImageIndex = idx"
            :class="['w-16 h-16 rounded-2xl border p-1 bg-white flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300', selectedImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100']"
          >
            <img :src="getImgUrl(img)" class="w-full h-full object-contain" />
          </button>
        </div>

      </div>

      <!-- Specs Right Col (7 Cols) -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Category Tag -->
        <div class="flex items-center justify-between gap-4">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {{ mainCategoryName }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {{ product.nom_commercial }}
        </h1>

        <!-- Price Display -->
        <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-baseline gap-3">
          <span class="text-3xl font-black text-emerald-800 tracking-tight">
            {{ Number(product.prix_unitaire || 0).toLocaleString('fr-FR') }} <span class="text-base font-bold text-emerald-600">FCFA</span>
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
        <div v-if="product.composition || product.principes_actifs || product.dosage_recommande || product.mode_emploi" class="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
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
            <div class="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
              <button 
                @click="selectedQuantity = Math.max(1, selectedQuantity - 1)"
                class="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
              >-</button>
              <span class="px-4 py-2 text-sm font-bold text-slate-900">{{ selectedQuantity }}</span>
              <button 
                @click="selectedQuantity = Math.min(product.stock_disponible || 999, selectedQuantity + 1)"
                class="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
              >+</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              @click="addToCart"
              :disabled="(product.stock_disponible || 0) <= 0"
              class="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingCart, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const config = useRuntimeConfig()
const cartStore = useCartStore()

const selectedQuantity = ref(1)
const isAdded = ref(false)
const selectedImageIndex = ref(0)
let autoSlideTimer = null

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
  images: [
    'storage/produits/urea.jpg',
    '/images/Agroshopproduit .png',
    '/images/hero-produits-agroshop.png'
  ],
  categories: [{ nom: 'Intrants Agricoles / Urée' }]
})

const fallbackProducts = [
  {
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
    images: [
      'storage/produits/urea.jpg',
      '/images/Agroshopproduit .png',
      '/images/hero-produits-agroshop.png'
    ],
    categories: [{ nom: 'Intrants Agricoles / Urée' }]
  },
  {
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    description: 'Engrais universel équilibré assurant un apport complet en Azote (N), Phosphore (P) et Potassium (K) pour toutes les cultures vivrières et maraîchères.',
    composition: '15% N, 15% P2O5, 15% K2O.',
    principes_actifs: 'Azote (15%), Phosphore (15%), Potassium (15%).',
    mode_emploi: 'Épandre régulièrement autour de la zone racinaire lors de la préparation des sols ou en entretien.',
    dosage_recommande: '150 à 200 kg/ha.',
    precautions_usage: 'Conserver à l\'abri de l\'humidité.',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 750,
    featured: true,
    url_image: 'storage/produits/npk.jpg',
    images: [
      'storage/produits/npk.jpg',
      '/images/Agroshopproduit .png',
      '/images/hero-produits-agroshop.png'
    ],
    categories: [{ nom: 'Intrants Agricoles / NPK' }]
  },
  {
    id: 3,
    nom_commercial: 'Insecticide Katana 50 EC',
    slug: 'insecticide-katana-50-ec',
    description: 'Insecticide à large spectre d\'action pour la protection des cultures contre les chenilles, pucerons et insectes piqueurs.',
    composition: 'Cyperméthrine 50 g/L.',
    principes_actifs: 'Cyperméthrine (Pyréthrinoïde de synthèse).',
    mode_emploi: 'Diluer dans l\'eau et pulvériser le feuillage tôt le matin ou en fin d\'après-midi.',
    dosage_recommande: '1L par hectare.',
    precautions_usage: 'Porter un masque et des gants lors de la manipulation.',
    prix_unitaire: 7500,
    unite_mesure: 'flacon 1L',
    stock_disponible: 300,
    featured: false,
    url_image: 'storage/produits/katana.jpg',
    images: [
      'storage/produits/katana.jpg',
      '/images/Agroshopproduit .png'
    ],
    categories: [{ nom: 'Produits Phytosanitaires' }]
  },
  {
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    description: 'Semences certifiées de maïs hybride à très haut potentiel de rendement, tolérantes au stress hydrique et aux maladies foliaires.',
    composition: 'Semences traitées fongicide & insecticide.',
    principes_actifs: 'Variété Hybride F1 certifiée.',
    mode_emploi: 'Semer 1 graine tous les 25cm en lignes espacées de 75cm.',
    dosage_recommande: '25 kg/ha.',
    precautions_usage: 'Ne pas consommer les semences traitées.',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    stock_disponible: 500,
    featured: true,
    url_image: 'storage/produits/mais_pan53.jpg',
    images: [
      'storage/produits/mais_pan53.jpg',
      '/images/Agroshopproduit .png'
    ],
    categories: [{ nom: 'Semences Certifiées' }]
  },
  {
    id: 5,
    nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²',
    slug: 'kit-irrigation-goutte-a-goutte-500m2',
    description: 'Système complet d\'arrosage goutte-à-goutte pour maraîchage economisant 70% d\'eau.',
    composition: 'Gaines goutte-à-goutte 16mm, filtre à disque, vannes et raccordement.',
    mode_emploi: 'Raccorder à une citerne ou un château d\'eau sous pression.',
    dosage_recommande: 'Arrosage journalier 30 à 45 minutes.',
    prix_unitaire: 85000,
    unite_mesure: 'kit complet',
    stock_disponible: 45,
    featured: true,
    url_image: 'storage/produits/irrigation_kit.jpg',
    images: [
      'storage/produits/irrigation_kit.jpg',
      '/images/Agroshopproduit .png'
    ],
    categories: [{ nom: 'Systèmes d\'Irrigation' }]
  },
  {
    id: 6,
    nom_commercial: 'Atomiseur STIHL SR 450',
    slug: 'atomiseur-stihl-sr-450',
    description: 'Atomiseur thermique professionnel pour le traitement des plantations, vergers et grandes cultures.',
    composition: 'Moteur STIHL 2T 63.3cm³.',
    mode_emploi: 'Remplir le réservoir avec la solution traitante diluée.',
    dosage_recommande: 'Portée de pulvérisation jusqu\'à 14.5m.',
    precautions_usage: 'Utiliser du carburant mélangé 2%.',
    prix_unitaire: 515000,
    unite_mesure: 'unité',
    stock_disponible: 25,
    featured: true,
    url_image: 'storage/produits/stihl.jpg',
    images: [
      'storage/produits/stihl.jpg',
      '/images/Agroshopproduit .png'
    ],
    categories: [{ nom: 'Machines Agricoles' }]
  }
]

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

const nextImage = () => {
  if (productImages.value.length <= 1) return
  selectedImageIndex.value = (selectedImageIndex.value + 1) % productImages.value.length
}

const prevImage = () => {
  if (productImages.value.length <= 1) return
  selectedImageIndex.value = (selectedImageIndex.value - 1 + productImages.value.length) % productImages.value.length
}

const startAutoSlide = () => {
  stopAutoSlide()
  if (productImages.value.length > 1) {
    autoSlideTimer = setInterval(nextImage, 4000)
  }
}

const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

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

const findFallbackProduct = (slug) => {
  const found = fallbackProducts.find(p => p.slug === slug || String(p.id) === String(slug))
  if (found) {
    product.value = found
  }
  trackProductView()
}

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await $fetch(`${config.public.apiBaseUrl}/produits/${slug}`)
    const item = res?.data?.produit || res?.data
    if (item && item.nom_commercial) {
      product.value = item
      trackProductView()
    } else {
      findFallbackProduct(slug)
    }
  } catch (e) {
    findFallbackProduct(route.params.slug)
  }
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateX(12px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(-12px);
}
</style>
