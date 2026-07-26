<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
    
    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col justify-between p-5">
      <div class="space-y-6">
        
        <!-- Logo & Admin Badge -->
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-emerald-950">
            <Sprout class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xl font-black text-white tracking-wide">Agro<span class="text-[#8cc63f]">Shop</span></span>
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30 block mt-0.5">ADMIN v4.2</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          <NuxtLink 
            to="/admin" 
            exact
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path === '/admin' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Tableau de Bord</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/produits" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/produits') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
          >
            <Package class="w-4 h-4" />
            <span>Produits & Stocks</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/commandes" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/commandes') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
          >
            <ShoppingCart class="w-4 h-4" />
            <span>Commandes Clients</span>
          </NuxtLink>

          <NuxtLink 
            to="/admin/blog" 
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="route.path.startsWith('/admin/blog') ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
          >
            <FileText class="w-4 h-4" />
            <span>Blog & Conseils</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Bottom Profile & Actions -->
      <div class="space-y-4 pt-6 border-t border-slate-800">
        
        <NuxtLink to="/" target="_blank" class="flex items-center gap-2 px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all">
          <ExternalLink class="w-4 h-4 text-emerald-400" />
          <span>Voir la Vitrine Client</span>
        </NuxtLink>

        <!-- Admin Logged User info -->
        <div class="flex items-center justify-between px-2 pt-1">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-black text-xs flex items-center justify-center">
              AD
            </div>
            <div class="text-xs">
              <p class="font-bold text-white leading-tight">Admin AgroShop</p>
              <p class="text-[10px] text-slate-500">Session Active</p>
            </div>
          </div>

          <button 
            @click="handleLogout" 
            title="Se Déconnecter"
            class="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>

    <!-- Main Admin Body Content -->
    <main class="flex-1 min-w-0 bg-slate-950 flex flex-col min-h-screen">
      
      <!-- Top Bar Header -->
      <header class="h-16 border-b border-slate-800 bg-slate-900/60 px-6 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>PORTAIL D'ADMINISTRATION</span>
          <span>/</span>
          <span class="text-emerald-400 font-bold uppercase">{{ route.name?.toString().replace('admin-', '') || 'DASHBOARD' }}</span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API CONNECTÉE</span>
          </div>
        </div>
      </header>

      <!-- Slot Area -->
      <div class="flex-1 p-6 sm:p-8 overflow-y-auto">
        <slot />
      </div>

    </main>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Sprout, LayoutDashboard, Package, ShoppingCart, FileText, ExternalLink, LogOut } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

const route = useRoute()
const authStore = useAdminAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
