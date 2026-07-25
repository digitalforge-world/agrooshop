<template>
  <section class="relative overflow-hidden bg-white">
    
    <!-- Image de fond unique (dégradé + produits déjà intégrés) -->
    <div class="absolute inset-0">
      <img
        src="/images/hero-produits-agroshop.png"
        alt=""
        class="w-full h-full object-cover object-right"
      />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">

        <!-- Colonne gauche : texte -->
        <div class="lg:col-span-6 space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-[1.12] tracking-tight">
            Tout pour une<br />
            <span class="text-emerald-700">agriculture</span><br />
            <span class="inline-flex items-center gap-2 text-emerald-700">
              performante
              <svg class="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.98-2.22c.5.11 1.13.22 1.83.22C15.5 20 20 15.5 20 8c0-3-1-6-1-6s-1.99 4-8 6c-4.5 1.5-6 4.5-6 4.5S8.5 10.5 17 8z"/>
              </svg>
            </span>
          </h1>

          <p class="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed">
            Intrants, équipements, semences et conseils d'experts pour des récoltes abondantes et durables.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <NuxtLink
              to="/produits"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>Découvrir nos produits</span>
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-lg border border-gray-300 shadow-sm transition-colors"
            >
              <MessageCircle class="w-4 h-4 text-emerald-700" />
              <span>Nous contacter</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Colonne droite : vide, les produits sont déjà dans l'image de fond -->
        <div class="lg:col-span-6"></div>
      </div>

      <!-- Pagination à points -->
      <div class="flex justify-center items-center gap-2 pb-4">
        <span class="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-emerald-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-gray-300"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-gray-300"></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ShoppingBag, MessageCircle } from 'lucide-vue-next'
</script>