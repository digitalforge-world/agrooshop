<template>
  <div class="h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col space-y-3">
    
    <!-- Page Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <FolderTree class="w-6 h-6 text-emerald-600" />
          <span>Gestion des Catégories & Sous-Catégories</span>
        </h1>
        <p class="text-xs text-slate-600 mt-0.5">Organisez l'arborescence complète de vos familles et sous-familles de produits agricoles.</p>
      </div>

      <button 
        @click="openAddCategoryModal" 
        class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Nouvelle Catégorie</span>
      </button>
    </div>

    <!-- Stats Summary KPI Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Catégories & Sous-Catégories</p>
          <h2 class="text-xl font-black text-slate-900 mt-0.5">{{ categories.length }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <FolderTree class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Catégories Principales (Racines)</p>
          <h2 class="text-xl font-black text-emerald-700 mt-0.5">{{ mainCategories.length }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Tag class="w-4 h-4" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Sous-Catégories Déclinées</p>
          <h2 class="text-xl font-black text-amber-700 mt-0.5">{{ subCategories.length }}</h2>
        </div>
        <div class="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Layers class="w-4 h-4" />
        </div>
      </div>
    </div>

    <!-- Categories List Table Container -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
      
      <!-- Table Action Bar -->
      <div class="p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div class="flex items-center gap-2.5">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Arborescence Officielle BDD</h2>
          <button @click="fetchCategories" :disabled="isLoading" class="p-1 text-slate-500 hover:text-slate-900" title="Rafraîchir">
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative w-full sm:w-64">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Filtrer une catégorie..." 
              class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select 
            v-model="filterType" 
            class="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="tous">Toutes les catégories</option>
            <option value="principales">Principales uniquement</option>
            <option value="sous-categories">Sous-catégories uniquement</option>
          </select>
        </div>
      </div>

      <!-- Scrollable Table Body -->
      <div v-if="isLoading" class="py-16 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement de l'arborescence BDD...
      </div>

      <div v-else class="overflow-y-auto flex-1 custom-modal-scroll">
        <table class="w-full text-left text-xs text-slate-700 relative">
          
          <!-- Sticky Header -->
          <thead class="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th class="px-4 py-2.5">Nom de la Catégorie</th>
              <th class="px-4 py-2.5">Catégorie Parente (Famille)</th>
              <th class="px-4 py-2.5">Slug URL</th>
              <th class="px-4 py-2.5">Type</th>
              <th class="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>

          <!-- Compact Table Body Rows -->
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="cat in filteredCategories" :key="cat.id" class="hover:bg-slate-50/80 transition-colors">
              
              <!-- Name & Description -->
              <td class="px-4 py-2 flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                  <i v-if="cat.icon" :class="cat.icon"></i>
                  <span v-else>{{ cat.nom ? cat.nom[0] : 'C' }}</span>
                </div>
                <div>
                  <p class="font-bold text-white text-xs flex items-center gap-2">
                    <span>{{ getCleanName(cat.nom) }}</span>
                  </p>
                  <p class="text-[10px] text-slate-500 truncate max-w-[220px]">{{ cat.description || 'Famille agricole AgroShop' }}</p>
                </div>
              </td>

              <!-- Parent Category -->
              <td class="px-4 py-1.5">
                <span v-if="cat.parent_id" class="px-2 py-0.5 bg-slate-950 border border-slate-800 text-emerald-400 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                  <FolderTree class="w-3 h-3 text-emerald-400" />
                  <span>{{ getParentName(cat.parent_id) }}</span>
                </span>
                <span v-else class="text-slate-500 font-mono text-[10px]">
                  — Racine principale —
                </span>
              </td>

              <!-- Slug -->
              <td class="px-4 py-1.5 font-mono text-slate-400 text-[11px]">/categories/{{ cat.slug }}</td>

              <!-- Type Badge -->
              <td class="px-4 py-1.5">
                <span :class="!cat.parent_id ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider">
                  {{ !cat.parent_id ? 'Principale' : 'Sous-Catégorie' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-1.5 text-right font-mono space-x-1.5">
                <button @click="openEditCategoryModal(cat)" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-bold transition-colors cursor-pointer" title="Éditer">
                  ✏️ Éditer
                </button>
                <button @click="deleteCategory(cat)" class="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 rounded-md text-[11px] font-bold transition-colors cursor-pointer" title="Supprimer">
                  🗑️
                </button>
              </td>
            </tr>

            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-slate-500 font-mono text-xs">
                Aucune catégorie ou sous-catégorie trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 1. ADD / EDIT CATEGORY MODAL -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isCategoryModalOpen" class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <FolderTree class="w-5 h-5 text-emerald-400" />
              <span>{{ editingCatId ? 'Modifier la Catégorie' : 'Créer une Catégorie ou Sous-Catégorie' }}</span>
            </h3>
            <button @click="isCategoryModalOpen = false" class="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="saveCategory" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Nom de la Catégorie *</label>
              <input 
                v-model="catForm.nom" 
                required 
                type="text" 
                placeholder="ex: Engrais NPK, Urée, Insecticides..." 
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Catégorie Parente (Pour créer une sous-catégorie)</label>
              <select 
                v-model="catForm.parent_id" 
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option :value="null">-- Aucune (Catégorie Principale Racine) --</option>
                <option v-for="mainCat in mainCategories" :key="mainCat.id" :value="mainCat.id">
                  {{ mainCat.nom }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea 
                v-model="catForm.description" 
                rows="2" 
                placeholder="Description courte..." 
                class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-300 uppercase mb-1">Classe d'Icône (FontAwesome)</label>
                <input 
                  v-model="catForm.icon" 
                  type="text" 
                  placeholder="fa-solid fa-leaf" 
                  class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-300 uppercase mb-1">Slug URL (Optionnel)</label>
                <input 
                  v-model="catForm.slug" 
                  type="text" 
                  placeholder="Généré auto si vide" 
                  class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-slate-800">
              <button 
                type="button" 
                @click="isCategoryModalOpen = false" 
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
                <span>{{ isSaving ? 'Sauvegarde...' : '✓ Enregistrer la Catégorie' }}</span>
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
import { FolderTree, Tag, Layers, Plus, Search, RefreshCw, X, AlertTriangle } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/categories',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Catégories & Sous-Catégories - Administration AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const searchQuery = ref('')
const filterType = ref('tous')
const isLoading = ref(false)
const isSaving = ref(false)
const isCategoryModalOpen = ref(false)
const editingCatId = ref(null)

const isConfirmModalOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref(null)

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

const categories = ref([])

const catForm = ref({
  nom: '',
  parent_id: null,
  description: '',
  icon: 'fa-solid fa-tag',
  slug: ''
})

const getCleanName = (name) => {
  if (!name) return ''
  return name.replace(/\s*\(Sous-catégorie.*?\)/i, '')
}

const getParentName = (parentId) => {
  const p = categories.value.find(c => Number(c.id) === Number(parentId))
  return p ? getCleanName(p.nom) : `Parent #${parentId}`
}

const mainCategories = computed(() => {
  return categories.value.filter(c => !c.parent_id)
})

const subCategories = computed(() => {
  return categories.value.filter(c => !!c.parent_id)
})

const filteredCategories = computed(() => {
  return categories.value.filter(c => {
    if (filterType.value === 'principales' && c.parent_id) return false
    if (filterType.value === 'sous-categories' && !c.parent_id) return false

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const matchNom = c.nom.toLowerCase().includes(q)
      const matchSlug = c.slug.toLowerCase().includes(q)
      if (!matchNom && !matchSlug) return false
    }

    return true
  })
})

const flattenCategories = (rawList) => {
  const result = []
  if (!Array.isArray(rawList)) return result

  rawList.forEach(item => {
    result.push({
      id: Number(item.id),
      slug: String(item.slug || item.id),
      nom: item.nom || item.name || item.slug,
      description: item.description || '',
      icon: item.icon || (item.parent_id ? 'fa-solid fa-tag' : 'fa-solid fa-wheat-awn'),
      parent_id: item.parent_id ? Number(item.parent_id) : null
    })

    if (Array.isArray(item.enfants) && item.enfants.length > 0) {
      item.enfants.forEach(child => {
        result.push({
          id: Number(child.id),
          slug: String(child.slug || child.id),
          nom: child.nom || child.name,
          description: child.description || '',
          icon: child.icon || 'fa-solid fa-tag',
          parent_id: Number(item.id)
        })
      })
    }
  })

  const map = new Map()
  result.forEach(c => map.set(c.id, c))
  return Array.from(map.values())
}

const fetchCategories = async () => {
  isLoading.value = true
  try {
    let list = []
    try {
      const resAdmin = await $fetch(`${config.public.apiBaseUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      list = resAdmin?.data?.data || resAdmin?.data || resAdmin || []
    } catch (e1) {
      const resPublic = await $fetch(`${config.public.apiBaseUrl}/categories`)
      list = resPublic?.data?.data || resPublic?.data || resPublic || []
    }

    if (Array.isArray(list) && list.length > 0) {
      categories.value = flattenCategories(list)
    } else {
      categories.value = fallbackCategoriesList
    }
  } catch (e) {
    categories.value = fallbackCategoriesList
  }
  isLoading.value = false
}

const openAddCategoryModal = () => {
  editingCatId.value = null
  catForm.value = {
    nom: '',
    parent_id: null,
    description: '',
    icon: 'fa-solid fa-tag',
    slug: ''
  }
  isCategoryModalOpen.value = true
}

const openEditCategoryModal = (cat) => {
  editingCatId.value = cat.id
  catForm.value = {
    nom: getCleanName(cat.nom),
    parent_id: cat.parent_id ? Number(cat.parent_id) : null,
    description: cat.description || '',
    icon: cat.icon || 'fa-solid fa-tag',
    slug: cat.slug || ''
  }
  isCategoryModalOpen.value = true
}

const saveCategory = async () => {
  isSaving.value = true
  try {
    const payload = {
      nom: catForm.value.nom,
      description: catForm.value.description,
      parent_id: catForm.value.parent_id,
      icon: catForm.value.icon,
      slug: catForm.value.slug
    }

    if (editingCatId.value) {
      await $fetch(`${config.public.apiBaseUrl}/admin/categories/${editingCatId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    } else {
      await $fetch(`${config.public.apiBaseUrl}/admin/categories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    }

    await fetchCategories()
  } catch (e) {
    console.error('Save category error', e)
    // Offline local fallback
    if (editingCatId.value) {
      const idx = categories.value.findIndex(c => c.id === editingCatId.value)
      if (idx !== -1) {
        categories.value[idx] = {
          ...categories.value[idx],
          ...catForm.value,
          id: editingCatId.value
        }
      }
    } else {
      categories.value.push({
        id: Date.now(),
        ...catForm.value
      })
    }
  }

  isSaving.value = false
  isCategoryModalOpen.value = false
}

const deleteCategory = (cat) => {
  const clean = getCleanName(cat.nom)
  triggerConfirmModal(
    'Supprimer la catégorie',
    `Voulez-vous vraiment supprimer la catégorie "${clean}" ? Cette action désactivera la catégorie du catalogue.`,
    async () => {
      categories.value = categories.value.filter(c => c.id !== cat.id)
      try {
        await $fetch(`${config.public.apiBaseUrl}/admin/categories/${cat.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
      } catch (e) {
        console.warn('Delete category error', e)
      }
    }
  )
}

onMounted(() => {
  fetchCategories()
})

const fallbackCategoriesList = [
  { id: 1, slug: 'intrants-agricoles', nom: 'Intrants Agricoles', icon: 'fa-solid fa-wheat-awn', parent_id: null },
  { id: 2, slug: 'produits-phytosanitaires', nom: 'Produits Phytosanitaires', icon: 'fa-solid fa-bug', parent_id: null },
  { id: 3, slug: 'systemes-irrigation', nom: "Systèmes d'Irrigation", icon: 'fa-solid fa-droplet', parent_id: null },
  { id: 4, slug: 'semences', nom: 'Semences Certifiées', icon: 'fa-solid fa-seedling', parent_id: null },
  { id: 5, slug: 'machines-agricoles', nom: 'Machines Agricoles', icon: 'fa-solid fa-tractor', parent_id: null },
  { id: 6, slug: 'quincaillerie', nom: 'Quincaillerie & Outillage', icon: 'fa-solid fa-wrench', parent_id: null },
  { id: 7, slug: 'engrais-npk', nom: 'Engrais NPK', icon: 'fa-solid fa-flask', parent_id: 1 },
  { id: 8, slug: 'uree', nom: 'Urée', icon: 'fa-solid fa-vial', parent_id: 1 },
  { id: 9, slug: 'engrais-organiques', nom: 'Engrais Organiques', icon: 'fa-solid fa-leaf', parent_id: 1 },
  { id: 10, slug: 'insecticides', nom: 'Insecticides', icon: 'fa-solid fa-spray-can', parent_id: 2 },
  { id: 11, slug: 'fongicides', nom: 'Fongicides', icon: 'fa-solid fa-shield-halved', parent_id: 2 },
  { id: 12, slug: 'herbicides', nom: 'Herbicides', icon: 'fa-solid fa-scissors', parent_id: 2 },
  { id: 13, slug: 'nematicides', nom: 'Nématicides', icon: 'fa-solid fa-virus', parent_id: 2 },
  { id: 14, slug: 'outillage-manuel', nom: 'Outillage Manuel', icon: 'fa-solid fa-hammer', parent_id: 6 },
  { id: 15, slug: 'equipements-protection', nom: 'Équipements & Protection', icon: 'fa-solid fa-hard-hat', parent_id: 6 }
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
