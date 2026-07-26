<template>
  <div class="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
    
    <div class="relative z-10 max-w-5xl mx-auto space-y-8">
      
      <!-- Header Badge & Title -->
      <div class="text-center max-w-2xl mx-auto space-y-2.5">
       
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
          Calculateur de Dosage <span class="text-emerald-700">Engrais & Semences</span>
        </h2>
        
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Obtenez instantanément les quantités exactes d'Urée 46% N, d'Engrais NPK et de Semences certifiées adaptées à votre surface agricole au Togo.
        </p>
      </div>

      <!-- Step 1: Crop Selection Cards -->
      <div class="space-y-3">
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <span>1. Choisissez votre culture</span>
          <span class="h-px bg-slate-200 flex-1"></span>
        </label>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button 
            v-for="crop in cropOptions" 
            :key="crop.id"
            @click="selectedCrop = crop.id"
            :class="[
              'p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative',
              selectedCrop === crop.id 
                ? 'bg-emerald-700 text-white border-emerald-700' 
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            ]"
          >
            <div class="flex items-center justify-between">
              <div :class="selectedCrop === crop.id ? 'text-white' : 'text-emerald-700'" class="text-xl">
                <i :class="crop.icon"></i>
              </div>
              <div 
                v-if="selectedCrop === crop.id" 
                class="w-5 h-5 rounded-full bg-white text-emerald-800 flex items-center justify-center font-bold text-[10px]"
              >
                <i class="fa-solid fa-check"></i>
              </div>
            </div>
            <div>
              <p class="font-bold text-xs sm:text-sm" :class="selectedCrop === crop.id ? 'text-white' : 'text-slate-900'">{{ crop.name }}</p>
              <p class="text-[10px] font-medium leading-tight mt-0.5" :class="selectedCrop === crop.id ? 'text-emerald-100' : 'text-slate-500'">{{ crop.subtitle }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 2: Surface Slider & Inputs -->
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label class="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Surface de la parcelle (en Hectares)
          </label>

          <!-- Quick Presets -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[11px] text-slate-400 font-semibold">Raccourcis :</span>
            <button 
              v-for="preset in [0.5, 1, 2, 5, 10]" 
              :key="preset"
              @click="hectares = preset"
              :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer',
                hectares === preset ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
              ]"
            >
              {{ preset }} Ha
            </button>
          </div>
        </div>

        <!-- Slider & Input Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div class="sm:col-span-8 space-y-2">
            <input 
              v-model.number="hectares" 
              type="range" 
              min="0.5" 
              max="20" 
              step="0.5" 
              class="w-full accent-emerald-700 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
            <div class="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
              <span>0.5 Ha</span>
              <span>5 Ha</span>
              <span>10 Ha</span>
              <span>20 Ha</span>
            </div>
          </div>

          <div class="sm:col-span-4 relative">
            <input 
              v-model.number="hectares"
              type="number"
              min="0.5"
              step="0.5"
              class="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-20 py-2.5 text-base font-black font-mono text-slate-900 focus:outline-none focus:border-emerald-600 text-center"
            />
            <span class="absolute right-3 top-3 text-xs font-bold text-emerald-800 font-mono">Hectare(s)</span>
          </div>
        </div>
      </div>

      <!-- Step 3: Calculation Results Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <!-- Urea Result Card -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-400 transition-all space-y-4">
          <div>
            <div class="flex justify-between items-center text-xs font-semibold mb-2">
              <span class="text-slate-500 text-[10px] uppercase font-bold">Engrais Azoté</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">Urée YARA 46%</span>
            </div>

            <div class="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
              <span>{{ calculatedUreaBags }}</span>
              <span class="text-xs font-semibold text-slate-500">sacs (50kg)</span>
            </div>
            
            <p class="text-[11px] text-slate-500 mt-1">Soit <strong class="text-slate-800">{{ calculatedUreaBags * 50 }} kg</strong> d'Urée au total</p>
            <p class="text-xs font-mono font-bold text-emerald-700 mt-2">{{ formatPrice(calculatedUreaBags * 15000) }} FCFA</p>
          </div>

          <button 
            @click="addUreaToCart"
            class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot ({{ calculatedUreaBags }} sacs)</span>
          </button>
        </div>

        <!-- NPK Result Card -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-400 transition-all space-y-4">
          <div>
            <div class="flex justify-between items-center text-xs font-semibold mb-2">
              <span class="text-slate-500 text-[10px] uppercase font-bold">Fertilisation NPK</span>
              <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold">NPK 15-15-15</span>
            </div>

            <div class="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
              <span>{{ calculatedNpkBags }}</span>
              <span class="text-xs font-semibold text-slate-500">sacs (50kg)</span>
            </div>
            
            <p class="text-[11px] text-slate-500 mt-1">Soit <strong class="text-slate-800">{{ calculatedNpkBags * 50 }} kg</strong> de NPK au total</p>
            <p class="text-xs font-mono font-bold text-emerald-700 mt-2">{{ formatPrice(calculatedNpkBags * 18500) }} FCFA</p>
          </div>

          <button 
            @click="addNpkToCart"
            class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot ({{ calculatedNpkBags }} sacs)</span>
          </button>
        </div>

        <!-- Seeds Result Card -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-400 transition-all space-y-4">
          <div>
            <div class="flex justify-between items-center text-xs font-semibold mb-2">
              <span class="text-slate-500 text-[10px] uppercase font-bold">Semences Certifiées</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">Semences Hybrides</span>
            </div>

            <div class="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
              <span>{{ calculatedSeedsBags }}</span>
              <span class="text-xs font-semibold text-slate-500">sacs (5kg)</span>
            </div>
            
            <p class="text-[11px] text-slate-500 mt-1">Densité de semis conseillée pour {{ hectares }} Ha</p>
            <p class="text-xs font-mono font-bold text-emerald-700 mt-2">{{ formatPrice(calculatedSeedsBags * 12000) }} FCFA</p>
          </div>

          <button 
            @click="addSeedsToCart"
            class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShoppingCart class="w-3.5 h-3.5" />
            <span>Ajouter ce lot ({{ calculatedSeedsBags }} sacs)</span>
          </button>
        </div>

      </div>

      <!-- Master CTA Order Pack Button -->
      <div class="pt-2">
        <button 
          @click="addAllPackToCart"
          class="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
        >
          <Sparkles class="w-5 h-5 text-amber-300" />
          <span>Commander TOUT le Pack Recommandé — <span class="font-mono text-white font-black">{{ formatPrice(totalPricePack) }} FCFA</span></span>
        </button>

        <p v-if="showSuccessFeedback" class="text-center text-xs font-bold text-emerald-700 mt-2 animate-fade-in">
          Pack complet de {{ hectares }} Hectare(s) ajouté avec succès à votre panier !
        </p>
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
const showSuccessFeedback = ref(false)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const cropOptions = [
  { id: 'mais', name: 'Maïs', subtitle: 'Culture Vivrière', icon: 'fa-solid fa-wheat-awn' },
  { id: 'riz', name: 'Riz', subtitle: 'Irrigué / Bas-fond', icon: 'fa-solid fa-seedling' },
  { id: 'maraichage', name: 'Maraîchage', subtitle: 'Tomate, Piment, Oignon', icon: 'fa-solid fa-leaf' },
  { id: 'coton', name: 'Coton', subtitle: 'Culture Industrielle', icon: 'fa-solid fa-tree' }
]

