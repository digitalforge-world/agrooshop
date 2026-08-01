<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 flex font-sans select-none">
    
    <!-- Sidebar Gestionnaire -->
    <aside class="w-60 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 flex-shrink-0 z-30 shadow-sm">
      <div class="space-y-6">
        <!-- Brand -->
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <Store class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-sm font-black tracking-wider text-slate-900 uppercase">AGROSHOP</h1>
            <p class="text-[10px] text-emerald-600 font-bold font-mono">ESPACE GESTIONNAIRE</p>
          </div>
        </div>

        <!-- Boutique info / Sélecteur -->
        <div class="space-y-2">
          <p class="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boutique Active</p>
          
          <!-- Si une seule boutique : affichage simple -->
          <div v-if="!gestionnaireStore.hasMultipleBoutiques" class="bg-emerald-50/80 border border-emerald-200 rounded-xl px-3 py-2.5">
            <p class="text-sm font-bold text-slate-900 truncate">{{ gestionnaireStore.boutique?.nom || 'Boutique Assignée' }}</p>
            <p class="text-[10px] text-emerald-700 font-medium capitalize">{{ gestionnaireStore.boutique?.type || '' }}</p>
          </div>

          <!-- Si plusieurs boutiques : menu déroulant -->
          <div v-else class="space-y-1.5">
            <button
              v-for="b in gestionnaireStore.boutiques"
              :key="b.id"
              @click="gestionnaireStore.selectBoutique(b.id)"
              :class="gestionnaireStore.boutique?.id === b.id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'"
              class="w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="gestionnaireStore.boutique?.id === b.id ? 'bg-emerald-500' : 'bg-slate-300'"></span>
              <div class="overflow-hidden">
                <p class="truncate">{{ b.nom }}</p>
                <p class="text-[10px] opacity-60 capitalize">{{ b.type }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1">
          <NuxtLink
            to="/gestionnaire"
            :class="route.path === '/gestionnaire' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Tableau de Bord</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/stock"
            :class="route.path.startsWith('/gestionnaire/stock') ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <Package class="w-4 h-4" />
            <span>Mon Stock</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/ventes"
            :class="route.path === '/gestionnaire/ventes' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Caisse / Vente</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/commandes"
            :class="route.path.startsWith('/gestionnaire/commandes') ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <ShoppingBag class="w-4 h-4" />
            <span>Commandes en Ligne</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/historique-ventes"
            :class="route.path.startsWith('/gestionnaire/historique-ventes') ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <History class="w-4 h-4" />
            <span>Historique Ventes</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Bottom: User Info & Logout -->
      <div class="space-y-3 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-xs">
              {{ gestionnaireStore.user?.prenom?.[0] || 'G' }}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-slate-900 truncate">{{ gestionnaireStore.user?.prenom || 'Gestionnaire' }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ gestionnaireStore.user?.email || '' }}</p>
            </div>
          </div>
          <button @click="handleLogout" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-full flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
      <header class="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>ESPACE GESTIONNAIRE</span>
          <span>/</span>
          <span class="text-emerald-700 font-bold uppercase">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>CONNECTÉ</span>
        </div>
      </header>
      <div class="flex-1 overflow-y-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Store, LayoutDashboard, Package, ShoppingCart, ShoppingBag, History, LogOut } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

const route = useRoute()
const router = useRouter()
const gestionnaireStore = useGestionnaireAuthStore()

const pageTitle = computed(() => {
  if (route.path === '/gestionnaire') return 'DASHBOARD'
  if (route.path.includes('stock')) return 'MON STOCK'
  if (route.path.includes('commandes')) return 'COMMANDES EN LIGNE'
  if (route.path.includes('historique')) return 'HISTORIQUE DES VENTES'
  if (route.path.includes('ventes')) return 'CAISSE / VENTE'
  return ''
})

const handleLogout = () => {
  gestionnaireStore.logout()
  router.push('/gestionnaire/login')
}
</script>
