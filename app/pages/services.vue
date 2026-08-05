<template>
  <div class="min-h-screen bg-slate-50 py-6 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
      
      <!-- ═══ HERO BANNER ═══ -->
      <div class="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-12 text-white overflow-hidden shadow-2xl border border-emerald-800/40">
        <!-- Ambient decorative glows -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div class="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck class="w-4 h-4 text-amber-400" />
              <span>Services Certifiés AgroShop</span>
            </div>

            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Dites adieu aux <span class="text-amber-400">nuisibles !</span>
            </h1>

            <p class="text-xs sm:text-base text-emerald-100/90 leading-relaxed font-medium max-w-2xl">
              La solution professionnelle certifiée pour votre maison, jardin, entrepôts et exploitations agricoles au Togo. Nos techniciens se déplacent directement sur le terrain pour un diagnostic précis avant tout traitement.
            </p>

            <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a 
                :href="whatsappDirectUrl"
                target="_blank"
                class="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquare class="w-4 h-4 text-slate-950" />
                <span>Demander une inspection terrain (WhatsApp)</span>
              </a>

              <a 
                href="tel:+22898706081"
                class="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Phone class="w-4 h-4 text-amber-300" />
                <span>+228 98 70 60 81</span>
              </a>
            </div>
          </div>

          <!-- Interactive Flyer / Banner Presentation Card -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="w-full max-w-sm bg-white rounded-3xl p-5 text-slate-900 shadow-2xl border-4 border-amber-400 space-y-4 transform hover:scale-[1.02] transition-transform">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <img src="/logo.png" alt="AgroShop" class="h-8 w-auto object-contain" />
                </div>
                <span class="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase tracking-wider flex items-center gap-1">
                  ★ Certifié
                </span>
              </div>

              <div class="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 rounded-2xl text-center space-y-1">
                <h3 class="text-sm font-black tracking-wide uppercase text-amber-300">DITES ADIEU AUX NUISIBLES !</h3>
                <p class="text-[10px] text-emerald-100 font-medium">La solution professionnelle pour maison & jardin</p>
              </div>

              <div class="space-y-2 text-xs font-bold text-slate-800">
                <div class="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-emerald-900">
                  <Bug class="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Dératisation & Contrôle des rongeurs</span>
                </div>
                <div class="flex items-center gap-2 p-2 bg-amber-50 rounded-xl text-amber-900">
                  <ShieldAlert class="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Traitement contre reptiles & scorpions</span>
                </div>
                <div class="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-emerald-900">
                  <Sparkles class="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Désinsectisation (Punaises, Cafards, Moustiques)</span>
                </div>
                <div class="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-emerald-900">
                  <Wind class="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Fumigation professionnelle</span>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100 text-center space-y-1">
                <p class="text-[11px] font-extrabold text-slate-700">Service sur-mesure · Intervention sur le terrain</p>
                <p class="text-xs font-black text-emerald-800">📞 +228 98 70 60 81 / +228 79 04 07 07</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══ WHY DIAGNOSTIC TERRAIN (EXPLANATION) ═══ -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div class="text-center max-w-3xl mx-auto space-y-2">
          <span class="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Comment fonctionne notre service ?</span>
          <h2 class="text-xl sm:text-3xl font-black text-slate-900">Un diagnostic sur le terrain avant tout devis</h2>
          <p class="text-xs sm:text-sm text-slate-600">
            Chaque lieu et chaque infestation est unique. AgroShop n'applique pas de tarif fixe standard sans évaluation. Notre équipe se déplace directement chez vous pour inspecter le terrain.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(step, idx) in processSteps" :key="idx" class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3 relative">
            <div class="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
              0{{ idx + 1 }}
            </div>
            <h3 class="text-sm font-extrabold text-slate-900">{{ step.title }}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <!-- ═══ 4 MAIN SERVICES CATALOG ═══ -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900">Nos prestations phytosanitaires & hygiène</h2>
            <p class="text-xs sm:text-sm text-slate-500">Découvrez l'ensemble des traitements assurés par AgroShop Togo.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(service, idx) in mainServices" 
            :key="idx"
            class="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div class="space-y-4">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-400 text-amber-900 group-hover:text-slate-950 flex items-center justify-center transition-colors shadow-xs">
                <component :is="service.icon" class="w-7 h-7" />
              </div>

              <div class="space-y-1.5">
                <span class="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">Intervention Terrain</span>
                <h3 class="text-base font-black text-slate-900 leading-snug">{{ service.title }}</h3>
                <p class="text-xs text-slate-500 leading-relaxed">{{ service.desc }}</p>
              </div>

              <ul class="space-y-1.5 pt-2 text-xs font-semibold text-slate-700 border-t border-slate-100">
                <li v-for="(item, i) in service.details" :key="i" class="flex items-center gap-1.5">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-slate-100 space-y-2">
              <div class="text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-xl text-center border border-amber-200/60">
                Tarif sur devis après visite terrain
              </div>

              <a 
                :href="getServiceWhatsappUrl(service.title)"
                target="_blank"
                class="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare class="w-3.5 h-3.5 text-amber-300" />
                <span>Demander ce service</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ CONTACT & QUOTE REQUEST FORM SECTION ═══ -->
      <div class="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-6 space-y-4">
            <span class="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Contact Direct AgroShop</span>
            <h2 class="text-xl sm:text-3xl font-black">Besoin d'un diagnostic rapide à votre domicile ou entreprise ?</h2>
            <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Contactez directement nos équipes par téléphone ou via WhatsApp. Indiquez la nature de votre problème et nous planifierons rapidement une visite d'inspection.
            </p>

            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Phone class="w-5 h-5" />
                </div>
                <div>
                  <p class="text-[10px] text-emerald-200 uppercase font-bold">Téléphones</p>
                  <p class="text-sm font-black">+228 98 70 60 81 / +228 79 04 07 07</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <MapPin class="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p class="text-[10px] text-emerald-200 uppercase font-bold">Zone d'intervention</p>
                  <p class="text-sm font-black">Lomé et toutes les régions du Togo</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Interactive Request Form -->
          <div class="lg:col-span-6 bg-white text-slate-900 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 class="text-sm font-extrabold text-slate-900">Demande d'inspection terrain rapide</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Votre Nom complet</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  placeholder="Ex: Kossi Mensah"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Service recherché</label>
                <select 
                  v-model="form.service"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Dératisation & Contrôle des rongeurs">Dératisation & Contrôle des rongeurs (Rats, Souris)</option>
                  <option value="Traitement contre les reptiles & scorpions">Traitement contre les reptiles et scorpions</option>
                  <option value="Désinsectisation">Désinsectisation (Punaises, Cafards, Moustiques)</option>
                  <option value="Fumigation professionnelle">Fumigation professionnelle</option>
                  <option value="Autre service d'assainissement">Autre service d'assainissement</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Ville / Emplacement au Togo</label>
                <input 
                  v-model="form.location"
                  type="text" 
                  placeholder="Ex: Lomé (Adidogomé), Tsévié, Atakpamé..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Détails (Optionnel)</label>
                <textarea 
                  v-model="form.details"
                  rows="2"
                  placeholder="Précisez la superficie du lieu ou le degré d'infestation..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

              <button 
                @click="sendFormToWhatsapp"
                class="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageSquare class="w-4 h-4 text-slate-950" />
                <span>Envoyer la demande sur WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  ShieldCheck, MessageSquare, Phone, Bug, ShieldAlert, Sparkles, Wind,
  CheckCircle2, MapPin
} from 'lucide-vue-next'

