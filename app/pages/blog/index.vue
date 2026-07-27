<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

    <!-- Header -->
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Conseils Agronomiques & Guides Pratiques
          </h1>
          <p class="text-sm text-gray-500 mt-1 max-w-2xl">
            Retrouvez nos dossiers d'experts, techniques d'irrigation, notices phytosanitaires et recommandations de fertilisation au Togo.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="w-full md:w-80 relative">
          <input 
            v-model="searchQuery"
            @input="fetchArticles"
            type="text" 
            placeholder="Rechercher un conseil, engrais..."
            class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>
      </div>
    </div>

    <!-- Tags Filter Strip -->
    <div v-if="tags.length > 0" class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button 
        @click="selectTag(null)"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
          selectedTag === null ? 'bg-emerald-800 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        Tous les articles
      </button>
      <button 
        v-for="t in tags" 
        :key="t.id"
        @click="selectTag(t.slug)"
        :class="[
          'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5',
          selectedTag === t.slug ? 'bg-emerald-800 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        <span>{{ t.nom }}</span>
        <span class="text-[10px] opacity-75">({{ t.articles_count || 0 }})</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse bg-white rounded-2xl p-4 space-y-4 border border-gray-200">
        <div class="h-48 bg-gray-200 rounded-xl"></div>
        <div class="h-4 w-1/3 bg-gray-200 rounded"></div>
        <div class="h-5 w-full bg-gray-200 rounded"></div>
        <div class="h-12 w-full bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="articles.length === 0" class="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
      <BookOpen class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-lg font-bold text-gray-900">Aucun article trouvé</h3>
      <p class="text-xs text-gray-500 mt-1">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
      <button @click="resetFilters" class="mt-4 px-4 py-2 bg-emerald-700 text-white font-semibold text-xs rounded-lg hover:bg-emerald-800 transition-colors">
        Réinitialiser les filtres
      </button>
    </div>

    <!-- Articles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article 
        v-for="article in articles" 
        :key="article.id"
        class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
      >
        <NuxtLink :to="`/blog/${article.slug}`" class="relative block w-full h-52 overflow-hidden bg-gray-100">
          <img 
            :src="getImgUrl(article.image_principale)" 
            :alt="article.titre"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            @error="(e) => e.target.src = '/images/hero-produits-agroshop.png'"
          />
          <span 
            v-if="article.tags && article.tags[0]" 
            class="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-3 py-1 rounded-md text-white shadow-xs"
            :style="{ backgroundColor: article.tags[0].couleur || '#10B981' }"
          >
            {{ article.tags[0].nom }}
          </span>
        </NuxtLink>

        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>{{ formatDate(article.date_publication) }}</span>
              <span class="flex items-center gap-1">
                <Eye class="w-3.5 h-3.5 text-emerald-600" />
                {{ article.vues || 0 }} vues
              </span>
            </div>

            <NuxtLink :to="`/blog/${article.slug}`">
              <h2 class="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                {{ article.titre }}
              </h2>
            </NuxtLink>

            <p class="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {{ article.extrait }}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
            <NuxtLink 
              :to="`/blog/${article.slug}`"
              class="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Lire la suite</span>
              <ArrowRight class="w-4 h-4" />
            </NuxtLink>

            <span class="text-[11px] text-gray-400 font-semibold">
              Par {{ article.auteur ? `${article.auteur.prenom} ${article.auteur.nom}` : 'AgroShop' }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, ArrowRight, Eye, BookOpen } from 'lucide-vue-next'

const config = useRuntimeConfig()
const isLoading = ref(true)
const articles = ref([])
const tags = ref([])
const searchQuery = ref('')
const selectedTag = ref(null)

const { getImageUrl } = useMedia()
const getImgUrl = (img) => getImageUrl(img, '/images/hero-produits-agroshop.png')

const formatDate = (dateStr) => {
  if (!dateStr) return 'Récemment'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchArticles = async () => {
  isLoading.value = true
  try {
    let url = `${config.public.apiBaseUrl}/blog?per_page=12`
    if (searchQuery.value) url += `&search=${encodeURIComponent(searchQuery.value)}`
    if (selectedTag.value) url += `&tag=${encodeURIComponent(selectedTag.value)}`

    const res = await $fetch(url)
    if (res?.data) {
      articles.value = res.data.articles?.data || []
      tags.value = res.data.tags || []
    }
  } catch (e) {
    console.warn('Blog fetch error', e)
  }
  isLoading.value = false
}

const selectTag = (tagSlug) => {
  selectedTag.value = tagSlug
  fetchArticles()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedTag.value = null
  fetchArticles()
}

onMounted(() => {
  fetchArticles()
})

useSeoMeta({
  title: 'Blog Agronomique & Guides Pratiques - AgroShop Togo',
  description: 'Consultez nos articles d\'experts, notices phytosanitaires et recommandations de fertilisation NPK/Urée pour optimiser vos récoltes au Togo.',
  ogTitle: 'Blog Agronomique & Guides Pratiques - AgroShop Togo',
  ogDescription: 'Dossiers d\'experts agricoles, conseils d\'épandage et guides d\'irrigation au Togo.',
  ogUrl: 'https://agroshoptg.store/blog',
  twitterCard: 'summary_large_image'
})
</script>
