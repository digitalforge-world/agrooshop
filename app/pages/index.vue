<template>
  <div class="overflow-x-hidden">

    <!-- ═══ HERO ═══ -->
    <HeroSection />


    <!-- ═══ TRUST STRIP ═══ -->
    <section class="border-b border-gray-200 bg-white overflow-hidden py-3 sm:py-0">
      
      <!-- Mobile: Animated Scrolling Marquee -->
      <div class="sm:hidden relative w-full overflow-hidden py-1">
        <div class="flex animate-marquee items-center gap-3">
          <div 
            v-for="(item, idx) in [...trustItems, ...trustItems]" 
            :key="idx" 
            class="flex items-center gap-2.5 py-2 px-3.5 bg-emerald-50/90 rounded-full border border-emerald-100/90 flex-shrink-0 whitespace-nowrap shadow-xs"
          >
            <div class="w-6.5 h-6.5 rounded-full bg-emerald-800 text-white flex items-center justify-center flex-shrink-0">
              <component :is="item.icon" class="w-3.5 h-3.5" />
            </div>
            <div class="pr-1">
              <p class="text-xs font-extrabold text-gray-900 leading-tight">{{ item.title }}</p>
              <p class="text-[10px] text-emerald-800 font-semibold leading-tight">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop / Tablet Grid -->
      <div class="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          <div 
            v-for="(item, idx) in trustItems" 
            :key="idx" 
            :class="['flex items-center gap-3 py-6 px-4 reveal-up', `stagger-${idx + 1}`]"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:bg-emerald-100">
              <component :is="item.icon" class="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ item.title }}</p>
              <p class="text-xs text-gray-500">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </section>


    <!-- ═══ CATEGORIES ═══ -->
    <section class="bg-white pt-4 pb-6 sm:py-16 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-3 sm:mb-10">
          <div>
            <h2 class="text-base sm:text-xl font-black text-slate-900">Nos catégories populaires</h2>
            <p class="mt-0.5 text-xs sm:text-sm text-slate-500">Retrouvez tous les produits essentiels pour votre exploitation agricole.</p>
          </div>
          <NuxtLink to="/produits" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:translate-x-1">
            Voir toutes les catégories
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Mobile: Animated Scrolling Marquee with Horizontal Cards -->
        <div class="sm:hidden relative w-full overflow-hidden py-1">
          <div class="flex animate-marquee-categories items-center gap-3">
            <NuxtLink 
              v-for="(cat, idx) in [...categoryCards, ...categoryCards]" 
              :key="idx"
              :to="cat.link"
              class="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs flex-shrink-0 whitespace-nowrap min-w-[210px] hover:border-emerald-500 transition-colors"
            >
              <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <component :is="cat.icon" class="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 class="text-xs font-extrabold text-gray-900 leading-tight">{{ cat.name }}</h3>
                <p class="text-[10px] text-gray-400 leading-tight mt-0.5">{{ cat.sub }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop / Tablet Grid -->
        <div class="hidden sm:grid sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-3.5">
          <NuxtLink 
            v-for="(cat, idx) in categoryCards" 
            :key="idx"
            :to="cat.link"
            :class="[
              'group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300 bg-white',
              idx % 2 === 0 ? 'reveal-left' : 'reveal-right',
              `stagger-${(idx % 4) + 1}`
            ]"
          >
            <div class="w-12 h-12 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
              <component :is="cat.icon" class="w-5 h-5 text-emerald-700" />
            </div>
            <h3 class="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight mb-0.5">{{ cat.name }}</h3>
            <p class="text-[10px] text-gray-400 leading-tight">{{ cat.sub }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>


    <!-- ═══ FEATURED PRODUCTS ═══ -->
    <section class="bg-gray-50 py-8 sm:py-16">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6 sm:mb-10">
          <div>
            <h2 class="text-base sm:text-xl font-black text-slate-900">Produits populaires</h2>
            <p class="mt-0.5 text-xs sm:text-sm text-slate-500">Les produits les plus commandés par nos clients.</p>
          </div>
          <NuxtLink to="/produits?category=semences" class="flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-700 transition-all duration-300">
            <span>Voir toutes les semences</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div class="h-36 sm:h-48 bg-gray-200 rounded-lg"></div>
            <div class="h-3 w-20 bg-gray-200 rounded"></div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div class="h-9 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>



    <!-- ═══ CALCULATOR ═══ -->
    <section class="bg-white py-12 sm:py-16 reveal-scale">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FertilizerCalculator />
      </div>
    </section>





    <!-- ═══ PARTNERS ═══ -->
    <section class="bg-white py-16 reveal-up">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Nos partenaires de confiance</h2>
        <div class="overflow-hidden">
          <div class="flex animate-marquee items-center gap-8 min-w-full">
            <template v-for="n in 2" :key="n">
              <div v-for="(p, idx) in partners" :key="`${n}-${idx}`" class="flex-shrink-0 mx-4 flex items-center justify-center h-16">
                <img 
                  v-if="p.logo_url && !failedLogos.has(p.id || p.nom)" 
                  :src="getImageUrl(p.logo_url)" 
                  :alt="p.nom" 
                  @error="onPartnerLogoError(p.id || p.nom)"
                  class="h-12 max-w-[160px] object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 cursor-pointer drop-shadow-xs" 
                />
                <div v-else class="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs flex items-center gap-2 hover:border-emerald-500/40 hover:bg-emerald-50/50 transition-all cursor-pointer">
                  <Building2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span class="text-xs font-black text-slate-700 tracking-wide whitespace-nowrap">{{ p.nom }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>


    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="bg-gray-50 py-8 sm:py-16 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-6 sm:mb-10">
          <h2 class="text-base sm:text-xl font-black text-slate-900">Ce que disent nos clients</h2>
          <p class="mt-0.5 text-xs sm:text-sm text-slate-500">Plus de 2000 agriculteurs nous font confiance</p>
        </div>

        <!-- Mobile: Touch Swipe Snap Scroll -->
        <div class="sm:hidden relative w-full overflow-x-auto scrollbar-none snap-x snap-mandatory py-1">
          <div class="flex items-stretch gap-3 px-1">
            <div 
              v-for="(t, idx) in testimonials" 
              :key="idx"
              class="snap-start p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex-shrink-0 w-[275px] flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex gap-0.5">
                  <Star v-for="i in 5" :key="i" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <p class="text-xs text-slate-600 leading-relaxed italic line-clamp-3">"{{ t.text }}"</p>
              </div>
              <div class="flex items-center gap-2.5 pt-3 mt-2 border-t border-slate-100">
                <div class="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                  {{ t.initials }}
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 leading-tight">{{ t.name }}</p>
                  <p class="text-[10px] text-slate-500 leading-tight">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop / Tablet Grid -->
        <div class="hidden sm:grid sm:grid-cols-3 gap-6">
          <div 
            v-for="(t, idx) in testimonials" 
            :key="idx"
            :class="[
              'p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
              idx === 0 ? 'reveal-left' : idx === 1 ? 'reveal-scale' : 'reveal-right',
              `stagger-${idx + 1}`
            ]"
          >
            <div class="flex gap-0.5 mb-3">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ t.text }}</p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div class="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {{ t.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ t.name }}</p>
                <p class="text-xs text-gray-500">{{ t.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ═══ NEWSLETTER ═══ -->
    <section class="bg-emerald-800 reveal-scale">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="text-center lg:text-left">
            <h2 class="text-2xl font-bold text-white">Recevez nos conseils et offres</h2>
            <p class="mt-2 text-sm text-emerald-200/70">1 email par semaine. -5% sur votre première commande.</p>
          </div>
          <div class="flex w-full max-w-md gap-3">
            <input 
              v-model="email"
              type="email" 
              placeholder="Votre email"
              class="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-emerald-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button @click="subscribe" class="px-6 py-3 bg-white text-emerald-800 font-semibold text-sm rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer active:scale-95">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ArrowRight, Star, Building2,
  Truck, ShieldCheck, Banknote, Headphones,
  Beaker, Bug, Droplets, Sprout, Tractor, Wrench
} from 'lucide-vue-next'

const config = useRuntimeConfig()
const isLoading = ref(true)
const email = ref('')

// Trust strip
const trustItems = [
  { title: 'Livraison rapide', desc: 'Partout au Togo', icon: Truck },
  { title: 'Paiement à la livraison', desc: 'Payez à la réception', icon: Banknote },
  { title: 'Produits certifiés', desc: 'Qualité garantie', icon: ShieldCheck },
  { title: 'Support client', desc: '7j/7 à votre écoute', icon: Headphones },
]

// Categories
const categoryCards = [
  { name: 'Services Anti-Nuisibles', sub: 'Dératisation, Fumigation...', link: '/services', icon: ShieldCheck },
  { name: 'Intrants agricoles', sub: 'Engrais, NPK, Urée...', link: '/produits?category=intrants-agricoles', icon: Beaker },
  { name: 'Produits phytosanitaires', sub: 'Insecticides, Fongicides...', link: '/produits?category=produits-phytosanitaires', icon: Bug },
  { name: 'Semences', sub: 'Légumes, Céréales...', link: '/produits?category=semences', icon: Sprout },
  { name: 'Systèmes d\'irrigation', sub: 'Tuyaux, Pompes, Arroseurs...', link: '/produits?category=systemes-irrigation', icon: Droplets },
  { name: 'Machines agricoles', sub: 'Tracteurs, Motoculteurs...', link: '/produits?category=machines-agricoles', icon: Tractor },
  { name: 'Quincaillerie agricole', sub: 'Outils et équipements...', link: '/quincaillerie', icon: Wrench },
]

// Partners
const partners = ref([])
const failedLogos = ref(new Set())
const onPartnerLogoError = (key) => {
  failedLogos.value.add(key)
}

// Testimonials
const testimonials = [
  { text: "Les engrais Yara d'AgroShop ont doublé mon rendement de maïs cette saison. Livraison rapide jusqu'à Sokodé !", name: 'Kossi A.', role: 'Agriculteur, Sokodé', initials: 'KA' },
  { text: "Kit d'irrigation installé facilement grâce aux conseils de l'équipe. Mes tomates n'ont jamais été aussi belles.", name: 'Afi M.', role: 'Maraîchère, Kpalimé', initials: 'AM' },
  { text: "Qualité des outils de quincaillerie exceptionnelle. Bien meilleur que ce qu'on trouve au marché local.", name: 'Kofi D.', role: 'Entrepreneur BTP, Lomé', initials: 'KD' },
]

// Featured Products (Seeds only as requested)
const featuredProducts = ref([
  { 
    id: 4, 
    nom_commercial: 'Semence Maïs Hybride PAN 53', 
    slug: 'semence-mais-hybride-pan-53', 
    composition: 'Semence certifiée Zea mays. Haut rendement & résistant à la sécheresse.', 
    prix_unitaire: 12000, 
    unite_mesure: 'sac 5kg', 
    stock_disponible: 500, 
    featured: true, 
    url_image: 'storage/produits/mais_pan53.jpg', 
    categories: [{ nom: 'Semences', slug: 'semences' }] 
  },
  { 
    id: 9, 
    nom_commercial: 'Semences Tomate Hybride Cobra F1', 
    slug: 'semences-tomate-hybride-cobra-f1', 
    composition: 'Semence maraîchère certifiée. Fruits fermes et tolérance aux maladies.', 
    prix_unitaire: 8500, 
    unite_mesure: 'boîte 50g', 
    stock_disponible: 350, 
    featured: true, 
    url_image: 'storage/produits/mais_pan53.jpg', 
    categories: [{ nom: 'Semences', slug: 'semences' }] 
  },
  { 
    id: 10, 
    nom_commercial: 'Semences Piment Hybride Demon F1', 
    slug: 'semences-piment-hybride-demon-f1', 
    composition: 'Piment fort très productif adapté au climat tropical.', 
    prix_unitaire: 9500, 
    unite_mesure: 'boîte 50g', 
    stock_disponible: 280, 
    featured: true, 
    url_image: 'storage/produits/mais_pan53.jpg', 
    categories: [{ nom: 'Semences', slug: 'semences' }] 
  },
  { 
    id: 11, 
    nom_commercial: 'Semences Gombo Kropi F1', 
    slug: 'semences-gombo-kropi-f1', 
    composition: 'Variété précoce à forte ramification et gousses vertes.', 
    prix_unitaire: 6000, 
    unite_mesure: 'sachet 100g', 
    stock_disponible: 420, 
    featured: true, 
    url_image: 'storage/produits/mais_pan53.jpg', 
    categories: [{ nom: 'Semences', slug: 'semences' }] 
  },
])

// Blog Posts from DB
const blogPosts = ref([])

const { getImageUrl } = useMedia()
const getBlogImg = (img) => getImageUrl(img, '/images/hero-produits-agroshop.png')

const formatDate = (dateStr) => {
  if (!dateStr) return 'Récemment'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

let observer = null

const initScrollObserver = () => {
  const elements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale')
  if (!elements.length) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      } else {
        entry.target.classList.remove('is-visible')
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  })

  elements.forEach(el => observer.observe(el))
}

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBaseUrl}/produits?category=semences&per_page=12`)
    const prods = data?.data?.data || data?.data || []
    if (prods.length > 0) {
      const seedsOnly = prods.filter(p => {
        const cats = p.categories || []
        const catStr = cats.map(c => (c.nom || c.slug || '').toLowerCase()).join(' ')
        const nameStr = (p.nom_commercial || '').toLowerCase()
        return catStr.includes('semence') || catStr.includes('graine') || nameStr.includes('semence') || nameStr.includes('maïs') || nameStr.includes('tomate') || nameStr.includes('piment') || nameStr.includes('gombo')
      })
      if (seedsOnly.length > 0) {
        featuredProducts.value = seedsOnly.slice(0, 4)
      } else {
        featuredProducts.value = prods.slice(0, 4)
      }
    }
  } catch (e) {
    console.warn('API products offline', e)
  }

  try {
    const blogRes = await $fetch(`${config.public.apiBaseUrl}/blog?per_page=4`)
    if (blogRes?.data?.articles?.data?.length > 0) {
      blogPosts.value = blogRes.data.articles.data
    }
  } catch (e) {
    console.warn('API blog offline', e)
  }

  try {
    const partRes = await $fetch(`${config.public.apiBaseUrl}/partenaires`)
    if (partRes?.data && Array.isArray(partRes.data) && partRes.data.length > 0) {
      partners.value = partRes.data
    } else {
      partners.value = [
        { id: 1, nom: 'YARA International', logo_url: null },
        { id: 2, nom: 'Bayer CropScience', logo_url: null },
        { id: 3, nom: 'Syngenta Togo', logo_url: null },
        { id: 4, nom: 'CAGIA Togo', logo_url: null },
        { id: 5, nom: 'ITRA Togo', logo_url: null },
        { id: 6, nom: 'FAO Agriculture', logo_url: null }
      ]
    }
  } catch (e) {
    console.warn('API partenaires offline', e)
    partners.value = [
      { id: 1, nom: 'YARA International', logo_url: null },
      { id: 2, nom: 'Bayer CropScience', logo_url: null },
      { id: 3, nom: 'Syngenta Togo', logo_url: null },
      { id: 4, nom: 'CAGIA Togo', logo_url: null },
      { id: 5, nom: 'ITRA Togo', logo_url: null },
      { id: 6, nom: 'FAO Agriculture', logo_url: null }
    ]
  }

  isLoading.value = false

  setTimeout(() => {
    initScrollObserver()
  }, 100)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const subscribe = () => {
  if (!email.value) return
  alert(`Merci ! Code -5% : BIENVENUE5 envoyé à ${email.value}`)
  email.value = ''
}
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 16s linear infinite;
}

.animate-marquee-categories {
  display: flex;
  width: max-content;
  animation: marquee 22s linear infinite;
}

.animate-marquee-testimonials {
  display: flex;
  width: max-content;
  animation: marquee 24s linear infinite;
}

.animate-marquee:hover,
.animate-marquee-categories:hover,
.animate-marquee-testimonials:hover {
  animation-play-state: paused;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
