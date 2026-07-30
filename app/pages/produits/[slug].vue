<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 py-6 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-6xl mx-auto space-y-6">

      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <NuxtLink to="/" class="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home class="w-3.5 h-3.5 text-emerald-600" />
          <span>Accueil</span>
        </NuxtLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <NuxtLink to="/produits" class="hover:text-emerald-700 transition-colors">Catalogue</NuxtLink>
        <ChevronRight class="w-3 h-3 text-slate-400" />
        <span class="text-slate-900 font-bold truncate max-w-[180px] sm:max-w-xs">{{ product.nom_commercial }}</span>
      </nav>

      <!-- Main Product Grid: Balanced & Elegant Scale -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- LEFT COLUMN: Image Carousel Slider -->
        <div class="lg:col-span-5 lg:sticky lg:top-24 self-start z-20 space-y-3">
          
          <!-- Main Image Display Frame -->
          <div 
            class="relative w-full aspect-square bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-center group shadow-xs"
            @mouseenter="stopAutoSlide"
            @mouseleave="startAutoSlide"
          >
            <Transition name="slide-fade" mode="out-in">
              <img 
                :key="selectedImageIndex"
                :src="getImgUrl(displayImages[selectedImageIndex])" 
                :alt="product.nom_commercial"
                class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                @error="(e) => e.target.src = fallbackImage"
              />
            </Transition>

            <!-- Certified Badge -->
            <span class="absolute top-3 left-3 bg-emerald-800 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
              <CheckCircle class="w-3 h-3" />
              <span>Certifié AgroShop</span>
            </span>

            <!-- Carousel Navigation Arrows -->
            <button 
              v-if="displayImages.length > 1"
              @click="prevImage"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 cursor-pointer shadow-sm"
              title="Image précédente"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <button 
              v-if="displayImages.length > 1"
              @click="nextImage"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 cursor-pointer shadow-sm"
              title="Image suivante"
            >
              <ChevronRight class="w-4 h-4" />
            </button>

            <!-- Dot Indicators Bar -->
            <div v-if="displayImages.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur-md">
              <button 
                v-for="(_, idx) in displayImages" 
                :key="idx"
                @click="selectedImageIndex = idx"
                :class="[
                  'h-1.5 rounded-full transition-all cursor-pointer',
                  idx === selectedImageIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/50 hover:bg-white'
                ]"
              ></button>
            </div>
          </div>

          <!-- Thumbnail Ribbon -->
          <div v-if="displayImages.length > 1" class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button 
              v-for="(img, idx) in displayImages" 
              :key="idx"
              @click="selectedImageIndex = idx"
              :class="[
                'w-16 h-16 rounded-xl bg-white border p-1.5 flex-shrink-0 transition-all overflow-hidden cursor-pointer shadow-xs',
                idx === selectedImageIndex ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="getImgUrl(img)" class="w-full h-full object-contain" @error="(e) => e.target.src = fallbackImage" />
            </button>
          </div>
        </div>

        <!-- RIGHT COLUMN: Compact & Refined Typography Scale -->
        <div class="lg:col-span-7 space-y-5">
          
          <!-- 1. Category Badge & Title -->
          <div class="space-y-2">
            <span class="inline-block px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
              {{ categoryName }}
            </span>

            <!-- Compact & Balanced Title Size -->
            <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {{ product.nom_commercial }}
            </h1>

            <div class="flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
              <span class="flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5 text-emerald-600" />
                <span>Disponible immédiatement</span>
              </span>
              <span>•</span>
              <span class="text-slate-500">Livraison rapide au Togo</span>
            </div>
          </div>

          <!-- 2. Price Bar -->
          <div class="flex items-baseline gap-2 py-2 border-y border-slate-200/80">
            <span class="text-2xl font-black text-emerald-700">
              {{ formatPrice(product.prix_unitaire) }} FCFA
            </span>
            <span class="text-xs text-slate-500 font-bold">
              / {{ product.unite_mesure || 'unité' }}
            </span>
          </div>

          <!-- 3. Quantity & Action Buttons Bar -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row items-center gap-3">
              
              <!-- Quantity Selector -->
              <div class="flex items-center border border-slate-200 bg-white rounded-xl p-0.5 w-full sm:w-auto shadow-xs">
                <button 
                  @click="selectedQuantity > 1 ? selectedQuantity-- : null"
                  class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus class="w-3.5 h-3.5" />
                </button>
                <span class="w-10 text-center font-bold text-slate-900 text-xs">
                  {{ selectedQuantity }}
                </span>
                <button 
                  @click="selectedQuantity++"
                  class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Main Order Button -->
              <button 
                @click="addToCart"
                :class="[
                  'w-full sm:flex-1 py-3 px-5 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95',
                  isAdded ? 'bg-emerald-800 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                ]"
              >
                <ShoppingBag class="w-4 h-4" />
                <span>{{ isAdded ? 'Ajouté à la commande !' : 'Ajouter à ma commande' }}</span>
              </button>
            </div>

            <!-- WhatsApp Direct Order Button -->
            <a 
              :href="whatsappUrl" 
              target="_blank"
              class="w-full py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare class="w-3.5 h-3.5 text-emerald-400" />
              <span>Commander par WhatsApp (+228 98 70 60 81)</span>
            </a>
          </div>

          <!-- 4. Refined Content Sections -->
          <div class="space-y-4 pt-3 border-t border-slate-200/80">
            
            <!-- Description -->
            <div class="space-y-1">
              <h3 class="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <FileText class="w-3.5 h-3.5 text-emerald-600" />
                <span>Description du Produit</span>
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed font-sans">
                {{ product.description || 'Engrais et produit agricole certifié AgroShop répondant aux normes de qualité internationales.' }}
              </p>
            </div>

            <!-- Composition & Principes Actifs -->
            <div v-if="product.composition || product.principes_actifs" class="space-y-1.5 pt-3 border-t border-slate-200/60">
              <h3 class="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <Beaker class="w-3.5 h-3.5 text-emerald-600" />
                <span>Composition & Principes Actifs</span>
              </h3>
              <div class="space-y-1 text-xs text-slate-600">
                <p v-if="product.composition"><strong class="text-slate-900">Composition :</strong> {{ product.composition }}</p>
                <p v-if="product.principes_actifs"><strong class="text-slate-900">Principes actifs :</strong> {{ product.principes_actifs }}</p>
              </div>
            </div>

            <!-- Mode d'emploi & Dosage -->
            <div v-if="product.mode_emploi || product.dosage_recommande" class="space-y-1.5 pt-3 border-t border-slate-200/60">
              <h3 class="text-xs font-bold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                <span>Mode d'emploi & Dosage Recommandé</span>
              </h3>
              <div class="space-y-1 text-xs text-slate-600">
                <p v-if="product.mode_emploi"><strong class="text-slate-900">Mode d'application :</strong> {{ product.mode_emploi }}</p>
                <p v-if="product.dosage_recommande"><strong class="text-slate-900">Dosage recommandé :</strong> {{ product.dosage_recommande }}</p>
              </div>
            </div>

            <!-- Précautions d'usage -->
            <div v-if="product.precautions_usage" class="space-y-1 pt-3 border-t border-slate-200/60">
              <h3 class="text-xs font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                <ShieldAlert class="w-3.5 h-3.5 text-amber-600" />
                <span>Précautions d'emploi</span>
              </h3>
              <p class="text-xs text-amber-900/90 leading-relaxed">
                {{ product.precautions_usage }}
              </p>
            </div>

          </div>

          <!-- 5. Reassurance Strip -->
          <div class="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-slate-600">
            <div class="flex items-center gap-1.5">
              <CheckCircle class="w-3.5 h-3.5 text-emerald-600" />
              <span>Qualité Certifiée</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Truck class="w-3.5 h-3.5 text-emerald-600" />
              <span>Livraison au Togo</span>
            </div>
            <div class="flex items-center gap-1.5">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
              <span>Support AgroShop</span>
            </div>
          </div>

        </div>

      </div>

      <!-- AI Product Recommendations -->
      <section class="mt-10 pt-8 border-t border-slate-200">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles class="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
              Produits qui pourraient vous intéresser
            </h2>
            <p class="text-xs text-slate-500">Suggestions IA basées sur ce produit et votre panier</p>
          </div>
        </div>
        <div v-if="aiRecommendations.loading" class="py-10 text-center text-xs font-mono text-slate-500">
          <div class="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Recherche de suggestions en cours...
        </div>
        <div v-else-if="aiRecommendations.produits.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <NuxtLink
            v-for="rec in aiRecommendations.produits"
            :key="rec.id"
            :to="`/produits/${rec.slug || rec.id}`"
            class="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <div class="aspect-square p-3 bg-gradient-to-br from-slate-50 to-emerald-50/40 border-b border-slate-100 flex items-center justify-center">
              <img
                :src="getImgUrl(rec.url_image || rec.image_principale?.url_image || rec.image)"
                :alt="rec.nom_commercial"
                class="w-full h-full object-contain transition-transform group-hover:scale-105"
                @error="(e) => e.target.src = fallbackImage"
              />
            </div>
            <div class="p-3 flex flex-col gap-1 flex-1">
              <h3 class="text-xs font-bold text-slate-900 line-clamp-2 leading-tight min-h-[2.5rem]">{{ rec.nom_commercial || rec.nom }}</h3>
              <p v-if="rec.categorie || (rec.categories && rec.categories.length)" class="text-[10px] text-emerald-700 uppercase font-semibold tracking-tight">
                {{ rec.categorie || rec.categories[0]?.nom }}
              </p>
              <div class="mt-auto pt-2 flex items-baseline gap-1">
                <span class="text-sm font-black text-emerald-700">{{ formatPrice(rec.prix_unitaire) }}</span>
                <span class="text-[10px] text-slate-500 font-bold">FCFA</span>
              </div>
              <div class="flex items-center gap-1">
                <span :class="(rec.stock_disponible ?? rec.stock ?? 0) > 0 ? 'text-emerald-600' : 'text-rose-500'" class="text-[10px] font-bold">
                  {{ (rec.stock_disponible ?? rec.stock ?? 0) > 0 ? '✓ En stock' : '⚠️ Rupture' }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="py-10 text-center text-xs text-slate-400">
          Aucune suggestion disponible pour ce produit pour le moment.
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Home, ChevronRight, ChevronLeft, CheckCircle, CheckCircle2, Minus, Plus, ShoppingBag, FileText, Beaker, ShieldAlert, Truck, MessageSquare, ShieldCheck, Sparkles } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const config = useRuntimeConfig()
const cartStore = useCartStore()
const { getImageUrl } = useMedia()

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
      '/images/Agroshopproduit .png',
      '/images/hero-produits-agroshop.png'
    ],
    categories: [{ nom: 'Produits Phytosanitaires / Insecticides' }]
  }
]

