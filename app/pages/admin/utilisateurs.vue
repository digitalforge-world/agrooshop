<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users class="w-6 h-6 text-emerald-600" />
          <span>Gestion des Utilisateurs & Administrateurs</span>
        </h1>
        <p class="text-xs text-slate-600 mt-1">Gérez les accès, rôles et privilèges de la plateforme AgroShop Togo</p>
      </div>

      <button 
        @click="openAddUserModal" 
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
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
          <h2 class="text-2xl font-black text-slate-900 mt-1">2</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
          <ShieldCheck class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrateurs Actifs</p>
          <h2 class="text-2xl font-black text-emerald-700 mt-1">3</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <UserCheck class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Enregistrés</p>
          <h2 class="text-2xl font-black text-blue-700 mt-1">142</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Users class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-5 border-b border-slate-200 flex items-center justify-between">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Liste des Administrateurs Système</h2>
        <div class="relative w-64">
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
              <th class="px-6 py-4">Nom & Prénom</th>
              <th class="px-6 py-4">Adresse Email</th>
              <th class="px-6 py-4">Rôle Système</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-6 py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  {{ user.prenom[0] }}{{ user.nom[0] }}
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-sm">{{ user.prenom }} {{ user.nom }}</p>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-purple-50 text-purple-800 border-purple-200 capitalize">
                  {{ user.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Actif
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="editUser(user)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                  Gérer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Users, UserPlus, ShieldCheck, UserCheck, Search } from 'lucide-vue-next'

definePageMeta({
  path: '/admin/utilisateurs',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Utilisateurs & Admins - AgroShop TG'
})

const searchQuery = ref('')

const users = ref([
  { id: 1, nom: 'Admin', prenom: 'Super', email: 'admin@agroshop.tg', role: 'super_admin' },
  { id: 2, nom: 'Admin', prenom: 'Super', email: 'admin@agroshoptg.store', role: 'super_admin' },
  { id: 3, nom: 'Komla', prenom: 'Sewoda', email: 'sewodakomla@gmail.com', role: 'admin' },
  { id: 4, nom: 'Admin', prenom: 'Contact', email: 'contact@agroshoptg.store', role: 'admin' }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => u.nom.toLowerCase().includes(q) || u.prenom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
})

const openAddUserModal = () => {
  alert("Modal de création d'administrateur")
}

const editUser = (user) => {
  alert(`Gestion de l'utilisateur: ${user.prenom} ${user.nom}`)
}
</script>