useHead({
  title: 'Services Anti-Nuisibles & Fumigation - AgroShop Togo',
  meta: [
    { name: 'description', content: 'Services professionnels de dératisation, désinsectisation, traitement reptiles et fumigation au Togo par AgroShop. Diagnostic d\'inspection sur le terrain.' }
  ]
})

const whatsappDirectUrl = `https://wa.me/22898706081?text=${encodeURIComponent("Bonjour AgroShop, je souhaite me renseigner sur vos services d'assainissement et demander une visite de diagnostic terrain.")}`

const processSteps = [
  { title: 'Prise de contact', desc: 'Vous nous contactez par téléphone ou WhatsApp (+228 98 70 60 81) pour nous faire part de votre problème.' },
  { title: 'Inspection Terrain', desc: 'Notre équipe technique se déplace sur votre lieu pour évaluer la superficie et le degré d\'infestation.' },
  { title: 'Devis Sur-Mesure', desc: 'Nous établissons une proposition tarifaire précise et adaptée sans frais cachés.' },
  { title: 'Traitement Certifié', desc: 'Application des solutions phytosanitaires certifiées avec suivi d\'efficacité.' }
]

const mainServices = [
  {
    title: 'Dératisation & Contrôle des Rongeurs',
    desc: 'Éradication complète et gestion des populations de rats et souris pour maisons, entrepôts et champs.',
    icon: Bug,
    details: ['Rats & Souris', 'Entrepôts & Habitations', 'Postes d\'appâtage sécurisés', 'Plan d\'éradication durable']
  },
  {
    title: 'Traitement Reptiles & Scorpions',
    desc: 'Intervention préventive et curative contre les serpents, scorpions et créatures venimeuses.',
    icon: ShieldAlert,
    details: ['Protection habitations & jardins', 'Barrière répulsive périmétrique', 'Intervention d\'urgence', 'Produits homologués']
  },
  {
    title: 'Désinsectisation Spécialisée',
    desc: 'Elimination rapide des insectes nuisibles piqueurs et ravageurs de locaux.',
    icon: Sparkles,
    details: ['Punaises de lit', 'Cafards & Blattes', 'Moustiques & Larves', 'Termites de structure']
  },
  {
    title: 'Fumigation Professionnelle',
    desc: 'Gazage et désinfection globale pour grands volumes, silos, hangars et serres.',
    icon: Wind,
    details: ['Silos de céréales & conteneurs', 'Hangars & Serres agricoles', 'Bâtiments professionnels', 'Conformité normes phytosanitaires']
  }
]

const form = ref({
  name: '',
  service: 'Dératisation & Contrôle des rongeurs',
  location: '',
  details: ''
})

const getServiceWhatsappUrl = (serviceName) => {
  const msg = `Bonjour AgroShop, je suis intéressé(e) par votre service de "${serviceName}". Je souhaite planifier une visite de diagnostic sur le terrain.`
  return `https://wa.me/22898706081?text=${encodeURIComponent(msg)}`
}

const sendFormToWhatsapp = () => {
  let msg = `Bonjour AgroShop Togo,\n\nJe souhaite effectuer une demande de visite de diagnostic sur le terrain pour un service d'assainissement.\n\n`
  if (form.value.name) msg += `- Nom: ${form.value.name}\n`
  msg += `- Service: ${form.value.service}\n`
  if (form.value.location) msg += `- Localisation: ${form.value.location}\n`
  if (form.value.details) msg += `- Détails: ${form.value.details}\n`

  const url = `https://wa.me/22898706081?text=${encodeURIComponent(msg)}`
  window.open(url, '_blank')
}
</script>
