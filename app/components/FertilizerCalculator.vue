<template>
  <div class="bg-gradient-to-br from-emerald-950 via-emerald-900 to-forest-dark text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-emerald-700/50">
    
    <!-- Background Decorative Elements -->
    <div class="absolute -top-12 -right-12 w-48 h-48 bg-lime-500/10 rounded-full blur-2xl"></div>
    <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>

    <div class="relative z-10 max-w-4xl mx-auto">
      
      <!-- Header Title -->
      <div class="text-center max-w-xl mx-auto mb-8">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lime-500/20 text-lime-400 text-xs font-bold uppercase tracking-wider mb-2 border border-lime-500/30">
          <Calculator class="w-3.5 h-3.5" /> Outil d'Expertise Agronomique
        </span>
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Calculateur de Dosage Engrais & Semences
        </h2>
        <p class="text-xs sm:text-sm text-emerald-200 mt-2">
          Sélectionnez votre culture et indiquez votre surface en Hectares pour obtenir les quantités exactes d'engrais recommandées.
        </p>
      </div>

      <!-- Inputs Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
        
        <!-- Crop Type Select -->
        <div>
          <label class="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
            1. Choisissez votre culture
          </label>
          <select 
            v-model="selectedCrop"
            class="w-full bg-emerald-900/80 border border-emerald-600 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
          >
            <option value="mais">Maïs (Culture vivrière)</option>
            <option value="riz">Riz (Irrigué / Bas-fond)</option>
            <option value="maraichage">Maraîchage (Tomate, Betterave, Piment)</option>
            <option value="coton">Coton (Culture industrielle)</option>
          </select>
        </div>

        <!-- Surface Area Input -->
        <div>
          <label class="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
            2. Surface de la parcelle (en Hectares)
          </label>
          <div class="relative">
            <input 
              v-model.number="hectares"
              type="number"
              min="0.5"
              step="0.5"
              class="w-full bg-emerald-900/80 border border-emerald-600 rounded-xl pl-4 pr-16 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <span class="absolute right-4 top-3 text-xs font-bold text-emerald-300">Hectare(s)</span>
          </div>
        </div>

      </div>

      <!-- Calculation Results Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        
        <!-- Urea Result Card -->
        <div class="bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all">
          <div>
            <div class="flex justify-between items-center text-xs text-emerald-300 font-semibold mb-1">
              <span>Engrais Azoté</span>
              <span class="text-lime-400 font-bold">Urée YARA 46%</span>
            </div>
            <div class="text-2xl font-black text-white">
              {{ calculatedUreaBags }} <span class="text-sm font-normal text-emerald-200">sacs (50kg)</span>
            </div>
            <p class="text-[11px] text-emerald-200/80 mt-1">Soit {{ calculatedUreaBags * 50 }} kg au total</p>
          </div>
          <button 
            @click="addUreaToCart"
            class="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot</span>
          </button>
        </div>

        <!-- NPK Result Card -->
        <div class="bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all">
          <div>
            <div class="flex justify-between items-center text-xs text-emerald-300 font-semibold mb-1">
              <span>Engrais Équilibré</span>
              <span class="text-amber-400 font-bold">NPK 15-15-15</span>
            </div>
            <div class="text-2xl font-black text-white">
              {{ calculatedNpkBags }} <span class="text-sm font-normal text-emerald-200">sacs (50kg)</span>
            </div>
            <p class="text-[11px] text-emerald-200/80 mt-1">Soit {{ calculatedNpkBags * 50 }} kg au total</p>
          </div>
          <button 
            @click="addNpkToCart"
            class="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot</span>
          </button>
        </div>

        <!-- Seeds / Phyto Result Card -->
        <div class="bg-white/10 border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all">
          <div>
            <div class="flex justify-between items-center text-xs text-emerald-300 font-semibold mb-1">
              <span>Semences Recommandées</span>
              <span class="text-lime-400 font-bold">Maïs PAN 53</span>
            </div>
            <div class="text-2xl font-black text-white">
              {{ calculatedSeedsBags }} <span class="text-sm font-normal text-emerald-200">sacs (5kg)</span>
            </div>
            <p class="text-[11px] text-emerald-200/80 mt-1">Densité de semis optimale</p>
          </div>
          <button 
            @click="addSeedsToCart"
            class="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot</span>
          </button>
        </div>

      </div>

      <!-- 1-Click All Pack CTA -->
      <div class="mt-6 text-center">
        <button 
          @click="addAllPackToCart"
          class="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 cursor-pointer"
        >
          <Sparkles class="w-4 h-4" />
          <span>Ajouter TOUT le pack recommandé au panier ({{ totalPricePack.toLocaleString('fr-FR') }} FCFA)</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingCart, Sparkles, Calculator } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const selectedCrop = ref('mais')
const hectares = ref(1)

// Rates per Hectare in Bags (50kg for fertilizers, 5kg for seeds)
const cropData = {
  mais: { ureaBagsPerHa: 2, npkBagsPerHa: 4, seedsBagsPerHa: 4 },
  riz: { ureaBagsPerHa: 3, npkBagsPerHa: 3, seedsBagsPerHa: 5 },
  maraichage: { ureaBagsPerHa: 1, npkBagsPerHa: 3, seedsBagsPerHa: 2 },
  coton: { ureaBagsPerHa: 2, npkBagsPerHa: 4, seedsBagsPerHa: 3 }
}

const calculatedUreaBags = computed(() => {
  const rate = cropData[selectedCrop.value]?.ureaBagsPerHa || 2
  return Math.ceil(rate * (hectares.value || 1))
})

const calculatedNpkBags = computed(() => {
  const rate = cropData[selectedCrop.value]?.npkBagsPerHa || 4
  return Math.ceil(rate * (hectares.value || 1))
})

const calculatedSeedsBags = computed(() => {
  const rate = cropData[selectedCrop.value]?.seedsBagsPerHa || 4
  return Math.ceil(rate * (hectares.value || 1))
})

const totalPricePack = computed(() => {
  return (calculatedUreaBags.value * 15000) + (calculatedNpkBags.value * 18500) + (calculatedSeedsBags.value * 12000)
})

const addUreaToCart = () => {
  cartStore.addItem({
    id: 1,
    nom_commercial: 'Urée YARA 46% N',
    slug: 'uree-yara-46-n',
    prix_unitaire: 15000,
    unite_mesure: 'sac 50kg',
    url_image: 'storage/produits/urea.jpg',
    stock_disponible: 1000
  }, calculatedUreaBags.value)
}

const addNpkToCart = () => {
  cartStore.addItem({
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    url_image: 'storage/produits/npk.jpg',
    stock_disponible: 750
  }, calculatedNpkBags.value)
}

const addSeedsToCart = () => {
  cartStore.addItem({
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    url_image: 'storage/produits/mais_pan53.jpg',
    stock_disponible: 500
  }, calculatedSeedsBags.value)
}

const addAllPackToCart = () => {
  addUreaToCart()
  addNpkToCart()
  addSeedsToCart()
}
</script>
