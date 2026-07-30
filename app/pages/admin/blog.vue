<template>
  <div class="h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col space-y-3">
    
    <!-- Title & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <FileText class="w-6 h-6 text-emerald-600" />
          <span>Gestion du Blog & Conseils Agronomiques</span>
        </h1>
        <p class="text-xs text-slate-600 mt-0.5">Publiez, éditez et gérez les articles, dossiers d'experts et guides de fertilisation.</p>
      </div>

      <div class="flex items-center gap-2.5">
        <button 
          @click="openAddArticleModal" 
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>+ Nouvel Article</span>
        </button>

        <button 
          @click="fetchArticles" 
          :disabled="isLoading" 
          class="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Actualiser les articles"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Stats KPI Summary Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Articles</p>
          <h2 class="text-xl font-black text-slate-900 mt-0.5">{{ articles.length }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <FileText class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Articles Publiés</p>
          <h2 class="text-xl font-black text-emerald-700 mt-0.5">{{ publishedCount }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-md">
        <div>
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Brouillons</p>
          <h2 class="text-xl font-black text-amber-400 mt-0.5">{{ draftCount }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Clock class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-md">
        <div>
          <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Lecteurs / Vues</p>
          <h2 class="text-xl font-black text-blue-400 font-mono mt-0.5">{{ formatNumber(totalViewsCount) }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Eye class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Articles Table Container -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col min-h-0">
      
      <!-- Action & Filter Bar -->
      <div class="p-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div class="relative flex-1 max-w-md">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par titre, extrait ou mot-clé..." 
            class="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
        </div>

        <div class="flex items-center gap-2">
          <select 
            v-model="statusFilter" 
            class="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="tous">Tous les articles</option>
            <option value="publie">✅ Publiés</option>
            <option value="brouillon">⏳ Brouillons</option>
          </select>

          <span class="text-xs font-mono text-slate-400">
            {{ filteredArticles.length }} article(s)
          </span>
        </div>
      </div>

      <!-- Scrollable Table Body -->
      <div v-if="isLoading" class="py-16 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement des articles de blog...
      </div>

      <div v-else-if="filteredArticles.length > 0" class="overflow-y-auto flex-1 custom-modal-scroll">
        <table class="w-full text-left text-xs text-slate-300 relative">
          
          <!-- Sticky Header -->
          <thead class="bg-slate-950/95 backdrop-blur-md text-slate-400 uppercase font-mono text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-800">
            <tr>
              <th class="px-4 py-2 text-left">Article & Image</th>
              <th class="px-4 py-2 text-left">Extrait / Résumé</th>
              <th class="px-4 py-2 text-center">Vues Réelles</th>
              <th class="px-4 py-2 text-center">Statut</th>
              <th class="px-4 py-2 text-center">Date de Publication</th>
              <th class="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <!-- Compact Body Rows -->
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="art in filteredArticles" :key="art.id" class="hover:bg-slate-800/40 transition-colors">
              
              <!-- Article Thumbnail & Title -->
              <td class="px-4 py-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                    <img 
                      :src="getImgUrl(art.image_principale)" 
                      :alt="art.titre"
                      class="w-full h-full object-cover"
                      @error="(e) => e.target.src = '/images/hero-produits-agroshop.png'"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-white text-xs truncate max-w-[200px] sm:max-w-[260px]">{{ art.titre }}</p>
                    <p class="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">/blog/{{ art.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Abstract / Excerpt -->
              <td class="px-4 py-2 text-slate-400 text-xs">
                <p class="truncate max-w-[240px]">{{ art.extrait || art.contenu || 'Article agronomique AgroShop' }}</p>
              </td>

              <!-- Views Count -->
              <td class="px-4 py-2 text-center font-mono font-bold text-emerald-400 text-xs whitespace-nowrap">
                <div class="inline-flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800/80">
                  <Eye class="w-3 h-3 text-emerald-500" />
                  <span>{{ formatNumber(art.vues || 0) }}</span>
                </div>
              </td>

              <!-- Status Badge -->
              <td class="px-4 py-2 text-center whitespace-nowrap">
                <span 
                  :class="art.statut === 'publie' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
                  class="px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider inline-block"
                >
                  {{ art.statut === 'publie' ? 'Publié' : 'Brouillon' }}
                </span>
              </td>

              <!-- Publication Date -->
              <td class="px-4 py-2 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                {{ formatDate(art.date_publication) }}
              </td>

              <!-- Actions -->
              <td class="px-4 py-2 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <NuxtLink 
                    :to="`/blog/${art.slug}`" 
                    target="_blank" 
                    class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" 
                    title="Voir l'article public"
                  >
                    <ExternalLink class="w-3.5 h-3.5" />
                  </NuxtLink>

                  <button 
                    @click="openEditArticleModal(art)" 
                    class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1" 
                    title="Éditer l'article"
                  >
                    <span>✏️ Éditer</span>
                  </button>

                  <button 
                    @click="deleteArticle(art)" 
                    class="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 rounded-lg text-[11px] font-bold transition-colors cursor-pointer" 
                    title="Supprimer l'article"
                  >
                    🗑️
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
        Aucun article de blog ne correspond à votre recherche.
      </div>

    </div>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 1. ADD / EDIT ARTICLE MODAL POPUP -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isArticleModalOpen" class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <FileText class="w-5 h-5 text-emerald-400" />
              <span>{{ editingArticleId ? 'Modifier l\'Article' : 'Rédiger un Nouvel Article' }}</span>
            </h3>
            <button @click="isArticleModalOpen = false" class="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="saveArticle" class="space-y-4 text-xs overflow-y-auto custom-modal-scroll flex-1 pr-1">
            
            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Titre de l'Article *</label>
              <input 
                v-model="articleForm.titre" 
                required 
                type="text" 
                placeholder="ex: Guide Complet de la Fertilisation NPK pour le Maïs..." 
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-300 uppercase mb-1">Statut de Publication</label>
                <select 
                  v-model="articleForm.statut" 
                  class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="publie">✅ Publié immédiatement</option>
                  <option value="brouillon">⏳ Enregistrer comme Brouillon</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-300 uppercase mb-1">URL / Image Principale</label>
                <input 
                  v-model="articleForm.image_principale" 
                  type="text" 
                  placeholder="/images/hero-produits-agroshop.png" 
                  class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Chapeau / Extrait Résumé</label>
              <textarea 
                v-model="articleForm.extrait" 
                rows="2" 
                placeholder="Résumé court affiché sur les cartes du blog..." 
                class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Contenu Complet de l'Article *</label>
              <textarea 
                v-model="articleForm.contenu" 
                required 
                rows="7" 
                placeholder="Rédigez ici le corps de votre article agronomique..." 
                class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              ></textarea>
            </div>

            <!-- SEO Google Options -->
            <div class="border-t border-slate-800 pt-3 space-y-3">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">🌐 Référencement SEO Google</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] text-slate-400 uppercase mb-1">Meta Title</label>
                  <input 
                    v-model="articleForm.meta_title" 
                    type="text" 
                    placeholder="Titre SEO..." 
                    class="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 uppercase mb-1">Meta Description</label>
                  <input 
                    v-model="articleForm.meta_description" 
                    type="text" 
                    placeholder="Description pour les moteurs de recherche..." 
                    class="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-800 flex-shrink-0">
              <button 
                type="button" 
                @click="isArticleModalOpen = false" 
                class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                :disabled="isSaving"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <RefreshCw v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ isSaving ? 'Sauvegarde BDD...' : '✓ Enregistrer l\'Article' }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </Teleport>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 2. CUSTOM SYSTEM CONFIRMATION MODAL (NO BROWSER POPUPS) -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isConfirmModalOpen" class="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          
          <div class="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400 shadow-inner">
            <AlertTriangle class="w-7 h-7 animate-pulse" />
          </div>

          <div class="space-y-1.5">
            <h3 class="text-lg font-black text-white">{{ confirmTitle }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">{{ confirmMessage }}</p>
          </div>

          <div class="flex items-center justify-center gap-3 pt-2">
            <button 
              @click="isConfirmModalOpen = false" 
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Annuler
            </button>

            <button 
              @click="executeConfirmAction" 
              class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/40 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🔴 Confirmer la suppression</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FileText, Plus, Search, RefreshCw, Eye, ExternalLink, CheckCircle2, Clock, X, AlertTriangle } from 'lucide-vue-next'
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
const isSaving = ref(false)
const isArticleModalOpen = ref(false)
const editingArticleId = ref(null)

const isConfirmModalOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref(null)

const searchQuery = ref('')
const statusFilter = ref('tous')
const articles = ref([])

const articleForm = ref({
  titre: '',
  extrait: '',
  contenu: '',
  statut: 'publie',
  image_principale: '/images/hero-produits-agroshop.png',
  meta_title: '',
  meta_description: ''
})

const getImgUrl = (img) => getImageUrl(img, '/images/hero-produits-agroshop.png')

const formatNumber = (val) => Number(val || 0).toLocaleString('fr-FR')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const triggerConfirmModal = (title, message, actionFn) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = actionFn
  isConfirmModalOpen.value = true
}

const executeConfirmAction = async () => {
  if (confirmAction.value) {
    await confirmAction.value()
  }
  isConfirmModalOpen.value = false
}

const publishedCount = computed(() => {
  return articles.value.filter(a => a.statut === 'publie').length
})

const draftCount = computed(() => {
  return articles.value.filter(a => a.statut === 'brouillon').length
})

const totalViewsCount = computed(() => {
  return articles.value.reduce((acc, a) => acc + Number(a.vues || 0), 0)
})

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    if (statusFilter.value !== 'tous' && a.statut !== statusFilter.value) {
      return false
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const titleMatch = (a.titre || '').toLowerCase().includes(q)
      const excerptMatch = (a.extrait || '').toLowerCase().includes(q)
      const contentMatch = (a.contenu || '').toLowerCase().includes(q)
      if (!titleMatch && !excerptMatch && !contentMatch) return false
    }

    return true
  })
})

