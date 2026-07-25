<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div 
      class="relative h-[300px] md:h-[400px] w-full bg-cover bg-center flex flex-col justify-center"
      style="background-image: url('https://images.unsplash.com/photo-1592982537447-6f23f5b721e7?w=1600&q=80');"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">Contactez-nous</h1>
        <p class="max-w-md text-sm md:text-base text-gray-200">
          Commencez la conversation pour établir un partenariat solide et propulser vos projets agricoles vers le succès.
        </p>
      </div>
    </div>

    <!-- Middle Section (Form & Info) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        <!-- Left Side: Text and Socials -->
        <div>
          <div class="flex items-center gap-2 text-emerald-600 font-semibold mb-4 text-sm">
            <span class="w-6 h-px bg-emerald-600"></span>
            Entrer En Contact
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            Questions, idées ou projets ?<br>Nous sommes à votre écoute
          </h2>
          <p class="text-gray-500 mb-4 leading-relaxed text-sm">
            Que vous ayez besoin de conseils agronomiques, d'équipements spécialisés ou de semences de qualité, notre équipe d'experts est là pour vous guider à chaque étape de votre production.
          </p>
          <p class="text-gray-500 mb-8 leading-relaxed text-sm">
            N'hésitez pas à nous envoyer vos requêtes via le formulaire ou à nous contacter directement. Nous répondons généralement dans un délai de 24 heures.
          </p>
          
          <div class="flex items-center gap-3">
            <a href="https://www.facebook.com/profile.php?id=100081426776950" target="_blank" class="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/agroshop_tg/" target="_blank" class="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/agro-shop-04751a36b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
              <Linkedin class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Right Side: Form -->
        <div class="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-t-4 border-emerald-500 relative lg:mt-[-120px] z-20">
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-800">Nom</label>
                <input v-model="form.firstname" type="text" placeholder="Votre nom" class="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-800">Email</label>
                <input v-model="form.email" type="email" placeholder="Votre email" class="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" required />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-800">Téléphone</label>
                <input v-model="form.phone" type="tel" placeholder="Numéro de téléphone" class="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-800">Sujet</label>
                <input v-model="form.subject" type="text" placeholder="Sujet" class="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-800">Message</label>
              <textarea v-model="form.message" rows="5" placeholder="Votre message" class="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" required></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting" class="px-8 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm rounded-full transition-colors disabled:opacity-70 inline-flex items-center gap-2 cursor-pointer">
              <span v-if="!isSubmitting">Envoyer le Message</span>
              <span v-else class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                Envoi...
              </span>
            </button>
            
            <div v-if="successMessage" class="mt-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg font-medium">
              {{ successMessage }}
            </div>
          </form>
        </div>

      </div>
    </div>

    <!-- Bottom Section (Map & Info) -->
    <div 
      class="relative py-20 bg-cover bg-center"
      style="background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80');"
    >
      <div class="absolute inset-0 bg-black/70"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <!-- Map -->
          <div class="w-full h-[350px] md:h-[450px] bg-gray-200 overflow-hidden border border-white/10 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.03923307525!2d1.1444059088663806!3d6.216343501726002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185419%3A0x3224b5422caf411d!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
              class="w-full h-full" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          <!-- Info Blocks -->
          <div class="space-y-10 text-white">
            
            <div class="flex items-start gap-6">
              <div class="w-14 h-14 bg-amber-400 flex items-center justify-center flex-shrink-0 text-gray-900 shadow-[0_4px_20px_rgb(251,191,36,0.3)]">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-xl mb-1.5">Notre Position</h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  Quartier Totsi, en face de la pharmacie<br>Lomé, Togo
                </p>
              </div>
            </div>

            <div class="w-full h-px bg-white/10"></div>

            <div class="flex items-start gap-6">
              <div class="w-14 h-14 bg-amber-400 flex items-center justify-center flex-shrink-0 text-gray-900 shadow-[0_4px_20px_rgb(251,191,36,0.3)]">
                <Mail class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-xl mb-1.5">Écrivez-nous</h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  info@agroshop.tg<br>contact@agroshop.tg
                </p>
              </div>
            </div>

            <div class="w-full h-px bg-white/10"></div>

            <div class="flex items-start gap-6">
              <div class="w-14 h-14 bg-amber-400 flex items-center justify-center flex-shrink-0 text-gray-900 shadow-[0_4px_20px_rgb(251,191,36,0.3)]">
                <Phone class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-xl mb-1.5">Appelez-nous</h3>
                <p class="text-gray-300 text-sm leading-relaxed">
                  Tél 1: +228 90 80 70 70<br>Tél 2: +228 99 80 70 70
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-vue-next'

useHead({
  title: 'Contact - AgroShop',
  meta: [
    { name: 'description', content: 'Questions, idées ou projets ? Nous sommes prêts à vous aider.' }
  ]
})

const form = ref({
  firstname: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  successMessage.value = ''
  
  // Simulation d'envoi d'API
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  successMessage.value = "Votre message a été envoyé avec succès !"
  isSubmitting.value = false
  
  form.value = {
    firstname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
  
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}
</script>
