<template>
  <div class="bg-gray-50 min-h-screen pb-16">
    <!-- Header -->
    <div class="bg-emerald-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">Blog Agricole</h1>
        <p class="text-emerald-100 max-w-2xl mx-auto text-lg">Conseils pratiques, actualités et guides pour optimiser votre production agricole.</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <!-- Recherche -->
        <div class="relative w-full md:w-96">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher un article..." 
            class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
          />
          <Search class="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
        </div>

        <!-- Filtres / Tags -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="tag in allTags" 
            :key="tag"
            @click="activeTag = tag"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeTag === tag 
                ? 'bg-emerald-700 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Grille d'articles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in filteredPosts" 
          :key="post.slug" 
          class="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
        >
          <div class="relative h-56 overflow-hidden">
            <img :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm bg-white/90 text-emerald-800 backdrop-blur-sm">
                {{ post.category }}
              </span>
            </div>
          </div>
          
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
              <Calendar class="w-3.5 h-3.5" />
              {{ post.date }}
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors">
              <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
            </h3>
            
            <p class="text-sm text-gray-600 mb-5 line-clamp-3 flex-grow">{{ post.excerpt }}</p>
            
            <NuxtLink :to="`/blog/${post.slug}`" class="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:text-emerald-600">
              Lire l'article complet
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </NuxtLink>
          </div>
        </article>
      </div>
      
      <!-- État vide -->
      <div v-if="filteredPosts.length === 0" class="text-center py-20">
        <FileText class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900">Aucun article trouvé</h3>
        <p class="text-gray-500 mt-1">Essayez de modifier vos termes de recherche ou de filtre.</p>
        <button @click="resetFilters" class="mt-4 px-6 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors">
          Réinitialiser
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Calendar, ArrowRight, FileText } from 'lucide-vue-next'

useHead({
  title: 'Blog Agricole - AgroShop',
  meta: [
    { name: 'description', content: 'Conseils, actualités et guides pour réussir vos cultures et élevages.' }
  ]
})

const searchQuery = ref('')
const activeTag = ref('Tous')

const allTags = ['Tous', 'Conseils', 'Équipement', 'Saison', 'Innovations']

// Mock data en attendant l'API
const posts = ref([
  {
    title: "Comment optimiser l'irrigation pendant la saison sèche",
    excerpt: "Découvrez nos techniques d'irrigation goutte-à-goutte pour économiser l'eau tout en maximisant le rendement de vos cultures maraîchères face aux changements climatiques.",
    slug: "optimiser-irrigation-saison-seche",
    date: "15 Février 2026",
    category: "Conseils",
    image: "https://images.unsplash.com/photo-1592982537447-6f233c06114b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Bien choisir son engrais NPK pour le maïs",
    excerpt: "Le choix de l'engrais est crucial. Apprenez à lire les formules NPK et à choisir celle qui correspond le mieux à votre sol et au stade de développement de votre maïs.",
    slug: "choisir-engrais-npk-mais",
    date: "02 Février 2026",
    category: "Équipement",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Calendrier des semis : Préparer la grande saison des pluies",
    excerpt: "Ne ratez pas le coche ! Voici le calendrier idéal pour préparer vos pépinières et planifier vos semis pour la prochaine grande saison des pluies au Togo.",
    slug: "calendrier-semis-grande-saison",
    date: "28 Janvier 2026",
    category: "Saison",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "L'utilisation des drones pour la surveillance des cultures",
    excerpt: "Comment les nouvelles technologies révolutionnent l'agriculture de précision. Le point sur l'utilisation des drones pour détecter les maladies précocement.",
    slug: "utilisation-drones-surveillance-cultures",
    date: "10 Janvier 2026",
    category: "Innovations",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Prévenir les maladies de la tomate : Le mildiou",
    excerpt: "Le mildiou est le principal ennemi de la tomate. Comment le reconnaître rapidement et quels traitements appliquer de manière préventive et curative.",
    slug: "prevenir-maladies-tomate-mildiou",
    date: "05 Janvier 2026",
    category: "Conseils",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
])

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = activeTag.value === 'Tous' || post.category === activeTag.value
    
    return matchesSearch && matchesTag
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  activeTag.value = 'Tous'
}
</script>