const fetchArticles = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/blog`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const list = res?.data?.data || res?.data || res || []
    if (Array.isArray(list) && list.length > 0) {
      articles.value = list
    } else {
      articles.value = fallbackArticlesList
    }
  } catch (e) {
    console.warn('Admin blog fetch error', e)
    articles.value = fallbackArticlesList
  }
  isLoading.value = false
}

const openAddArticleModal = () => {
  editingArticleId.value = null
  articleForm.value = {
    titre: '',
    extrait: '',
    contenu: '',
    statut: 'publie',
    image_principale: '/images/hero-produits-agroshop.png',
    meta_title: '',
    meta_description: ''
  }
  isArticleModalOpen.value = true
}

const openEditArticleModal = (art) => {
  editingArticleId.value = art.id
  articleForm.value = {
    titre: art.titre || '',
    extrait: art.extrait || '',
    contenu: art.contenu || '',
    statut: art.statut || 'publie',
    image_principale: art.image_principale || '/images/hero-produits-agroshop.png',
    meta_title: art.meta_title || `${art.titre} - AgroShop Togo`,
    meta_description: art.meta_description || art.extrait || ''
  }
  isArticleModalOpen.value = true
}

const saveArticle = async () => {
  isSaving.value = true
  try {
    const payload = {
      titre: articleForm.value.titre,
      extrait: articleForm.value.extrait,
      contenu: articleForm.value.contenu,
      statut: articleForm.value.statut,
      image_principale: articleForm.value.image_principale,
      meta_title: articleForm.value.meta_title || `${articleForm.value.titre} - AgroShop Togo`,
      meta_description: articleForm.value.meta_description || articleForm.value.extrait
    }

    if (editingArticleId.value) {
      await $fetch(`${config.public.apiBaseUrl}/admin/blog/${editingArticleId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    } else {
      await $fetch(`${config.public.apiBaseUrl}/admin/blog`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    }

    await fetchArticles()
  } catch (e) {
    console.error('Save article error', e)
    // Local fallback update
    const slugGen = articleForm.value.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (editingArticleId.value) {
      const idx = articles.value.findIndex(a => a.id === editingArticleId.value)
      if (idx !== -1) {
        articles.value[idx] = {
          ...articles.value[idx],
          ...articleForm.value,
          slug: slugGen
        }
      }
    } else {
      articles.value.unshift({
        id: Date.now(),
        slug: slugGen,
        vues: 0,
        date_publication: new Date().toISOString(),
        ...articleForm.value
      })
    }
  }

  isSaving.value = false
  isArticleModalOpen.value = false
}

