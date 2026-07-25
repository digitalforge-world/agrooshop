<template>
  <div class="space-y-12 pb-16">
    
    <!-- Hero Banner Quincaillerie -->
    <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="max-w-7xl mx-auto space-y-4 text-center sm:text-left relative z-10">
        <span class="inline-block px-3.5 py-1 bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-500/30">
          🛠️ Univers Quincaillerie & Matériel de Chantier
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">
          Outillage Pro, Brouettes & Équipements
        </h1>
        <p class="text-sm sm:text-base text-slate-300 max-w-2xl font-medium">
          Matériel de quincaillerie professionnelle pour le maraîchage, le BTP, le défrichement et l'aménagement agricole au Togo.
        </p>
      </div>
    </div>

    <!-- Products Grid Quincaillerie -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900">
          Catalogue Quincaillerie & Outillage
        </h2>
        <span class="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          {{ quincaillerieProducts.length }} articles disponibles
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard 
          v-for="product in quincaillerieProducts" 
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

const quincaillerieProducts = ref([
  {
    id: 7,
    nom_commercial: 'Brouette de Chantier Renforcée 90L',
    slug: 'brouette-de-chantier-renforcee-90l',
    description: 'Brouette professionnelle de quincaillerie pour transport lourd.',
    composition: 'Bac acier galvanisé 1mm, châssis 32mm, roue gonflable 400mm.',
    prix_unitaire: 32000,
    unite_mesure: 'unité',
    stock_disponible: 120,
    featured: false,
    url_image: 'storage/produits/brouette.jpg',
    categories: [{ nom: 'Quincaillerie / Équipements' }]
  },
  {
    id: 8,
    nom_commercial: 'Machette d\'Agriculture & Chantier 22"',
    slug: 'machette-agriculture-chantier-22',
    description: 'Outil de coupe en acier au carbone poli.',
    composition: 'Lame acier au carbone 55cm, manche antidérapant.',
    prix_unitaire: 4500,
    unite_mesure: 'unité',
    stock_disponible: 250,
    featured: true,
    url_image: 'storage/produits/machette.jpg',
    categories: [{ nom: 'Quincaillerie / Outillage Manuel' }]
  }
])

onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/produits?category=quincaillerie`)
    if (res && res.data && res.data.data && res.data.data.length > 0) {
      quincaillerieProducts.value = res.data.data
    }
  } catch (e) {
    console.warn('API fetch error for Quincaillerie, using fallback test products', e)
  }
})
</script>
