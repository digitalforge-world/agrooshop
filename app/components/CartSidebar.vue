<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <div 
      v-if="cartStore.isOpen" 
      @click="cartStore.toggleCart(false)"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity"
    ></div>

    <!-- Slide-in Drawer -->
    <div 
      :class="[
        'fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
        cartStore.isOpen ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <!-- Header -->
      <div class="p-5 bg-gradient-to-r from-emerald-900 to-forest-dark text-white flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-6 h-6 text-lime-400" />
          <h2 class="text-lg font-bold">Votre Panier</h2>
          <span class="text-xs bg-emerald-700/80 px-2 py-0.5 rounded-full text-emerald-100 font-semibold">
            {{ cartStore.totalQuantity }} article(s)
          </span>
        </div>
        <button 
          @click="cartStore.toggleCart(false)"
          class="p-1 rounded-full hover:bg-emerald-800/80 text-white transition-colors cursor-pointer"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Cart Items List -->
      <div v-if="cartStore.items.length > 0" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div 
          v-for="item in cartStore.items" 
          :key="item.id"
          class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-colors"
        >
          <!-- Product Thumbnail -->
          <div class="w-16 h-16 rounded-lg bg-white p-1 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img 
              :src="item.url_image" 
              :alt="item.nom_commercial" 
              class="w-full h-full object-contain"
              @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop&q=60'"
            />
          </div>

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-800 truncate">{{ item.nom_commercial }}</h4>
            <p class="text-xs font-semibold text-emerald-700 mt-0.5">
              {{ item.prix_unitaire.toLocaleString('fr-FR') }} FCFA <span class="text-slate-400 font-normal">/ {{ item.unite_mesure }}</span>
            </p>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-2 mt-2">
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantite - 1)"
                class="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >-</button>
              <span class="text-xs font-bold text-slate-800 w-6 text-center">{{ item.quantite }}</span>
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantite + 1)"
                class="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >+</button>
            </div>
          </div>

          <!-- Total & Remove -->
          <div class="flex flex-col items-end gap-2">
            <span class="text-sm font-extrabold text-slate-900">
              {{ (item.prix_unitaire * item.quantite).toLocaleString('fr-FR') }} FCFA
            </span>
            <button 
              @click="cartStore.removeItem(item.id)"
              class="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty Cart View -->
      <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div class="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
          <ShoppingBag class="w-10 h-10" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Votre panier est vide</h3>
        <p class="text-sm text-slate-500 mt-1 max-w-xs">
          Explorez nos produits agricoles et matériel de quincaillerie certifiés.
        </p>
        <button 
          @click="cartStore.toggleCart(false)"
          class="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full shadow-md transition-colors cursor-pointer"
        >
          Découvrir le catalogue
        </button>
      </div>

      <!-- Footer Summary & Checkout Button -->
      <div v-if="cartStore.items.length > 0" class="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
        <div class="flex justify-between text-xs text-slate-600">
          <span>Sous-total HT</span>
          <span>{{ cartStore.totalPriceHT.toLocaleString('fr-FR') }} FCFA</span>
        </div>
        <div class="flex justify-between text-xs text-slate-600">
          <span>TVA (18%)</span>
          <span>{{ cartStore.tvaAmount.toLocaleString('fr-FR') }} FCFA</span>
        </div>
        <div class="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
          <span>Total TTC</span>
          <span class="text-emerald-700">{{ cartStore.totalPriceTTC.toLocaleString('fr-FR') }} FCFA</span>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <NuxtLink 
            to="/checkout"
            @click="cartStore.toggleCart(false)"
            class="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm text-center rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Commander</span>
            <ArrowRight class="w-4 h-4" />
          </NuxtLink>

          <a 
            :href="whatsappCheckoutUrl"
            target="_blank"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare class="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { ShoppingCart, X, Trash2, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const whatsappCheckoutUrl = computed(() => {
  const itemList = cartStore.items
    .map(i => `- ${i.nom_commercial} (${i.quantite}x) : ${(i.prix_unitaire * i.quantite).toLocaleString('fr-FR')} FCFA`)
    .join('%0A')
  
  const text = `Bonjour AgroShop,%0AJesouhaite passer la commande suivante :%0A${itemList}%0A%0ATotal TTC : ${cartStore.totalPriceTTC.toLocaleString('fr-FR')} FCFA`
  return `https://wa.me/22890123456?text=${text}`
})
</script>
