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

    <!-- Checkout Modal Component -->
    <CheckoutModal />

    <!-- Floating WhatsApp Action Button -->
    <FloatingWhatsapp />

    <!-- Footer Component -->
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import CheckoutModal from '~/components/CheckoutModal.vue'
import FloatingWhatsapp from '~/components/FloatingWhatsapp.vue'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.loadFromStorage()
})
</script>
