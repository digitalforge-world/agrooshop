<template>
  <div class="space-y-12 pb-16">
    
    <!-- Hero Banner AgroDop -->
    <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-forest-dark text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="max-w-7xl mx-auto space-y-4 text-center sm:text-left relative z-10">
        <span class="inline-block px-3.5 py-1 bg-lime-500/20 text-lime-400 font-bold text-xs uppercase tracking-wider rounded-full border border-lime-500/30">
          Univers AgroDop & Production Agricole
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">
          Intrants, Phytosanitaires & Semences Certifiées
        </h1>
        <p class="text-sm sm:text-base text-emerald-200 max-w-2xl font-medium">
          Retrouvez tous les produits indispensables pour fertiliser vos sols, protéger vos cultures et maximiser vos rendements agricoles au Togo.
        </p>
      </div>
    </div>

    <!-- Products Grid AgroDop -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">
          Catalogue des Produits Agricoles
        </h2>
        <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          {{ agriculturalProducts.length }} articles disponibles
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard 
          v-for="product in agriculturalProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()

const agriculturalProducts = ref([
  {
    id: 1,
    nom_commercial: 'Urée YARA 46% N',
    slug: 'uree-yara-46-n',
    description: 'Engrais azoté concentré idéal pour le maïs, riz et maraîchage.',
    composition: 'Urée granulée 46% Azote total.',
    prix_unitaire: 15000,
    unite_mesure: 'sac 50kg',
    stock_disponible: 1000,
    featured: true,
    url_image: 'storage/produits/urea.jpg',
    categories: [{ nom: 'Intrants / Urée' }]
  },
  {
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    description: 'Engrais équilibré pour le développement harmonieux des cultures.',
    composition: '15% N, 15% P2O5, 15% K2O.',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 750,
    featured: true,
    url_image: 'storage/produits/npk.jpg',
    categories: [{ nom: 'Intrants / NPK' }]
  },
  {
    id: 3,
    nom_commercial: 'Insecticide Katana 50 EC',
    slug: 'insecticide-katana-50-ec',
    description: 'Insecticide polyvalent contre chenilles et pucerons.',
    composition: 'Cyperméthrine 50 g/L.',
    prix_unitaire: 7500,
    unite_mesure: 'flacon 1L',
    stock_disponible: 300,
    featured: false,
    url_image: 'storage/produits/katana.jpg',
    categories: [{ nom: 'Phytosanitaire' }]
  },
  {
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    description: 'Maïs hybride à haut rendement résistant à la sécheresse.',
    composition: 'Semence certifiée Zea mays.',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    stock_disponible: 500,
    featured: true,
    url_image: 'storage/produits/mais_pan53.jpg',
    categories: [{ nom: 'Semences' }]
  },
  {
    id: 5,
    nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²',
    slug: 'kit-irrigation-goutte-a-goutte-500m2',
    description: 'Système d\'irrigation complet pour maraîchage et serres.',
    composition: 'Tuyaux PE 25mm, gaines 16mm, filtre à disque.',
    prix_unitaire: 85000,
    unite_mesure: 'kit complet',
    stock_disponible: 45,
    featured: true,
    url_image: 'storage/produits/irrigation_kit.jpg',
    categories: [{ nom: 'Irrigation' }]
  },
  {
    id: 6,
    nom_commercial: 'Atomiseur STIHL SR 450',
    slug: 'atomiseur-stihl-sr-450',
    description: 'Appareil de pulvérisation motorisé haute performance.',
    composition: 'Moteur 2T STIHL 63.3cm³, réservoir 14L.',
    prix_unitaire: 515000,
    unite_mesure: 'unité',
    stock_disponible: 25,
    featured: true,
    url_image: 'storage/produits/stihl.jpg',
    categories: [{ nom: 'Machines Agricoles' }]
  }
])

onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/produits?category=intrants-agricoles`)
    if (res && res.data && res.data.data && res.data.data.length > 0) {
      agriculturalProducts.value = res.data.data
    }
  } catch (e) {
    console.warn('API fetch error for AgroDop, using fallback data', e)
  }
})
</script>
