<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <!-- Hero Section -->
    <div class="bg-emerald-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">Contactez-nous</h1>
        <p class="text-emerald-100 max-w-2xl mx-auto text-lg">Une question sur nos produits ? Besoin d'un conseil agronomique ? Notre équipe est là pour vous accompagner.</p>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          
          <!-- Colonne Informations -->
          <div class="bg-emerald-900 text-white p-10 sm:p-12 relative overflow-hidden">
            <!-- Décoration de fond -->
            <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
            
            <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-6 text-white">Nos Coordonnées</h2>
              <p class="text-emerald-100 mb-10 leading-relaxed">
                Passez nous voir en boutique, appelez-nous ou envoyez-nous un message sur WhatsApp pour une réponse encore plus rapide.
              </p>
              
              <div class="space-y-8">
                <!-- Adresse -->
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0">
                    <MapPin class="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">Boutique Principale</h3>
                    <p class="text-emerald-200 mt-1">Quartier Totsi, en face de la pharmacie<br>Lomé, Togo</p>
                  </div>
                </div>
                
                <!-- Téléphone -->
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0">
                    <Phone class="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">Téléphone</h3>
                    <p class="text-emerald-200 mt-1">+228 90 XX XX XX<br>+228 99 XX XX XX</p>
                  </div>
                </div>
                
                <!-- Email -->
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0">
                    <Mail class="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg">Email</h3>
                    <p class="text-emerald-200 mt-1">contact@agroshop.tg</p>
                  </div>
                </div>
              </div>

              <!-- WhatsApp CTA -->
              <div class="mt-12 p-6 bg-emerald-800/50 rounded-2xl border border-emerald-700/50 backdrop-blur-sm">
                <div class="flex items-center gap-4 mb-4">
                  <MessageCircle class="w-8 h-8 text-green-400" />
                  <h3 class="font-bold text-lg">Besoin d'aide immédiate ?</h3>
                </div>
                <p class="text-sm text-emerald-100 mb-4">Discutez en direct avec nos agronomes sur WhatsApp.</p>
                <a href="https://wa.me/22890000000" target="_blank" class="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#22bf5b] text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-900/20">
                  <MessageCircle class="w-5 h-5" />
                  Démarrer le chat WhatsApp
                </a>
              </div>
            </div>
          </div>
          
          <!-- Colonne Formulaire -->
          <div class="p-10 sm:p-12 lg:p-16">
            <h2 class="text-2xl font-bold text-gray-900 mb-8">Envoyez-nous un message</h2>
            
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Prénom -->
                <div class="space-y-2">
                  <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
                  <input 
                    type="text" 
                    id="firstname" 
                    v-model="form.firstname" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Votre prénom"
                  />
                </div>
                
                <!-- Nom -->
                <div class="space-y-2">
                  <label for="lastname" class="block text-sm font-medium text-gray-700">Nom</label>
                  <input 
                    type="text" 
                    id="lastname" 
                    v-model="form.lastname" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <!-- Email / Tel -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="form.email" 
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="exemple@email.com"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone (obligatoire)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="form.phone" 
                    required
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="+228 XX XX XX XX"
                  />
                </div>
              </div>
              
              <!-- Sujet -->
              <div class="space-y-2">
                <label for="subject" class="block text-sm font-medium text-gray-700">Sujet</label>
                <select 
                  id="subject" 
                  v-model="form.subject" 
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Sélectionnez un sujet</option>
                  <option value="produits">Question sur un produit / stock</option>
                  <option value="commande">Suivi de commande</option>
                  <option value="conseil">Besoin d'un conseil agricole</option>
                  <option value="partenariat">Devenir partenaire</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>
              
              <!-- Message -->
              <div class="space-y-2">
                <label for="message" class="block text-sm font-medium text-gray-700">Votre message</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  rows="4" 
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>
              
              <!-- Submit -->
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!isSubmitting">Envoyer le message</span>
                <span v-else class="flex items-center gap-2">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Envoi en cours...
                </span>
                <Send v-if="!isSubmitting" class="w-5 h-5" />
              </button>
              
              <!-- Message de succès -->
              <div v-if="successMessage" class="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 transition-all">
                <CheckCircle class="w-6 h-6 flex-shrink-0 text-emerald-500" />
                <p class="text-sm font-medium pt-0.5">{{ successMessage }}</p>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Section Localisation / Carte -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-hidden">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Retrouvez-nous en boutique</h2>
        <div class="w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden bg-gray-100 relative">
          <!-- Iframe Google Maps (Lomé, Togo par défaut) -->
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.03923307525!2d1.1444059088663806!3d6.216343501726002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e1c113185419%3A0x3224b5422caf411d!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
            class="absolute top-0 left-0 w-full h-full" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle } from 'lucide-vue-next'

useHead({
  title: 'Contact - AgroShop',
  meta: [
    { name: 'description', content: 'Contactez AgroShop pour toute question, conseil agronomique ou suivi de commande.' }
  ]
})

const form = ref({
  firstname: '',
  lastname: '',
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
  
  // Simulation d'un appel API (ex: POST /api/contact)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  successMessage.value = "Votre message a bien été envoyé ! Notre équipe vous contactera dans les plus brefs délais."
  isSubmitting.value = false
  
  // Réinitialiser le formulaire
  form.value = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }
  
  // Cacher le message après 5 secondes
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}
</script>
