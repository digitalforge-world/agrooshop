<template>
  <div class="bg-white min-h-screen pb-20">
    <div v-if="post">
      <!-- Article Header -->
      <div class="relative h-[40vh] min-h-[300px] w-full">
        <img :src="post.image" :alt="post.title" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/50"></div>
        
        <div class="absolute inset-0 flex items-center">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <span class="inline-block px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full mb-4">
              {{ post.category }}
            </span>
            <h1 class="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {{ post.title }}
            </h1>
            <div class="flex items-center justify-center gap-4 text-emerald-50 text-sm">
              <div class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4" />
                {{ post.date }}
              </div>
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
              <div class="flex items-center gap-1.5">
                <Clock class="w-4 h-4" />
                5 min de lecture
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div class="flex flex-col lg:flex-row gap-12">
          
          <!-- Contenu Principal -->
          <div class="lg:w-2/3">
            <!-- Breadcrumb -->
            <nav class="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-3">
                <li class="inline-flex items-center">
                  <NuxtLink to="/" class="hover:text-emerald-700 transition-colors">Accueil</NuxtLink>
                </li>
                <li>
                  <div class="flex items-center">
                    <ChevronRight class="w-4 h-4 mx-1" />
                    <NuxtLink to="/blog" class="hover:text-emerald-700 transition-colors">Blog</NuxtLink>
                  </div>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <ChevronRight class="w-4 h-4 mx-1" />
                    <span class="text-gray-400 truncate max-w-[200px]">{{ post.title }}</span>
                  </div>
                </li>
              </ol>
            </nav>

            <!-- Markdown Content Placeholder -->
            <div class="max-w-none text-gray-700">
              <p class="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
                {{ post.excerpt }}
              </p>
              
              <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Introduction à la technique</h2>
              <p class="mb-4 leading-relaxed">L'agriculture moderne nécessite des adaptations constantes face aux défis climatiques et économiques. L'optimisation des ressources n'est plus une option, mais une nécessité absolue pour garantir des rendements suffisants tout en préservant l'environnement.</p>
              
              <img src="https://images.unsplash.com/photo-1592982537447-6f233c06114b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Illustration" class="rounded-xl w-full my-8" />
              
              <h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">Les bonnes pratiques</h2>
              <ul class="list-disc list-inside space-y-2 mb-6">
                <li><strong class="font-bold text-gray-900">Analyse du sol :</strong> Toujours commencer par connaître la composition de votre terrain.</li>
                <li><strong class="font-bold text-gray-900">Planification :</strong> Suivre le calendrier agricole strict pour ne pas rater les saisons.</li>
                <li><strong class="font-bold text-gray-900">Choix des intrants :</strong> Utiliser des produits certifiés de qualité pour un meilleur retour sur investissement.</li>
              </ul>
              
              <blockquote class="border-l-4 border-emerald-500 pl-4 italic text-gray-600 bg-gray-50 py-3 pr-4 rounded-r-lg my-6">
                "Un bon agriculteur écoute la terre avant de semer."
              </blockquote>
              
              <p class="mb-4 leading-relaxed">En suivant ces recommandations, vous augmenterez drastiquement vos chances de réussite pour la prochaine campagne.</p>
            </div>

            <!-- Partage -->
            <div class="border-t border-gray-200 mt-12 pt-8 flex items-center justify-between">
              <span class="font-semibold text-gray-900">Partager cet article :</span>
              <div class="flex gap-3">
                <button class="p-2.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                  <Facebook class="w-5 h-5" />
                </button>
                <button class="p-2.5 rounded-full bg-blue-50 text-sky-500 hover:bg-blue-100 transition-colors">
                  <Twitter class="w-5 h-5" />
                </button>
                <button class="p-2.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                  <Share2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Sidebar (Produits liés) -->
          <div class="lg:w-1/3">
            <div class="sticky top-24 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart class="w-5 h-5 text-emerald-600" />
                Produits recommandés
              </h3>
              
              <div class="space-y-4">
                <NuxtLink v-for="prod in linkedProducts" :key="prod.id" :to="`/produits/${prod.slug}`" class="group flex gap-4 bg-white p-3 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
                  <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="prod.image" :alt="prod.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex flex-col justify-center">
                    <h4 class="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 line-clamp-2">{{ prod.name }}</h4>
                    <p class="text-emerald-700 font-bold mt-1">{{ prod.price }} FCFA</p>
                  </div>
                </NuxtLink>
              </div>
              
              <div class="mt-6 pt-6 border-t border-gray-200 text-center">
                <NuxtLink to="/produits" class="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
                  Voir toute la boutique →
                </NuxtLink>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    <div v-else class="min-h-[50vh] flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h2>
        <p class="text-gray-500 mb-6">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
        <NuxtLink to="/blog" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Retour au blog
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Calendar, Clock, ChevronRight, Facebook, Twitter, Share2, ShoppingCart } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock data pour l'article (à remplacer par un fetch API)
const post = ref({
  title: "Comment optimiser l'irrigation pendant la saison sèche",
  excerpt: "Découvrez nos techniques d'irrigation goutte-à-goutte pour économiser l'eau tout en maximisant le rendement de vos cultures maraîchères.",
  slug: "optimiser-irrigation-saison-seche",
  date: "15 Février 2026",
  category: "Conseils",
  image: "https://images.unsplash.com/photo-1592982537447-6f233c06114b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
})

// Mock produits liés
const linkedProducts = [
  { id: 5, name: "Kit Irrigation 500m² Goutte à Goutte", price: "85 000", slug: "kit-irrigation-goutte-a-goutte-500m2", image: "https://images.unsplash.com/photo-1592982537447-6f233c06114b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 12, name: "Pompe à Eau Solaire 12V", price: "45 000", slug: "pompe-eau-solaire", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
]

useHead({
  title: `${post.value?.title || 'Article'} - Blog AgroShop`,
})
</script>
