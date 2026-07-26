<template>
  <div class="space-y-6">
    
    <!-- Title Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white">Gestion du Blog & Conseils Agronomiques</h1>
        <p class="text-xs text-slate-400 mt-1">Publiez et gérez vos dossiers d'experts et guides de fertilisation.</p>
      </div>

      <button @click="fetchArticles" class="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
      <div class="relative flex-1">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un article par titre, sujet..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      <span class="text-xs font-mono text-slate-400">
        {{ filteredArticles.length }} article(s)
      </span>
    </div>

    <!-- Articles Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      
      <div v-if="isLoading" class="py-12 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des articles...
      </div>

      <div v-else-if="filteredArticles.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Article</th>
              <th class="px-4 py-3">Nombre de Vues (Réelles)</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 text-right">Date de Publication</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="art in filteredArticles" :key="art.id" class="hover:bg-slate-800/40 transition-colors">
              
              <td class="px-4 py-3.5 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                  <img 
                    :src="getImgUrl(art.image_principale)" 
                    :alt="art.titre"
                    class="w-full h-full object-cover"
                    @error="(e) => e.target.src = '/images/hero-produits-agroshop.png'"
                  />
                </div>
                <div>
                  <p class="font-bold text-white text-xs line-clamp-1">{{ art.titre }}</p>
                  <p class="text-[10px] text-slate-500 font-mono">Slug: {{ art.slug }}</p>
                </div>
              </td>

              <td class="px-4 py-3.5 font-mono font-bold text-emerald-400">
                <div class="flex items-center gap-1.5">
                  <Eye class="w-3.5 h-3.5 text-emerald-500" />
                  <span>{{ art.vues || 0 }} vues</span>
                </div>
              </td>

              <td class="px-4 py-3.5">
                <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Publié
                </span>
              </td>

              <td class="px-4 py-3.5 text-right font-mono text-[11px] text-slate-400">
                {{ formatDate(art.date_publication) }}
              </td>

              <td class="px-4 py-3.5 text-right font-mono">
                <NuxtLink :to="`/blog/${art.slug}`" target="_blank" class="p-2 text-slate-400 hover:text-white transition-colors">
                  <ExternalLink class="w-4 h-4 inline-block" />
                </NuxtLink>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
        Aucun article de blog trouvé.
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshCw, Eye, ExternalLink } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/blog',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Gestion du Blog - AgroShop Admin'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()
const { getImageUrl } = useMedia()

const isLoading = ref(true)
const articles = ref([])
const searchQuery = ref('')

const getImgUrl = (img) => getImageUrl(img, '/images/hero-produits-agroshop.png')
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const filteredArticles = computed(() => {
  if (!searchQuery.value.trim()) return articles.value
  const q = searchQuery.value.toLowerCase()
  return articles.value.filter(a => a.titre?.toLowerCase().includes(q))
})

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/blog`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    articles.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.warn('Admin blog fetch error', e)
  }
  isLoading.value = false
}

onMounted(() => {
  fetchArticles()
})
</script>
