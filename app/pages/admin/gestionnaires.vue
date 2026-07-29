<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <UserCog class="w-6 h-6 text-emerald-600" />
          <span>Gestion des Délégués</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Gérez les comptes des gestionnaires affectés à chaque boutique</p>
      </div>

      <button 
        @click="openModal()"
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Nouveau Gestionnaire</span>
      </button>
    </div>

    <!-- Gestionnaires List Table -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Liste des Gestionnaires</h2>
        <div class="relative w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Nom Complet</th>
              <th class="px-6 py-4">Contact</th>
              <th class="px-6 py-4">Boutique Assignée</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-10 text-center text-slate-500">
                <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Chargement...
              </td>
            </tr>
            <tr v-else-if="filteredGestionnaires.length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-slate-500">
                <UserCog class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Aucun gestionnaire trouvé</p>
                <button @click="openModal()" class="mt-3 text-emerald-700 hover:underline text-xs font-bold">+ Créer le premier délégué</button>
              </td>
            </tr>
            <tr v-for="gest in filteredGestionnaires" :key="gest.id" class="hover:bg-emerald-50/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                    {{ gest.prenom?.[0] || 'G' }}{{ gest.nom?.[0] || '' }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 text-sm">{{ gest.prenom }} {{ gest.nom }}</p>
                    <p class="text-[10px] text-slate-400">Depuis le {{ new Date(gest.created_at).toLocaleDateString('fr-FR') }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-800 font-medium">{{ gest.email }}</p>
                <p class="text-[11px] text-slate-400">{{ gest.telephone || '—' }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1.5" v-if="gest.boutiques && gest.boutiques.length > 0">
                  <span v-for="b in gest.boutiques" :key="b.id" class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-bold">
                    <Store class="w-3 h-3 text-emerald-600" />
                    {{ b.nom }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 text-emerald-700 font-bold" v-else-if="gest.boutique">
                  <Store class="w-3.5 h-3.5" />
                  <span>{{ gest.boutique.nom }}</span>
                </div>
                <span v-else class="text-amber-700 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Non assignée</span>
              </td>
              <td class="px-6 py-4 text-right flex items-center justify-end gap-2">
                <button @click="openModal(gest)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                  Éditer
                </button>
                <button @click="deleteGestionnaire(gest)" class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===================== MODAL ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" @click.self="closeModal">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <UserCog class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">{{ isEditing ? 'Modifier le Délégué' : 'Nouveau Gestionnaire' }}</h2>
                  <p class="text-[11px] text-slate-500">{{ isEditing ? 'Modifiez les informations' : 'Créez un compte pour votre délégué' }}</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="saveGestionnaire" class="p-6 space-y-4">

              <!-- Prénom + Nom -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prénom <span class="text-red-500">*</span></label>
                  <input v-model="form.prenom" type="text" required placeholder="Prénom" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nom <span class="text-red-500">*</span></label>
                  <input v-model="form.nom" type="text" required placeholder="Nom de famille" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors" />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email <span class="text-red-500">*</span></label>
                <input v-model="form.email" type="email" required placeholder="gestionnaire@agroshop.tg" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors" />
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Téléphone</label>
                <input v-model="form.telephone" type="tel" placeholder="Ex: +228 90 00 00 00" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors" />
              </div>

              <!-- Boutiques (multi-sélection) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Boutiques Assignées <span class="text-red-500">*</span>
                  <span class="ml-2 text-slate-500 normal-case font-normal">(cochez une ou plusieurs)</span>
                </label>
                <div v-if="loadingBoutiques" class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">Chargement des boutiques...</div>
                <div v-else class="space-y-2">
                  <label
                    v-for="b in availableBoutiques"
                    :key="b.id"
                    class="flex items-center gap-3 p-3 bg-slate-50 border rounded-xl cursor-pointer transition-all"
                    :class="form.boutique_ids.includes(b.id) ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:border-slate-300'"
                  >
                    <input
                      type="checkbox"
                      :value="b.id"
                      v-model="form.boutique_ids"
                      class="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-slate-900 truncate">{{ b.nom }}</p>
                      <p class="text-[10px] text-slate-500 capitalize">{{ b.type }}</p>
                    </div>
                    <span :class="b.type === 'quincaillerie' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'" class="px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize">{{ b.type }}</span>
                  </label>
                  <p v-if="availableBoutiques.length === 0" class="text-xs text-slate-500 italic px-2">Aucune boutique disponible. Créez-en une d'abord.</p>
                </div>
              </div>

              <!-- Mot de passe (création uniquement) -->
              <div v-if="!isEditing">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mot de Passe <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPwd ? 'text' : 'password'"
                    required
                    placeholder="Minimum 8 caractères"
                    class="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                  />
                  <button type="button" @click="showPwd = !showPwd" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700">
                    <Eye v-if="!showPwd" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Nouveau mdp (edit) -->
              <div v-if="isEditing">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nouveau Mot de Passe <span class="text-slate-400">(laisser vide = inchangé)</span></label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPwd ? 'text' : 'password'"
                    placeholder="Laisser vide pour ne pas changer"
                    class="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                  />
                  <button type="button" @click="showPwd = !showPwd" class="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700">
                    <Eye v-if="!showPwd" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div v-if="formError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle class="w-4 h-4 flex-shrink-0" />
                {{ formError }}
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 pt-2">
                <button type="button" @click="closeModal" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" :disabled="saving" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{{ saving ? 'Enregistrement...' : (isEditing ? 'Mettre à Jour' : 'Créer le Compte') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { UserCog, Plus, Search, Store, X, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/gestionnaires',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'Gestionnaires - Administration AgroShop' })

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()
const { adminFetch } = useAdminFetch()

// ---- State ----
const searchQuery = ref('')
const gestionnaires = ref([])
const availableBoutiques = ref([])
const loading = ref(true)
const loadingBoutiques = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const formError = ref(null)
const editingId = ref(null)
const showPwd = ref(false)

const defaultForm = () => ({ prenom: '', nom: '', email: '', telephone: '', boutique_ids: [], password: '' })
const form = ref(defaultForm())

// ---- Fetch gestionnaires ----
const fetchGestionnaires = async () => {
  loading.value = true
  try {
    const res = await adminFetch('/admin/gestionnaires')
    gestionnaires.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) {
    // Fallback démo uniquement si l'erreur n'est pas un 401
    if (e?.status !== 401 && e?.statusCode !== 401) {
      gestionnaires.value = [
        { id: 1, prenom: 'Paul', nom: 'Koffi', email: 'paul@agroshop.tg', telephone: '90000001', boutique: { nom: 'AgroShop Quincaillerie Centre' }, created_at: '2025-01-05' },
        { id: 2, prenom: 'Marie', nom: 'Aya', email: 'marie@agroshop.tg', telephone: '90000002', boutique: { nom: 'AgroShop Engrais Nord' }, created_at: '2025-02-20' }
      ]
    }
  } finally {
    loading.value = false
  }
}

// ---- Fetch boutiques (for select) ----
const fetchBoutiques = async () => {
  loadingBoutiques.value = true
  try {
    const res = await adminFetch('/admin/boutiques')
    availableBoutiques.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) {
    if (e?.status !== 401 && e?.statusCode !== 401) {
      availableBoutiques.value = [
        { id: 1, nom: 'AgroShop Quincaillerie Centre', type: 'quincaillerie' },
        { id: 2, nom: 'AgroShop Engrais Nord', type: 'agricole' }
      ]
    }
  } finally {
    loadingBoutiques.value = false
  }
}

onMounted(() => {
  fetchGestionnaires()
  fetchBoutiques()
})

// ---- Computed ----
const filteredGestionnaires = computed(() => {
  if (!searchQuery.value) return gestionnaires.value
  const q = searchQuery.value.toLowerCase()
  return gestionnaires.value.filter(g =>
    g.nom.toLowerCase().includes(q) || g.prenom.toLowerCase().includes(q) || g.email.toLowerCase().includes(q)
  )
})

// ---- Modal ----
const openModal = (gest = null) => {
  formError.value = null
  showPwd.value = false
  if (gest) {
    isEditing.value = true
    editingId.value = gest.id
    form.value = {
      prenom: gest.prenom,
      nom: gest.nom,
      email: gest.email,
      telephone: gest.telephone || '',
      boutique_ids: gest.boutique_ids || (gest.boutique?.id ? [gest.boutique.id] : []),
      password: ''
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formError.value = null
}

// ---- Save ----
const saveGestionnaire = async () => {
  saving.value = true
  formError.value = null
  if (form.value.boutique_ids.length === 0) {
    formError.value = 'Veuillez sélectionner au moins une boutique.'
    saving.value = false
    return
  }
  try {
    const body = { ...form.value }
    if (!body.password) delete body.password

    const endpoint = isEditing.value
      ? `/admin/gestionnaires/${editingId.value}`
      : '/admin/gestionnaires'
    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await adminFetch(endpoint, { method, body })

    const saved = res?.data || res
    if (isEditing.value) {
      const idx = gestionnaires.value.findIndex(g => g.id === editingId.value)
      if (idx !== -1) gestionnaires.value[idx] = { ...gestionnaires.value[idx], ...saved }
    } else {
      gestionnaires.value.unshift(saved)
    }
    closeModal()
  } catch (e) {
    const errors = e?.data?.errors
    if (errors) {
      formError.value = Object.values(errors).flat().join(' | ')
    } else {
      formError.value = e?.data?.message || e?.message || 'Erreur lors de l\'enregistrement.'
    }
  } finally {
    saving.value = false
  }
}

// ---- Delete ----
const deleteGestionnaire = async (gest) => {
  if (!confirm(`Supprimer ${gest.prenom} ${gest.nom} ? Cette action est irréversible.`)) return
  try {
    await adminFetch(`/admin/gestionnaires/${gest.id}`, { method: 'DELETE' })
    gestionnaires.value = gestionnaires.value.filter(g => g.id !== gest.id)
  } catch (e) {
    if (e?.status !== 401) alert('Erreur lors de la suppression.')
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.97); }
</style>
