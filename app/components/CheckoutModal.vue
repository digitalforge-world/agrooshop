<template>
  <ClientOnly>
    <Teleport to="body">
      <div 
        v-if="cartStore.isCheckoutOpen" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs transition-opacity duration-300"
        @click.self="closeModal"
      >
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] my-auto border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Fixed Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white flex-shrink-0">
            <div>
              <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Finalisation de commande</span>
              <h2 class="text-base sm:text-xl font-black text-slate-900">Validation &amp; Paiement</h2>
            </div>
            <button 
              @click="closeModal" 
              type="button"
              class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable Modal Content -->
          <div class="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-modal-scroll">

            <!-- Redirecting to LeekPay -->
            <div v-if="redirectingToPayment" class="py-12 text-center space-y-5">
              <div class="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-black text-slate-900">Redirection vers le paiement...</h3>
                <p class="text-xs text-slate-500 max-w-sm mx-auto">
                  Commande <strong class="text-emerald-700">{{ orderRefCode }}</strong> enregistrée.<br/>
                  Vous allez être redirigé vers la page de paiement Mobile Money.
                </p>
              </div>
              <div class="flex flex-col items-center gap-2">
                <a
                  v-if="paymentUrl"
                  :href="paymentUrl"
                  target="_blank"
                  class="mt-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Ouvrir la page de paiement →
                </a>
              </div>
            </div>

            <!-- Success Confirmation View (especes / fallback) -->
            <div v-else-if="orderSuccess" class="py-8 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-xs">
                ✓
              </div>
              <div class="space-y-1">
                <h3 class="text-xl font-black text-slate-900">Commande Confirmée !</h3>
                <p class="text-xs text-slate-500">Merci pour votre confiance. Votre référence de commande est :</p>
                <div class="inline-block bg-slate-100 px-4 py-2 rounded-xl text-emerald-800 font-black text-lg tracking-wider border border-slate-200 mt-2">
                  {{ orderRefCode }}
                </div>
              </div>
              <p class="text-xs text-slate-600 max-w-md mx-auto">
                Notre équipe va vous contacter au <strong>{{ form.telephone }}</strong> pour organiser la livraison.
              </p>
              <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a 
                  :href="whatsappDirectUrl"
                  target="_blank"
                  @click="trackSuccessWhatsappClick"
                  class="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Confirmer sur WhatsApp</span>
                </a>
                <button 
                  @click="closeModal" 
                  class="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

            <!-- Empty Cart State -->
            <div v-else-if="cartStore.items.length === 0" class="py-10 text-center space-y-3">
              <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                🛒
              </div>
              <p class="text-sm font-bold text-slate-700">Votre panier est actuellement vide.</p>
              <button 
                @click="closeModal"
                class="px-5 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-full shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Découvrir les produits
              </button>
            </div>

            <!-- Checkout Form -->
            <form v-else @submit.prevent="submitOrder" class="space-y-6">
              
              <!-- Items Summary Strip -->
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-200/60">
                  <span>Articles ({{ cartStore.totalQuantity }})</span>
                  <span>Prix</span>
                </div>
                <div class="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between text-xs">
                    <span class="font-medium text-slate-800 line-clamp-1">{{ item.nom_commercial }} (x{{ item.quantite }})</span>
                    <span class="font-extrabold text-slate-900 flex-shrink-0 ml-2">{{ (item.prix_unitaire * item.quantite).toLocaleString('fr-FR') }} FCFA</span>
                  </div>
                </div>
              </div>

              <!-- Customer Details Form -->
              <div class="space-y-4">
                <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">1. Vos Coordonnées</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Prénom *</label>
                    <input 
                      v-model="form.prenom_client" 
                      required 
                      type="text" 
                      placeholder="ex: Ablam" 
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nom *</label>
                    <input 
                      v-model="form.nom_client" 
                      required 
                      type="text" 
                      placeholder="ex: KOFFI" 
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Téléphone *</label>
                    <input 
                      v-model="form.telephone" 
                      required 
                      type="tel" 
                      placeholder="ex: +228 98 70 60 81" 
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Adresse / Ville *</label>
                    <input 
                      v-model="form.adresse_ligne1" 
                      required 
                      type="text" 
                      placeholder="ex: Totsi, Lomé" 
                      class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Reception & Payment Options -->
              <div class="space-y-4 pt-2 border-t border-slate-100">
                <h3 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider">2. Options de Livraison &amp; Paiement</h3>

                <!-- Boutique Selection -->
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    🏬 Boutique AgroShop la plus proche / de traitement *
                  </label>
                  <select 
                    v-model="form.boutique_id"
                    required
                    class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option v-for="b in boutiques" :key="b.id" :value="b.id">
                      {{ b.nom }} {{ b.localisation ? `(${b.localisation})` : '' }}
                    </option>
                  </select>
                </div>

                <!-- Reception Mode -->
                <div class="grid grid-cols-2 gap-3">
                  <label :class="['p-3 rounded-xl border flex flex-col cursor-pointer transition-all', form.mode_livraison === 'domicile' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900 ring-1 ring-emerald-500/30' : 'border-slate-200 text-slate-600']">
                    <input type="radio" v-model="form.mode_livraison" value="domicile" class="sr-only" />
                    <span class="text-xs">🚚 Livraison (+5 000 FCFA)</span>
                  </label>
                  <label :class="['p-3 rounded-xl border flex flex-col cursor-pointer transition-all', form.mode_livraison === 'retrait' ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-900 ring-1 ring-emerald-500/30' : 'border-slate-200 text-slate-600']">
                    <input type="radio" v-model="form.mode_livraison" value="retrait" class="sr-only" />
                    <span class="text-xs">🏢 Retrait en Agence (Gratuit)</span>
                  </label>
                </div>

                <!-- Payment Mode -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- Mobile Money Card -->
                  <label :class="['p-4 rounded-xl border-2 flex flex-col gap-2 cursor-pointer transition-all', form.mode_paiement === 'mobile_money' ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300']">
                    <input type="radio" v-model="form.mode_paiement" value="mobile_money" class="sr-only" />
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-900">📱 Mobile Money</span>
                      <span v-if="form.mode_paiement === 'mobile_money'" class="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center">
                        <span class="text-white text-[8px] font-black">✓</span>
                      </span>
                    </div>
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full border border-yellow-200">TMoney</span>
                      <span class="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full border border-orange-200">Flooz</span>
                    </div>
                    <p class="text-[10px] text-slate-500">Paiement immédiat &amp; sécurisé</p>
                  </label>

                  <!-- Espèces Card -->
                  <label :class="['p-4 rounded-xl border-2 flex flex-col gap-2 cursor-pointer transition-all', form.mode_paiement === 'especes' ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300']">
                    <input type="radio" v-model="form.mode_paiement" value="especes" class="sr-only" />
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-900">💵 Espèces</span>
                      <span v-if="form.mode_paiement === 'especes'" class="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center">
                        <span class="text-white text-[8px] font-black">✓</span>
                      </span>
                    </div>
                    <p class="text-[10px] text-slate-500 mt-1">Paiement à la livraison ou en agence</p>
                  </label>
                </div>

                <!-- Mobile Money info banner -->
                <div v-if="form.mode_paiement === 'mobile_money'" class="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span class="text-emerald-600 text-base mt-0.5">🔒</span>
                  <p class="text-[11px] text-emerald-800 leading-relaxed">
                    Après validation, vous serez redirigé vers la page de paiement Mobile Money sécurisée. 
                    Votre numéro de téléphone sera pré-rempli automatiquement.
                  </p>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Sous-total articles :</span>
                  <span>{{ cartStore.totalPrice.toLocaleString('fr-FR') }} FCFA</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Frais de livraison :</span>
                  <span>{{ form.mode_livraison === 'domicile' ? '5 000 FCFA' : '0 FCFA' }}</span>
                </div>
                <div class="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total à régler :</span>
                  <span class="text-emerald-800 text-lg">{{ calculatedGrandTotal.toLocaleString('fr-FR') }} FCFA</span>
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                :disabled="submitting"
                class="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-if="submitting">Traitement en cours...</span>
                <span v-else-if="form.mode_paiement === 'mobile_money'">Payer {{ calculatedGrandTotal.toLocaleString('fr-FR') }} FCFA — Mobile Money 📱</span>
                <span v-else>Confirmer la commande ✓</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCartStore } from '~/stores/cart'

