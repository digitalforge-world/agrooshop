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
          <!-- Notification Bell Dropdown Component -->
          <div class="relative" v-click-outside="closeNotifications">
            <button 
              @click="toggleNotifications"
              type="button"
              class="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-800 transition-all cursor-pointer border border-slate-200 shadow-2xs flex items-center justify-center"
              title="Notifications commandes"
            >
              <Bell class="w-5 h-5" />
              <span 
                v-if="unreadNotificationsCount > 0" 
                class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white font-black text-[10px] flex items-center justify-center border-2 border-white animate-pulse"
              >
                {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
              </span>
            </button>

            <!-- Notifications Dropdown Panel -->
            <div 
              v-if="showNotifications"
              class="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div class="p-4 bg-emerald-950 text-white flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Bell class="w-4 h-4 text-emerald-400" />
                  <h3 class="text-xs font-black tracking-wider uppercase">Notifications Commandes</h3>
                </div>
                <span v-if="unreadNotificationsCount > 0" class="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {{ unreadNotificationsCount }} nouvelle(s)
                </span>
              </div>

              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
                <div v-if="notifications.length === 0" class="p-6 text-center text-xs text-slate-400">
                  Aucune notification de commande récente.
                </div>
                <NuxtLink
                  v-for="item in notifications"
                  :key="item.id"
                  :to="`/admin/commandes`"
                  @click="closeNotifications"
                  class="p-3.5 hover:bg-slate-50 flex items-start gap-3 transition-colors block"
                >
                  <div 
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5',
                      item.mode_paiement === 'mobile_money' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    ]"
                  >
                    {{ item.mode_paiement === 'mobile_money' ? '📱' : '💵' }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-xs font-bold text-slate-900 truncate">
                        {{ item.prenom_client }} {{ item.nom_client }}
                      </p>
                      <span class="text-[10px] text-slate-400 font-mono">{{ formatTimeAgo(item.created_at) }}</span>
                    </div>
                    <p class="text-[11px] text-slate-600 font-medium">
                      Ref: <strong class="text-slate-800">{{ item.code_reference }}</strong> — 
                      <span class="text-emerald-700 font-black">{{ (item.montant_total || 0).toLocaleString('fr-FR') }} FCFA</span>
                    </p>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase bg-slate-100 text-slate-600">
                        {{ item.mode_paiement === 'mobile_money' ? 'Mobile Money' : 'Espèces' }}
                      </span>
                      <span 
                        :class="[
                          'text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase',
                          item.statut_paiement === 'paye' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        ]"
                      >
                        {{ item.statut_paiement === 'paye' ? 'Payé' : 'En attente' }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <div class="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <NuxtLink 
                  to="/admin/commandes" 
                  @click="closeNotifications"
                  class="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Voir toutes les commandes →
                </NuxtLink>
              </div>
            </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
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
  LogOut,
  Bell
} from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

const route = useRoute()
const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const showNotifications = ref(false)
const notifications = ref([])
const unreadNotificationsCount = ref(0)
let pollingTimer = null

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    unreadNotificationsCount.value = 0
  }
}

const closeNotifications = () => {
  showNotifications.value = false
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diffMs = new Date() - date
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `il y a ${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `il y a ${diffHours} h`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

const fetchNotifications = async () => {
  try {
    const token = authStore.token
    if (!token) return

    const res = await $fetch(`${config.public.apiBaseUrl}/admin/commandes/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = res?.data
    if (data) {
      notifications.value = data.notifications || []
      unreadNotificationsCount.value = data.unread_count || 0
    }
  } catch (e) {
    // silencieux sur erreur réseau
  }
}

onMounted(() => {
  fetchNotifications()
  // Polling automatique toutes les 25 secondes
  pollingTimer = setInterval(fetchNotifications, 25000)
})

onUnmounted(() => {
  if (pollingTimer) clearInterval(pollingTimer)
})

const handleLogout = () => {
  authStore.logout()
}
</script>

