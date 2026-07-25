<template>
  <div class="overflow-x-hidden">

    <!-- ═══ HERO ═══ -->
    <HeroSection />


    <!-- ═══ TRUST STRIP ═══ -->
    <section class="border-b border-gray-200 bg-white reveal-down">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between mb-10 reveal-left">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Nos catégories populaires</h2>
            <p class="mt-1 text-sm text-gray-500">Retrouvez tous les produits essentiels pour votre exploitation agricole.</p>
          </div>
          <NuxtLink to="/produits" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:translate-x-1">
            Voir toutes les catégories
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <NuxtLink 
            v-for="(cat, idx) in categoryCards" 
            :key="idx"
            :to="cat.link"
            :class="[
              'group flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300 bg-white',
              idx % 2 === 0 ? 'reveal-left' : 'reveal-right',
              `stagger-${(idx % 4) + 1}`
            ]"
          >
            <div class="w-14 h-14 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
              <component :is="cat.icon" class="w-6 h-6 text-emerald-700" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">{{ cat.name }}</h3>
            <p class="text-[11px] text-gray-400 mt-0.5">{{ cat.sub }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>


    <!-- ═══ FEATURED PRODUCTS ═══ -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between mb-10 reveal-right">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Produits populaires</h2>
            <p class="mt-1 text-sm text-gray-500">Les produits les plus commandés par nos clients.</p>
          </div>
          <NuxtLink to="/produits" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-600 transition-all duration-300 hover:translate-x-1">
            Voir tout
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-xl p-4 space-y-4">
            <div class="h-48 bg-gray-200 rounded-lg"></div>
            <div class="h-3 w-24 bg-gray-200 rounded"></div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
            <div class="h-10 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            v-for="(product, idx) in featuredProducts" 
            :key="product.id"
            :class="[
              idx % 2 === 0 ? 'reveal-left' : 'reveal-right',
              `stagger-${(idx % 4) + 1}`
            ]"
          >
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>


    <!-- ═══ CALCULATOR ═══ -->
    <section class="bg-white py-16 reveal-scale">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FertilizerCalculator />
      </div>
    </section>


    <!-- ═══ BLOG (4 Articles issus de la Base de Données) ═══ -->
    <section class="bg-gray-50 py-16 border-t border-gray-200/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 reveal-up">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Conseils & Guides Agronomiques
            </h2>
          </div>
          <NuxtLink 
            to="/blog" 
            class="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>Voir tous les articles</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article 
            v-for="(article, idx) in blogPosts" 
            :key="article.id"
            :class="[
              'bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col group',
              idx % 2 === 0 ? 'reveal-left' : 'reveal-right',
              `stagger-${idx + 1}`
            ]"
          >
            <!-- Image -->
            <NuxtLink :to="`/blog/${article.slug}`" class="relative block w-full h-44 overflow-hidden bg-gray-100">
              <img 
                :src="getBlogImg(article.image_principale)" 
                :alt="article.titre"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="(e) => e.target.src = '/images/hero-produits-agroshop.png'"
              />
              <span 
                v-if="article.tags && article.tags[0]" 
                class="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md text-white shadow-xs"
                :style="{ backgroundColor: article.tags[0].couleur || '#10B981' }"
              >
                {{ article.tags[0].nom }}
              </span>
            </NuxtLink>

            <!-- Body -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <p class="text-[11px] text-gray-400 font-medium mb-1">
                  {{ formatDate(article.date_publication) }}
                </p>
                <NuxtLink :to="`/blog/${article.slug}`">
                  <h3 class="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {{ article.titre }}
                  </h3>
                </NuxtLink>
                <p class="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                  {{ article.extrait }}
                </p>
              </div>

              <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
                <NuxtLink 
                  :to="`/blog/${article.slug}`"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>Lire l'article</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </NuxtLink>
                <span class="text-[11px] text-gray-400 font-medium">👁️ {{ article.vues || 0 }}</span>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>


    <!-- ═══ PARTNERS ═══ -->
    <section class="bg-white py-16 reveal-up">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Nos partenaires de confiance</h2>
        <div class="overflow-hidden">
          <div class="animate-marquee">
            <template v-for="n in 2" :key="n">
              <div v-for="(p, idx) in partners" :key="`${n}-${idx}`" class="flex-shrink-0 mx-10">
                <span class="text-base font-bold text-gray-300 hover:text-emerald-600 transition-colors whitespace-nowrap cursor-default">{{ p }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>


    <!-- ═══ TESTIMONIALS ═══ -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 reveal-down">
          <h2 class="text-xl font-bold text-gray-900">Ce que disent nos clients</h2>
          <p class="mt-1 text-sm text-gray-500">Plus de 2000 agriculteurs nous font confiance</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  ArrowRight, Star,
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
  { name: 'Intrants agricoles', sub: 'Engrais, NPK, Urée...', link: '/produits?category=intrants-agricoles', icon: Beaker },
  { name: 'Produits phytosanitaires', sub: 'Insecticides, Fongicides...', link: '/produits?category=produits-phytosanitaires', icon: Bug },
  { name: 'Semences', sub: 'Légumes, Céréales...', link: '/produits?category=semences', icon: Sprout },
  { name: 'Systèmes d\'irrigation', sub: 'Tuyaux, Pompes, Arroseurs...', link: '/produits?category=systemes-irrigation', icon: Droplets },
  { name: 'Machines agricoles', sub: 'Tracteurs, Motoculteurs...', link: '/produits?category=machines-agricoles', icon: Tractor },
  { name: 'Quincaillerie agricole', sub: 'Outils et équipements...', link: '/quincaillerie', icon: Wrench },
]

