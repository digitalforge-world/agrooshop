<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800">Partenaires</h1>
        <p class="text-xs text-slate-500 mt-1">Gérez les partenaires affichés sur la page d'accueil</p>
      </div>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        Ajouter un partenaire
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Logo</th>
              <th class="px-6 py-4">Nom</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="partenaire in partenaires" :key="partenaire.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                  <img v-if="partenaire.logo_url" :src="getImageUrl(partenaire.logo_url)" :alt="partenaire.nom" class="w-full h-full object-contain p-1" />
                  <ImageIcon v-else class="w-5 h-5 text-slate-400" />
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-slate-700">
                {{ partenaire.nom }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="partenaire.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ partenaire.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(partenaire)" class="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(partenaire.id)" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="partenaires.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                Aucun partenaire enregistré.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-slate-800">{{ form.id ? 'Modifier le partenaire' : 'Nouveau partenaire' }}</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="savePartenaire" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom du partenaire *</label>
            <input 
              v-model="form.nom" 
              type="text" 
              required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Ex: YARA International"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo (Optionnel)</label>
            <input 
              type="file" 
              @change="handleLogoUpload" 
              accept="image/*"
              class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
            />
            <div v-if="form.logoPreview || (form.id && form.logo_url)" class="mt-3">
              <p class="text-[10px] text-slate-400 mb-1">Aperçu :</p>
              <div class="w-16 h-16 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-1">
                <img :src="form.logoPreview || getImageUrl(form.logo_url)" class="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input type="checkbox" id="actif" v-model="form.actif" class="rounded text-emerald-500 focus:ring-emerald-500" />
            <label for="actif" class="text-sm text-slate-600 cursor-pointer">Afficher sur le site public</label>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-slate-500 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors">
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/20 flex items-center gap-2"
            >
              <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useMedia } from '~/composables/useMedia'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({ title: 'Partenaires - AgroShop Admin' })

const store = useAdminAuthStore()
const config = useRuntimeConfig()
const { getImageUrl } = useMedia()

const partenaires = ref([])
const loading = ref(true)

const showModal = ref(false)
const saving = ref(false)

const form = ref({
  id: null,
  nom: '',
  actif: true,
  logoFile: null,
  logoPreview: null,
  logo_url: null
})

const fetchPartenaires = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/partenaires`, {
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' }
    })
    partenaires.value = res?.data || []
  } catch (e) {
    console.error('Error fetching partenaires', e)
  } finally {
    loading.value = false
  }
}

const openModal = (partenaire = null) => {
  if (partenaire) {
    form.value = {
      id: partenaire.id,
      nom: partenaire.nom,
      actif: partenaire.actif,
      logoFile: null,
      logoPreview: null,
      logo_url: partenaire.logo_url
    }
  } else {
    form.value = { id: null, nom: '', actif: true, logoFile: null, logoPreview: null, logo_url: null }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = { id: null, nom: '', actif: true, logoFile: null, logoPreview: null, logo_url: null }
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.logoFile = file
  form.value.logoPreview = URL.createObjectURL(file)
}

const savePartenaire = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('nom', form.value.nom)
    formData.append('actif', form.value.actif ? 1 : 0)
    if (form.value.logoFile) {
      formData.append('logo', form.value.logoFile)
    }

    if (form.value.id) {
      formData.append('_method', 'PUT')
      await $fetch(`${config.public.apiBaseUrl}/admin/partenaires/${form.value.id}`, {
        method: 'POST', // using POST with _method=PUT for multipart/form-data
        headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' },
        body: formData
      })
    } else {
      await $fetch(`${config.public.apiBaseUrl}/admin/partenaires`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' },
        body: formData
      })
    }
    await fetchPartenaires()
    closeModal()
  } catch (e) {
    console.error('Error saving partenaire', e)
    alert("Une erreur s'est produite lors de l'enregistrement.")
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (id) => {
  if (!confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/partenaires/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${store.token}`, Accept: 'application/json' }
    })
    await fetchPartenaires()
  } catch (e) {
    console.error('Error deleting partenaire', e)
    alert("Impossible de supprimer le partenaire.")
  }
}

onMounted(() => {
  fetchPartenaires()
})
</script>
