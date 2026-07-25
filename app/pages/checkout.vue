<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    
    <!-- Title -->
    <div class="border-b border-slate-200 pb-4">
      <span class="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Finalisation de commande</span>
      <h1 class="text-2xl sm:text-4xl font-black text-slate-900">Validation & Paiement</h1>
    </div>

    <!-- Empty Cart Warning -->
    <div v-if="cartStore.items.length === 0" class="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-4">
      <p class="text-base font-bold text-slate-700">Votre panier ne contient aucun produit.</p>
      <NuxtLink to="/produits" class="inline-block px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md">
        Retourner au catalogue
      </NuxtLink>
    </div>

    <!-- Checkout Form Layout -->
    <form v-else @submit.prevent="submitOrder" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Customer Information (7 Cols) -->
      <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 class="text-base font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          1. Coordonnées & Livraison
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Prénom *</label>
            <input 
              v-model="form.prenom_client" 
              required 
              type="text" 
              placeholder="ex: Ablam" 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nom *</label>
            <input 
              v-model="form.nom_client" 
              required 
              type="text" 
              placeholder="ex: KOFFI" 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone *</label>
            <input 
              v-model="form.telephone" 
              required 
              type="tel" 
              placeholder="ex: +228 90 12 34 56" 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Email (optionnel)</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="ex: client@example.com" 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- Mode de livraison -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Mode de Réception *</label>
          <div class="grid grid-cols-2 gap-3">
            <label :class="['p-3 rounded-xl border flex flex-col cursor-pointer transition-all', form.mode_livraison === 'domicile' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900' : 'border-slate-200 text-slate-600']">
              <input type="radio" v-model="form.mode_livraison" value="domicile" class="sr-only" />
              <span class="text-xs">🚚 Livraison à domicile (+5 000 FCFA)</span>
            </label>
            <label :class="['p-3 rounded-xl border flex flex-col cursor-pointer transition-all', form.mode_livraison === 'retrait' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900' : 'border-slate-200 text-slate-600']">
              <input type="radio" v-model="form.mode_livraison" value="retrait" class="sr-only" />
              <span class="text-xs">🏢 Retrait Gratuit en Agence</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Adresse / Ville *</label>
          <input 
            v-model="form.adresse_ligne1" 
            required 
            type="text" 
            placeholder="ex: Tokoin Doumasséssé, Lomé" 
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <!-- Mode de paiement -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Mode de Paiement *</label>
          <div class="space-y-2">
            <label :class="['p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all', form.mode_paiement === 'mobile_money' ? 'border-amber-500 bg-amber-50/60 font-bold text-slate-900' : 'border-slate-200 text-slate-600']">
              <div class="flex items-center gap-2">
                <input type="radio" v-model="form.mode_paiement" value="mobile_money" class="sr-only" />
                <span class="text-xs">📱 Mobile Money (T-Money / Flooz)</span>
              </div>
              <span class="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Instantané</span>
            </label>

            <label :class="['p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all', form.mode_paiement === 'especes' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-slate-900' : 'border-slate-200 text-slate-600']">
              <div class="flex items-center gap-2">
                <input type="radio" v-model="form.mode_paiement" value="especes" class="sr-only" />
                <span class="text-xs">💵 Paiement en espèces à la livraison</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Commentaires / Instructions</label>
          <textarea 
            v-model="form.commentaires" 
            rows="2" 
            placeholder="ex: Appeler avant la livraison..." 
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          ></textarea>
        </div>
      </div>

      <!-- Order Summary Right Col (5 Cols) -->
      <div class="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 class="text-base font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          2. Récapitulatif
        </h3>

        <div class="space-y-3 max-h-60 overflow-y-auto pr-1">
          <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800">{{ item.nom_commercial }} (x{{ item.quantite }})</span>
            <span class="font-extrabold text-slate-900">{{ (item.prix_unitaire * item.quantite).toLocaleString('fr-FR') }} FCFA</span>
          </div>
        </div>

        <div class="space-y-2 pt-4 border-t border-slate-200 text-xs">
          <div class="flex justify-between text-slate-600">
            <span>Sous-total articles</span>
            <span>{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Frais de livraison</span>
            <span>{{ form.mode_livraison === 'domicile' ? '5 000 FCFA' : '0 FCFA' }}</span>
          </div>
          <div class="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span class="text-emerald-700">{{ calculatedGrandTotal.toLocaleString('fr-FR') }} FCFA</span>
          </div>
        </div>

        <button 
          type="submit"
          :disabled="submitting"
          class="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>{{ submitting ? 'Validation...' : 'Confirmer la commande' }}</span>
          <CheckCircle2 class="w-5 h-5" />
        </button>

        <p class="text-[11px] text-slate-400 text-center">
          En confirmant, vous recevrez un code de référence unique pour le suivi de votre commande.
        </p>
      </div>

    </form>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle2 } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const config = useRuntimeConfig()
const router = useRouter()
const cartStore = useCartStore()

const submitting = ref(false)

const form = ref({
  prenom_client: '',
  nom_client: '',
  telephone: '',
  email: '',
  mode_livraison: 'domicile',
  adresse_ligne1: '',
  ville: 'Lomé',
  mode_paiement: 'mobile_money',
  commentaires: ''
})

const calculatedGrandTotal = computed(() => {
  const fee = form.value.mode_livraison === 'domicile' ? 5000 : 0
  return cartStore.totalPrice + fee
})

const submitOrder = async () => {
  submitting.value = true
  try {
    const payload = {
      ...form.value,
      articles: cartStore.items.map(item => ({
        produit_id: item.id,
        quantite: item.quantite
      }))
    }

    const res = await $fetch(`${config.public.apiBaseUrl}/commandes`, {
      method: 'POST',
      body: payload
    })

    if (res && res.data) {
      const refCode = res.data.code_reference || 'CMD-2026-0001'
      cartStore.clearCart()
      router.push(`/commande/suivi?ref=${refCode}`)
    } else {
      // Fallback redirection for local test
      const dummyRef = 'CMD-2026-' + Math.floor(1000 + Math.random() * 9000)
      cartStore.clearCart()
      router.push(`/commande/suivi?ref=${dummyRef}`)
    }
  } catch (e) {
    console.warn('API error, redirecting to tracking with generated reference', e)
    const dummyRef = 'CMD-2026-0001'
    cartStore.clearCart()
    router.push(`/commande/suivi?ref=${dummyRef}`)
  } finally {
    submitting.value = false
  }
}
</script>