// Partners
const partners = ['YARA International', 'Bayer CropScience', 'Bejo Zaden', 'STIHL', 'Netafim', 'Syngenta', 'GSN Semences', 'BASF']

// Testimonials
const testimonials = [
  { text: "Les engrais Yara d'AgroShop ont doublé mon rendement de maïs cette saison. Livraison rapide jusqu'à Sokodé !", name: 'Kossi A.', role: 'Agriculteur, Sokodé', initials: 'KA' },
  { text: "Kit d'irrigation installé facilement grâce aux conseils de l'équipe. Mes tomates n'ont jamais été aussi belles.", name: 'Afi M.', role: 'Maraîchère, Kpalimé', initials: 'AM' },
  { text: "Qualité des outils de quincaillerie exceptionnelle. Bien meilleur que ce qu'on trouve au marché local.", name: 'Kofi D.', role: 'Entrepreneur BTP, Lomé', initials: 'KD' },
]

// Featured Products
const featuredProducts = ref([
  { id: 1, nom_commercial: 'Urée YARA 46% N', slug: 'uree-yara-46-n', composition: 'Urée granulée 46% Azote total.', prix_unitaire: 15000, unite_mesure: 'sac 50kg', stock_disponible: 1000, featured: true, url_image: 'storage/produits/urea.jpg', categories: [{ nom: 'Urée' }] },
  { id: 2, nom_commercial: 'Engrais NPK 15-15-15', slug: 'engrais-npk-15-15-15-superfert', composition: '15% N, 15% P2O5, 15% K2O.', prix_unitaire: 18500, unite_mesure: 'sac 50kg', stock_disponible: 750, featured: true, url_image: 'storage/produits/npk.jpg', categories: [{ nom: 'Engrais NPK' }] },
  { id: 5, nom_commercial: "Kit Irrigation 500m²", slug: 'kit-irrigation-goutte-a-goutte-500m2', composition: 'Tuyaux PE 25mm, gaines 16mm.', prix_unitaire: 85000, unite_mesure: 'kit', stock_disponible: 45, featured: true, url_image: 'storage/produits/irrigation_kit.jpg', categories: [{ nom: 'Irrigation' }] },
  { id: 7, nom_commercial: 'Brouette Renforcée 90L', slug: 'brouette-de-chantier-renforcee-90l', composition: 'Bac acier galvanisé 1mm.', prix_unitaire: 32000, unite_mesure: 'unité', stock_disponible: 120, url_image: 'storage/produits/brouette.jpg', categories: [{ nom: 'Quincaillerie' }] },
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
    const data = await $fetch(`${config.public.apiBaseUrl}/produits?per_page=4`)
    if (data?.data?.data?.length > 0) featuredProducts.value = data.data.data
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