const config = useRuntimeConfig()
const cartStore = useCartStore()

const submitting = ref(false)
const orderSuccess = ref(false)
const orderRefCode = ref('')
const paymentUrl = ref(null)
const redirectingToPayment = ref(false)
const defaultBoutiques = [
  { id: 1, nom: 'AgroShop Siège Principal', localisation: 'Lomé Tokoin' },
  { id: 2, nom: 'AgroShop Grand Marché', localisation: 'Lomé' },
  { id: 3, nom: 'AgroShop Totsi', localisation: 'Lomé' },
  { id: 4, nom: 'AgroShop Kara', localisation: 'Kara' }
]

const boutiques = ref([...defaultBoutiques])

const form = ref({
  prenom_client: '',
  nom_client: '',
  telephone: '',
  email: '',
  boutique_id: 1,
  mode_livraison: 'domicile',
  adresse_ligne1: '',
  ville: 'Lomé',
  mode_paiement: 'especes',
  commentaires: ''
})

const fetchBoutiques = async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/boutiques-publiques`)
    const list = res?.data || res || []
    if (Array.isArray(list) && list.length > 0) {
      boutiques.value = list
      if (!boutiques.value.some(b => b.id === form.value.boutique_id)) {
        form.value.boutique_id = list[0].id
      }
    }
  } catch (e) {
    console.warn('Error loading public boutiques', e)
  }
}

onMounted(() => {
  fetchBoutiques()
})

watch(() => cartStore.isCheckoutOpen, (isOpen) => {
  if (isOpen) {
    fetchBoutiques()
    if (!form.value.boutique_id && boutiques.value.length > 0) {
      form.value.boutique_id = boutiques.value[0].id
    }
  }
})

const calculatedGrandTotal = computed(() => {
  const fee = form.value.mode_livraison === 'domicile' ? 5000 : 0
  return cartStore.totalPrice + fee
})

const whatsappDirectUrl = computed(() => {
  const phone = config.public.whatsappNumber || '22898706081'
  const text = `Bonjour AgroShop,%0AJe viens de valider la commande N° ${orderRefCode.value} d'un montant de ${calculatedGrandTotal.value.toLocaleString('fr-FR')} FCFA.%0AMerci de me contacter.`
  return `https://wa.me/${phone}?text=${text}`
})

