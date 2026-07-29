<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileSpreadsheet class="w-6 h-6 text-emerald-600" />
          <span>Rapports PDF des Gestionnaires</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Consultez et téléchargez les rapports générés par vos délégués de boutique</p>
      </div>
    </div>

    <!-- Stats badges -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Rapports</p>
          <h2 class="text-2xl font-black text-slate-900 mt-1">{{ rapports.length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <FileText class="w-5 h-5" />
        </div>
      </div>
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Non Lus</p>
          <h2 class="text-2xl font-black text-amber-600 mt-1">{{ rapports.filter(r => !r.lu_par_admin).length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <BellDot class="w-5 h-5" />
        </div>
      </div>
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lus</p>
          <h2 class="text-2xl font-black text-emerald-700 mt-1">{{ rapports.filter(r => r.lu_par_admin).length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCheck class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 flex-wrap">
      <button
        v-for="f in filters"
        :key="f.key"
        @click="activeFilter = f.key"
        :class="activeFilter === f.key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'"
        class="px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors shadow-2xs"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Rapports List -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4">Rapport</th>
              <th class="px-6 py-4">Boutique</th>
              <th class="px-6 py-4">Gestionnaire</th>
              <th class="px-6 py-4">Type</th>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-10 text-center text-slate-500">Chargement...</td>
            </tr>
            <tr v-else-if="filteredRapports.length === 0">
              <td colspan="7" class="px-6 py-10 text-center text-slate-500">Aucun rapport reçu pour le moment</td>
            </tr>
            <tr
              v-for="rapport in filteredRapports"
              :key="rapport.id"
              class="hover:bg-emerald-50/30 transition-colors"
              :class="!rapport.lu_par_admin ? 'bg-amber-50/30' : ''"
            >
              <td class="px-6 py-4">
                <span
                  :class="rapport.lu_par_admin ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="rapport.lu_par_admin ? 'bg-slate-400' : 'bg-amber-500'"></span>
                  {{ rapport.lu_par_admin ? 'Lu' : 'Nouveau' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText class="w-4 h-4 text-blue-600" />
                  {{ rapport.titre || `Rapport #${rapport.id}` }}
                </p>
                <p class="text-[10px] text-slate-400 mt-0.5">{{ rapport.description || `Rapport automatique généré` }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-emerald-700 text-xs">{{ rapport.boutique?.nom || '—' }}</p>
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ rapport.gestionnaire ? `${rapport.gestionnaire.prenom} ${rapport.gestionnaire.nom}` : '—' }}
              </td>
              <td class="px-6 py-4">
                <span :class="rapport.type_rapport === 'mensuel' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">
                  {{ rapport.type_rapport === 'mensuel' ? 'Mensuel' : 'Journalier' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-slate-500 text-[11px]">
                {{ formatDate(rapport.created_at) }}
              </td>
              <td class="px-6 py-4 text-right flex items-center justify-end gap-2">
                <button
                  v-if="!rapport.lu_par_admin"
                  @click="marquerLu(rapport)"
                  title="Marquer comme lu"
                  class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors border border-amber-200"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <a
                  :href="`${config.public.apiBaseUrl}/admin/rapports/${rapport.id}/telecharger`"
                  target="_blank"
                  class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors inline-flex items-center border border-emerald-200"
                  title="Télécharger le PDF"
                >
                  <Download class="w-4 h-4" />
                </a>
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
import { FileSpreadsheet, FileText, BellDot, CheckCheck, Eye, Download } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/rapports',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'Rapports PDF - Administration AgroShop' })

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const rapports = ref([])
const loading = ref(true)
const activeFilter = ref('all')

const filters = [
  { key: 'all', label: 'Tous' },
  { key: 'unread', label: 'Non lus' },
  { key: 'journalier', label: 'Journaliers' },
  { key: 'mensuel', label: 'Mensuels' }
]

const fetchRapports = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/rapports`, {
      headers: { Authorization: `Bearer ${authStore.token}`, Accept: 'application/json' }
    })
    rapports.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) {
    rapports.value = [
      { id: 1, titre: 'Rapport Journalier - 28 Juillet', type_rapport: 'journalier', lu_par_admin: false, boutique: { nom: 'AgroShop Quincaillerie Centre' }, gestionnaire: { prenom: 'Paul', nom: 'Koffi' }, created_at: new Date().toISOString() },
      { id: 2, titre: 'Rapport Mensuel - Juillet 2025', type_rapport: 'mensuel', lu_par_admin: true, boutique: { nom: 'AgroShop Engrais Nord' }, gestionnaire: { prenom: 'Marie', nom: 'Aya' }, created_at: new Date().toISOString() }
    ]
  } finally {
    loading.value = false
  }
}

const marquerLu = async (rapport) => {
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/rapports/${rapport.id}/marquer-lu`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    rapport.lu_par_admin = true
  } catch (e) {
    rapport.lu_par_admin = true
  }
}

const filteredRapports = computed(() => {
  if (activeFilter.value === 'unread') return rapports.value.filter(r => !r.lu_par_admin)
  if (activeFilter.value === 'journalier') return rapports.value.filter(r => r.type_rapport === 'journalier')
  if (activeFilter.value === 'mensuel') return rapports.value.filter(r => r.type_rapport === 'mensuel')
  return rapports.value
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(fetchRapports)
</script>
