<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen && product" 
        @click="close"
        class="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
      >
        <!-- Modal Card Container -->
        <div 
          @click.stop
          class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-modal-in"
        >
          <!-- Close Button -->
          <button 
            @click="close"
            class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-600 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            aria-label="Fermer"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Left Column: Product Image Gallery -->
          <div class="md:w-1/2 bg-gradient-to-b from-slate-50 to-emerald-50/30 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-100 relative min-h-[300px]">
            <!-- Top Badges -->
            <div class="w-full flex items-center justify-between gap-2 z-10">
              <span class="px-3 py-1 bg-emerald-800 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-xs">
                {{ mainCategory }}
              </span>

              <span 
                :class="['text-[11px] font-bold px-3 py-1 rounded-full shadow-xs', stockBadge.class]"
              >
                {{ stockBadge.label }}
              </span>
            </div>

            <!-- Main Image -->
            <div class="w-full h-64 sm:h-80 flex items-center justify-center p-4 my-auto relative">
              <img 
                :src="activeImage" 
                :alt="product.nom_commercial"
                class="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-md"
                @error="handleImageError"
              />
            </div>

            <!-- Trust Indicator below image -->
            <div class="w-full bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-emerald-100 flex items-center justify-around text-center text-xs text-slate-700 font-semibold shadow-xs">
              <div class="flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-emerald-600" />
                <span>100% Certifié</span>
              </div>
              <div class="h-4 w-px bg-slate-200"></div>
              <div class="flex items-center gap-1.5">
                <Truck class="w-4 h-4 text-emerald-600" />
                <span>Livraison Togo</span>
              </div>
              <div class="h-4 w-px bg-slate-200"></div>
              <div class="flex items-center gap-1.5">
                <Leaf class="w-4 h-4 text-emerald-600" />
                <span>Qualité Pro</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Product Info & Buy Action -->
          <div class="md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto justify-between space-y-6">
            <!-- Header Info -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="flex items-center text-amber-400">
                  <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-amber-400" />
                </div>
                <span class="text-xs font-bold text-slate-500">(4.9 / 5 - Avis agronomes)</span>
              </div>

              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {{ product.nom_commercial }}
              </h2>

              <p v-if="product.composition" class="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-200">
                Composition : {{ product.composition }}
              </p>

              <!-- Price Box -->
              <div class="pt-2 flex items-baseline gap-3">
                <span class="text-3xl font-black text-emerald-800">
                  {{ Number(product.prix_unitaire).toLocaleString('fr-FR') }} <span class="text-sm font-bold text-slate-500">FCFA</span>
                </span>
                <span class="text-xs font-semibold text-slate-400">/ {{ product.unite_mesure || 'unité' }}</span>
              </div>
            </div>

            <!-- Description / Tabs -->
            <div class="space-y-3 border-t border-b border-slate-100 py-4">
              <div class="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
                <button 
                  @click="activeTab = 'description'"
                  :class="['pb-2 border-b-2 transition-colors cursor-pointer', activeTab === 'description' ? 'border-emerald-700 text-emerald-800' : 'border-transparent hover:text-slate-800']"
                >
                  Description
                </button>
                <button 
                  @click="activeTab = 'conseils'"
                  :class="['pb-2 border-b-2 transition-colors cursor-pointer', activeTab === 'conseils' ? 'border-emerald-700 text-emerald-800' : 'border-transparent hover:text-slate-800']"
                >
                  Conseils Agronomiques
                </button>
                <button 
                  @click="activeTab = 'livraison'"
                  :class="['pb-2 border-b-2 transition-colors cursor-pointer', activeTab === 'livraison' ? 'border-emerald-700 text-emerald-800' : 'border-transparent hover:text-slate-800']"
                >
                  Livraison
                </button>
              </div>

              <!-- Tab Content -->
              <div class="text-xs text-slate-600 leading-relaxed min-h-[70px]">
                <div v-if="activeTab === 'description'">
                  <p>{{ product.description || 'Intrant et équipement agricole de première qualité certifié pour maximiser le rendement de vos cultures et chantiers au Togo.' }}</p>
                </div>

                <div v-else-if="activeTab === 'conseils'">
                  <ul class="space-y-1.5 list-disc list-inside text-slate-700 font-medium">
                    <li>Utiliser selon le dosage préconisé par nos ingénieurs agronomes.</li>
                    <li>Conserver dans un endroit sec à l'abri de l'humidité directe.</li>
                    <li>Assistance téléphonique disponible 7j/7 avec nos techniciens.</li>
                  </ul>
                </div>

                <div v-else-if="activeTab === 'livraison'">
                  <p class="font-medium text-slate-700">Expédition rapide sur toute l'étendue du territoire togolais :</p>
                  <p class="mt-1">⚡ <strong>Lomé & banlieues</strong> : Livraison express sous 24h.</p>
                  <p>🚚 <strong>Régions du Togo</strong> : Expédition sous 48h à 72h.</p>
                </div>
              </div>
            </div>

            <!-- Quantity & Actions Box -->
            <div class="space-y-4">
              <!-- Quantity Selector & Line Total -->
              <div class="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span class="text-xs font-bold text-slate-700">Quantité :</span>
                <div class="flex items-center gap-3">
                  <div class="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                    <button 
                      @click="quantity > 1 ? quantity-- : null"
                      class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >-</button>
                    <span class="px-3 text-xs font-extrabold text-slate-900">{{ quantity }}</span>
                    <button 
                      @click="quantity < (product.stock_disponible || 999) ? quantity++ : null"
                      class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >+</button>
                  </div>

                  <span class="text-sm font-black text-emerald-800">
                    {{ (Number(product.prix_unitaire) * quantity).toLocaleString('fr-FR') }} FCFA
                  </span>
                </div>
              </div>

              <!-- Main Buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  @click="handleAddToCart"
                  :disabled="product.stock_disponible <= 0"
                  :class="[
                    'w-full py-3.5 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95',
                    product.stock_disponible > 0 
                      ? 'bg-emerald-800 hover:bg-emerald-700 text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <ShoppingCart v-if="!isAdded" class="w-4 h-4" />
                  <Check v-else class="w-4 h-4 text-lime-300" />
                  <span>{{ isAdded ? 'Ajouté au panier !' : 'Ajouter au panier' }}</span>
                </button>

                <button
                  @click="handleBuyNow"
                  :disabled="product.stock_disponible <= 0"
                  class="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap class="w-4 h-4" />
                  <span>Acheter maintenant</span>
                </button>
              </div>

              <!-- WhatsApp Quick Order -->
              <a 
                :href="whatsappOrderUrl"
                target="_blank"
                @click="trackWhatsappClick"
                class="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageSquare class="w-4 h-4 text-emerald-600" />
                <span>Commander directement par WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, ShoppingCart, Check, ShieldCheck, Truck, Leaf, Star, MessageSquare, Zap } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  product: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const cartStore = useCartStore()