const aiRecommendations = ref({
  loading: false,
  produits: []
})

const fetchAiRecommendations = async () => {
  if (!product.value?.id) return
  aiRecommendations.value.loading = true
  try {
    const panierIds = (cartStore.items || []).map((it) => it.produit?.id || it.id).filter(Boolean)
    const res = await $fetch(`${config.public.apiBaseUrl}/ai/produits/recommandations`, {
      method: 'POST',
      body: {
        produit_id: product.value.id,
        panier_produits: panierIds,
        limit: 6
      }
    })
    const list = res?.data?.produits || res?.data || res?.produits || res || []
    aiRecommendations.value.produits = Array.isArray(list) ? list.filter((p) => p.id !== product.value.id).slice(0, 6) : []
  } catch (e) {
    console.warn('AI recommendations fetch error', e)
    // Fallback: use other fallback products
    aiRecommendations.value.produits = fallbackProducts.filter(p => p.id !== product.value.id).slice(0, 6)
  } finally {
    aiRecommendations.value.loading = false
  }
}

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const getImgUrl = (img) => getImageUrl(img, fallbackImage)

const whatsappUrl = computed(() => {
  const text = encodeURIComponent(`Bonjour AgroShop, je souhaite commander : ${product.value.nom_commercial} (${selectedQuantity.value} ${product.value.unite_mesure || 'unité'})`)
  return `https://wa.me/22898706081?text=${text}`
})

