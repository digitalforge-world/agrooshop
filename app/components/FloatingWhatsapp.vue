<template>
  <div class="fixed bottom-6 right-6 z-50 flex items-center">
    <!-- Main Floating Action Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter AgroShop sur WhatsApp"
      class="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl shadow-emerald-600/40 transform hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
    >
      <!-- Pulsing Aura rings -->
      <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35"></span>
      <span class="absolute -inset-1 rounded-full border-2 border-[#25D366]/50 animate-pulse"></span>

      <!-- Official WhatsApp SVG Icon -->
      <svg class="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.001L2 22l5.176-1.334c1.472.802 3.129 1.224 4.833 1.225h.005c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.038-5.176-2.924-7.062A9.923 9.923 0 0 0 12.012 2zm.005 16.568h-.004c-1.492 0-2.956-.4-4.234-1.157l-.304-.18-3.147.811.838-3.037-.197-.311c-.833-1.314-1.273-2.839-1.273-4.404 0-4.408 3.587-7.994 7.996-7.994 2.135 0 4.141.832 5.651 2.342a7.94 7.94 0 0 1 2.338 5.65c-.001 4.409-3.588 7.995-7.998 7.995zm4.385-5.992c-.24-.12-.1423-.71-.207-.803-.083-.092-.18-.138-.277-.138-.096 0-.194.046-.264.149-.071.103-.277.345-.339.414-.063.069-.125.08-.245.02-.12-.06-.508-.187-.968-.598-.358-.319-.601-.714-.671-.834-.07-.12-.008-.185.052-.244.054-.053.12-.138.18-.207.06-.069.08-.12.12-.2.04-.08.02-.149-.01-.207-.03-.06-.277-.667-.38-.913-.1-.24-.202-.207-.277-.211h-.237c-.083 0-.218.031-.332.155-.114.124-.436.426-.436 1.04 0 .614.447 1.206.509 1.29.062.083.88 1.344 2.132 1.885.298.128.531.205.713.263.299.095.571.082.786.05.24-.036.738-.302.842-.594.104-.292.104-.542.073-.594-.031-.052-.128-.083-.248-.143z"/>
      </svg>
    </a>
  </div>
</template>

<script setup>
const whatsappUrl = 'https://wa.me/22898706081?text=' + encodeURIComponent('Bonjour, je viens du site AgroShop.')
</script>
