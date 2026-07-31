<template>
  <!-- Fixed Fullscreen Viewport Shell with AgroShop Brand Palette -->
  <div class="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 flex font-sans select-none">
    
    <!-- Fixed Sidebar Navigation (Deep Agro Emerald Theme) -->
    <aside class="w-64 h-full bg-emerald-950 border-r border-emerald-900/60 flex flex-col justify-between p-5 flex-shrink-0 overflow-y-auto z-30 text-slate-100">
      <div class="space-y-8">
        
        <!-- Brand Logo Header -->
        <NuxtLink to="/admin" class="flex items-center gap-3 px-2 group">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-md">
            <Sprout class="w-6 h-6" />
          </div>
          <div>
            <h1 class="text-sm font-black tracking-wider text-white uppercase">AGROSHOP</h1>
            <p class="text-[10px] text-emerald-400 font-mono font-semibold">PANNEAU ADMIN</p>
          </div>
        </NuxtLink>

        <!-- Main Navigation Links -->
        <nav class="space-y-1.5">
          
          <!-- 1. Tableau de bord -->
          <NuxtLink 
            to="/admin" 
            exact
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path === '/admin' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Tableau de Bord</span>
          </NuxtLink>

          <!-- 2. Produits -->
          <NuxtLink 
            to="/admin/produits" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/produits') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <Package class="w-4 h-4" />
            <span>Produits</span>
          </NuxtLink>

          <!-- 3. Catégories -->
          <NuxtLink 
            to="/admin/categories" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/categories') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <FolderTree class="w-4 h-4" />
            <span>Catégories</span>
          </NuxtLink>

          <!-- 4. Toutes les commandes -->
          <NuxtLink 
            to="/admin/commandes" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/commandes') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Toutes les Commandes</span>
          </NuxtLink>

          <!-- 4.5. Partenaires -->
          <NuxtLink 
            to="/admin/partenaires" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/partenaires') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <Handshake class="w-4 h-4" />
            <span>Partenaires</span>
          </NuxtLink>

          <!-- MULTI-BOUTIQUES -->
          <div class="pt-3 pb-1">
            <p class="px-3.5 text-[10px] font-bold tracking-wider text-emerald-400/60 uppercase">Multi-Boutiques</p>
          </div>

          <NuxtLink 
            to="/admin/boutiques" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/boutiques') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <Store class="w-4 h-4" />
            <span>Boutiques</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/gestionnaires" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/gestionnaires') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <UserCog class="w-4 h-4" />
            <span>Délégués & Gestionnaires</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/rapports" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/rapports') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Rapports PDF</span>
          </NuxtLink>

          <div class="pt-3 pb-1">
            <p class="px-3.5 text-[10px] font-bold tracking-wider text-emerald-400/60 uppercase">Contenu & Users</p>
          </div>

          <!-- 5. Gestion de Contenu (Articles & Blog) -->
          <NuxtLink 
            to="/admin/blog" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/blog') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <FileText class="w-4 h-4" />
            <span>Gestion de Contenu (Blog)</span>
          </NuxtLink>

          <!-- 6. Utilisateurs & Administrateurs -->
          <NuxtLink 
            to="/admin/utilisateurs" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/utilisateurs') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <Users class="w-4 h-4" />
            <span>Utilisateurs & Admins</span>
          </NuxtLink>

          <!-- 7. Suivi Visiteurs & Clics (IP) -->
          <NuxtLink 
            to="/admin/visites" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/visites') ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-black' : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'"
          >
            <Activity class="w-4 h-4" />
            <span>Suivi Visiteurs & Clics (IP)</span>
          </NuxtLink>

        </nav>
      </div>

      <!-- Bottom Profile & Actions -->
      <div class="space-y-4 pt-5 border-t border-emerald-900/60 flex-shrink-0">
        
        <NuxtLink to="/" target="_blank" class="flex items-center justify-between px-3.5 py-2.5 bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-100 hover:text-white text-xs font-semibold rounded-xl transition-all border border-emerald-800/50">
          <span class="flex items-center gap-2">
            <ExternalLink class="w-4 h-4 text-emerald-400" />
            <span>Vitrine Client</span>
          </span>
          <span class="text-[10px] text-emerald-300 font-mono">↗</span>
        </NuxtLink>

        <!-- Admin Logged User info -->
        <div class="flex items-center justify-between px-1 pt-1">
          <div class="flex items-center gap-2.5 overflow-hidden">
            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              {{ authStore.adminUser?.prenom?.[0] || 'A' }}
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-bold text-white truncate">{{ authStore.adminUser?.prenom || 'Admin' }} {{ authStore.adminUser?.nom || '' }}</p>
              <p class="text-[10px] text-emerald-300/80 font-mono capitalize truncate">{{ authStore.adminUser?.role || 'Super Admin' }}</p>
            </div>
          </div>

          <button 
            @click="handleLogout" 
            title="Déconnexion"
            class="p-2 text-emerald-300/70 hover:text-red-400 hover:bg-emerald-900/60 rounded-xl transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>

    <!-- Main Section (Header Fixed Top + Content Body Light & Crisp) -->
    <main class="flex-1 h-full flex flex-col min-w-0 bg-slate-100 overflow-hidden">
      
      <!-- Fixed Top Bar Header -->
      <header class="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-20 shadow-xs">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>PORTAIL D'ADMINISTRATION</span>
          <span>/</span>
          <span class="text-emerald-700 font-bold uppercase">{{ route.name?.toString().replace('admin-', '') || 'DASHBOARD' }}</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API CONNECTÉE</span>
          </div>
        </div>
      </header>

      <!-- Scrollable Main Content Area -->
      <div class="flex-1 h-[calc(100vh-4rem)] p-6 sm:p-8 overflow-y-auto">
        <slot />
      </div>

    </main>

    <!-- Floating AI Assistant -->
    <AiAssistant />

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { 
  Sprout, 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart,
  Store,
  UserCog,
  FileSpreadsheet,
  Handshake, 
  FileText, 
  Users, 
  Activity,
  ExternalLink, 
  LogOut 
} from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

const route = useRoute()
const authStore = useAdminAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