const quantity = ref(1)
const isAdded = ref(false)
const activeTab = ref('description')
const isFallback = ref(false)

const fallbackImage = '/images/Agroshopproduit .png'

watch(() => props.product, () => {
  quantity.value = 1
  isAdded.value = false
  isFallback.value = false
})

const { getImageUrl } = useMedia()

const activeImage = computed(() => {
  if (!props.product || isFallback.value) return fallbackImage
  const raw = props.product.image_principale?.url_image || props.product.url_image
  return getImageUrl(raw)
})

const handleImageError = () => {
  isFallback.value = true
}

const mainCategory = computed(() => {
  return props.product?.categories?.[0]?.nom || 'Produit AgroShop'
})

const stockBadge = computed(() => {
  const stock = props.product?.stock_disponible ?? 0
  if (stock <= 0) return { label: 'Sur commande', class: 'bg-amber-100 text-amber-800 border border-amber-200' }
  if (stock <= 10) return { label: `Dernières unités (${stock})`, class: 'bg-amber-100 text-amber-800 border border-amber-200' }
  return { label: 'Disponible - Expédition 24h', class: 'bg-emerald-100 text-emerald-800 border border-emerald-200' }
})

const whatsappOrderUrl = computed(() => {
  if (!props.product) return '#'
  const total = Number(props.product.prix_unitaire) * quantity.value
  const text = `Bonjour AgroShop,%0AJesouhaite commander le produit suivant :%0A- ${props.product.nom_commercial} (x${quantity.value}) : ${total.toLocaleString('fr-FR')} FCFA`
  const phone = useRuntimeConfig().public.whatsappNumber || '22898706081'
  return `https://wa.me/${phone}?text=${text}`
})

const trackWhatsappClick = () => {
  try {
    if (typeof window === 'undefined' || !props.product) return
    const config = useRuntimeConfig()
    const total = Number(props.product.prix_unitaire) * quantity.value
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'clic_whatsapp',
        details: `Commande WhatsApp Modal: "${props.product.nom_commercial}" (x${quantity.value}) - ${total.toLocaleString('fr-FR')} FCFA`
      }
    })
  } catch (e) {}
}

const handleAddToCart = () => {
  if (!props.product) return
  cartStore.addItem(props.product, quantity.value)
  isAdded.value = true
  setTimeout(() => { isAdded.value = false }, 1500)
}

const handleBuyNow = () => {
  if (!props.product) return
  cartStore.addItem(props.product, quantity.value)
  close()
  cartStore.openCheckout()
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
