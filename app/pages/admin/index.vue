<template>
  <div class="space-y-8">

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- LOADING OVERLAY                                     -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Synchronisation des données AgroShop...</p>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- HEADER & REFRESH                                    -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900">Tableau de Bord Administration</h1>
        <p class="text-xs text-slate-500 mt-1">Données, métriques et performances en temps réel issues de la base AgroShop.</p>
      </div>

      <button 
        @click="fetchDashboardData" 
        :disabled="isLoading"
        class="px-4 py-2.5 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
      >
        <RefreshCw class="w-3.5 h-3.5 text-emerald-400" :class="{ 'animate-spin': isLoading }" />
        <span>Actualiser les Données</span>
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 1. CARTE PRINCIPALE DARK NAVY + 4 CARTE KPI          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      
      <!-- High visibility Chiffre d'Affaires Card (Dark Navy) -->
      <div class="sm:col-span-2 lg:col-span-1 bg-[#1B2559] border border-[#2d3a7a] text-white rounded-2xl p-5 space-y-3 shadow-md flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-300">Chiffre d'Affaires</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-2xl sm:text-3xl font-black font-mono">
            {{ formatPrice(stats.chiffre_affaires || stats.total_ventes || 0) }}
          </p>
          <p class="text-[11px] font-sans text-slate-300 font-bold mt-1">FCFA cumulé</p>
        </div>
        <div class="text-[11px] text-slate-300 font-medium pt-2 border-t border-slate-700/60 flex items-center justify-between">
          <span>Variation :</span>
          <span :class="stats.variation_ca >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'">
            {{ stats.variation_ca >= 0 ? '▲ +' : '▼ ' }}{{ stats.variation_ca || 0 }}%
          </span>
        </div>
      </div>

      <!-- Card 1: Total des Ventes -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Total Ventes</span>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
          {{ formatPrice(stats.total_ventes || 0) }} <span class="text-xs font-sans text-slate-500 font-bold">FCFA</span>
        </p>
        <div class="text-[11px] text-slate-500 font-medium">
          Chiffre d'affaires global
        </div>
      </div>

      <!-- Card 2: Commandes en Cours -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Commandes en Cours</span>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Clock class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 font-mono">
          {{ stats.commandes_en_cours || stats.commandes_attente || 0 }}
        </p>
        <div class="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
          <ShoppingCart class="w-3.5 h-3.5" />
          <span>{{ stats.commandes_attente || 0 }} en attente</span>
        </div>
      </div>

      <!-- Card 3: Clients Total -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Clients Total</span>
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Users class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-slate-900 font-mono">
          {{ stats.clients_total || 0 }}
        </p>
        <div class="text-[11px] text-purple-600 font-semibold">
          Acheteurs enregistrés dans la BDD
        </div>
      </div>

      <!-- Card 4: Produits Actifs -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Produits Actifs</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Package class="w-5 h-5" />
          </div>
        </div>
        <p class="text-3xl font-black text-emerald-700 font-mono">
          {{ stats.produits_actifs || stats.total_produits || 0 }}
        </p>
        <div class="text-[11px] text-emerald-600 font-semibold">
          Catalogue agricole en ligne
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 2. BANDEAU D'ALERTES STOCK                           -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div v-if="alertesStock.count_rupture > 0 || alertesStock.count_faible > 0" class="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 shadow-xs">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle class="w-5 h-5 text-amber-600 animate-pulse" />
          <span>Alertes Stocks & Ruptures</span>
          <span v-if="alertesStock.count_rupture > 0" class="px-2.5 py-0.5 text-xs bg-red-600 text-white rounded-full font-extrabold">
            {{ alertesStock.count_rupture }} Rupture(s)
          </span>
          <span v-if="alertesStock.count_faible > 0" class="px-2.5 py-0.5 text-xs bg-amber-600 text-white rounded-full font-extrabold">
            {{ alertesStock.count_faible }} Stock Faible
          </span>
        </div>
        <NuxtLink to="/admin/produits" class="text-xs font-bold text-amber-800 hover:underline">
          Gérer les Produits →
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Produits en rupture -->
        <div v-if="alertesStock.liste_rupture?.length > 0" class="bg-white border border-red-200 rounded-xl p-3">
          <h4 class="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-600"></span> Produits en Rupture
          </h4>
          <ul class="divide-y divide-slate-100 text-xs">
            <li v-for="p in alertesStock.liste_rupture.slice(0, 4)" :key="p.id" class="py-1.5 flex justify-between items-center">
              <span class="font-semibold text-slate-800 truncate max-w-[220px]">{{ p.nom_commercial }}</span>
              <span class="px-2 py-0.5 bg-red-100 text-red-700 rounded font-mono font-bold text-[10px]">Stock 0</span>
            </li>
          </ul>
        </div>

        <!-- Produits stock faible -->
        <div v-if="alertesStock.liste_faible?.length > 0" class="bg-white border border-amber-200 rounded-xl p-3">
          <h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Stock Inférieur au Seuil d'Alerte
          </h4>
          <ul class="divide-y divide-slate-100 text-xs">
            <li v-for="p in alertesStock.liste_faible.slice(0, 4)" :key="p.id" class="py-1.5 flex justify-between items-center">
              <span class="font-semibold text-slate-800 truncate max-w-[220px]">{{ p.nom_commercial }}</span>
              <span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono font-bold text-[10px]">
                Reste: {{ p.stock_disponible }} / Seuil: {{ p.stock_alerte }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 3. GRAPHIQUE VENTES & PERFORMANCE THIS WEEK          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Sales Line Chart (2 cols) -->
      <div class="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Évolution des Ventes</h2>
            <p class="text-xs text-slate-500">Historique mensuel des ventes AgroShop</p>
          </div>
          <div class="text-right">
            <p class="text-xl font-black text-slate-900 font-mono">{{ formatPrice(stats.ca_mois_courant || 0) }} FCFA</p>
            <p class="text-[11px] font-semibold" :class="stats.variation_ca >= 0 ? 'text-emerald-600' : 'text-red-600'">
              {{ stats.variation_ca >= 0 ? '▲ +' : '▼ ' }}{{ Math.abs(stats.variation_ca || 0) }}% vs mois dernier
            </p>
          </div>
        </div>

        <!-- SVG Sales Chart -->
        <div class="h-56 w-full">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-full" preserveAspectRatio="none">
            <line v-for="i in 5" :key="'grid-'+i"
              :x1="chartPadding" :y1="chartPadding + ((i-1) * (chartInnerHeight / 4))"
              :x2="chartWidth - chartPadding" :y2="chartPadding + ((i-1) * (chartInnerHeight / 4))"
              stroke="#f1f5f9" stroke-width="1"
            />
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#4F46E5" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <path v-if="chartAreaPath" :d="chartAreaPath" fill="url(#salesGrad)" />
            <polyline v-if="chartPoints.length > 0"
              :points="chartPointsStr"
              fill="none" stroke="#4F46E5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            />
            <circle v-for="(pt, idx) in chartPoints" :key="'pt-'+idx"
              :cx="pt.x" :cy="pt.y" r="4"
              fill="white" stroke="#4F46E5" stroke-width="2.5"
            />
            <text v-for="(pt, idx) in chartPoints" :key="'lbl-'+idx"
              :x="pt.x" :y="chartHeight - 5"
              font-size="10" fill="#94a3b8" font-weight="600" text-anchor="middle"
            >{{ ventesMensuelles[idx]?.mois || '' }}</text>
          </svg>
        </div>
      </div>

      <!-- Performance Gauge (Company Performance This Week) -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-between text-center">
        <h2 class="text-base font-bold text-slate-900 w-full text-left">Company Performance This Week</h2>

        <div class="relative w-44 h-44 my-2">
          <svg viewBox="0 0 200 200" class="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#E2E8F0" stroke-width="14"
              stroke-dasharray="502.65" stroke-dashoffset="125.66"
              transform="rotate(135 100 100)" stroke-linecap="round"
            />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" stroke-width="14"
              :stroke-dasharray="502.65"
              :stroke-dashoffset="gaugeOffset"
              transform="rotate(135 100 100)" stroke-linecap="round"
              class="transition-all duration-1000 ease-out"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
            <span class="text-4xl font-black text-slate-900 font-mono tracking-tight">{{ animatedScore }}</span>
          </div>
        </div>

        <p class="text-xs text-slate-600 px-4">
          Taux de complétion des commandes : <strong class="text-emerald-600">{{ stats.pourcentage_completion || 0 }}%</strong>
        </p>

        <NuxtLink to="/admin/commandes" class="w-full py-2.5 bg-[#1B2559] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors">
          View Details
        </NuxtLink>

        <div class="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 w-full text-xs">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-slate-500">Completed {{ stats.commandes_completees || 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span class="text-slate-500">Pending {{ stats.commandes_attente || 0 }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 4. TOP PRODUITS + RESUME PAIEMENTS + TRAFIC          -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Top Produits les plus vendus -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award class="w-4 h-4 text-amber-500" />
            <span>Produits les plus vendus</span>
          </h3>
          <NuxtLink to="/admin/produits" class="text-[11px] font-bold text-emerald-700 hover:underline">Voir tout</NuxtLink>
        </div>

        <div v-if="topProduits?.length > 0" class="divide-y divide-slate-100">
          <div v-for="(p, i) in topProduits" :key="p.produit_id" class="py-2.5 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded bg-slate-100 text-slate-600 font-mono font-bold text-[10px] flex items-center justify-center">#{{ i+1 }}</span>
              <span class="font-semibold text-slate-800 truncate max-w-[140px]">{{ p.nom_produit }}</span>
            </div>
            <div class="text-right">
              <span class="font-bold font-mono text-emerald-700 block">{{ formatPrice(p.ca_genere) }} FCFA</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ p.total_quantite }} vendus</span>
            </div>
          </div>
        </div>
        <div v-else class="py-4 text-center text-xs text-slate-400 font-mono">
          Aucune vente enregistrée.
        </div>
      </div>

      <!-- Résumé Paiements -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-emerald-600" />
            <span>Résumé Paiements</span>
          </h3>
        </div>

        <div class="space-y-2.5 text-xs">
          <div class="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex justify-between items-center">
            <div>
              <p class="font-bold text-emerald-900">Paiements Réussis</p>
              <p class="text-[10px] text-emerald-700">{{ resumePaiements.payes_count || 0 }} commandes</p>
            </div>
            <span class="font-mono font-bold text-emerald-900">{{ formatPrice(resumePaiements.payes_montant) }} FCFA</span>
          </div>

          <div class="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex justify-between items-center">
            <div>
              <p class="font-bold text-amber-900">Paiements en Attente</p>
              <p class="text-[10px] text-amber-700">{{ resumePaiements.attente_count || 0 }} commandes</p>
            </div>
            <span class="font-mono font-bold text-amber-900">{{ formatPrice(resumePaiements.attente_montant) }} FCFA</span>
          </div>

          <div class="p-2.5 bg-red-50/70 border border-red-200 rounded-xl flex justify-between items-center">
            <div>
              <p class="font-bold text-red-900">Paiements Échoués</p>
              <p class="text-[10px] text-red-700">{{ resumePaiements.echoues_count || 0 }} commandes</p>
            </div>
            <span class="font-mono font-bold text-red-900">{{ formatPrice(resumePaiements.echoues_montant) }} FCFA</span>
          </div>
        </div>
      </div>

      <!-- Performance Marketing & Trafic -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Eye class="w-4 h-4 text-purple-600" />
            <span>Trafic & Marketing</span>
          </h3>
          <NuxtLink to="/admin/visites" class="text-[11px] font-bold text-purple-700 hover:underline">Visiteurs IP →</NuxtLink>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Visiteurs uniques</span>
            <span class="font-bold font-mono text-slate-900">{{ performanceMarketing.visiteurs_uniques || 0 }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Visites ce mois</span>
            <span class="font-bold font-mono text-slate-900">{{ performanceMarketing.visites_ce_mois || 0 }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span class="text-slate-500">Conversions (Commandes)</span>
            <span class="font-bold font-mono text-emerald-700">{{ performanceMarketing.conversions || 0 }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5">
            <span class="text-slate-500 font-bold">Taux de conversion</span>
            <span class="font-black font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {{ performanceMarketing.taux_conversion || 0 }}%
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 5. TABLEAU COMPLET DES DERNIERES COMMANDES           -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Dernières Commandes enregistrées</h2>
          <p class="text-xs text-slate-500">Transactions récentes synchronisées depuis la base de données AgroShop</p>
        </div>
        <NuxtLink to="/admin/commandes" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
          Toutes les Commandes →
        </NuxtLink>
      </div>

      <div v-if="recentOrders.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 rounded-l-xl">Code Réf</th>
              <th class="px-4 py-3">Nom Client</th>
              <th class="px-4 py-3">Téléphone</th>
              <th class="px-4 py-3">Montant Total</th>
              <th class="px-4 py-3">Paiement</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 rounded-r-xl text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="cmd in recentOrders" :key="cmd.id" class="hover:bg-emerald-50/40 transition-colors">
              <td class="px-4 py-3.5 font-mono text-emerald-700 font-bold">
                {{ cmd.code_reference || cmd.reference_commande || `CMD-${cmd.id}` }}
              </td>
              <td class="px-4 py-3.5 font-bold text-slate-900">
                {{ cmd.nom_client }} {{ cmd.prenom_client || '' }}
              </td>
              <td class="px-4 py-3.5 font-mono text-slate-600">
                {{ cmd.telephone || cmd.telephone_client || 'N/A' }}
              </td>
              <td class="px-4 py-3.5 font-mono font-bold text-slate-900">
                {{ formatPrice(cmd.montant_total || 0) }} FCFA
              </td>
              <td class="px-4 py-3.5">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border"
                  :class="getPaiementBadgeClass(cmd.statut_paiement)"
                >
                  {{ formatPaiement(cmd.statut_paiement) }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border"
                  :class="getStatutBadgeClass(cmd.statut_commande)"
                >
                  {{ formatStatut(cmd.statut_commande) }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-right text-slate-500 font-mono text-[11px]">
                {{ formatDate(cmd.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-8 text-center text-xs text-slate-500 font-mono">
        Aucune commande récente enregistrée dans la base de données.
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════ -->
    <!-- 6. CHIFFRE D'AFFAIRES PAR BOUTIQUE (MULTI-BOUTIQUES) -->
    <!-- ═══════════════════════════════════════════════════ -->
    <div v-if="stats.ventes_par_boutique && stats.ventes_par_boutique.length > 0" class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Chiffre d'Affaires par Boutique</h2>
          <p class="text-xs text-slate-500">Répartition des revenus entre les différentes succursales</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="b in stats.ventes_par_boutique" :key="b.boutique_nom" class="p-4 border border-emerald-100 rounded-xl bg-emerald-50/30 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-emerald-800 text-sm">{{ b.boutique_nom }}</h3>
            <p class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{{ b.boutique_type }}</p>
          </div>
          <div class="mt-4 flex items-end justify-between">
            <span class="text-xl font-black text-slate-900 font-mono">{{ formatPrice(b.ca_total) }} <span class="text-[10px] font-sans text-slate-500 font-bold">FCFA</span></span>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">{{ b.ventes_count }} Ventes</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  TrendingUp, Clock, Users, Package, ShoppingCart, RefreshCw,
  AlertTriangle, Award, CreditCard, Eye
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
  total_ventes: 0,
  chiffre_affaires: 0,
  commandes_en_cours: 0,
  commandes_attente: 0,
  commandes_completees: 0,
  clients_total: 0,
  produits_actifs: 0,
  pourcentage_completion: 0,
  score_performance: 0,
  variation_ca: 0,
  ca_mois_courant: 0,
  ventes_par_boutique: []
})

const alertesStock = ref({ count_rupture: 0, count_faible: 0, liste_rupture: [], liste_faible: [] })
const topProduits = ref([])
const performanceMarketing = ref({ visiteurs_uniques: 0, visites_ce_mois: 0, conversions: 0, taux_conversion: 0 })
const resumePaiements = ref({ payes_count: 0, payes_montant: 0, attente_count: 0, attente_montant: 0, echoues_count: 0, echoues_montant: 0 })
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

const gaugeOffset = computed(() => {
  const score = stats.value.score_performance || 0
  const totalArc = 502.65 * 0.75
  const filled = (score / 100) * totalArc
  return 502.65 - filled
})

// ── Formatters ──
const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

const formatStatut = (statut) => {
  switch (statut) {
    case 'livree': return 'Livrée'
    case 'expediee': return 'Expédiée'
    case 'preparee': return 'Préparée'
    case 'confirmee': return 'Confirmée'
    case 'en_attente': return 'En Attente'
    case 'annulee': return 'Annulée'
    default: return statut || 'En attente'
  }
}

const formatPaiement = (statut) => {
  switch (statut) {
    case 'paye': return 'Payé'
    case 'en_attente': return 'En Attente'
    case 'rembourse': return 'Remboursé'
    case 'echoue': return 'Échoué'
    default: return statut || 'En Attente'
  }
}

const getStatutBadgeClass = (statut) => {
  switch (statut) {
    case 'livree': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'expediee': case 'preparee': case 'confirmee': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'annulee': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

const getPaiementBadgeClass = (statut) => {
  switch (statut) {
    case 'paye': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'rembourse': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'echoue': return 'bg-red-50 text-red-700 border-red-200'
    default: return 'bg-amber-50 text-amber-700 border-amber-200'
  }
}

// ── Fetch Data ──
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    if (res?.data) {
      const d = res.data
      stats.value = d.stats || {}
      if (d.ventes_par_boutique) stats.value.ventes_par_boutique = d.ventes_par_boutique
      alertesStock.value = d.alertes_stock || { count_rupture: 0, count_faible: 0, liste_rupture: [], liste_faible: [] }
      topProduits.value = d.top_produits || []
      performanceMarketing.value = d.performance_marketing || { visiteurs_uniques: 0, visites_ce_mois: 0, conversions: 0, taux_conversion: 0 }
      resumePaiements.value = d.resume_paiements || { payes_count: 0, payes_montant: 0 }
      ventesMensuelles.value = d.ventes_mensuelles || []
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
  border-top-color: #059669;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.loading-text {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
