<template>
  <footer 
    class="relative text-gray-100 overflow-hidden font-sans bg-center bg-no-repeat bg-cover shadow-2xl"
    style="background-image: url('/images/footerbabkgroundagroshop.png');"
  >
    <!-- Dark Gradient Overlay for optimal text readability -->
    <div class="absolute inset-0 bg-emerald-950/75 backdrop-brightness-90"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-8">
      
      <!-- Main Columns Grid (5 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10 mb-12">
        
        <!-- Col 1: Brand Logo & Tagline -->
        <div class="lg:col-span-1 pr-2 space-y-4">
          <NuxtLink to="/" class="inline-flex group">
            <div class="bg-white/95 rounded-xl px-3.5 py-2.5 group-hover:scale-105 transition-transform shadow-md border border-white/20">
              <img 
                src="/Logo Agroshop _fond transparent.png" 
                alt="AgroShop Togo" 
                class="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
          </NuxtLink>

          <div>
            <h3 class="text-white font-black text-lg leading-snug mb-2">
              Cultivons aujourd'hui<br />pour nourrir demain.
            </h3>
            <p class="text-xs text-emerald-100/80 leading-relaxed">
              Des solutions agricoles durables pour un avenir meilleur.
            </p>
          </div>
        </div>

        <!-- Col 2: Nos Services -->
        <div>
          <h4 class="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-[#8cc63f]/30 pb-2 inline-block">Nos Services</h4>
          <ul class="space-y-2.5 text-xs text-emerald-100/90 font-medium">
            <li><NuxtLink to="/services" class="hover:text-[#8cc63f] transition-colors text-amber-300 font-bold">Dératisation & Anti-Nuisibles</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-[#8cc63f] transition-colors">Désinsectisation & Fumigation</NuxtLink></li>
            <li><NuxtLink to="/produits" class="hover:text-[#8cc63f] transition-colors">Protection des Cultures</NuxtLink></li>
            <li><NuxtLink to="/produits" class="hover:text-[#8cc63f] transition-colors">Fertilisation</NuxtLink></li>
            <li><NuxtLink to="/produits" class="hover:text-[#8cc63f] transition-colors">Irrigation</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Accompagnement Terrain</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 3: Catégories -->
        <div>
          <h4 class="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-[#8cc63f]/30 pb-2 inline-block">Catégories</h4>
          <ul class="space-y-2.5 text-xs text-emerald-100/90 font-medium">
            <li><NuxtLink to="/produits?category=intrants-agricoles" class="hover:text-[#8cc63f] transition-colors">Engrais & NPK</NuxtLink></li>
            <li><NuxtLink to="/produits?category=produits-phytosanitaires" class="hover:text-[#8cc63f] transition-colors">Phytosanitaires</NuxtLink></li>
            <li><NuxtLink to="/produits?category=semences" class="hover:text-[#8cc63f] transition-colors">Semences certifiées</NuxtLink></li>
            <li><NuxtLink to="/produits?category=systemes-irrigation" class="hover:text-[#8cc63f] transition-colors">Systèmes d'irrigation</NuxtLink></li>
            <li><NuxtLink to="/produits?category=machines-agricoles" class="hover:text-[#8cc63f] transition-colors">Machines agricoles</NuxtLink></li>
            <li><NuxtLink to="/produits?category=quincaillerie" class="hover:text-[#8cc63f] transition-colors">Quincaillerie agricole</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 4: À Propos -->
        <div>
          <h4 class="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-[#8cc63f]/30 pb-2 inline-block">À Propos</h4>
          <ul class="space-y-2.5 text-xs text-emerald-100/90 font-medium">
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Qui sommes-nous ?</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Notre Vision</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Notre Mission</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Nos Valeurs</NuxtLink></li>
            <li><NuxtLink to="/blog" class="hover:text-[#8cc63f] transition-colors">Actualités & Blog</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Carrières</NuxtLink></li>
          </ul>
        </div>

        <!-- Col 5: Contact -->
        <div>
          <h4 class="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-[#8cc63f]/30 pb-2 inline-block">Contact</h4>
          <ul class="space-y-2.5 text-xs text-emerald-100/90 font-medium">
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Nous contacter</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Formulaire de contact</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Points de vente</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-[#8cc63f] transition-colors">Mentions légales</NuxtLink></li>
          </ul>
        </div>

      </div>

      <!-- Social Networks Row -->
      <div class="flex justify-center items-center gap-4 mb-6">
        <a 
          href="https://www.facebook.com/profile.php?id=100081426776950" 
          target="_blank" 
          aria-label="Facebook"
          class="w-10 h-10 rounded-full border border-[#8cc63f]/60 bg-emerald-950/40 flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-emerald-950 hover:border-[#8cc63f] transition-all duration-300 shadow-xs"
        >
          <Facebook class="w-4 h-4" />
        </a>
        <a 
          href="https://www.linkedin.com/in/agro-shop-04751a36b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
          target="_blank" 
          aria-label="LinkedIn"
          class="w-10 h-10 rounded-full border border-[#8cc63f]/60 bg-emerald-950/40 flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-emerald-950 hover:border-[#8cc63f] transition-all duration-300 shadow-xs"
        >
          <Linkedin class="w-4 h-4" />
        </a>
        <a 
          href="https://www.instagram.com/agroshoptg.store?igsh=ZXk0ZjM5ZGsxeTlz&utm_source=qr" 
          target="_blank" 
          rel="noopener"
          aria-label="Instagram"
          class="w-10 h-10 rounded-full border border-[#8cc63f]/60 bg-emerald-950/40 flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-emerald-950 hover:border-[#8cc63f] transition-all duration-300 shadow-xs"
        >
          <Instagram class="w-4 h-4" />
        </a>
        <!-- WhatsApp -->
        <a 
          href="https://wa.me/22898706081?text=Bonjour,%20je%20viens%20du%20site%20AgroShop" 
          target="_blank" 
          rel="noopener"
          aria-label="WhatsApp"
          class="w-10 h-10 rounded-full border border-[#8cc63f]/60 bg-emerald-950/40 flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-emerald-950 hover:border-[#8cc63f] transition-all duration-300 shadow-xs"
          title="WhatsApp"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
        <!-- X (Twitter) -->
        <a 
          href="#" 
          aria-label="X"
          class="w-10 h-10 rounded-full border border-[#8cc63f]/60 bg-emerald-950/40 flex items-center justify-center text-[#8cc63f] hover:bg-[#8cc63f] hover:text-emerald-950 hover:border-[#8cc63f] transition-all duration-300 shadow-xs"
          title="X"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>

      <!-- Bottom Copyright Line -->
      <div class="border-t border-emerald-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-200/70">
        <span>© 2026 AgroShop. Tous droits réservés.</span>
        <span>
          Développé par 
          <a 
            href="https://digitalforges.org/" 
            target="_blank" 
            rel="noopener" 
            class="text-[#8cc63f] hover:underline font-extrabold transition-colors"
          >
            DIGITALFORGE
          </a>
        </span>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Sprout, Facebook, Linkedin, Instagram, MessageCircle } from 'lucide-vue-next'
</script>
