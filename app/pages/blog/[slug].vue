<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-gray-500">
      <NuxtLink to="/" class="hover:text-emerald-700">Accueil</NuxtLink>
      <span>/</span>
      <NuxtLink to="/blog" class="hover:text-emerald-700">Blog</NuxtLink>
      <span>/</span>
      <span class="text-gray-900 font-bold truncate max-w-xs">{{ article.titre || 'Article' }}</span>
    </nav>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      <div class="h-96 bg-gray-200 rounded-3xl w-full"></div>
      <div class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else class="space-y-8">

      <!-- Header & Meta -->
      <div class="space-y-4">
        <!-- Tags -->
        <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap items-center gap-2">
          <span 
            v-for="tag in article.tags" 
            :key="tag.id"
            class="px-3 py-1 text-xs font-extrabold uppercase rounded-full text-white shadow-xs"
            :style="{ backgroundColor: tag.couleur || '#10B981' }"
          >
            {{ tag.nom }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
          {{ article.titre }}
        </h1>

        <!-- Author, Date & Views Strip -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-gray-200 text-xs text-gray-500 font-medium">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shadow-xs">
              {{ getInitials(article.auteur) }}
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm">
                {{ article.auteur ? `${article.auteur.prenom} ${article.auteur.nom}` : 'Équipe Agronome AgroShop' }}
              </p>
              <p class="text-gray-400">Publié le {{ formatDate(article.date_publication) }}</p>
            </div>
          </div>

          <!-- Dynamic View Count Display -->
          <div class="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full font-bold border border-emerald-200">
            <Eye class="w-4 h-4 text-emerald-600" />
            <span>{{ article.vues || 0 }} vues</span>
          </div>
        </div>
      </div>

      <!-- Main Cover Image -->
      <div class="w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden bg-gray-100 shadow-md relative">
        <img 
          :src="getImgUrl(article.image_principale)" 
          :alt="article.titre"
          class="w-full h-full object-cover"
          @error="(e) => e.target.src = '/images/champ-agricole-bg.jpg'"
        />
      </div>

      <!-- Article Extract Highlight -->
      <div v-if="article.extrait" class="p-6 bg-emerald-50/80 rounded-2xl border-l-4 border-emerald-700 text-gray-800 font-semibold text-base sm:text-lg leading-relaxed shadow-xs">
        « {{ article.extrait }} »
      </div>

      <!-- Article Body -->
      <div class="prose prose-emerald max-w-none text-gray-700 text-base leading-relaxed space-y-4">
        <p class="whitespace-pre-line">{{ article.contenu }}</p>
      </div>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- RECOMMENDED PRODUCTS (Recommandés selon les Tags de l'Admin) -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <div v-if="recommendedProducts.length > 0" class="pt-10 border-t border-gray-200 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Recommandation Agronomique
            </span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
              Produits & Matériel Associés à cet Article
            </h2>
            <p class="text-xs text-gray-500 mt-1">
              Sélection recommandée par nos agronomes selon les besoins de cet article.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ProductCard 
            v-for="product in recommendedProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>

      <!-- Suggested Articles -->
      <div v-if="suggestedArticles.length > 0" class="pt-10 border-t border-gray-200 space-y-6">
        <h3 class="text-lg font-bold text-gray-900">Articles Similaires</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="sug in suggestedArticles" 
            :key="sug.id"
            :to="`/blog/${sug.slug}`"
            class="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3"
          >
            <div class="h-36 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="getImgUrl(sug.image_principale)" 
                :alt="sug.titre"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 class="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {{ sug.titre }}
            </h4>
            <span class="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
              Lire l'article <ArrowRight class="w-3 h-3" />
            </span>
          </NuxtLink>
        </div>
      </div>

    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Eye, ArrowRight } from 'lucide-vue-next'
import ProductCard from '~/components/ProductCard.vue'

const route = useRoute()
const config = useRuntimeConfig()

const isLoading = ref(true)
const article = ref({})
const recommendedProducts = ref([])
const suggestedArticles = ref([])

const getImgUrl = (img) => {
  if (!img) return '/images/champ-agricole-bg.jpg'
  if (img.startsWith('http') || img.startsWith('/')) return img
  return `http://localhost:8000/${img}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Récemment'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getInitials = (auteur) => {
  if (!auteur) return 'AG'
  const p = auteur.prenom ? auteur.prenom[0] : ''
  const n = auteur.nom ? auteur.nom[0] : ''
  return `${p}${n}`.toUpperCase() || 'AG'
}

const fetchArticleDetail = async () => {
  isLoading.value = true
  try {
    const slug = route.params.slug
    const res = await $fetch(`${config.public.apiBaseUrl}/blog/${slug}`)
    if (res?.data?.article) {
      article.value = res.data.article
      recommendedProducts.value = res.data.produits_recommandes || []
      suggestedArticles.value = res.data.articles_suggeres || []
    }
  } catch (e) {
    console.warn('Article detail fetch error', e)
  }
  isLoading.value = false
}

watch(() => route.params.slug, () => {
  fetchArticleDetail()
})

onMounted(() => {
  fetchArticleDetail()
})
</script>
