<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="text-center space-y-3">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
        Besoin d'aide ?
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
        Foire Aux Questions (FAQ)
      </h1>
      <p class="text-sm text-gray-500 max-w-xl mx-auto">
        Trouvez rapidement les réponses à vos questions sur nos produits agricoles, la livraison au Togo et les modes de paiement.
      </p>
    </div>

    <div class="space-y-4">
      <div 
        v-for="(item, idx) in faqs" 
        :key="idx"
        class="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2 hover:border-emerald-300 transition-colors"
      >
        <h3 class="text-base font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle class="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {{ item.question }}
        </h3>
        <p class="text-sm text-gray-600 pl-7 leading-relaxed">
          {{ item.answer }}
        </p>
      </div>
    </div>

    <div class="bg-emerald-800 text-white rounded-2xl p-8 text-center space-y-4 shadow-md">
      <h2 class="text-xl font-bold">Vous ne trouvez pas votre réponse ?</h2>
      <p class="text-xs text-emerald-100 max-w-md mx-auto">
        Notre équipe d'experts agronomes est disponible pour vous conseiller et vous accompagner.
      </p>
      <NuxtLink 
        to="/contact" 
        class="inline-block px-6 py-3 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
      >
        Contactez notre équipe
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { HelpCircle } from 'lucide-vue-next'

useHead({
  title: 'Foire Aux Questions (FAQ) - AgroShop',
  meta: [
    { name: 'description', content: 'Réponses à vos questions courantes sur les commandes, produits et livraison AgroShop Togo.' }
  ]
})

const faqs = [
  {
    question: "Comment puis-je passer une commande sur AgroShop ?",
    answer: "Parcourez notre catalogue, ajoutez les produits souhaités au panier, puis validez votre commande en renseignant votre adresse de livraison au Togo."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements par Mobile Money (TMoney, Flooz) ainsi que le paiement en espèces à la livraison."
  },
  {
    question: "Quels sont les délais et zones de livraison ?",
    answer: "Nous livrons sur l'ensemble du territoire togolais. La livraison à Lomé s'effectue sous 24h et sous 48h à 72h pour les autres régions."
  },
  {
    question: "Les produits phytosanitaires et engrais sont-ils certifiés ?",
    answer: "Oui, tous les produits distribués sur AgroShop sont certifiés conformes par le Ministère de l'Agriculture et nos partenaires agronomes agréés."
  }
]
</script>
