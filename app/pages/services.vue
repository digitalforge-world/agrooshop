<template>
  <div class="min-h-screen bg-[#F7F9F8] text-slate-900 selection:bg-amber-400 selection:text-slate-950">

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 1: HERO HEADER (FULL-BLEED BACKGROUND LIKE HOMEPAGE HERO)-->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden bg-white min-h-[480px] sm:min-h-[520px] flex items-center border-b border-slate-200/60 select-none">
      
      <!-- Background Image (Widescreen African AgroShop technician, non-zoomed, seamlessly feathered) -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/images/services-hero-tech-wide.png" 
          alt="Technicien africain certifié AgroShop en intervention" 
          class="w-full h-full object-cover object-right"
        />
        <!-- Soft Gradient Overlay on Left Side for Text Contrast -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:w-[50%]"></div>
      </div>

      <!-- Main Content Container -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Hero Text Left -->
          <div class="lg:col-span-7 space-y-6 text-left">
            
            <!-- Pill Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300/70 text-[#072B1C] text-xs font-bold uppercase tracking-wider">
              <svg class="w-4 h-4 text-[#072B1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>SERVICES CERTIFIÉS AGROSHOP</span>
            </div>

            <!-- Main Title -->
            <h1 class="text-4xl sm:text-6xl font-black text-[#072B1C] leading-[1.1] tracking-tight">
              Dites adieu <br />
              <span class="text-[#D49917]">aux nuisibles !</span>
            </h1>

            <!-- Description Paragraph -->
            <p class="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              La solution professionnelle certifiée pour votre maison, jardin, entrepôts et exploitations agricoles au Togo.
              Nos techniciens se déplacent directement sur le terrain pour un diagnostic précis avant tout traitement.
            </p>

            <!-- 3 Bullet Features Row -->
            <div class="flex flex-wrap items-center gap-3 text-xs font-extrabold text-[#072B1C] pt-1">
              <div class="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <svg class="w-4 h-4 text-[#072B1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Diagnostic sur site</span>
              </div>

              <div class="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <svg class="w-4 h-4 text-[#072B1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Traitement professionnel</span>
              </div>

              <div class="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
                <svg class="w-4 h-4 text-[#072B1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Suivi après intervention</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 pt-2 sm:w-max">
              <!-- Main WhatsApp Gold Button -->
              <a 
                :href="whatsappDirectUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto px-7 py-3.5 bg-[#E5A812] hover:bg-[#d69b0f] text-[#072B1C] text-xs sm:text-sm font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer border border-amber-400"
              >
                <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.001L2 22l5.176-1.334c1.472.802 3.129 1.224 4.833 1.225h.005c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.038-5.176-2.924-7.062A9.923 9.923 0 0 0 12.012 2zm.005 16.568h-.004c-1.492 0-2.956-.4-4.234-1.157l-.304-.18-3.147.811.838-3.037-.197-.311c-.833-1.314-1.273-2.839-1.273-4.404 0-4.408 3.587-7.994 7.996-7.994 2.135 0 4.141.832 5.651 2.342a7.94 7.94 0 0 1 2.338 5.65c-.001 4.409-3.588 7.995-7.998 7.995zm4.385-5.992c-.24-.12-.1423-.71-.207-.803-.083-.092-.18-.138-.277-.138-.096 0-.194.046-.264.149-.071.103-.277.345-.339.414-.063.069-.125.08-.245.02-.12-.06-.508-.187-.968-.598-.358-.319-.601-.714-.671-.834-.07-.12-.008-.185.052-.244.054-.053.12-.138.18-.207.06-.069.08-.12.12-.2.04-.08.02-.149-.01-.207-.03-.06-.277-.667-.38-.913-.1-.24-.202-.207-.277-.211h-.237c-.083 0-.218.031-.332.155-.114.124-.436.426-.436 1.04 0 .614.447 1.206.509 1.29.062.083.88 1.344 2.132 1.885.298.128.531.205.713.263.299.095.571.082.786.05.24-.036.738-.302.842-.594.104-.292.104-.542.073-.594-.031-.052-.128-.083-.248-.143z"/>
                </svg>
                <div class="text-center sm:text-left leading-tight">
                  <div class="uppercase tracking-wide">DEMANDER UNE INSPECTION TERRAIN</div>
                  <div class="text-[11px] font-bold opacity-90">(WhatsApp)</div>
                </div>
              </a>

              <!-- Phone White Button -->
              <a 
                href="tel:+22898706081"
                class="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-[#072B1C] text-xs sm:text-sm font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg class="w-4 h-4 text-[#072B1C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+228 98 70 60 81</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- REST OF THE SERVICES PAGE SECTIONS CONTAINER                      -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 py-8 sm:py-12">

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SECTION 2: DETACHED INDIVIDUAL DARK GREEN COMMITMENT CARDS (MARQUEE) -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <section class="relative w-full overflow-hidden py-2">
        <!-- Horizontal Marquee Loop scrolling 3 detached cards one by one -->
        <div class="overflow-x-auto scrollbar-none py-1">
          <div class="flex animate-marquee items-center gap-4">
            <div 
              v-for="(item, idx) in [...commitmentItems, ...commitmentItems, ...commitmentItems]" 
              :key="idx"
              class="flex items-center gap-4 bg-[#052818] border border-emerald-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex-shrink-0 min-w-[275px] sm:min-w-[320px] transition-transform hover:scale-[1.02]"
            >
              <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-md">
                <component :is="item.icon" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-xs sm:text-sm font-black text-white tracking-wide leading-tight">{{ item.title }}</h3>
                <p class="text-[11px] sm:text-xs text-emerald-200/90 font-medium leading-relaxed mt-0.5">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SECTION 3: NOS INTERVENTIONS (REAL NATURAL PHOTOS MATCHING RED BOX) -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <section class="space-y-4 sm:space-y-6">
        <!-- Title -->
        <div class="text-center space-y-1.5">
          <h2 class="text-lg sm:text-2xl font-black text-[#072B1C]">Nos interventions</h2>
          <div class="w-10 sm:w-12 h-1 bg-[#E5A812] mx-auto rounded-full"></div>
        </div>

        <!-- 8 Cards Grid (Compact 4 columns on mobile, 8 on desktop) -->
        <div class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          <div 
            v-for="(pest, idx) in pestInterventions" 
            :key="idx"
            class="bg-white rounded-2xl border border-slate-200/90 p-2 flex flex-col items-center justify-between text-center min-h-[110px] sm:min-h-[135px] shadow-2xs hover:border-[#E5A812] hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer group"
            @click="requestPestService(pest.name)"
          >
            <!-- Image in subtle container -->
            <div class="w-full h-12 sm:h-16 flex items-center justify-center p-1 rounded-xl bg-slate-50 group-hover:bg-amber-50/60 transition-colors">
              <img 
                :src="pest.image" 
                :alt="pest.name" 
                class="max-w-full max-h-full object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <!-- Label -->
            <span class="text-[10px] sm:text-xs font-extrabold text-[#072B1C] group-hover:text-amber-700 leading-tight pt-1">
              {{ pest.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SECTION 4: COMMENT ÇA MARCHE ?                                  -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <section class="space-y-8">
        <!-- Title -->
        <div class="text-center space-y-2">
          <h2 class="text-xl sm:text-2xl font-black text-[#072B1C]">Comment ça marche ?</h2>
          <div class="w-12 h-1 bg-[#E5A812] mx-auto rounded-full"></div>
        </div>

        <!-- 3 Steps Grid with Dark Green Badges & Dashed Yellow Arrows -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <!-- Step 01 Card -->
          <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-3">
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <span class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#052818] text-white font-black text-xs flex items-center justify-center shadow-md z-10">
                01
              </span>
              <img src="/images/services-step-1.png" alt="Inspection AgroShop" class="w-full h-full object-cover" />
            </div>
            <div class="p-4 space-y-1.5 text-center">
              <h3 class="text-sm font-black text-[#072B1C]">Inspection</h3>
              <p class="text-xs text-slate-600 font-medium leading-relaxed">
                Nous identifions les nuisibles et évaluons le niveau d'infestation.
              </p>
            </div>
          </div>

          <!-- Dashed Yellow Arrow 1 -->
          <div class="hidden md:flex md:col-span-1 justify-center text-[#E5A812]">
            <svg class="w-8 h-8 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-dasharray="3 3">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <!-- Step 02 Card -->
          <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-3">
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <span class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#052818] text-white font-black text-xs flex items-center justify-center shadow-md z-10">
                02
              </span>
              <img src="/images/services-step-2.png" alt="Traitement AgroShop" class="w-full h-full object-cover" />
            </div>
            <div class="p-4 space-y-1.5 text-center">
              <h3 class="text-sm font-black text-[#072B1C]">Traitement</h3>
              <p class="text-xs text-slate-600 font-medium leading-relaxed">
                Nous appliquons le traitement adapté au problème identifié.
              </p>
            </div>
          </div>

          <!-- Dashed Yellow Arrow 2 -->
          <div class="hidden md:flex md:col-span-1 justify-center text-[#E5A812]">
            <svg class="w-8 h-8 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-dasharray="3 3">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <!-- Step 03 Card -->
          <div class="md:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-3">
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <span class="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#052818] text-white font-black text-xs flex items-center justify-center shadow-md z-10">
                03
              </span>
              <img src="/images/services-step-3.png" alt="Suivi AgroShop" class="w-full h-full object-cover" />
            </div>
            <div class="p-4 space-y-1.5 text-center">
              <h3 class="text-sm font-black text-[#072B1C]">Suivi</h3>
              <p class="text-xs text-slate-600 font-medium leading-relaxed">
                Nous assurons le suivi et vous donnons des conseils pour éviter la réinfestation.
              </p>
            </div>
          </div>

        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SECTION 5: POURQUOI CHOISIR AGROSHOP ?                          -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <section class="space-y-8">
        <!-- Title -->
        <div class="text-center space-y-2">
          <h2 class="text-xl sm:text-2xl font-black text-[#072B1C]">Pourquoi choisir AGROSHOP ?</h2>
          <div class="w-12 h-1 bg-[#E5A812] mx-auto rounded-full"></div>
        </div>

        <!-- 4 White Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <!-- Card 1 -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:border-[#E5A812] transition-colors">
            <div class="w-12 h-12 text-[#072B1C] mx-auto flex items-center justify-center">
              <svg class="w-8 h-8 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3 class="text-sm font-black text-[#072B1C]">Diagnostic précis</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Inspection sur site pour identifier la source du problème.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:border-[#E5A812] transition-colors">
            <div class="w-12 h-12 text-[#072B1C] mx-auto flex items-center justify-center">
              <svg class="w-8 h-8 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h3 class="text-sm font-black text-[#072B1C]">Solutions adaptées</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Traitements professionnels adaptés à chaque situation.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:border-[#E5A812] transition-colors">
            <div class="w-12 h-12 text-[#072B1C] mx-auto flex items-center justify-center">
              <svg class="w-8 h-8 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <h3 class="text-sm font-black text-[#072B1C]">Sécurité garantie</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Méthodes sûres pour les personnes, les animaux et l'environnement.
            </p>
          </div>

          <!-- Card 4 -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-2xs hover:border-[#E5A812] transition-colors">
            <div class="w-12 h-12 text-[#072B1C] mx-auto flex items-center justify-center">
              <svg class="w-8 h-8 stroke-[1.75]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
            </div>
            <h3 class="text-sm font-black text-[#072B1C]">Suivi client</h3>
            <p class="text-xs text-slate-600 font-medium leading-relaxed">
              Nous restons à vos côtés après chaque intervention.
            </p>
          </div>

        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SECTION 6: ILS NOUS FONT CONFIANCE                               -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <section class="bg-[#052818] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-900 space-y-8">
        <!-- Title + Yellow Underline -->
        <div class="text-left space-y-2">
          <h2 class="text-xl sm:text-2xl font-black text-white">Ils nous font confiance</h2>
          <div class="w-12 h-1 bg-[#E5A812] rounded-full"></div>
        </div>

        <!-- Content Grid (Testimonial Quote + 3 Photos) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Testimonial Quote Left -->
          <div class="lg:col-span-5 space-y-4">
            <div class="text-3xl text-amber-400 font-serif leading-none">““</div>
            <p class="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed italic">
              Service rapide et efficace. Techniciens professionnels et à l'écoute. Je recommande AGROSHOP.
            </p>
            
            <!-- 5 Stars -->
            <div class="flex items-center gap-1 text-amber-400">
              <span v-for="i in 5" :key="i" class="text-base">★</span>
            </div>

            <p class="text-xs font-bold text-emerald-300">
              — Client à Lomé
            </p>
          </div>

          <!-- 3 Photos Right -->
          <div class="lg:col-span-7 grid grid-cols-3 gap-3">
            <div class="rounded-xl overflow-hidden shadow-md h-32 sm:h-40 bg-slate-900">
              <img src="/images/services-step-1.png" alt="Intervention AgroShop" class="w-full h-full object-cover" />
            </div>
            <div class="rounded-xl overflow-hidden shadow-md h-32 sm:h-40 bg-slate-900">
              <img src="/images/services-step-2.png" alt="Traitement entrepôt AgroShop" class="w-full h-full object-cover" />
            </div>
            <div class="rounded-xl overflow-hidden shadow-md h-32 sm:h-40 bg-slate-900">
              <img src="/images/services-greenhouse.png" alt="Intervention serre agricole" class="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ShieldCheck, UserCheck, MapPin } from 'lucide-vue-next'

useHead({
  title: 'Services Certifiés Anti-Nuisibles - AgroShop Togo',
  meta: [
    { name: 'description', content: 'Dites adieu aux nuisibles ! La solution professionnelle certifiée pour votre maison, jardin, entrepôts et exploitations agricoles au Togo par AgroShop.' }
  ]
})

const commitmentItems = [
  {
    title: 'Produits homologués',
    desc: 'Utilisation de produits certifiés et respectueux des normes.',
    icon: ShieldCheck
  },
  {
    title: 'Techniciens qualifiés',
    desc: 'Équipe expérimentée et formée aux meilleures pratiques.',
    icon: UserCheck
  },
  {
    title: 'Intervention au Togo',
    desc: 'Déplacement rapide dans toutes les régions.',
    icon: MapPin
  }
]

const whatsappDirectUrl = `https://wa.me/22898706081?text=${encodeURIComponent("Bonjour AgroShop Togo, je souhaite demander une visite d'inspection terrain pour un traitement anti-nuisibles.")}`

const requestPestService = (pestName) => {
  const msg = `Bonjour AgroShop Togo, je souhaite demander une intervention / diagnostic concernant les : ${pestName}.`
  const url = `https://wa.me/22898706081?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}

// 8 Pest Interventions Grid with REAL NATURAL PHOTOS
const pestInterventions = [
  { name: 'Cafards', image: '/images/pest-cafard.png' },
  { name: 'Fourmis', image: '/images/pest-fourmi.png' },
  { name: 'Rats & souris', image: '/images/pest-rat.png' },
  { name: 'Moustiques', image: '/images/pest-moustique.png' },
  { name: 'Mouches', image: '/images/pest-mouche.png' },
  { name: 'Insectes nuisibles', image: '/images/pest-beetle.png' },
  { name: 'Nuisibles agricoles', image: '/images/pest-chenille.png' },
  { name: 'Entrepôts & stocks', image: '/images/pest-entrepot.png' }
]
</script>
