<template>
  <div class="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
    <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-black">
      💳
    </div>
    <h1 class="text-2xl font-black text-slate-900">Validation de votre Commande</h1>
    <p class="text-sm text-slate-600">
      Cliquez ci-dessous pour ouvrir le formulaire de validation de commande.
    </p>
    <button 
      @click="cartStore.openCheckout()" 
      class="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-full shadow-lg transition-all cursor-pointer active:scale-95"
    >
      Ouvrir la validation de commande
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.openCheckout()
})
</script>
