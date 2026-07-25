<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-lime-400 selection:text-slate-950">
    <!-- Navbar Component -->
    <AppNavbar />

    <!-- Main Content View -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Slide-in Cart Sidebar Drawer -->
    <CartSidebar />

    <!-- Footer Component -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadFromStorage()
})
</script>
