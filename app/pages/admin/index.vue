<template>
  <div class="dashboard-wrapper">

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- LOADING OVERLAY                                     -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Chargement du tableau de bord...</p>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- TOP BAR: Title + Refresh                            -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="top-bar">
      <div>
        <h1 class="page-title">Tableau de Bord</h1>
        <p class="page-subtitle">Vue d'ensemble des performances AgroShop en temps réel</p>
      </div>
      <button @click="fetchDashboardData" :disabled="isLoading" class="btn-refresh">
        <RefreshCw class="btn-refresh-icon" :class="{ spinning: isLoading }" />
        <span>Actualiser</span>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 4 KPI CARDS ROW                                     -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="kpi-grid">

      <!-- Card 1: Total Commandes -->
      <div class="kpi-card">
        <div class="kpi-card-inner">
          <div class="kpi-header">
            <span class="kpi-label">Total Commandes</span>
            <div class="kpi-icon-wrapper kpi-icon-blue">
              <ShoppingCart class="kpi-icon" />
            </div>
          </div>
          <p class="kpi-value">{{ stats.total_commandes || 0 }}</p>
          <p class="kpi-footer">Mois en cours</p>
        </div>
      </div>

      <!-- Card 2: Chiffre d'Affaires (highlighted) -->
      <div class="kpi-card kpi-card-highlight">
        <div class="kpi-card-inner kpi-card-dark">
          <div class="kpi-header">
            <span class="kpi-label-light">Chiffre d'Affaires</span>
            <div class="kpi-badge-green">
              <TrendingUp class="kpi-badge-icon" />
            </div>
          </div>
          <p class="kpi-value-large">{{ formatCompact(stats.chiffre_affaires || 0) }}</p>
          <p class="kpi-footer-light">
            <span v-if="stats.variation_ca > 0" class="variation-up">▲ +{{ stats.variation_ca }}%</span>
            <span v-else-if="stats.variation_ca < 0" class="variation-down">▼ {{ stats.variation_ca }}%</span>
            <span v-else class="variation-neutral">— stable</span>
            vs mois précédent
          </p>
        </div>
      </div>

      <!-- Card 3: Revenus Nets -->
      <div class="kpi-card">
        <div class="kpi-card-inner">
          <div class="kpi-header">
            <span class="kpi-label">Revenus Nets</span>
            <div class="kpi-icon-wrapper kpi-icon-green">
              <DollarSign class="kpi-icon" />
            </div>
          </div>
          <p class="kpi-value">{{ formatCompact(stats.revenus_nets || 0) }}</p>
          <p class="kpi-footer">Après frais de livraison</p>
        </div>
      </div>

      <!-- Card 4: Produits & Catégories -->
      <div class="kpi-card">
        <div class="kpi-card-inner">
          <div class="kpi-header">
            <span class="kpi-label">Produits Actifs</span>
            <div class="kpi-icon-wrapper kpi-icon-purple">
              <Package class="kpi-icon" />
            </div>
          </div>
          <div class="kpi-dual-row">
            <div class="kpi-dual-item">
              <p class="kpi-value">{{ stats.produits_actifs || 0 }}</p>
              <p class="kpi-footer">Produits disponibles</p>
            </div>
            <div class="kpi-dual-divider"></div>
            <div class="kpi-dual-item">
              <p class="kpi-value kpi-value-accent">{{ stats.categories_total || 0 }}</p>
              <p class="kpi-footer">Catégories</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- MIDDLE ROW: Sales Chart + Performance Gauge         -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="middle-row">

      <!-- Sales Chart Panel -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Ventes</h2>
            <p class="chart-current-value">{{ formatPrice(stats.ca_mois_courant || 0) }} <span class="chart-currency">FCFA</span></p>
            <p class="chart-variation" v-if="stats.variation_ca !== undefined">
              <span :class="stats.variation_ca >= 0 ? 'variation-up' : 'variation-down'">
                {{ stats.variation_ca >= 0 ? '▲' : '▼' }} {{ Math.abs(stats.variation_ca) }}% vs mois précédent
              </span>
            </p>
          </div>
          <div class="chart-legend">
            <span class="legend-dot legend-dot-blue"></span>
            <span class="legend-label">Mois courant</span>
            <span class="legend-dot legend-dot-light"></span>
            <span class="legend-label">Mois précédent</span>
          </div>
        </div>

        <!-- SVG Sales Chart -->
        <div class="chart-container">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="sales-chart" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line v-for="i in 5" :key="'grid-'+i"
              :x1="chartPadding" :y1="chartPadding + ((i-1) * (chartInnerHeight / 4))"
              :x2="chartWidth - chartPadding" :y2="chartPadding + ((i-1) * (chartInnerHeight / 4))"
              class="chart-gridline"
            />

            <!-- Gradient fill under the line -->
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.02" />
              </linearGradient>
            </defs>

            <!-- Area fill -->
            <path v-if="chartAreaPath" :d="chartAreaPath" fill="url(#salesGradient)" />

            <!-- Main line -->
            <polyline v-if="chartPoints.length > 0"
              :points="chartPointsStr"
              fill="none" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            />

            <!-- Data points -->
            <circle v-for="(pt, idx) in chartPoints" :key="'pt-'+idx"
              :cx="pt.x" :cy="pt.y" r="4"
              fill="white" stroke="#4F46E5" stroke-width="2.5"
            />

            <!-- Month labels -->
            <text v-for="(pt, idx) in chartPoints" :key="'lbl-'+idx"
              :x="pt.x" :y="chartHeight - 5"
              class="chart-month-label" text-anchor="middle"
            >{{ ventesMensuelles[idx]?.mois?.split(' ')[0] || '' }}</text>
          </svg>
        </div>
      </div>

      <!-- Performance Gauge Panel -->
      <div class="performance-panel">
        <h2 class="section-title">Performance de la Semaine</h2>

        <div class="gauge-wrapper">
          <svg viewBox="0 0 200 200" class="gauge-svg">
            <!-- Background arc -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" stroke-width="14"
              stroke-dasharray="502.65" stroke-dashoffset="125.66"
              transform="rotate(135 100 100)" stroke-linecap="round"
            />
            <!-- Animated score arc -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="#EF4444" stroke-width="14"
              :stroke-dasharray="502.65"
              :stroke-dashoffset="gaugeOffset"
              transform="rotate(135 100 100)" stroke-linecap="round"
              class="gauge-arc-animated"
            />
          </svg>
          <div class="gauge-center">
            <p class="gauge-label">Score</p>
            <p class="gauge-score">{{ animatedScore }}</p>
          </div>
        </div>

        <p class="performance-text">
          Votre performance est
          <strong :class="performanceColor">{{ stats.score_performance >= 70 ? 'excellente' : stats.score_performance >= 50 ? 'correcte' : 'à améliorer' }}</strong>
          cette semaine.
        </p>

        <button class="btn-details" @click="navigateTo('/admin/commandes')">
          Voir les Détails
        </button>

        <!-- Stats Footer -->
        <div class="stats-footer">
          <div class="stat-item">
            <span class="stat-dot stat-dot-green"></span>
            <span class="stat-label">Complétées</span>
            <span class="stat-value">{{ stats.commandes_completees || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-dot stat-dot-blue"></span>
            <span class="stat-label">Taux</span>
            <span class="stat-value">{{ stats.pourcentage_completion || 0 }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-dot stat-dot-red"></span>
            <span class="stat-label">En Attente</span>
            <span class="stat-value">{{ stats.commandes_attente || 0 }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- RECENT ORDERS TABLE                                 -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="orders-panel">
      <div class="orders-header">
        <h2 class="section-title">Commandes Récentes</h2>
        <NuxtLink to="/admin/commandes" class="link-all">
          Toutes les Commandes →
        </NuxtLink>
      </div>

      <div v-if="recentOrders.length > 0" class="orders-table-wrapper">
        <table class="orders-table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>Date</th>
              <th>Client</th>
              <th>Paiement</th>
              <th>Statut</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cmd in recentOrders" :key="cmd.id" class="order-row">
              <td class="order-ref">
                #{{ cmd.id }}
              </td>
              <td class="order-date">
                {{ formatDate(cmd.created_at) }}
              </td>
              <td class="order-customer">
                {{ cmd.nom_client }} {{ cmd.prenom_client || '' }}
              </td>
              <td>
                <span class="badge" :class="getPaiementBadgeClass(cmd.statut_paiement)">
                  {{ formatPaiement(cmd.statut_paiement) }}
                </span>
              </td>
              <td>
                <span class="badge" :class="getStatutBadgeClass(cmd.statut_commande)">
                  {{ formatStatut(cmd.statut_commande) }}
                </span>
              </td>
              <td class="order-total text-right">
                {{ formatPrice(cmd.montant_total || 0) }} <span class="currency-sm">FCFA</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="orders-empty">
        Aucune commande récente enregistrée.
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  TrendingUp, ShoppingCart, DollarSign, Package, RefreshCw
} from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Dashboard Administration - AgroShop TG'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()

const isLoading = ref(true)
const stats = ref({
  total_commandes: 0,
  chiffre_affaires: 0,
  revenus_nets: 0,
  produits_actifs: 0,
  categories_total: 0,
  commandes_completees: 0,
  commandes_attente: 0,
  commandes_en_cours: 0,
  pourcentage_completion: 0,
  score_performance: 0,
  variation_ca: 0,
  ca_mois_courant: 0,
  ca_mois_precedent: 0,
})
const ventesMensuelles = ref([])
const recentOrders = ref([])

// ── Animated Score ──
const animatedScore = ref(0)
watch(() => stats.value.score_performance, (newVal) => {
  let current = 0
  const target = newVal || 0
  const step = Math.max(1, Math.floor(target / 40))
  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    animatedScore.value = current
  }, 25)
}, { immediate: true })

// ── Chart computations ──
const chartWidth = 520
const chartHeight = 220
const chartPadding = 40
const chartInnerHeight = chartHeight - chartPadding * 2

const chartPoints = computed(() => {
  const data = ventesMensuelles.value
  if (!data || data.length === 0) return []

  const maxVal = Math.max(...data.map(d => d.montant), 1)
  const stepX = (chartWidth - chartPadding * 2) / Math.max(data.length - 1, 1)

  return data.map((d, i) => ({
    x: chartPadding + i * stepX,
    y: chartPadding + chartInnerHeight - (d.montant / maxVal) * chartInnerHeight
  }))
})

const chartPointsStr = computed(() => {
  return chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const chartAreaPath = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return ''
  const bottom = chartPadding + chartInnerHeight
  let path = `M${pts[0].x},${bottom}`
  pts.forEach(p => { path += ` L${p.x},${p.y}` })
  path += ` L${pts[pts.length - 1].x},${bottom} Z`
  return path
})

// ── Gauge computation ──
const totalArc = 502.65 * 0.75 // 270 degrees
const gaugeOffset = computed(() => {
  const score = stats.value.score_performance || 0
  const filled = (score / 100) * totalArc
  return 502.65 - filled // dashoffset = total - filled
})

const performanceColor = computed(() => {
  const s = stats.value.score_performance || 0
  if (s >= 70) return 'perf-excellent'
  if (s >= 50) return 'perf-correct'
  return 'perf-low'
})

// ── Formatters ──
const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const formatCompact = (val) => {
  const n = Number(val || 0)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'k'
  return n.toLocaleString('fr-FR')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatStatut = (statut) => {
  const map = {
    livree: 'Livrée',
    expediee: 'Expédiée',
    preparee: 'Préparée',
    confirmee: 'Confirmée',
    en_attente: 'En Attente',
    annulee: 'Annulée',
  }
  return map[statut] || statut || 'En attente'
}

const formatPaiement = (statut) => {
  const map = {
    paye: 'Payé',
    en_attente: 'En Attente',
    rembourse: 'Remboursé',
    echoue: 'Échoué',
  }
  return map[statut] || statut || 'En Attente'
}

const getStatutBadgeClass = (statut) => {
  switch (statut) {
    case 'livree': return 'badge-green'
    case 'expediee': case 'preparee': case 'confirmee': return 'badge-blue'
    case 'annulee': return 'badge-red'
    default: return 'badge-amber'
  }
}

const getPaiementBadgeClass = (statut) => {
  switch (statut) {
    case 'paye': return 'badge-green'
    case 'rembourse': return 'badge-purple'
    case 'echoue': return 'badge-red'
    default: return 'badge-amber'
  }
}

// ── Fetch data ──
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (res?.data) {
      const d = res.data

      // Stats
      stats.value = {
        total_commandes: d.stats?.total_commandes || 0,
        chiffre_affaires: d.stats?.chiffre_affaires || d.stats?.total_ventes || 0,
        revenus_nets: d.stats?.revenus_nets || 0,
        produits_actifs: d.stats?.produits_actifs || d.stats?.total_produits || 0,
        categories_total: d.stats?.categories_total || 0,
        commandes_completees: d.stats?.commandes_completees || 0,
        commandes_attente: d.stats?.commandes_attente || 0,
        commandes_en_cours: d.stats?.commandes_en_cours || 0,
        pourcentage_completion: d.stats?.pourcentage_completion || 0,
        score_performance: d.stats?.score_performance || 0,
        variation_ca: d.stats?.variation_ca || 0,
        ca_mois_courant: d.stats?.ca_mois_courant || 0,
        ca_mois_precedent: d.stats?.ca_mois_precedent || 0,
      }

      // Monthly sales
      ventesMensuelles.value = d.ventes_mensuelles || []

      // Recent orders
      recentOrders.value = d.dernieres_commandes || []
    }
  } catch (e) {
    console.error('Erreur de chargement du dashboard', e)
  }
  isLoading.value = false
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════ */
/*  DASHBOARD — PREMIUM DARK NAVY DESIGN                      */
/* ═══════════════════════════════════════════════════════════ */

.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
}

