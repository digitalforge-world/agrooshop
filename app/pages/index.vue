<template>
  <div>

    <!-- ═══ HERO ═══ -->
    <HeroSection />


    <!-- ═══ TRUST STRIP ═══ -->
    <section class="border-b border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          <div v-for="(item, idx) in trustItems" :key="idx" class="flex items-center gap-3 py-6 px-4">
            <div class="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
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
        <div class="flex items-baseline justify-between mb-10">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Nos catégories populaires</h2>
            <p class="mt-1 text-sm text-gray-500">Retrouvez tous les produits essentiels pour votre exploitation agricole.</p>
          </div>
          <NuxtLink to="/produits" class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Voir toutes les catégories
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <NuxtLink 
            v-for="(cat, idx) in categoryCards" :key="idx"
            :to="cat.link"
            class="group flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div class="w-14 h-14 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
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
        <div class="flex items-baseline justify-between mb-10">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Produits populaires</h2>
            <p class="mt-1 text-sm text-gray-500">Les produits les plus commandés par nos clients.</p>
          </div>
          <NuxtLink to="/produits" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-600 transition-colors">
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

        <!-- Products -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
      </div>
    </section>


    <!-- ═══ CALCULATOR ═══ -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FertilizerCalculator />
      </div>
    </section>


    <!-- ═══ PARTNERS ═══ -->
    <section class="bg-gray-50 py-16">
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
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-xl font-bold text-gray-900">Ce que disent nos clients</h2>
          <p class="mt-1 text-sm text-gray-500">Plus de 2000 agriculteurs nous font confiance</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="(t, idx) in testimonials" :key="idx"
            class="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex gap-0.5 mb-3">
              <Star v-for="i in 5" :key="i" class="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ t.text }}</p>
            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div class="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
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


    <!-- ═══ GUIDES ═══ -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between mb-10">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Fiches techniques & guides</h2>
            <p class="mt-1 text-sm text-gray-500">Téléchargez nos ressources gratuitement.</p>
          </div>
          <NuxtLink to="/blog" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-600">
            Tous les articles
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article v-for="(g, idx) in guides" :key="idx" class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div :class="['h-1', g.bar]"></div>
            <div class="p-5 space-y-3">
              <span :class="['inline-block px-2.5 py-1 text-[11px] font-medium rounded-md', g.tagClass]">{{ g.tag }}</span>
              <h3 class="text-sm font-semibold text-gray-900">{{ g.title }}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">{{ g.desc }}</p>
              <a :href="g.url" target="_blank" class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-600 transition-colors pt-1">
                <Download class="w-4 h-4" />
                {{ g.btn }}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>


    <!-- ═══ NEWSLETTER ═══ -->
    <section class="bg-emerald-800">
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
            <button @click="subscribe" class="px-6 py-3 bg-white text-emerald-800 font-semibold text-sm rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer">
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { 
  Lock, MessageSquare, ArrowRight, Star, Download,
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

// Guides
const apiBase = config.public?.apiBaseUrl ? config.public.apiBaseUrl.replace('/api', '') : 'http://localhost:8000'
const guides = [
  { tag: 'Fiche technique', tagClass: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500', title: 'Urée YARA 46% N — Dosages par hectare', desc: "Fiche officielle : dosages, moments d'application et précautions.", url: `${apiBase}/storage/documents/ft_urea_yara.pdf`, btn: 'Télécharger (1.0 MB)' },
  { tag: 'Sécurité', tagClass: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500', title: 'Katana 50 EC — Notice de sécurité', desc: "Consignes d'utilisation sécurisée contre les ravageurs.", url: `${apiBase}/storage/documents/guide_katana_50ec.pdf`, btn: 'Télécharger (512 KB)' },
  { tag: 'Manuel', tagClass: 'bg-blue-50 text-blue-700', bar: 'bg-blue-500', title: 'STIHL SR 450 — Manuel utilisateur', desc: "Utilisation, mélange carburant et entretien périodique.", url: `${apiBase}/storage/documents/manuel_stihl_sr450.pdf`, btn: 'Télécharger (2.0 MB)' },
]

// Products
const featuredProducts = ref([
  { id: 1, nom_commercial: 'Urée YARA 46% N', slug: 'uree-yara-46-n', composition: 'Urée granulée 46% Azote total.', prix_unitaire: 15000, unite_mesure: 'sac 50kg', stock_disponible: 1000, featured: true, url_image: 'storage/produits/urea.jpg', categories: [{ nom: 'Urée' }] },
  { id: 2, nom_commercial: 'Engrais NPK 15-15-15', slug: 'engrais-npk-15-15-15-superfert', composition: '15% N, 15% P2O5, 15% K2O.', prix_unitaire: 18500, unite_mesure: 'sac 50kg', stock_disponible: 750, featured: true, url_image: 'storage/produits/npk.jpg', categories: [{ nom: 'Engrais NPK' }] },
  { id: 5, nom_commercial: "Kit Irrigation 500m²", slug: 'kit-irrigation-goutte-a-goutte-500m2', composition: 'Tuyaux PE 25mm, gaines 16mm.', prix_unitaire: 85000, unite_mesure: 'kit', stock_disponible: 45, featured: true, url_image: 'storage/produits/irrigation_kit.jpg', categories: [{ nom: 'Irrigation' }] },
  { id: 7, nom_commercial: 'Brouette Renforcée 90L', slug: 'brouette-de-chantier-renforcee-90l', composition: 'Bac acier galvanisé 1mm.', prix_unitaire: 32000, unite_mesure: 'unité', stock_disponible: 120, url_image: 'storage/produits/brouette.jpg', categories: [{ nom: 'Quincaillerie' }] },
])

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBaseUrl}/produits?per_page=4`)
    if (data?.data?.data?.length > 0) featuredProducts.value = data.data.data
  } catch (e) {
    console.warn('API offline, using fallback data', e)
  }
  isLoading.value = false
})

const subscribe = () => {
  if (!email.value) return
  alert(`Merci ! Code -5% : BIENVENUE5 envoyé à ${email.value}`)
  email.value = ''
}
</script>