const displayImages = computed(() => {
  const list = []
  
  if (product.value?.image_principale?.url_image) {
    list.push(product.value.image_principale.url_image)
  }
  if (product.value?.url_image && !list.includes(product.value.url_image)) {
    list.push(product.value.url_image)
  }
  
  if (product.value?.images && Array.isArray(product.value.images)) {
    product.value.images.forEach(img => {
      const path = typeof img === 'object' ? (img.url_image || img.url) : img
      if (path && !list.includes(path)) list.push(path)
    })
  }

  const defaultGallery = [
    '/images/Agroshopproduit .png',
    '/images/hero-produits-agroshop.png',
    '/images/agroshop.jpg'
  ]
  defaultGallery.forEach(g => {
    if (!list.includes(g)) list.push(g)
  })

  return list
})

const categoryName = computed(() => {
  if (product.value?.categories && product.value.categories.length > 0) {
    return product.value.categories[0].nom || product.value.categories[0].slug
  }
  return 'Intrants Agricoles Certifiés'
})

const nextImage = () => {
  if (displayImages.value.length === 0) return
  selectedImageIndex.value = (selectedImageIndex.value + 1) % displayImages.value.length
}

const prevImage = () => {
  if (displayImages.value.length === 0) return
  selectedImageIndex.value = (selectedImageIndex.value - 1 + displayImages.value.length) % displayImages.value.length
}