/* ── LOADING ── */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #1B2559;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-text {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Inter', system-ui, sans-serif;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── TOP BAR ── */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 24px;
  font-weight: 900;
  color: #1B2559;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
  font-weight: 500;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #1B2559;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(27, 37, 89, 0.25);
}

.btn-refresh:hover {
  background: #2d3a7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 37, 89, 0.35);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-refresh-icon {
  width: 14px;
  height: 14px;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

/* ═══════════════════════════════════════ */
/*  KPI CARDS GRID                         */
/* ═══════════════════════════════════════ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.kpi-card-inner {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kpi-card-dark {
  background: #1B2559;
  border-color: #2d3a7a;
  color: white;
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
}

.kpi-label-light {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
}

.kpi-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon {
  width: 20px;
  height: 20px;
}

.kpi-icon-blue {
  background: #EEF2FF;
  color: #4F46E5;
}

.kpi-icon-green {
  background: #F0FDF4;
  color: #16A34A;
}

.kpi-icon-purple {
  background: #FAF5FF;
  color: #9333EA;
}

.kpi-badge-green {
  padding: 4px 10px;
  background: #22c55e;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-badge-icon {
  width: 14px;
  height: 14px;
  color: white;
}

.kpi-value {
  font-size: 28px;
  font-weight: 900;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -1px;
}

.kpi-value-large {
  font-size: 34px;
  font-weight: 900;
  color: white;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -1px;
}

.kpi-value-accent {
  color: #9333EA;
}

.kpi-footer {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.kpi-footer-light {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}

.kpi-dual-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.kpi-dual-item {
  flex: 1;
}

.kpi-dual-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

.variation-up {
  color: #22c55e;
  font-weight: 700;
}

.variation-down {
  color: #ef4444;
  font-weight: 700;
}

.variation-neutral {
  color: #94a3b8;
  font-weight: 600;
}

/* ═══════════════════════════════════════ */
/*  MIDDLE ROW: Chart + Performance        */
/* ═══════════════════════════════════════ */
.middle-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .middle-row {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #1B2559;
  letter-spacing: -0.3px;
}

/* ── Chart Panel ── */
.chart-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-current-value {
  font-size: 28px;
  font-weight: 900;
  color: #1e293b;
  letter-spacing: -1px;
  margin-top: 4px;
}

.chart-currency {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0;
}

.chart-variation {
  font-size: 12px;
  margin-top: 2px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-dot-blue {
  background: #4F46E5;
}

.legend-dot-light {
  background: #CBD5E1;
}

.legend-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  margin-right: 8px;
}

.chart-container {
  flex: 1;
  min-height: 180px;
}

.sales-chart {
  width: 100%;
  height: 100%;
}

.chart-gridline {
  stroke: #f1f5f9;
  stroke-width: 1;
}

.chart-month-label {
  font-size: 10px;
  fill: #94a3b8;
  font-weight: 600;
}

/* ── Performance Panel ── */
.performance-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.gauge-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
}

