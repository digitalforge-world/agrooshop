<template>
  <section 
    class="relative overflow-hidden bg-white select-none min-h-[500px] sm:min-h-[540px] flex flex-col justify-between"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <!-- Background Carousel Images (Instant / Fast Overlap - No White Gap) -->
    <div 
      v-for="(slide, idx) in slides" 
      :key="idx" 
      :class="[
        'absolute inset-0 transition-opacity duration-300 ease-linear',
        currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      ]"
    >
      <img
        :src="slide.image"
        :alt="slide.titleLine2"
        class="w-full h-full object-cover object-right"
      />
      <!-- Soft Gradient Overlay on Left Side for Text Contrast -->
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:w-[58%]"></div>
    </div>

    <!-- Main Content Container -->
    <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        <!-- Left Column: Dynamic Text for Active Slide -->
        <div class="lg:col-span-7 space-y-6">
          <div 
            :key="currentSlide"
            class="space-y-4 transition-all duration-300"
          >
            <h1 class="text-3xl sm:text-4xl lg:text-[3.2rem] font-black text-gray-900 leading-[1.12] tracking-tight">
              {{ activeSlide.titleLine1 }}<br />
              <span class="text-emerald-700">{{ activeSlide.titleLine2 }}</span><br />
              <span class="inline-flex items-center gap-2 text-emerald-800">
                {{ activeSlide.titleLine3 }}
              </span>
            </h1>

            <p class="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
              {{ activeSlide.subtitle }}
            </p>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <NuxtLink
              to="/produits"
              class="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingBag class="w-4.5 h-4.5" />
              <span>Découvrir nos produits</span>
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm rounded-xl border border-gray-300 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageCircle class="w-4.5 h-4.5 text-emerald-700" />
              <span>Nous contacter</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column Spacer -->
        <div class="hidden lg:block lg:col-span-5"></div>
      </div>
    </div>

    <!-- Centered Pagination Buttons at Bottom -->
    <div class="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full flex justify-center items-center gap-3">
      <button
        v-for="(slide, idx) in slides"
        :key="idx"
        @click="selectSlide(idx)"
        :class="[
          'h-3 rounded-full transition-all duration-300 cursor-pointer shadow-xs border border-white/50',
          currentSlide === idx ? 'w-10 bg-emerald-700' : 'w-3 bg-gray-300/90 hover:bg-emerald-500'
        ]"
        :aria-label="`Diapositive ${idx + 1}`"
      ></button>
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

const selectSlide = (idx) => {
  currentSlide.value = idx
  startTimer()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const startTimer = () => {
  stopTimer()
  timer = setInterval(nextSlide, 5000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>