const startAutoSlide = () => {
  stopAutoSlide()
  if (displayImages.value.length > 1) {
    autoSlideTimer = setInterval(() => {
      nextImage()
    }, 4500)
  }
}

const stopAutoSlide = () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

const extractProduitFromResponse = (res) => {
  if (!res || typeof res !== 'object') return null
  const direct = res?.data?.produit || res?.produit || res?.data?.data?.produit
  if (direct && (direct.nom_commercial || direct.slug || direct.id)) {
    return direct
  }
  const obj = res?.data?.data || res?.data || res
  if (obj && (obj.nom_commercial || obj.slug || obj.id)) {
    return obj
  }
  return null
}

const normalizeProduit = (item) => {
  if (!item || typeof item !== 'object') return item
  const imgPrincipale = item.image_principale || item.imagePrincipale || item.image_principale
  return {
    ...item,
    image_principale: imgPrincipale,
    url_image: item.url_image || imgPrincipale?.url_image || imgPrincipale?.url || item.image
  }
}

const trackProductView = async () => {
  try {
    await $fetch(`${config.public.apiBaseUrl}/statistiques/visites`, {
      method: 'POST',
      body: {
        type_action: 'vue_produit',
        details: {
          produit_id: product.value.id,
          nom_commercial: product.value.nom_commercial,
          slug: product.value.slug
        }
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
    product.value = { ...product.value, ...found }
  }
  trackProductView()
}

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await $fetch(`${config.public.apiBaseUrl}/produits/${slug}`)
    const rawItem = extractProduitFromResponse(res)
    const item = normalizeProduit(rawItem)
    if (item && item.nom_commercial) {
      product.value = {
        ...product.value,
        ...item,
        description: item.description || product.value.description,
        composition: item.composition || product.value.composition,
        principes_actifs: item.principes_actifs || product.value.principes_actifs,
        mode_emploi: item.mode_emploi || product.value.mode_emploi,
        dosage_recommande: item.dosage_recommande || product.value.dosage_recommande,
        precautions_usage: item.precautions_usage || product.value.precautions_usage,
        prix_unitaire: item.prix_unitaire ?? product.value.prix_unitaire,
        unite_mesure: item.unite_mesure || product.value.unite_mesure,
        stock_disponible: item.stock_disponible ?? product.value.stock_disponible,
        images: (item.images && item.images.length > 0) ? item.images : product.value.images,
        categories: (item.categories && item.categories.length > 0) ? item.categories : product.value.categories,
        image_principale: item.image_principale || product.value.image_principale,
        url_image: item.url_image || product.value.url_image
      }
      trackProductView()
    } else {
      findFallbackProduct(slug)
    }
  } catch (e) {
    findFallbackProduct(route.params.slug)
  }
  startAutoSlide()
  fetchAiRecommendations()
})

useSeoMeta({
  title: () => `${product.value.nom_commercial} - AgroShop Togo`,
  description: () => product.value.description || 'Achetez vos intrants agricoles certifiés chez AgroShop Togo.',
  ogTitle: () => `${product.value.nom_commercial} | AgroShop Togo`,
  ogDescription: () => product.value.description || 'Intrant agricole certifié disponible au Togo.',
  ogImage: () => getImgUrl(displayImages.value[0]),
  ogUrl: () => `https://agroshoptg.store/produits/${product.value.slug}`,
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.value.nom_commercial,
        'image': [getImgUrl(displayImages.value[0])],
        'description': product.value.description,
        'sku': `AGRO-${product.value.id}`,
        'offers': {
          '@type': 'Offer',
          'url': `https://agroshoptg.store/produits/${product.value.slug}`,
          'priceCurrency': 'XOF',
          'price': product.value.prix_unitaire,
          'availability': product.value.stock_disponible > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'itemCondition': 'https://schema.org/NewCondition'
        }
      }))
    }
  ]
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