.gauge-svg {
  width: 100%;
  height: 100%;
}

.gauge-arc-animated {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.gauge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  text-align: center;
}

.gauge-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gauge-score {
  font-size: 42px;
  font-weight: 900;
  color: #1B2559;
  letter-spacing: -2px;
  line-height: 1;
  margin-top: 4px;
}

.performance-text {
  font-size: 13px;
  color: #64748b;
  max-width: 220px;
  line-height: 1.5;
}

.perf-excellent { color: #16A34A; }
.perf-correct { color: #F59E0B; }
.perf-low { color: #EF4444; }

.btn-details {
  padding: 10px 28px;
  background: white;
  border: 2px solid #1B2559;
  color: #1B2559;
  font-size: 12px;
  font-weight: 800;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details:hover {
  background: #1B2559;
  color: white;
}

.stats-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot-green { background: #22c55e; }
.stat-dot-blue { background: #3B82F6; }
.stat-dot-red { background: #EF4444; }

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.stat-value {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
}

/* ═══════════════════════════════════════ */
/*  RECENT ORDERS TABLE                    */
/* ═══════════════════════════════════════ */
.orders-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.link-all {
  font-size: 12px;
  font-weight: 700;
  color: #4F46E5;
  text-decoration: none;
  transition: color 0.2s;
}

.link-all:hover {
  color: #3730A3;
  text-decoration: underline;
}

.orders-table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.orders-table thead th {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.orders-table tbody td {
  padding: 14px 16px;
  font-size: 13px;
  border-bottom: 1px solid #f8fafc;
  white-space: nowrap;
}

.order-row {
  transition: background 0.15s;
}

.order-row:hover {
  background: #fafbff;
}

.order-ref {
  font-weight: 800;
  color: #1B2559;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.order-date {
  color: #64748b;
  font-size: 12px;
}

.order-customer {
  font-weight: 700;
  color: #1e293b;
}

.order-total {
  font-weight: 800;
  color: #1e293b;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.currency-sm {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
}

.text-right {
  text-align: right;
}

/* ── Badges ── */
.badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
  border: 1px solid transparent;
}

.badge-green {
  background: #F0FDF4;
  color: #15803D;
  border-color: #BBF7D0;
}

.badge-blue {
  background: #EFF6FF;
  color: #1D4ED8;
  border-color: #BFDBFE;
}

.badge-amber {
  background: #FFFBEB;
  color: #B45309;
  border-color: #FDE68A;
}

.badge-red {
  background: #FEF2F2;
  color: #B91C1C;
  border-color: #FECACA;
}

.badge-purple {
  background: #FAF5FF;
  color: #7E22CE;
  border-color: #E9D5FF;
}

.orders-empty {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
}
</style>
