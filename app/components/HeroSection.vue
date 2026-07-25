<template>
  <section 
    class="relative overflow-hidden bg-white select-none"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <!-- Background Carousel Images -->
    <div 
      v-for="(slide, idx) in slides" 
      :key="idx" 
      :class="[
        'absolute inset-0 transition-opacity duration-1000 ease-in-out',
        currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
      ]"
    >
      <img
        :src="slide.image"
        :alt="slide.titleLine2"
        class="w-full h-full object-cover object-right"
      />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">

        <!-- Left Column: Dynamic Text for Active Slide -->
        <div class="lg:col-span-6 space-y-6">
          <div class="transition-all duration-500 transform">
            <h1 class="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-[1.12] tracking-tight">
              {{ activeSlide.titleLine1 }}<br />
              <span class="text-emerald-700">{{ activeSlide.titleLine2 }}</span><br />
              <span class="inline-flex items-center gap-2 text-emerald-700">
                {{ activeSlide.titleLine3 }}
                <svg class="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.98-2.22c.5.11 1.13.22 1.83.22C15.5 20 20 15.5 20 8c0-3-1-6-1-6s-1.99 4-8 6c-4.5 1.5-6 4.5-6 4.5S8.5 10.5 17 8z"/>
                </svg>
              </span>
            </h1>

            <p class="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed mt-4">
              {{ activeSlide.subtitle }}
            </p>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <NuxtLink
              to="/produits"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>Découvrir nos produits</span>
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-lg border border-gray-300 shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle class="w-4 h-4 text-emerald-700" />
              <span>Nous contacter</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column: Spacing for background image composition -->
        <div class="lg:col-span-6"></div>
      </div>

      <!-- Pagination Dots -->
      <div class="flex justify-center items-center gap-3 pb-6 pt-2 relative z-20">
        <button
          v-for="(slide, idx) in slides"
          :key="idx"
          @click="goToSlide(idx)"
          :class="[
            'h-2.5 rounded-full transition-all duration-300 cursor-pointer',
            currentSlide === idx ? 'w-8 bg-emerald-700' : 'w-2.5 bg-gray-300 hover:bg-emerald-400'
          ]"
          :aria-label="`Slide ${idx + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ShoppingBag, MessageCircle } from 'lucide-vue-next'

const slides = [
  {
    image: '/images/hero-produits-agroshop.png',
    titleLine1: 'Tout pour une',
    titleLine2: 'agriculture',
    titleLine3: 'performante',
    subtitle: 'Intrants certifiés, engrais YARA, produits phytosanitaires et conseils d\'experts pour des récoltes abondantes.'
  },
  {
    image: '/images/Agroshop-hero2.png',
    titleLine1: 'Équipements &',
    titleLine2: 'matériel agricole',
    titleLine3: 'performant',
    subtitle: 'Systèmes d\'irrigation goutte-à-goutte, motopompes, pulvérisateurs et motoculteurs pour mécaniser votre exploitation.'
  },
  {
    image: '/images/Agroshop-hero3.png',
    titleLine1: 'Matériel & Outillage de',
    titleLine2: 'quincaillerie',
    titleLine3: 'professionnelle',
    subtitle: 'Brouettes renforcées, outillage manuel, machines et équipements professionnels pour tous vos chantiers.'
  }
]

const currentSlide = ref(0)
let timer = null

const activeSlide = computed(() => slides[currentSlide.value])

const goToSlide = (index) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(nextSlide, 5000)
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>