<template>
  <footer class="bg-gradient-to-b from-emerald-950 via-emerald-900 to-forest-dark text-white border-t border-emerald-800">
    
    <!-- Top Footer Bar: Trust & Guarantee -->
    <div class="border-b border-emerald-800/60 py-8 bg-emerald-950/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-800/60 flex items-center justify-center text-lime-400 font-bold">
            <Truck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Livraison au Togo</h4>
            <p class="text-xs text-emerald-200">Lomé, Tsévié, Atakpamé, Kara...</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-800/60 flex items-center justify-center text-amber-400 font-bold">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Produits Certifiés</h4>
            <p class="text-xs text-emerald-200">Engrais & Phyto 100% Homologués</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-800/60 flex items-center justify-center text-lime-400 font-bold">
            <Headphones class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Conseil Agronomique</h4>
            <p class="text-xs text-emerald-200">Agronomes à votre écoute 7j/7</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-800/60 flex items-center justify-center text-amber-400 font-bold">
            <CreditCard class="w-6 h-6" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Paiement Flexible</h4>
            <p class="text-xs text-emerald-200">T-Money, Flooz & Espèces</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      <!-- Col 1: Brand & Bio -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-slate-950 font-black">
            <Sprout class="w-5 h-5" />
          </div>
          <span class="text-2xl font-extrabold tracking-tight text-white">
            Agro<span class="text-amber-400">Shop</span>
          </span>
        </div>
        <p class="text-xs text-emerald-200 leading-relaxed">
          Plateforme leader au Togo pour l'approvisionnement en intrants agricoles certifiés (AgroDop) et matériel de quincaillerie & outillage de chantier.
        </p>

        <!-- Social Icons -->
        <div class="flex items-center gap-3 pt-2">
          <a href="#" class="w-9 h-9 rounded-full bg-emerald-800/60 hover:bg-emerald-700 flex items-center justify-center text-emerald-200 hover:text-white transition-colors">
            <Facebook class="w-4 h-4" />
          </a>
          <a href="https://wa.me/22890123456" target="_blank" class="w-9 h-9 rounded-full bg-lime-500/20 hover:bg-lime-500 flex items-center justify-center text-lime-400 hover:text-slate-950 transition-colors">
            <MessageSquare class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Col 2: Navigation Links -->
      <div>
        <h4 class="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-emerald-800 pb-2">
          Univers Produits
        </h4>
        <ul class="space-y-2 text-xs font-semibold text-emerald-200">
          <li><NuxtLink to="/agrodop" class="hover:text-lime-400 transition-colors">🌾 Engrais & Urée YARA</NuxtLink></li>
          <li><NuxtLink to="/agrodop" class="hover:text-lime-400 transition-colors">🐛 Produits Phytosanitaires</NuxtLink></li>
          <li><NuxtLink to="/agrodop" class="hover:text-lime-400 transition-colors">💧 Systèmes d'Irrigation</NuxtLink></li>
          <li><NuxtLink to="/agrodop" class="hover:text-lime-400 transition-colors">🌱 Semences Certifiées</NuxtLink></li>
          <li><NuxtLink to="/quincaillerie" class="hover:text-lime-400 transition-colors">🛠️ Quincaillerie & Outillage Manuel</NuxtLink></li>
          <li><NuxtLink to="/quincaillerie" class="hover:text-lime-400 transition-colors">🚜 Machines & Brouettes de Chantier</NuxtLink></li>
        </ul>
      </div>

      <!-- Col 3: Customer Care & Links -->
      <div>
        <h4 class="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-emerald-800 pb-2">
          Espace Client & Aide
        </h4>
        <ul class="space-y-2 text-xs font-semibold text-emerald-200">
          <li><NuxtLink to="/commande/suivi" class="hover:text-amber-400 transition-colors">📦 Suivre ma commande</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-amber-400 transition-colors">📖 Guides d'utilisation & Fiches PDF</NuxtLink></li>
          <li><NuxtLink to="/faq" class="hover:text-amber-400 transition-colors">❓ Foire Aux Questions (FAQ)</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-amber-400 transition-colors">📍 Nos agences au Togo</NuxtLink></li>
        </ul>
      </div>

      <!-- Col 4: Contact & Mobile Money -->
      <div class="space-y-4">
        <h4 class="text-sm font-extrabold text-white uppercase tracking-wider border-b border-emerald-800 pb-2">
          Contact & Siège
        </h4>
        <div class="space-y-2 text-xs text-emerald-200 font-medium">
          <p class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-lime-400 flex-shrink-0" />
            <span>Boulevard du 13 Janvier, Lomé - Togo</span>
          </p>
          <p class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-lime-400 flex-shrink-0" />
            <span>+228 90 12 34 56 / +228 91 98 76 54</span>
          </p>
          <p class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-lime-400 flex-shrink-0" />
            <span>contact@agroshoptg.store</span>
          </p>
        </div>

        <div class="pt-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-2">Modes de Paiement Acceptés</span>
          <div class="flex items-center gap-2">
            <span class="px-2 py-1 bg-amber-500/20 text-amber-300 font-extrabold text-[11px] rounded-md border border-amber-500/30">T-Money</span>
            <span class="px-2 py-1 bg-sky-500/20 text-sky-300 font-extrabold text-[11px] rounded-md border border-sky-500/30">Flooz</span>
            <span class="px-2 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] rounded-md border border-emerald-500/30">Espèces</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Bar Copyright -->
    <div class="border-t border-emerald-800/80 py-4 bg-emerald-950">
      <div class="max-w-7xl mx-auto px-4 text-center text-xs text-emerald-300">
        &copy; 2026 AgroShop Togo. Tous droits réservés. V2 Next-Gen E-Commerce Architecture.
      </div>
    </div>

    <!-- Floating WhatsApp Fixed Button (Bottom Right) -->
    <a 
      href="https://wa.me/22890123456?text=Bonjour%20AgroShop%2C%20j%27ai%20une%20question"
      target="_blank"
      class="fixed bottom-6 right-6 z-40 bg-lime-500 hover:bg-lime-400 text-slate-950 p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 cursor-pointer group"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageSquare class="w-6 h-6 fill-slate-950" />
      <span class="hidden group-hover:inline-block font-bold text-xs pr-1">Discuter sur WhatsApp</span>
    </a>
  </footer>
</template>

<script setup>
import { Sprout, Truck, ShieldCheck, Headphones, CreditCard, Facebook, MessageSquare, MapPin, Phone, Mail } from 'lucide-vue-next'
</script>
