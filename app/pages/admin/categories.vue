<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white flex items-center gap-2">
          <FolderTree class="w-6 h-6 text-emerald-400" />
          <span>Gestion des Catégories</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">Organisez vos familles et sous-catégories de produits agricoles</p>
      </div>

      <button 
        @click="openAddCategoryModal" 
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle Catégorie</span>
      </button>
    </div>

    <!-- Stats summary badges -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Catégories</p>
          <h2 class="text-2xl font-black text-white mt-1">{{ categories.length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <FolderTree class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catégories Principales</p>
          <h2 class="text-2xl font-black text-emerald-400 mt-1">{{ categories.filter(c => !c.parent_id).length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Tag class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sous-Catégories</p>
          <h2 class="text-2xl font-black text-amber-400 mt-1">{{ categories.filter(c => c.parent_id).length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Layers class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Categories List Table -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <h2 class="text-sm font-bold text-white uppercase tracking-wider">Arborescence des Catégories</h2>
        <div class="relative w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher une catégorie..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-300">
          <thead class="bg-slate-950/80 uppercase text-[10px] font-mono tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th class="px-6 py-4">Nom de la Catégorie</th>
              <th class="px-6 py-4">Slug URL</th>
              <th class="px-6 py-4">Type</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 font-medium">
            <tr v-for="cat in filteredCategories" :key="cat.id" class="hover:bg-slate-800/40 transition-colors">
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  <i v-if="cat.icon" :class="cat.icon"></i>
                  <span v-else>{{ cat.nom[0] }}</span>
                </div>
                <div>
                  <p class="font-bold text-white text-sm flex items-center gap-2">
                    <span>{{ cat.nom }}</span>
                  </p>
                  <p class="text-[11px] text-slate-500">{{ cat.description || 'Famille certifiée AgroShop' }}</p>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-slate-400">/categories/{{ cat.slug }}</td>
              <td class="px-6 py-4">
                <span :class="!cat.parent_id ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">
                  {{ !cat.parent_id ? 'Principale' : 'Sous-Catégorie' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="editCategory(cat)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors">
                  Éditer
                </button>
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-slate-500">
                Aucune catégorie trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FolderTree, Tag, Layers, Plus, Search } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/categories',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Catégories - Administration AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const searchQuery = ref('')
const categories = ref([])

const fetchCategories = async () => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/categories`)
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      categories.value = res.data
    } else {
      categories.value = fallbackCategoriesList
    }
  } catch (e) {
    categories.value = fallbackCategoriesList
  }
}

const fallbackCategoriesList = [
  { id: 1, slug: 'intrants-agricoles', nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn', parent_id: null },
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
  { id: 13, slug: 'nematicides', nom: 'Nématicides', icon: 'fa-solid fa-virus', parent_id: 2 }
]

onMounted(() => {
  fetchCategories()
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter(c => c.nom.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
})

const openAddCategoryModal = () => {
  alert("Modal de création de catégorie")
}

const editCategory = (cat) => {
  alert(`Édition de la catégorie: ${cat.nom}`)
}
</script>
