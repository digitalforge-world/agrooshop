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
      <div class="top-bar-actions">
        <button @click="openAiModal" class="btn-ai-header">
          <Brain class="w-4 h-4 text-purple-300 animate-pulse" />
          <span>Insights IA</span>
          <span v-if="aiInsights.ai_insights.alertes?.length" class="ai-badge-count">
            {{ aiInsights.ai_insights.alertes.length }}
          </span>
        </button>

        <button @click="fetchDashboardData" :disabled="isLoading" class="btn-refresh">
          <RefreshCw class="btn-refresh-icon" :class="{ spinning: isLoading }" />
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- ALERTS HUB (Bannière d'Alertes Opérationnelles)      -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="alerts-grid" v-if="alerts.total_produits_rupture > 0 || alerts.commandes_souffrance > 0 || alerts.paiements_attente > 0">
      
      <!-- Alert 1: Stock Critique -->
      <div class="alert-card alert-card-red" v-if="alerts.total_produits_rupture > 0">
        <div class="alert-header">
          <div class="alert-icon-box alert-icon-red">
            <AlertTriangle class="alert-icon" />
          </div>
          <span class="alert-badge alert-badge-red">{{ alerts.total_produits_rupture }} alerte(s)</span>
        </div>
        <h3 class="alert-title">Stock Critique & Ruptures</h3>
        <p class="alert-desc">
          <span v-for="(prod, idx) in alerts.produits_rupture.slice(0, 2)" :key="prod.id">
            <strong>{{ prod.nom_commercial }}</strong> ({{ prod.stock_disponible }} restants){{ idx === 0 && alerts.produits_rupture.length > 1 ? ', ' : '' }}
          </span>
          <span v-if="alerts.total_produits_rupture > 2"> et +{{ alerts.total_produits_rupture - 2 }} autres.</span>
        </p>
        <NuxtLink to="/admin/produits" class="alert-link alert-link-red">
          Gérer les stocks →
        </NuxtLink>
      </div>

      <!-- Alert 2: Commandes en Souffrance -->
      <div class="alert-card alert-card-amber" v-if="alerts.commandes_souffrance > 0">
        <div class="alert-header">
          <div class="alert-icon-box alert-icon-amber">
            <Clock class="alert-icon" />
          </div>
          <span class="alert-badge alert-badge-amber">Urgent (> 2h)</span>
        </div>
        <h3 class="alert-title">Commandes en Souffrance</h3>
        <p class="alert-desc">
          <strong>{{ alerts.commandes_souffrance }} commande(s)</strong> en attente de confirmation depuis plus de 2 heures.
        </p>
        <NuxtLink to="/admin/commandes" class="alert-link alert-link-amber">
          Traiter les commandes →
        </NuxtLink>
      </div>

      <!-- Alert 3: Paiements en attente -->
      <div class="alert-card alert-card-blue" v-if="alerts.paiements_attente > 0">
        <div class="alert-header">
          <div class="alert-icon-box alert-icon-blue">
            <CreditCard class="alert-icon" />
          </div>
          <span class="alert-badge alert-badge-blue">T-Money / Flooz</span>
        </div>
        <h3 class="alert-title">Paiements en Attente</h3>
        <p class="alert-desc">
          <strong>{{ alerts.paiements_attente }} paiement(s)</strong> nécessitant la validation de la transaction.
        </p>
        <NuxtLink to="/admin/commandes" class="alert-link alert-link-blue">
          Vérifier les encaissements →
        </NuxtLink>
      </div>

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
    <!-- MIDDLE ROW 1: Sales Chart + Performance Gauge       -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="middle-row">

      <!-- Sales Chart Panel -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Ventes Mensuelles</h2>
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
        <h2 class="section-title">Performance Global</h2>

        <div class="gauge-wrapper">
          <svg viewBox="0 0 200 200" class="gauge-svg">
            <!-- Background arc -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" stroke-width="14"
              stroke-dasharray="502.65" stroke-dashoffset="125.66"
              transform="rotate(135 100 100)" stroke-linecap="round"
            />
            <!-- Animated score arc -->
            <circle cx="100" cy="100" r="80" fill="none" stroke="#4F46E5" stroke-width="14"
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
    <!-- MIDDLE ROW 2: CATEGORIES & TOP PRODUCTS             -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="middle-row">
      <!-- Panel 1: Ventes par Catégorie de Produits -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Ventes par Catégorie</h2>
            <p class="section-subtitle">Distribution du chiffre d'affaires par secteur agricole</p>
          </div>
          <div class="category-count-badge">
            {{ ventesCategories.length }} catégories
          </div>
        </div>

        <div class="categories-list" v-if="ventesCategories.length > 0">
          <div v-for="cat in ventesCategories" :key="cat.id" class="category-item">
            <div class="category-item-header">
              <div class="category-name-group">
                <span class="category-dot"></span>
                <span class="category-name">{{ cat.nom_categorie }}</span>
                <span class="category-products-count">({{ cat.total_produits }} produit{{ cat.total_produits > 1 ? 's' : '' }})</span>
              </div>
              <span class="category-amount">{{ formatPrice(cat.total_ventes || 0) }} FCFA</span>
            </div>
            <div class="category-progress-bg">
              <div 
                class="category-progress-bar" 
                :style="{ width: getCategoryPercentage(cat.total_ventes) + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="orders-empty">
          Aucune donnée de vente par catégorie disponible.
        </div>
      </div>

      <!-- Panel 2: Top Produits & Stock -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Top 5 Produits les Plus Vendus</h2>
            <p class="section-subtitle">Volumes écoulés et niveau de stock disponible</p>
          </div>
          <NuxtLink to="/admin/produits" class="link-all">
            Catalogue →
          </NuxtLink>
        </div>

        <div class="top-products-list" v-if="topProduits.length > 0">
          <div v-for="(prod, index) in topProduits" :key="prod.id" class="top-product-item">
            <div class="product-rank-badge" :class="getRankClass(index)">
              #{{ index + 1 }}
            </div>
            <div class="product-info flex-1">
              <h4 class="product-name">{{ prod.nom_commercial }}</h4>
              <p class="product-sub font-mono">{{ formatPrice(prod.prix_unitaire) }} FCFA / unité</p>
            </div>
            <div class="product-stats text-right">
              <span class="product-sold">{{ prod.total_vendu }} vendus</span>
              <span class="stock-tag" :class="prod.stock_disponible <= 10 ? 'stock-tag-danger' : 'stock-tag-ok'">
                Stock: {{ prod.stock_disponible }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="orders-empty">
          Aucune statistique de vente de produits disponible.
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- MIDDLE ROW 3: LOGISTICS & PAYMENT METHODS           -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="middle-row" v-if="ventesVilles.length > 0 || modesPaiement.length > 0">
      <!-- Logistique par Zone / Ville -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Répartition Logistique par Zone</h2>
            <p class="section-subtitle">Top des villes par volume de commandes</p>
          </div>
          <div class="kpi-icon-wrapper kpi-icon-purple">
            <MapPin class="kpi-icon" />
          </div>
        </div>
        <div class="villes-grid">
          <div v-for="v in ventesVilles" :key="v.ville" class="ville-card">
            <div class="ville-header">
              <span class="ville-name">{{ v.ville }}</span>
              <span class="ville-badge">{{ v.total_commandes }} cmd(s)</span>
            </div>
            <p class="ville-amount">{{ formatPrice(v.montant_total) }} FCFA</p>
          </div>
        </div>
      </div>

      <!-- Statuts & Modes de Paiement -->
      <div class="chart-panel">
        <div class="chart-header">
          <div>
            <h2 class="section-title">Modes & Statuts de Paiement</h2>
            <p class="section-subtitle">Encaissements Mobile Money & Cash</p>
          </div>
          <div class="kpi-icon-wrapper kpi-icon-green">
            <CreditCard class="kpi-icon" />
          </div>
        </div>
        <div class="payment-stats-list">
          <div v-for="mode in modesPaiement" :key="mode.statut_paiement" class="payment-stat-item">
            <div class="payment-stat-left">
              <span class="badge" :class="getPaiementBadgeClass(mode.statut_paiement)">
                {{ formatPaiement(mode.statut_paiement) }}
              </span>
              <span class="payment-count">{{ mode.total }} transaction(s)</span>
            </div>
            <span class="payment-amount">{{ formatPrice(mode.montant) }} FCFA</span>
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

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- AI INSIGHTS MODAL                                   -->
    <!-- ═══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isAiModalOpen" class="ai-modal-overlay" @click.self="closeAiModal">
          <div class="ai-modal-container">
            <!-- Modal Header -->
            <div class="ai-modal-header">
              <div class="flex items-center gap-3">
                <div class="ai-badge-icon">
                  <Brain class="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h2 class="ai-insights-title text-xl font-bold flex items-center gap-2">
                    <Sparkles class="w-5 h-5 text-amber-400" />
                    Insights — Analyse Prédictive
                  </h2>
                  <p class="ai-insights-subtitle text-xs text-slate-300">Analyse automatique des tendances et recommandations intelligentes</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  @click="fetchAiInsights" 
                  :disabled="aiInsights.loading"
                  class="ai-refresh-btn"
                  title="Actualiser les données IA"
                >
                  <RefreshCw class="w-3.5 h-3.5 mr-1.5" :class="{ spinning: aiInsights.loading }" />
                  Actualiser
                </button>
                <button @click="closeAiModal" class="ai-modal-close-btn" title="Fermer (Échap)">
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Modal Content Body -->
            <div class="ai-modal-body">
              <div v-if="aiInsights.loading" class="py-16 text-center text-xs font-mono text-slate-400">
                <div class="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Génération de l'analyse et prédictions en cours...
              </div>

              <div v-else class="space-y-6">
                <!-- 3 AI KPI stats: CA 30j, Prévision, Tendance -->
                <div class="ai-kpi-grid">
                  <div class="ai-kpi-card">
                    <div class="ai-kpi-label">CA 30 derniers jours</div>
                    <div class="ai-kpi-value ai-kpi-green">{{ formatPrice(aiInsights.ca_30j) }} <span class="ai-kpi-currency">FCFA</span></div>
                  </div>
                  <div class="ai-kpi-card">
                    <div class="ai-kpi-label">Prévision 30j (IA)</div>
                    <div class="ai-kpi-value ai-kpi-blue">{{ formatPrice(aiInsights.prevision_30j) }} <span class="ai-kpi-currency">FCFA</span></div>
                  </div>
                  <div class="ai-kpi-card">
                    <div class="ai-kpi-label">Tendance</div>
                    <div class="flex items-center gap-2">
                      <TrendingUp v-if="aiInsights.tendance_pct >= 0" class="w-5 h-5 text-emerald-400" />
                      <TrendingDown v-else class="w-5 h-5 text-rose-400" />
                      <span :class="aiInsights.tendance_pct >= 0 ? 'ai-kpi-green' : 'ai-kpi-red'" class="ai-kpi-value">
                        {{ aiInsights.tendance_pct >= 0 ? '+' : '' }}{{ aiInsights.tendance_pct }}%
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Tendances / Alertes / Opportunités columns -->
                <div class="ai-columns-grid">
                  <!-- Tendances -->
                  <div class="ai-col-card">
                    <div class="ai-col-header ai-col-header-blue">
                      <TrendingUp class="w-4 h-4" />
                      <span>Tendances du marché</span>
                    </div>
                    <div class="ai-col-body">
                      <div v-if="aiInsights.ai_insights.tendances?.length > 0" class="ai-list">
                        <div v-for="(t, i) in aiInsights.ai_insights.tendances.slice(0, 4)" :key="i" class="ai-list-item">
                          <span class="ai-dot ai-dot-blue"></span>
                          <span>{{ t }}</span>
                        </div>
                      </div>
                      <div v-else class="ai-empty">Aucune tendance détectée</div>
                    </div>
                  </div>

                  <!-- Alertes -->
                  <div class="ai-col-card">
                    <div class="ai-col-header ai-col-header-amber">
                      <Zap class="w-4 h-4" />
                      <span>Alertes critiques</span>
                    </div>
                    <div class="ai-col-body">
                      <div v-if="aiInsights.ai_insights.alertes?.length > 0" class="ai-list">
                        <div v-for="(a, i) in aiInsights.ai_insights.alertes.slice(0, 4)" :key="i" class="ai-list-item">
                          <span class="ai-dot ai-dot-amber"></span>
                          <span>{{ a }}</span>
                        </div>
                      </div>
                      <div v-else class="ai-empty">✅ Aucune alerte critique</div>
                    </div>
                  </div>

                  <!-- Opportunités -->
                  <div class="ai-col-card">
                    <div class="ai-col-header ai-col-header-green">
                      <Target class="w-4 h-4" />
                      <span>Opportunités</span>
                    </div>
                    <div class="ai-col-body">
                      <div v-if="aiInsights.ai_insights.opportunites?.length > 0" class="ai-list">
                        <div v-for="(o, i) in aiInsights.ai_insights.opportunites.slice(0, 4)" :key="i" class="ai-list-item">
                          <span class="ai-dot ai-dot-green"></span>
                          <span>{{ o }}</span>
                        </div>
                      </div>
                      <div v-else class="ai-empty">Analyse en cours...</div>
                    </div>
                  </div>
                </div>

                <!-- Top produits + Rupture -->
                <div class="ai-columns-grid">
                  <div class="ai-col-card">
                    <div class="ai-col-header">
                      <Package class="w-4 h-4 text-purple-400" />
                      <span>🏆 Top produits (IA)</span>
                    </div>
                    <div class="ai-col-body">
                      <div v-if="aiInsights.top_produits?.length > 0" class="ai-list ai-dense-list">
                        <div v-for="(p, i) in aiInsights.top_produits.slice(0, 5)" :key="p.id || i" class="ai-dense-item">
                          <span class="ai-rank">#{{ i + 1 }}</span>
                          <div class="flex-1 min-w-0">
                            <div class="ai-dense-name">{{ p.nom_commercial || p.nom }}</div>
                          </div>
                          <div class="ai-dense-amount">{{ formatPrice(p.chiffre_affaires || p.total_vente || 0) }}</div>
                        </div>
                      </div>
                      <div v-else class="ai-empty">Aucune donnée top produits</div>
                    </div>
                  </div>

                  <div class="ai-col-card">
                    <div class="ai-col-header">
                      <AlertTriangle class="w-4 h-4 text-rose-400" />
                      <span>⚠️ Produits en rupture prévue</span>
                    </div>
                    <div class="ai-col-body">
                      <div v-if="aiInsights.produits_rupture?.length > 0" class="ai-list ai-dense-list">
                        <div v-for="(p, i) in aiInsights.produits_rupture.slice(0, 5)" :key="p.id || i" class="ai-dense-item">
                          <div class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1.5"></div>
                          <div class="flex-1 min-w-0">
                            <div class="ai-dense-name">{{ p.nom_commercial || p.nom }}</div>
                            <div class="text-[10px] text-rose-400 font-mono">Stock: {{ p.stock_disponible ?? p.stock ?? '?' }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="ai-empty">✅ Aucune rupture prévue</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  TrendingUp, ShoppingCart, DollarSign, Package, RefreshCw,
  AlertTriangle, Clock, CreditCard, MapPin, Sparkles, Brain,
  Zap, Target, TrendingDown, X
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

const alerts = ref({
  produits_rupture: [],
  total_produits_rupture: 0,
  commandes_souffrance: 0,
  paiements_attente: 0,
})

const ventesMensuelles = ref([])
const ventesCategories = ref([])
const modesPaiement = ref([])
const topProduits = ref([])
const ventesVilles = ref([])
const recentOrders = ref([])

const aiInsights = ref({
  loading: false,
  ca_30j: 0,
  prevision_30j: 0,
  tendance_pct: 0,
  ai_insights: {
    tendances: [],
    alertes: [],
    opportunites: []
  },
  top_produits: [],
  produits_rupture: []
})

const isAiModalOpen = ref(false)

const openAiModal = () => {
  isAiModalOpen.value = true
  if (!aiInsights.value.ca_30j && !aiInsights.value.loading) {
    fetchAiInsights()
  }
}

const closeAiModal = () => {
  isAiModalOpen.value = false
}

// ── Computed for Category Total ──
const totalVentesCategories = computed(() => {
  const sum = ventesCategories.value.reduce((acc, cat) => acc + Number(cat.total_ventes || 0), 0)
  return sum > 0 ? sum : 1
})

const getCategoryPercentage = (amount) => {
  const total = totalVentesCategories.value
  if (!total || total === 0) return 0
  return Math.min(100, Math.round(((amount || 0) / total) * 100))
}

const getRankClass = (idx) => {
  if (idx === 0) return 'rank-1'
  if (idx === 1) return 'rank-2'
  if (idx === 2) return 'rank-3'
  return 'rank-default'
}

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

const fetchAiInsights = async () => {
  aiInsights.value.loading = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/ai/dashboard/insights`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const d = res?.data || res
    if (d) {
      aiInsights.value.ca_30j = d.ca_30j || d.ca || 0
      aiInsights.value.prevision_30j = d.prevision_30j || d.prevision || 0
      aiInsights.value.tendance_pct = d.tendance_pct || d.tendance || 0
      aiInsights.value.ai_insights = d.ai_insights || { tendances: [], alertes: [], opportunites: [] }
      aiInsights.value.top_produits = d.top_produits || d.topProduits || []
      aiInsights.value.produits_rupture = d.produits_rupture || d.stock_alerte || []
    }
  } catch (e) {
    console.warn('AI insights fetch error', e)
  }
  aiInsights.value.loading = false
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

      // Alerts
      alerts.value = d.alerts || {
        produits_rupture: [],
        total_produits_rupture: 0,
        commandes_souffrance: 0,
        paiements_attente: 0,
      }

      // Collections
      ventesMensuelles.value = d.ventes_mensuelles || []
      ventesCategories.value = d.ventes_categories || []
      modesPaiement.value = d.modes_paiement || []
      topProduits.value = d.top_produits || []
      ventesVilles.value = d.ventes_villes || []
      recentOrders.value = d.dernieres_commandes || []
    }
  } catch (e) {
    console.error('Erreur de chargement du dashboard', e)
  }
  isLoading.value = false
  fetchAiInsights()
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
/*  ALERTS HUB                             */
/* ═══════════════════════════════════════ */
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-card {
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid transparent;
  transition: transform 0.2s, box-shadow 0.2s;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.alert-card-red {
  background: #FEF2F2;
  border-color: #FECACA;
}

.alert-card-amber {
  background: #FFFBEB;
  border-color: #FDE68A;
}

.alert-card-blue {
  background: #EFF6FF;
  border-color: #BFDBFE;
}

.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-icon-red { background: #FEE2E2; color: #DC2626; }
.alert-icon-amber { background: #FEF3C7; color: #D97706; }
.alert-icon-blue { background: #DBEAFE; color: #2563EB; }

.alert-icon { width: 18px; height: 18px; }

.alert-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.alert-badge-red { background: #EF4444; color: white; }
.alert-badge-amber { background: #F59E0B; color: white; }
.alert-badge-blue { background: #3B82F6; color: white; }

.alert-title {
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.alert-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.4;
  margin: 0;
}

.alert-link {
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  margin-top: 4px;
}

.alert-link-red { color: #DC2626; }
.alert-link-amber { color: #D97706; }
.alert-link-blue { color: #2563EB; }

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
  height: 36px;
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
  font-weight: 700;
}

/* ═══════════════════════════════════════ */
/*  MIDDLE ROW: PANELS                     */
/* ═══════════════════════════════════════ */
.middle-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .middle-row {
    grid-template-columns: 1fr;
  }
}

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
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: #1B2559;
}

.section-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.chart-current-value {
  font-size: 26px;
  font-weight: 900;
  color: #1e293b;
  margin-top: 4px;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -0.5px;
}

.chart-currency {
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
}

.chart-variation {
  font-size: 11px;
  margin-top: 2px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot-blue {
  background: #4F46E5;
}

.legend-dot-light {
  background: #cbd5e1;
}

.chart-container {
  width: 100%;
  height: 200px;
}

.sales-chart {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-gridline {
  stroke: #f1f5f9;
  stroke-width: 1;
}

.chart-month-label {
  font-size: 10px;
  fill: #94a3b8;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── CATEGORIES PROGRESS ── */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.category-name-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4F46E5;
}

.category-name {
  font-weight: 700;
  color: #1B2559;
}

.category-products-count {
  font-size: 11px;
  color: #94a3b8;
}

.category-amount {
  font-weight: 800;
  color: #10B981;
  font-family: 'Inter', system-ui, sans-serif;
}

.category-progress-bg {
  height: 8px;
  background: #F1F5F9;
  border-radius: 10px;
  overflow: hidden;
}

.category-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4F46E5, #818CF8);
  border-radius: 10px;
  transition: width 0.6s ease-in-out;
}

.category-count-badge {
  font-size: 11px;
  font-weight: 700;
  background: #EEF2FF;
  color: #4F46E5;
  padding: 4px 10px;
  border-radius: 20px;
}

/* ── TOP PRODUCTS ── */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
}

.product-rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-1 { background: #FEF3C7; color: #D97706; }
.rank-2 { background: #E0E7FF; color: #4338CA; }
.rank-3 { background: #DCFCE7; color: #15803D; }
.rank-default { background: #E2E8F0; color: #64748B; }

.product-name {
  font-size: 13px;
  font-weight: 700;
  color: #1B2559;
  margin: 0;
}

.product-sub {
  font-size: 11px;
  color: #64748B;
  margin-top: 2px;
}

.product-sold {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #1E293B;
}

.stock-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  margin-top: 2px;
}

.stock-tag-ok { background: #DCFCE7; color: #166534; }
.stock-tag-danger { background: #FEE2E2; color: #991B1B; }

/* ── VILLES LOGISTIQUE ── */
.villes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.ville-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 12px 14px;
}

.ville-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.ville-name {
  font-size: 13px;
  font-weight: 800;
  color: #1B2559;
}

.ville-badge {
  font-size: 10px;
  font-weight: 700;
  background: #EDE9FE;
  color: #6D28D9;
  padding: 2px 6px;
  border-radius: 12px;
}

.ville-amount {
  font-size: 14px;
  font-weight: 900;
  color: #10B981;
}

/* ── MODES PAIEMENT ── */
.payment-stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.payment-stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
}

.payment-stat-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-count {
  font-size: 12px;
  color: #64748B;
  font-weight: 600;
}

.payment-amount {
  font-size: 13px;
  font-weight: 800;
  color: #1B2559;
}

/* ── PERFORMANCE GAUGE ── */
.performance-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.gauge-wrapper {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-svg {
  width: 100%;
  height: 100%;
}

.gauge-arc-animated {
  transition: stroke-dashoffset 1s ease-in-out;
}

.gauge-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gauge-score {
  font-size: 38px;
  font-weight: 900;
  color: #1B2559;
  font-family: 'Inter', system-ui, sans-serif;
  letter-spacing: -1px;
}

.performance-text {
  font-size: 12px;
  color: #64748b;
  text-align: center;

  strong.perf-excellent { color: #16A34A; }
  strong.perf-correct { color: #D97706; }
  strong.perf-low { color: #DC2626; }
}

.btn-details {
  width: 100%;
  padding: 10px;
  background: #F8FAFC;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #1B2559;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details:hover {
  background: #1B2559;
  color: white;
  border-color: #1B2559;
}

.stats-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.stat-dot-green { background: #22c55e; }
.stat-dot-blue { background: #3b82f6; }
.stat-dot-red { background: #ef4444; }

.stat-label {
  color: #94a3b8;
  font-weight: 600;
}

.stat-value {
  font-weight: 800;
  color: #1e293b;
}

/* ═══════════════════════════════════════ */
/*  ORDERS TABLE PANEL                     */
/* ═══════════════════════════════════════ */
.orders-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.orders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.link-all {
  font-size: 12px;
  font-weight: 700;
  color: #4F46E5;
  text-decoration: none;
  transition: color 0.2s;
}

.link-all:hover {
  color: #3730a3;
}

.orders-table-wrapper {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.orders-table th {
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  border-bottom: 1px solid #f1f5f9;
}

.orders-table td {
  padding: 14px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}

.order-row:hover {
  background: #f8fafc;
}

.order-ref {
  font-family: monospace;
  font-weight: 700;
  color: #4F46E5;
}

.order-date {
  color: #64748b;
  font-size: 12px;
}

.order-customer {
  font-weight: 600;
  color: #1e293b;
}

.order-total {
  font-weight: 800;
  color: #1e293b;
  font-family: 'Inter', system-ui, sans-serif;
}

.currency-sm {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
}

.orders-empty {
  text-align: center;
  padding: 32px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

/* ── BADGES ── */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.badge-green {
  background: #DCFCE7;
  color: #15803D;
}

.badge-blue {
  background: #E0E7FF;
  color: #4338CA;
}

.badge-amber {
  background: #FEF3C7;
  color: #B45309;
}

.badge-red {
  background: #FEE2E2;
  color: #B91C1C;
}

.badge-purple {
  background: #F3E8FF;
  color: #6B21A8;
}

.text-right {
  text-align: right;
}

/* ── AI INSIGHTS PANEL ── */
.ai-insights-panel {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%);
  border: 1px solid rgba(129, 140, 248, 0.25);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(79, 70, 229, 0.15), inset 0 1px 0 rgba(255,255,255,0.05);
}

.ai-insights-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.ai-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #a78bfa, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
}

.ai-insights-title {
  font-size: 18px;
  font-weight: 900;
  color: white;
  margin: 0;
}

.ai-insights-subtitle {
  font-size: 12px;
  color: rgba(199, 210, 254, 0.8);
  margin-top: 2px;
}

.ai-refresh-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e0e7ff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-refresh-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: white;
}

.ai-refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-insights-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ai-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 640px) {
  .ai-kpi-grid {
    grid-template-columns: 1fr;
  }
}

.ai-kpi-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px 16px;
}

.ai-kpi-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(199, 210, 254, 0.85);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ai-kpi-value {
  font-size: 22px;
  font-weight: 900;
  font-family: 'Inter', system-ui, sans-serif;
  margin-top: 4px;
  letter-spacing: -0.5px;
}

.ai-kpi-green { color: #4ade80; }
.ai-kpi-blue { color: #60a5fa; }
.ai-kpi-red { color: #f87171; }

.ai-kpi-currency {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.5);
}

.ai-columns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 1024px) {
  .ai-columns-grid {
    grid-template-columns: 1fr;
  }
}

.ai-columns-grid:nth-of-type(2) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 1024px) {
  .ai-columns-grid:nth-of-type(2) {
    grid-template-columns: 1fr;
  }
}

.ai-col-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-col-header {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  color: #e0e7ff;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ai-col-header-blue { color: #93c5fd; }
.ai-col-header-amber { color: #fcd34d; }
.ai-col-header-green { color: #86efac; }

.ai-col-body {
  padding: 12px 14px;
  flex: 1;
  min-height: 0;
}

.ai-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-list-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  line-height: 1.45;
  color: rgba(226, 232, 240, 0.9);
}

.ai-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.ai-dot-blue { background: #60a5fa; box-shadow: 0 0 6px rgba(96, 165, 250, 0.6); }
.ai-dot-amber { background: #fbbf24; box-shadow: 0 0 6px rgba(251, 191, 36, 0.6); }
.ai-dot-green { background: #4ade80; box-shadow: 0 0 6px rgba(74, 222, 128, 0.6); }

.ai-empty {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.8);
  text-align: center;
  padding: 8px 0;
}

.ai-dense-list {
  gap: 6px;
}

.ai-dense-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  font-size: 11px;
}

.ai-rank {
  min-width: 28px;
  padding: 2px 6px;
  text-align: center;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: #c4b5fd;
  border-radius: 6px;
  font-weight: 800;
  font-size: 10px;
  font-family: monospace;
}

.ai-dense-name {
  font-weight: 700;
  color: #f1f5f9;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-dense-amount {
  font-weight: 800;
  color: #86efac;
  font-family: monospace;
  font-size: 11px;
}

/* Spinning animation for refresh icons */
.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Top bar actions container */
.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* AI Header Trigger Button */
.btn-ai-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #2e1065 0%, #1e1b4b 50%, #0f172a 100%);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #e9d5ff;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(126, 34, 206, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.btn-ai-header:hover {
  background: linear-gradient(135deg, #3b0764 0%, #2e1065 50%, #1e1b4b 100%);
  border-color: rgba(192, 132, 252, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(126, 34, 206, 0.35);
  color: #ffffff;
}

.ai-badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #ef4444;
  color: #ffffff;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  font-family: monospace;
}

/* AI Modal Styles */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ai-modal-container {
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  background: #111827;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(126, 34, 206, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f8fafc;
}

.ai-modal-header {
  padding: 18px 24px;
  background: linear-gradient(90deg, #1e1b4b 0%, #0f172a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-modal-close-btn {
  padding: 6px;
  border-radius: 10px;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-modal-close-btn:hover {
  color: #ffffff;
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.ai-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
