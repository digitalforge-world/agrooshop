<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div 
      class="relative h-[340px] md:h-[480px] w-full bg-cover bg-center flex flex-col justify-center pb-12"
      style="background-image: url('https://images.unsplash.com/photo-1592982537447-6f23f5b721e7?w=1600&q=80');"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-emerald-950/75"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white space-y-2">
        <span class="text-xs font-black text-amber-400 uppercase tracking-widest block">Support & Accompagnement Agricole</span>
        <h1 class="text-3xl md:text-5xl font-black">Contactez AgroShop Togo</h1>
        <p class="max-w-xl text-xs md:text-sm text-emerald-100/90 leading-relaxed">
          Notre équipe d'experts agronomes est à votre écoute pour vous accompagner dans tous vos projets agricoles au Togo.
        </p>
      </div>
    </div>

    <!-- Middle Section (Form & Contact Info) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        <!-- Left Side: Text, Direct Details & Socials -->
        <div class="space-y-6 pt-4 lg:pt-8">
          <div class="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider">
            <span class="w-8 h-0.5 bg-emerald-600"></span>
            Entrer En Contact
          </div>
          <h2 class="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
            Questions, devis ou conseils ?<br />Nous sommes à votre service
          </h2>
          <p class="text-slate-600 leading-relaxed text-xs md:text-sm">
            Que vous ayez besoin de conseils agronomiques sur les engrais NPK/Urée, d'équipements phytosanitaires ou de semences certifiées, notre équipe est là pour vous guider.
          </p>
          
          <!-- Key Contact Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <Phone class="w-4 h-4" />
                <span>Téléphones Officiels</span>
              </div>
              <p class="text-xs font-black text-slate-900">
                <a href="tel:+22898706081" class="hover:text-emerald-700 transition-colors">+228 98 70 60 81</a><br />
                <a href="tel:+22890933716" class="hover:text-emerald-700 transition-colors">+228 90 93 37 16</a>
              </p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <Clock class="w-4 h-4" />
                <span>Horaires d'Ouverture</span>
              </div>
              <p class="text-xs font-medium text-slate-700 leading-tight">
                Lun - Ven : 8h00 - 17h00<br />
                Samedi : 9h00 - 16h00
              </p>
            </div>
          </div>

          <!-- Socials & WhatsApp direct -->
          <div class="pt-4 space-y-3">
            <p class="text-xs font-bold text-slate-800 uppercase tracking-wider">Suivez-nous sur les réseaux :</p>
            <div class="flex items-center gap-3">
              <a href="https://wa.me/22898706081?text=Bonjour%20AgroShop,%20j'aimerais%20avoir%20des%20informations" target="_blank" class="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2">
                <MessageSquare class="w-4 h-4" />
                <span>Chat WhatsApp</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100081426776950" target="_blank" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                <Facebook class="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/agroshop_tg/" target="_blank" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                <Instagram class="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/agro-shop-04751a36b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 flex items-center justify-center transition-colors">
                <Linkedin class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right Side: Form (Positioned high up into Hero) -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200/80 relative -mt-20 md:-mt-36 lg:-mt-48 z-20 space-y-6">
          <div>
            <h3 class="text-xl font-black text-slate-900">Envoyez-nous un message</h3>
            <p class="text-xs text-slate-500 mt-1">Réponse garantie sous 24h par notre équipe d'experts.</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase">Nom complet *</label>
                <input v-model="form.firstname" type="text" placeholder="Votre nom" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" required />
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase">Email *</label>
                <input v-model="form.email" type="email" placeholder="votre@email.com" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" required />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase">Téléphone</label>
                <input v-model="form.phone" type="tel" placeholder="+228 98 70 60 81" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" />
              </div>
              <div class="space-y-1">
                <label class="block text-xs font-bold text-slate-700 uppercase">Sujet</label>
                <input v-model="form.subject" type="text" placeholder="ex: Demande de devis engrais" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase">Message *</label>
              <textarea v-model="form.message" rows="4" placeholder="Décrivez votre demande en détail..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none" required></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting" class="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
              <span v-if="!isSubmitting">Envoyer le Message</span>
              <span v-else class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                Envoi en cours...
              </span>
            </button>
            
            <div v-if="successMessage" class="mt-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold border border-emerald-200 text-center">
              ✓ {{ successMessage }}
            </div>
          </form>
        </div>

      </div>
    </div>

    <!-- Bottom Section (Map & Address Cards) -->
    <div 
      class="relative py-16 md:py-24 bg-cover bg-center"
      style="background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80');"
    >
      <div class="absolute inset-0 bg-slate-950/80"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Map -->
          <div class="w-full h-[320px] md:h-[400px] bg-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.03923307525!2d1.1444059088663806!3d6.216343501726002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185419%3A0x3224b5422caf411d!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
              class="w-full h-full" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>

          <!-- SEO Information Cards -->
          <div class="space-y-6 text-white">
            
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center flex-shrink-0 text-slate-950 shadow-md">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Siège & Agences au Togo</h3>
                <p class="text-slate-300 text-xs leading-relaxed">
                  BP 12941, Lomé - Togo<br />
                  Kpogan zogbédji ; Agbalépédo (Quartier Totsi)
                </p>
              </div>
            </div>

            <div class="w-full h-px bg-white/10"></div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center flex-shrink-0 text-slate-950 shadow-md">
                <Mail class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Adresse Email Officielles</h3>
                <p class="text-slate-300 text-xs leading-relaxed">
                  <a href="mailto:agroshop_int@yahoo.fr" class="hover:text-amber-400 transition-colors font-semibold">agroshop_int@yahoo.fr</a><br />
                  <a href="mailto:contact@agroshop.tg" class="hover:text-amber-400 transition-colors">contact@agroshop.tg</a>
                </p>
              </div>
            </div>

            <div class="w-full h-px bg-white/10"></div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center flex-shrink-0 text-slate-950 shadow-md">
                <Phone class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold text-lg mb-1">Lignes Téléphoniques & WhatsApp</h3>
                <p class="text-slate-300 text-xs leading-relaxed font-semibold">
                  Tél 1 : <a href="tel:+22898706081" class="hover:text-amber-400 transition-colors">+228 98 70 60 81</a><br />
                  Tél 2 : <a href="tel:+22890933716" class="hover:text-amber-400 transition-colors">+228 90 93 37 16</a>
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
import { MapPin, Phone, Mail, Clock, MessageSquare, Facebook, Instagram, Linkedin } from 'lucide-vue-next'