const closeModal = () => {
  cartStore.closeCheckout()
  orderSuccess.value = false
  redirectingToPayment.value = false
  paymentUrl.value = null
}

const trackOrderValidation = (refCode) => {
  try {
    if (typeof window === 'undefined') return
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'validation_commande',
        details: `Commande Confirmée N° ${refCode} par ${form.value.prenom_client} ${form.value.nom_client} (${form.value.telephone}) - Total: ${calculatedGrandTotal.value.toLocaleString('fr-FR')} FCFA - Mode: ${form.value.mode_paiement}`
      }
    })
  } catch (e) {}
}

const trackSuccessWhatsappClick = () => {
  try {
    if (typeof window === 'undefined') return
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: window.location.pathname,
        type_action: 'clic_whatsapp',
        details: `Confirmation WhatsApp après Commande N° ${orderRefCode.value} - Total: ${calculatedGrandTotal.value.toLocaleString('fr-FR')} FCFA`
      }
    })
  } catch (e) {}
}

const submitOrder = async () => {
  submitting.value = true
  try {
    const itemsMapped = cartStore.items.map(item => ({
      produit_id: item.id,
      quantite: item.quantite
    }))

    const payload = {
      ...form.value,
      nom: form.value.nom_client,
      prenom: form.value.prenom_client || '',
      nom_client: form.value.nom_client,
      prenom_client: form.value.prenom_client,
      telephone: form.value.telephone,
      items: itemsMapped,
      articles: itemsMapped,
      type_livraison: form.value.mode_livraison === 'domicile' ? 'livraison' : 'retrait_agence',
      mode_livraison: form.value.mode_livraison,
      mode_paiement: form.value.mode_paiement,
      boutique_id: form.value.boutique_id ? Number(form.value.boutique_id) : 1
    }

    const res = await $fetch(`${config.public.apiBaseUrl}/commandes`, {
      method: 'POST',
      body: payload
    })

    const data = res?.data || res
    orderRefCode.value = data?.code_reference || ('AGR2026' + Math.floor(100000 + Math.random() * 900000))

    trackOrderValidation(orderRefCode.value)
    cartStore.clearCart()

    // --- Paiement Mobile Money : redirection vers LeekPay ---
    if (form.value.mode_paiement === 'mobile_money' && data?.payment_url) {
      paymentUrl.value = data.payment_url
      redirectingToPayment.value = true

      // Afficher l'état de chargement 1.2s puis rediriger
      setTimeout(() => {
        window.location.href = data.payment_url
      }, 1200)
    } else {
      // Espèces ou LeekPay indisponible : affichage succès classique
      orderSuccess.value = true
    }

  } catch (e) {
    console.error('Erreur enregistrement commande API', e)
    alert(e?.data?.message || e?.message || "Erreur lors de l'enregistrement de votre commande.")
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.custom-modal-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-modal-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 12px 0;
}
.custom-modal-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