// Rates per Hectare in Bags (50kg for fertilizers, 5kg for seeds)
const cropRates = {
  mais: { ureaBagsPerHa: 2, npkBagsPerHa: 4, seedsBagsPerHa: 4 },
  riz: { ureaBagsPerHa: 3, npkBagsPerHa: 3, seedsBagsPerHa: 5 },
  maraichage: { ureaBagsPerHa: 1, npkBagsPerHa: 3, seedsBagsPerHa: 2 },
  coton: { ureaBagsPerHa: 2, npkBagsPerHa: 4, seedsBagsPerHa: 3 }
}

const calculatedUreaBags = computed(() => {
  const rate = cropRates[selectedCrop.value]?.ureaBagsPerHa || 2
  return Math.ceil(rate * (hectares.value || 1))
})

const calculatedNpkBags = computed(() => {
  const rate = cropRates[selectedCrop.value]?.npkBagsPerHa || 4
  return Math.ceil(rate * (hectares.value || 1))
})

const calculatedSeedsBags = computed(() => {
  const rate = cropRates[selectedCrop.value]?.seedsBagsPerHa || 4
  return Math.ceil(rate * (hectares.value || 1))
})

const totalPricePack = computed(() => {
  return (calculatedUreaBags.value * 15000) + (calculatedNpkBags.value * 18500) + (calculatedSeedsBags.value * 12000)
})

const triggerSuccess = () => {
  showSuccessFeedback.value = true
  setTimeout(() => {
    showSuccessFeedback.value = false
  }, 3500)
}

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
  triggerSuccess()
}

const addNpkToCart = () => {
  cartStore.addItem({
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    url_image: 'storage/produits/npk.jpg',
    stock_disponible: 1000
  }, calculatedNpkBags.value)
  triggerSuccess()
}

const addSeedsToCart = () => {
  cartStore.addItem({
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    url_image: 'storage/produits/seeds.jpg',
    stock_disponible: 500
  }, calculatedSeedsBags.value)
  triggerSuccess()
}

const addAllPackToCart = () => {
  addUreaToCart()
  addNpkToCart()
  addSeedsToCart()
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