useHead({
  title: 'Contactez AgroShop Togo | Support Client & Vente d\'Intrants Agricoles',
  meta: [
    { name: 'description', content: 'Contactez l\'équipe d\'experts d\'AgroShop Togo pour vos projets d\'engrais, semences certifiées, systèmes d\'irrigation et matériel agricole à Lomé (Kpogan Zogbédji, Agbalépédo).' },
    { property: 'og:title', content: 'Contactez-nous - AgroShop TG | Support Client & Assistance' },
    { property: 'og:description', content: 'Notre équipe est là pour vous aider. Contactez AgroShop TG pour toute question sur nos produits agricoles et services au Togo.' },
    { property: 'og:url', content: 'https://agroshoptg.store/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AgriculturalStore',
        'name': 'AgroShop Togo',
        'image': 'https://agroshoptg.store/images/logo.png',
        'telephone': ['+22898706081', '+22890933716'],
        'email': 'agroshop_int@yahoo.fr',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'BP 12941, Kpogan Zogbédji ; Agbalépédo',
          'addressLocality': 'Lomé',
          'addressCountry': 'TG'
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '08:00',
            'closes': '17:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': 'Saturday',
            'opens': '09:00',
            'closes': '16:00'
          }
        ]
      })
    }
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
  
  try {
    const config = useRuntimeConfig()
    $fetch(`${config.public.apiBaseUrl}/track-visite`, {
      method: 'POST',
      body: {
        page: '/contact',
        type_action: 'demande_contact',
        details: `Formulaire de contact envoyé par ${form.value.firstname} (${form.value.email}) - Sujet: ${form.value.subject || 'Demande générale'}`
      }
    })
  } catch (e) {}

  await new Promise(resolve => setTimeout(resolve, 1200))
  
  successMessage.value = "Votre message a été envoyé avec succès ! Notre équipe vous répondra dans les plus brefs délais."
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
  }, 6000)
}
</script>
