<template>
  <footer 
    class="relative text-gray-200 overflow-hidden font-sans bg-bottom bg-no-repeat bg-cover"
    style="background-image: url('/images/footer-bg.png'); background-color: #062a15;"
  >
    <div class="relative z-10 w-full mx-auto px-6 lg:px-16 pt-12 pb-6">
      
      <!-- Top Grid: 6 Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-8 mb-8">
        
        <!-- Col 1: Logo & Tagline -->
        <div class="lg:col-span-1 pr-4">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full border-2 border-[#8cc63f] flex items-center justify-center text-[#8cc63f]">
              <Sprout class="w-6 h-6" />
            </div>
            <span class="text-2xl font-bold text-white tracking-wide">Agro<span class="text-[#8cc63f]">Shop</span></span>
          </div>
          <h3 class="text-white font-bold text-[17px] leading-snug mb-3">
            Cultivons aujourd'hui<br>pour nourrir demain.
          </h3>
          <p class="text-sm text-gray-300/80 leading-relaxed">
            Des solutions agricoles durables pour un avenir meilleur.
          </p>
        </div>

        <!-- Col 2: Nos Services -->
        <div>
          <h4 class="text-white font-bold text-base mb-4">Nos Services</h4>
          <ul class="space-y-2 text-[13px] text-gray-300/90 font-medium">
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Conseil Agricole</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Protection des Cultures</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Fertilisation</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Irrigation</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Formation</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Accompagnement</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 3: Cultures -->
        <div>
          <h4 class="text-white font-bold text-base mb-4">Cultures</h4>
          <ul class="space-y-2 text-[13px] text-gray-300/90 font-medium">
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Céréales</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Légumineuses</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Oléagineux</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Fourragères</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Arbustiers</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Autres Cultures</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 4: À Propos -->
        <div>
          <h4 class="text-white font-bold text-base mb-4">À Propos</h4>
          <ul class="space-y-2 text-[13px] text-gray-300/90 font-medium">
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Qui sommes-nous ?</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Notre Vision</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Notre Mission</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Nos Valeurs</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Actualités</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Carrières</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 5: Contact -->
        <div>
          <h4 class="text-white font-bold text-base mb-4">Contact</h4>
          <ul class="space-y-2 text-[13px] text-gray-300/90 font-medium">
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Nous contacter</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Formulaire de contact</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Points de vente</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">FAQ</NuxtLink></li>
            <li><NuxtLink to="#" class="hover:text-white transition-colors">Mentions légales</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 6: Newsletter & Contact info -->
        <div class="lg:col-span-1 lg:pl-8 lg:border-l border-white/10">
          <div class="flex items-center gap-2.5 mb-3">
            <Mail class="w-5 h-5 text-[#8cc63f]" />
            <h4 class="text-white font-bold text-base">Newsletter</h4>
          </div>
          <p class="text-[12px] text-gray-300/90 mb-4 leading-relaxed">
            Recevez nos conseils, actualités et nouveautés sur l'agriculture durable.
          </p>
          <form @submit.prevent class="mb-5">
            <input 
              type="email" 
              placeholder="Votre adresse e-mail" 
              class="w-full bg-[#03150a] border border-[#2a5a3a] text-sm text-white px-4 py-3 rounded mb-4 focus:outline-none focus:border-[#96c93d] placeholder-gray-400"
              required
            />
            <button 
              type="submit" 
              class="w-full bg-[#96c93d] hover:bg-[#86b535] text-[#05170b] font-bold text-[14px] py-3 rounded transition-colors"
            >
              S'INSCRIRE
            </button>
          </form>

          <div class="space-y-4 text-[13px] text-gray-200">
            <div class="flex items-start gap-3">
              <MapPin class="w-4 h-4 text-[#8cc63f] flex-shrink-0 mt-0.5" />
              <span>Quartier Totsi,<br>Lomé, Togo</span>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-[#8cc63f] flex-shrink-0" />
              <span>+228 90 80 70 70</span>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-[#8cc63f] flex-shrink-0" />
              <span>contact@agroshop.tg</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Socials -->
      <div class="flex justify-center items-center gap-5 mb-6 mt-4">
        <a href="https://www.facebook.com/profile.php?id=100081426776950" target="_blank" class="w-11 h-11 rounded-full border border-[#96c93d] flex items-center justify-center hover:bg-[#96c93d] hover:text-[#05170b] transition-all text-white">
          <Facebook class="w-5 h-5" />
        </a>
        <a href="https://www.linkedin.com/in/agro-shop-04751a36b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" class="w-11 h-11 rounded-full border border-[#96c93d] flex items-center justify-center hover:bg-[#96c93d] hover:text-[#05170b] transition-all text-white">
          <Linkedin class="w-5 h-5" />
        </a>
        <a href="https://www.instagram.com/agroshop_tg/" target="_blank" class="w-11 h-11 rounded-full border border-[#96c93d] flex items-center justify-center hover:bg-[#96c93d] hover:text-[#05170b] transition-all text-white">
          <Instagram class="w-5 h-5" />
        </a>
        <a href="#" class="w-11 h-11 rounded-full border border-[#96c93d] flex items-center justify-center hover:bg-[#96c93d] hover:text-[#05170b] transition-all text-white">
          <Youtube class="w-5 h-5" />
        </a>
        <a href="#" class="w-11 h-11 rounded-full border border-[#96c93d] flex items-center justify-center hover:bg-[#96c93d] hover:text-[#05170b] transition-all text-white">
          <Twitter class="w-5 h-5" />
        </a>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white/10 pt-4 text-center text-[12px] text-gray-400">
        &copy; 2025 AgroShop. Tous droits réservés.
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Sprout, MapPin, Phone, Facebook, Linkedin, Instagram, Youtube, Twitter, Mail } from 'lucide-vue-next'
</script>