const deleteArticle = (art) => {
  triggerConfirmModal(
    'Supprimer l\'article',
    `Voulez-vous vraiment supprimer l'article "${art.titre}" ? Cette action le retirera du blog public.`,
    async () => {
      articles.value = articles.value.filter(a => a.id !== art.id)
      try {
        await $fetch(`${config.public.apiBaseUrl}/admin/blog/${art.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
      } catch (e) {
        console.warn('Delete article error', e)
      }
    }
  )
}

onMounted(() => {
  fetchArticles()
})

const fallbackArticlesList = [
  {
    id: 1,
    titre: 'Guide Complet : Comment optimiser le rendement du Maïs avec l\'Urée 46% N',
    slug: 'guide-optimiser-rendement-mais-uree-46',
    extrait: 'Découvrez les meilleures périodes d\'épandage et dosages d\'azote conseillés pour les sols togolais.',
    contenu: 'L\'urée est l\'engrais azoté le plus concentré (46% N). Pour maximiser la récolte de maïs au Togo, appliquez le premier apport 15 jours après la levée...',
    statut: 'publie',
    image_principale: '/images/hero-produits-agroshop.png',
    vues: 1420,
    date_publication: '2026-07-20T10:00:00.000000Z'
  },
  {
    id: 2,
    titre: 'Prévention des Chenilles Légionnaires : Protocoles et Phytosanitaires',
    slug: 'prevention-chenilles-legionnaires-protocole',
    extrait: 'Stratégies de lutte intégrée et insecticides recommandés contre Spodoptera frugiperda.',
    contenu: 'La chenille légionnaire d\'automne ravage les cultures de céréales. L\'utilisation combinée de pièges à phéromones et d\'insecticides homologués...',
    statut: 'publie',
    image_principale: '/images/hero-produits-agroshop.png',
    vues: 980,
    date_publication: '2026-07-15T09:30:00.000000Z'
  },
  {
    id: 3,
    titre: 'Systèmes d\'Irrigation Goutte-à-Goutte : Économisez 50% d\'eau en Maraîchage',
    slug: 'irrigation-goutte-a-goutte-economie-eau-maraichage',
    extrait: 'Installation pas-à-pas d\'un kit d\'irrigation localisé pour tomates, piments et oignons.',
    contenu: 'Face au stress hydrique lors de la saison sèche, l\'irrigation goutte-à-goutte apporte l\'eau directement au chevelu racinaire des plantes...',
    statut: 'brouillon',
    image_principale: '/images/hero-produits-agroshop.png',
    vues: 320,
    date_publication: '2026-07-24T14:15:00.000000Z'
  }
]
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
  background: #334155;
  border-radius: 9999px;
}
.custom-modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
