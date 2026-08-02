<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users class="w-6 h-6 text-emerald-600" />
          <span>Gestion des Utilisateurs &amp; Administrateurs</span>
        </h1>
        <p class="text-xs text-slate-600 mt-1">Gérez les accès, rôles et privilèges de la plateforme AgroShop Togo</p>
      </div>

      <button 
        @click="openAddUserModal" 
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
      >
        <UserPlus class="w-4 h-4" />
        <span>Nouvel Administrateur</span>
      </button>
    </div>

    <!-- Stats badges -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Super Administrateurs</p>
          <h2 class="text-2xl font-black text-slate-900 mt-1">{{ superAdminsCount }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
          <ShieldCheck class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrateurs Actifs</p>
          <h2 class="text-2xl font-black text-emerald-700 mt-1">{{ activeAdminsCount }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <UserCheck class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Administrateurs</p>
          <h2 class="text-2xl font-black text-blue-700 mt-1">{{ users.length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Users class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-2xl">
      <div class="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Liste des Administrateurs Système</h2>
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-600 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Nom &amp; Prénom</th>
              <th class="px-6 py-4">Adresse Email</th>
              <th class="px-6 py-4">Rôle Système</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase">
                  {{ (user.prenom?.[0] || 'A') }}{{ (user.nom?.[0] || '') }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">{{ user.prenom }} {{ user.nom }}</p>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize',
                    user.role === 'super_admin' ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                  ]"
                >
                  {{ (user.role || 'admin').replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  v-if="user.actif"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Actif
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200"
                >
                  Inactif
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="editUser(user)" 
                    class="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    title="Modifier l'administrateur"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button 
                    @click="resetUserPassword(user)" 
                    class="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    title="Réinitialiser le mot de passe"
                  >
                    <KeyRound class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteUser(user)" 
                    class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                Aucun administrateur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal d'Ajout / Modification -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 class="font-black text-slate-900 text-base">
            {{ isEditing ? 'Modifier l\'administrateur' : 'Créer un administrateur' }}
          </h3>
          <button @click="closeModal" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Prénom *</label>
              <input 
                v-model="form.prenom" 
                required 
                type="text" 
                placeholder="ex: Jean"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nom *</label>
              <input 
                v-model="form.nom" 
                required 
                type="text" 
                placeholder="ex: DUPONT"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Adresse Email *</label>
            <input 
              v-model="form.email" 
              required 
              type="email" 
              placeholder="ex: admin@agroshop.tg"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mot de passe {{ isEditing ? '(laisser vide pour ne pas modifier)' : '*' }}
            </label>
            <input 
              v-model="form.mot_de_passe" 
              :required="!isEditing"
              type="password" 
              placeholder="Au moins 6 caractères"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Rôle Système *</label>
              <select 
                v-model="form.role"
                required
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Administrateur</option>
                <option value="gestionnaire_stock">Gestionnaire Stock</option>
                <option value="gestionnaire_commandes">Gestionnaire Commandes</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Statut du Compte</label>
              <select 
                v-model="form.actif"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option :value="true">Actif</option>
                <option :value="false">Inactif</option>
              </select>
            </div>
          </div>

          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {{ errorMessage }}
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ saving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'administrateur') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, UserPlus, ShieldCheck, UserCheck, Search, Edit, Trash2, KeyRound } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/utilisateurs',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Utilisateurs & Admins - AgroShop TG'
})

const config = useRuntimeConfig()
const authStore = useAdminAuthStore()

const users = ref([])
const loading = ref(true)
const saving = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const errorMessage = ref('')

const form = ref({
  prenom: '',
  nom: '',
  email: '',
  mot_de_passe: '',
  role: 'admin',
  actif: true
})

const superAdminsCount = computed(() => users.value.filter(u => u.role === 'super_admin').length)
const activeAdminsCount = computed(() => users.value.filter(u => u.actif).length)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    (u.nom || '').toLowerCase().includes(q) || 
    (u.prenom || '').toLowerCase().includes(q) || 
    (u.email || '').toLowerCase().includes(q)
  )
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/administrateurs`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    users.value = res?.data || res || []
  } catch (e) {
    console.error('Erreur lors du chargement des administrateurs', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const openAddUserModal = () => {
  isEditing.value = false
  editingId.value = null
  errorMessage.value = ''
  form.value = {
    prenom: '',
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'admin',
    actif: true
  }
  showModal.value = true
}

const editUser = (user) => {
  isEditing.value = true
  editingId.value = user.id
  errorMessage.value = ''
  form.value = {
    prenom: user.prenom,
    nom: user.nom,
    email: user.email,
    mot_de_passe: '',
    role: user.role || 'admin',
    actif: Boolean(user.actif)
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  errorMessage.value = ''
}

const saveUser = async () => {
  saving.value = true
  errorMessage.value = ''
  try {
    const endpoint = isEditing.value
      ? `${config.public.apiBaseUrl}/admin/administrateurs/${editingId.value}`
      : `${config.public.apiBaseUrl}/admin/administrateurs`

    const method = isEditing.value ? 'PUT' : 'POST'

    const payload = { ...form.value }
    if (isEditing.value && !payload.mot_de_passe) {
      delete payload.mot_de_passe
    }

    await $fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: payload
    })

    await fetchUsers()
    closeModal()
  } catch (e) {
    console.error('Erreur sauvegarde utilisateur', e)
    errorMessage.value = e?.data?.message || e?.message || 'Une erreur est survenue.'
  } finally {
    saving.value = false
  }
}

const resetUserPassword = async (user) => {
  if (!confirm(`Réinitialiser le mot de passe de ${user.prenom} ${user.nom} ?`)) return
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/administrateurs/${user.id}/reset-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const tempPassword = res?.data?.temp_password
    alert(`Mot de passe réinitialisé avec succès !\nMot de passe temporaire : ${tempPassword}`)
  } catch (e) {
    alert(e?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.')
  }
}

const deleteUser = async (user) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur ${user.prenom} ${user.nom} ?`)) return
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/administrateurs/${user.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchUsers()
  } catch (e) {
    alert(e?.data?.message || 'Impossible de supprimer cet administrateur.')
  }
}
</script>
