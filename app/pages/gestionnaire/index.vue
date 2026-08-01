<template>
  <div class="space-y-6">
    
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900">Bonjour, {{ store.user?.prenom || 'Gestionnaire' }} 👋</h1>
        <p class="text-xs text-slate-500 mt-1">Voici le récapitulatif de votre boutique aujourd'hui</p>
      </div>
      <div class="text-xs font-mono text-slate-500 font-medium">{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">CA du Jour</span>
          <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-amber-600 font-mono">{{ formatPrice(stats.ca_du_jour) }} <span class="text-xs text-slate-400 font-normal">FCFA</span></p>
      </div>
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ventes du Jour</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-slate-900 font-mono">{{ stats.ventes_du_jour || 0 }}</p>
      </div>
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Produits en Stock</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Package class="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">{{ stats.produits_en_stock || 0 }}</p>
      </div>
    </div>

    <!-- Action Buttons: Rapport PDF + Suggestion Réappro -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Rapport PDF Section -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText class="w-4 h-4 text-blue-600" />
          Générer un Rapport PDF
        </h2>
        <p class="text-xs text-slate-500 mb-5">Rapport classique envoyé à l'administrateur.</p>
        
        <div class="flex flex-wrap gap-3">
          <button
            @click="genererRapport('journalier')"
            :disabled="generatingReport"
            class="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileText class="w-4 h-4" />
            <span>{{ generatingReport === 'journalier' ? 'Génération...' : 'Rapport Journalier (PDF)' }}</span>
          </button>
          <button
            @click="genererRapport('mensuel')"
            :disabled="generatingReport"
            class="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Calendar class="w-4 h-4" />
            <span>{{ generatingReport === 'mensuel' ? 'Génération...' : 'Rapport Mensuel (PDF)' }}</span>
          </button>
        </div>

        <div v-if="reportSuccess" class="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle class="w-4 h-4 flex-shrink-0" />
          {{ reportSuccess }}
        </div>
      </div>

      <!-- Suggestion Réappro Section -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-violet-600" />
          📦 Suggestion Réappro IA
        </h2>
        <p class="text-xs text-slate-500 mb-5">Analyse des produits à réapprovisionner.</p>
        
        <button
          @click="fetchReappro"
          class="w-full px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-900/10 cursor-pointer"
        >
          <Sparkles class="w-4 h-4" />
          <span>{{ showReappro ? 'Masquer les suggestions' : '📦 Afficher Suggestion Réappro' }}</span>
        </button>

        <div v-if="showReappro" class="mt-5 space-y-4">
          <div v-if="reapproLoading" class="py-6 text-center text-slate-500 font-mono text-xs">
            <div class="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Analyse en cours...
          </div>
          <template v-else>
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-rose-50 border border-rose-200 rounded-xl p-3">
                <div class="text-[10px] font-bold uppercase text-rose-700 mb-1">Prioritaires</div>
                <div class="text-xl font-black text-rose-900 font-mono">{{ reapproData.nombre_prioritaires }}</div>
              </div>
              <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div class="text-[10px] font-bold uppercase text-emerald-700 mb-1">Coût estimé</div>
                <div class="text-xl font-black text-emerald-900 font-mono">{{ formatPrice(reapproData.total_estime) }}<span class="text-xs"> FCFA</span></div>
              </div>
            </div>

            <div v-if="reapproData.ai_summary" class="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
              <div class="text-[10px] font-bold uppercase text-indigo-700 mb-1 flex items-center gap-1">
                <Brain class="w-3 h-3" /> Résumé IA
              </div>
              <p class="text-[11px] text-indigo-900 leading-relaxed">{{ reapproData.ai_summary }}</p>
            </div>

            <div v-if="reapproData.prioritaires.length > 0" class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left text-[11px]">
                <thead class="bg-slate-50 uppercase text-[9px] text-slate-500 font-mono">
                  <tr>
                    <th class="px-3 py-2">Produit</th>
                    <th class="px-3 py-2 text-center">Stock</th>
                    <th class="px-3 py-2 text-center">Qté sugg</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium">
                  <tr v-for="(p, i) in reapproData.prioritaires.slice(0, 8)" :key="p.id || i" class="hover:bg-slate-50">
                    <td class="px-3 py-2 font-semibold text-slate-800 truncate max-w-[160px]">
                      {{ p.nom_commercial || p.nom || p.produit_nom || '#' + (p.id || i) }}
                    </td>
                    <td class="px-3 py-2 text-center font-mono text-rose-600 font-bold">{{ p.stock_actuel ?? p.stock_disponible ?? '?' }}</td>
                    <td class="px-3 py-2 text-center font-mono font-bold text-emerald-600">+{{ p.quantite_suggeree ?? p.quantite ?? '?' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-[11px] text-slate-500 text-center py-3">✅ Aucun produit prioritaire</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Assistant Rapport -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Brain class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-500" />
              🤖 Assistant Rapport IA
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Renseignez les données du jour et laissez rédiger votre rapport professionnel
            </p>
          </div>
        </div>
      </div>

      <!-- Rapport Form -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Type de rapport</label>
              <select v-model="aiRapportForm.type" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none cursor-pointer font-medium">
                <option value="journalier">📅 Journalier</option>
                <option value="hebdomadaire">📊 Hebdomadaire</option>
                <option value="mensuel">📈 Mensuel</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Date</label>
              <input type="date" v-model="aiRapportForm.date" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none font-medium" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">CA (FCFA)</label>
              <input type="number" v-model.number="aiRapportForm.ca" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none font-mono font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Clients</label>
              <input type="number" v-model.number="aiRapportForm.nb_clients" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none font-mono font-semibold" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Commandes</label>
              <input type="number" v-model.number="aiRapportForm.nb_commandes" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none font-mono font-semibold" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Points clés du jour</label>
            <textarea v-model="aiRapportForm.points_cles" rows="2" placeholder="Ex: Très bonne affluence sur les engrais NPK, Vente exceptionnelle de 20 sacs d'urée..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none resize-none placeholder-slate-400"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">Anomalies / Incidents</label>
            <textarea v-model="aiRapportForm.anomalies" rows="2" placeholder="Ex: Rupture temporaire de YaraMila, Paiement Flooz en retard..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none resize-none placeholder-slate-400"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">État des stocks</label>
            <textarea v-model="aiRapportForm.stocks" rows="2" placeholder="Ex: Stock Urée bas (5 sacs), Bon stock sur NPK 15-15-15..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none resize-none placeholder-slate-400"></textarea>
          </div>

          <button
            @click="generateAiRapport"
            :disabled="aiGeneratingRapport"
            class="w-full px-5 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl transition-all shadow-md shadow-violet-900/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <RefreshCw v-if="aiGeneratingRapport" class="w-4 h-4 animate-spin" />
            <Wand2 v-else class="w-4 h-4" />
            <span>{{ aiGeneratingRapport ? 'Rédaction en cours...' : '✨ Générer le Rapport avec l\'IA' }}</span>
          </button>
        </div>

        <!-- Rapport Generated Output -->
        <div class="lg:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[480px] max-h-[600px] overflow-y-auto custom-scrollbar">
          <div v-if="aiGeneratingRapport" class="h-full flex flex-col items-center justify-center text-center py-12">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-0.5 mb-4 animate-pulse">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Brain class="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <p class="text-sm font-bold text-slate-900 mb-1">L'IA rédige votre rapport...</p>
            <p class="text-xs text-slate-500">Analyse des données, structuration, recommandations</p>
          </div>

          <div v-else-if="!aiRapportResult" class="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
            <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
              <FileText class="w-8 h-8 text-slate-400" />
            </div>
            <p class="text-sm font-bold text-slate-700 mb-1">Aucun rapport généré</p>
            <p class="text-xs text-slate-400">Remplissez le formulaire à gauche puis cliquez sur "Générer"</p>
          </div>

          <div v-else class="space-y-4 text-[11.5px] text-slate-700">
            <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
              <div>
                <h3 class="text-base font-black text-slate-900 mb-0.5">{{ aiRapportResult.titre || 'Rapport d\'Activité' }}</h3>
                <p class="text-[10px] text-slate-500 font-mono">
                  Bout. {{ store.boutique?.nom || '-' }} · {{ aiRapportForm.date }} · {{ store.user?.prenom }} {{ store.user?.nom }}
                </p>
              </div>
              <button
                @click="exportRapportPdf"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Download class="w-3.5 h-3.5" />
                Exporter PDF
              </button>
            </div>

            <div v-if="aiRapportResult.introduction" class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase text-amber-700 tracking-wider">📌 Introduction</h4>
              <p class="text-slate-800 leading-relaxed">{{ aiRapportResult.introduction }}</p>
            </div>

            <div v-if="aiRapportResult.section_activite" class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase text-blue-700 tracking-wider">💹 Activité & Ventes</h4>
              <p class="text-slate-800 leading-relaxed whitespace-pre-line">{{ aiRapportResult.section_activite }}</p>
            </div>

            <div v-if="aiRapportResult.section_stocks" class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase text-emerald-700 tracking-wider">📦 Situation Stocks</h4>
              <p class="text-slate-800 leading-relaxed whitespace-pre-line">{{ aiRapportResult.section_stocks }}</p>
            </div>

            <div v-if="aiRapportResult.section_anomalies" class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase text-rose-700 tracking-wider flex items-center gap-1.5">
                <AlertTriangle class="w-3 h-3" />
                Anomalies Constatées
              </h4>
              <div class="bg-rose-50 border border-rose-200 rounded-xl p-3">
                <p class="text-rose-900 leading-relaxed whitespace-pre-line">{{ aiRapportResult.section_anomalies }}</p>
              </div>
            </div>

            <div v-if="aiRapportResult.section_recommandations" class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase text-violet-700 tracking-wider flex items-center gap-1.5">
                <Sparkles class="w-3 h-3" />
                Recommandations IA
              </h4>
              <div class="bg-violet-50 border border-violet-200 rounded-xl p-3">
                <p class="text-violet-900 leading-relaxed whitespace-pre-line">{{ aiRapportResult.section_recommandations }}</p>
              </div>
            </div>

            <div v-if="aiRapportResult.conclusion" class="space-y-1.5 pt-2 border-t border-slate-200">
              <h4 class="text-[10px] font-black uppercase text-indigo-700 tracking-wider">🎯 Conclusion</h4>
              <p class="text-slate-800 leading-relaxed italic">{{ aiRapportResult.conclusion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  TrendingUp, ShoppingBag, Package, FileText, Calendar, CheckCircle,
  Sparkles, Wand2, Brain, Download, AlertTriangle, Plus, X, BarChart3, RefreshCw
} from 'lucide-vue-next'
import { useGestionnaireAuthStore } from '~/stores/gestionnaireAuth'

definePageMeta({
  path: '/gestionnaire',
  layout: 'gestionnaire',
  middleware: 'gestionnaire'
})

useHead({ title: 'Mon Dashboard - AgroShop Gestionnaire' })

const store = useGestionnaireAuthStore()
const { gestionnaireFetch } = useGestionnaireFetch()

const stats = ref({ ca_du_jour: 0, ventes_du_jour: 0, produits_en_stock: 0 })
const generatingReport = ref(null)
const reportSuccess = ref(null)

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const todayStr = () => new Date().toISOString().split('T')[0]

// ===== AI RAPPORT FORM STATE =====
const aiRapportForm = ref({
  type: 'journalier',
  date: todayStr(),
  ca: 0,
  nb_clients: 0,
  nb_commandes: 0,
  points_cles: '',
  anomalies: '',
  stocks: ''
})

const aiGeneratingRapport = ref(false)
const aiRapportResult = ref(null)

// ===== SUGGESTION REAPPRO STATE =====
const showReappro = ref(false)
const reapproLoading = ref(false)
const reapproData = ref({
  nombre_prioritaires: 0,
  total_estime: 0,
  ai_summary: '',
  prioritaires: []
})

const fetchStats = async () => {
  try {
    const res = await gestionnaireFetch('/gestionnaire/dashboard')
    stats.value = res?.data || res || stats.value
    aiRapportForm.value.ca = stats.value.ca_du_jour || 0
    aiRapportForm.value.nb_commandes = stats.value.ventes_du_jour || 0
  } catch (e) {
    stats.value = { ca_du_jour: 0, ventes_du_jour: 0, produits_en_stock: 0 }
  }
}

const genererRapport = async (type) => {
  generatingReport.value = type
  reportSuccess.value = null
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await gestionnaireFetch('/gestionnaire/rapports/generer', {
      method: 'POST',
      body: { type, date: today }
    })
    reportSuccess.value = res?.message || `Rapport ${type} généré et envoyé à l'administrateur avec succès !`
  } catch (e) {
    console.error('Erreur rapport:', e)
    reportSuccess.value = "Erreur lors de la génération du rapport."
  } finally {
    generatingReport.value = null
    setTimeout(() => reportSuccess.value = null, 6000)
  }
}

// ===== AI GÉNÉRATION RAPPORT =====
const generateAiRapport = async () => {
  aiGeneratingRapport.value = true
  aiRapportResult.value = null
  try {
    const boutique = store.boutique
    const boutique_id = boutique?.id || store.boutiques?.[0]?.id || null
    const gestionnaire_nom = `${store.user?.prenom || ''} ${store.user?.nom || ''}`.trim() || 'Gestionnaire'

    const body = {
      boutique_id,
      gestionnaire_nom,
      type: aiRapportForm.value.type,
      date_rapport: aiRapportForm.value.date,
      ca_jour: Number(aiRapportForm.value.ca || 0),
      nb_clients: Number(aiRapportForm.value.nb_clients || 0),
      nb_commandes: Number(aiRapportForm.value.nb_commandes || 0),
      points_cles: aiRapportForm.value.points_cles,
      anomalies: aiRapportForm.value.anomalies,
      stocks: aiRapportForm.value.stocks
    }

    const res = await gestionnaireFetch('/gestionnaire/ai/rapports/generer', {
      method: 'POST',
      body
    })
    const data = res?.data || res
    aiRapportResult.value = data

    // Transmettre et sauvegarder automatiquement le rapport IA pour l'administrateur
    try {
      await gestionnaireFetch('/gestionnaire/rapports/sauvegarder-ia', {
        method: 'POST',
        body: {
          boutique_id,
          type: aiRapportForm.value.type,
          date_rapport: aiRapportForm.value.date,
          titre: data.titre || `Rapport IA ${aiRapportForm.value.type}`,
          introduction: data.introduction,
          section_activite: data.section_activite,
          section_stocks: data.section_stocks,
          section_anomalies: data.section_anomalies,
          section_recommandations: data.section_recommandations,
          conclusion: data.conclusion
        }
      })
    } catch (saveErr) {
      console.warn('Erreur sauvegarde automatique rapport IA', saveErr)
    }
  } catch (e) {
    console.error('AI rapport error', e)
  } finally {
    aiGeneratingRapport.value = false
  }
}

const exportRapportPdf = () => {
  if (!aiRapportResult.value) return
  try {
    const r = aiRapportResult.value
    const content = `
RAPPORT D'ACTIVITÉ — ${r.titre || 'Rapport'}
Date: ${aiRapportForm.value.date}
Gestionnaire: ${store.user?.prenom || ''} ${store.user?.nom || ''}
Boutique: ${store.boutique?.nom || ''}

=== INTRODUCTION ===
${r.introduction || ''}

=== ACTIVITÉ DU JOUR ===
${r.section_activite || ''}

=== SITUATION STOCKS ===
${r.section_stocks || ''}

=== ANOMALIES CONSTATÉES ===
${r.section_anomalies || ''}

=== RECOMMANDATIONS ===
${r.section_recommandations || ''}

=== CONCLUSION ===
${r.conclusion || ''}
`.trim()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport_${aiRapportForm.value.type}_${aiRapportForm.value.date}.txt`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.warn('Export error', e)
  }
}

// ===== SUGGESTION REAPPRO =====
const fetchReappro = async () => {
  showReappro.value = !showReappro.value
  if (!showReappro.value) return
  const boutique = store.boutique
  const boutique_id = boutique?.id || store.boutiques?.[0]?.id
  if (!boutique_id) return
  reapproLoading.value = true
  try {
    const res = await gestionnaireFetch(`/gestionnaire/ai/boutiques/${boutique_id}/suggerer-reappro`)
    const d = res?.data || res
    reapproData.value.nombre_prioritaires = d.nombre_prioritaires || d.prioritaires?.length || 0
    reapproData.value.total_estime = d.total_estime || d.cout_total || 0
    reapproData.value.ai_summary = d.ai_summary || d.resume || ''
    reapproData.value.prioritaires = d.prioritaires || d.produits || []
  } catch (e) {
    console.warn('Reappro error', e)
  } finally {
    reapproLoading.value = false
  }
}

onMounted(fetchStats)
</script>
