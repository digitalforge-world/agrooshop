<template>
  <div class="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex font-sans select-none">
    
    <!-- Sidebar Gestionnaire -->
    <aside class="w-60 h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0 z-30">
      <div class="space-y-6">
        <!-- Brand -->
        <div class="flex items-center gap-3 px-2 py-1">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Store class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-sm font-black tracking-wider text-white uppercase">AGROSHOP</h1>
            <p class="text-[10px] text-emerald-400 font-mono">ESPACE GESTIONNAIRE</p>
          </div>
        </div>

        <!-- Boutique info / Sélecteur -->
        <div class="space-y-2">
          <p class="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Boutique Active</p>
          
          <!-- Si une seule boutique : affichage simple -->
          <div v-if="!gestionnaireStore.hasMultipleBoutiques" class="bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-3 py-2.5">
            <p class="text-sm font-bold text-white truncate">{{ gestionnaireStore.boutique?.nom || 'Boutique Assignée' }}</p>
            <p class="text-[10px] text-slate-400 capitalize">{{ gestionnaireStore.boutique?.type || '' }}</p>
          </div>

          <!-- Si plusieurs boutiques : menu déroulant -->
          <div v-else class="space-y-1.5">
            <button
              v-for="b in gestionnaireStore.boutiques"
              :key="b.id"
              @click="gestionnaireStore.selectBoutique(b.id)"
              :class="gestionnaireStore.boutique?.id === b.id
                ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400'
                : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'"
              class="w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full flex-shrink-0" :class="gestionnaireStore.boutique?.id === b.id ? 'bg-emerald-400' : 'bg-slate-600'"></span>
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
            :class="route.path === '/gestionnaire' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Tableau de Bord</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/stock"
            :class="route.path.startsWith('/gestionnaire/stock') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <Package class="w-4 h-4" />
            <span>Mon Stock</span>
          </NuxtLink>

          <NuxtLink
            to="/gestionnaire/ventes"
            :class="route.path.startsWith('/gestionnaire/ventes') ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Caisse / Vente</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Bottom: User Info & Logout -->
      <div class="space-y-3 pt-4 border-t border-slate-800">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {{ gestionnaireStore.user?.prenom?.[0] || 'G' }}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-white truncate">{{ gestionnaireStore.user?.prenom || 'Gestionnaire' }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ gestionnaireStore.user?.email || '' }}</p>
            </div>
          </div>
          <button @click="handleLogout" class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
      <header class="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>ESPACE GESTIONNAIRE</span>
          <span>/</span>
          <span class="text-emerald-400 font-bold uppercase">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
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
import { Store, LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

const route = useRoute()
const router = useRouter()
const gestionnaireStore = useGestionnaireAuthStore()

const pageTitle = computed(() => {
  if (route.path === '/gestionnaire') return 'DASHBOARD'
  if (route.path.includes('stock')) return 'MON STOCK'
  if (route.path.includes('ventes')) return 'CAISSE / VENTE'
  return ''
})

const handleLogout = () => {
  gestionnaireStore.logout()
  router.push('/gestionnaire/login')
}
</script>
