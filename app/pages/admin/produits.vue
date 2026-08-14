<template>
  <div class="h-[calc(100vh-6.5rem)] overflow-hidden flex flex-col space-y-3">
    
    <!-- Title & Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Package class="w-6 h-6 text-emerald-600" />
          <span>Gestion du Catalogue Produits</span>
        </h1>
        <p class="text-xs text-slate-600 mt-0.5">Consultez, filtrez, modifiez et gérez vos produits agricoles certifiés.</p>
      </div>

      <!-- Action Buttons Area -->
      <div class="flex items-center gap-2.5">
        <!-- Filter Modal Trigger Button -->
        <button 
          @click="isFilterModalOpen = true" 
          class="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          :class="{ 'border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/30': isFilterActive }"
        >
          <Filter class="w-3.5 h-3.5 text-emerald-600" />
          <span>🎛️ Filtrer le Catalogue</span>
          <span v-if="isFilterActive" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        <!-- Add Product Wizard Modal Trigger Button -->
        <button 
          @click="openAddModal" 
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>+ Nouveau Produit</span>
        </button>

        <!-- Refresh Button -->
        <button 
          @click="fetchProducts" 
          :disabled="isLoading"
          class="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Actualiser la liste"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Table Header KPI Bar -->
    <div class="bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 shadow-xs">
      <div class="flex items-center gap-2.5 text-xs font-mono">
        <span class="px-2.5 py-0.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
          Total Produits : <strong class="text-slate-900">{{ products.length }}</strong>
        </span>
        <span class="px-2.5 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-700">
          Actifs : <strong class="text-emerald-800 font-bold">{{ activeProductsCount }}</strong>
        </span>
        <span class="px-2.5 py-0.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-700">
          ⚠️ Stock en Baisse : <strong class="text-rose-800 font-bold">{{ lowStockProductsCount }}</strong>
        </span>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <span class="text-slate-500 font-mono text-[11px]">{{ filteredProducts.length }} résultat(s)</span>
        <button 
          v-if="isFilterActive" 
          @click="resetFilters" 
          class="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Products Table Container -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-0">
      
      <div v-if="isLoading" class="py-16 text-center text-xs font-mono text-slate-500">
        <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Chargement du catalogue produits...
      </div>

      <div v-else-if="filteredProducts.length > 0" class="overflow-x-auto overflow-y-auto flex-1 custom-modal-scroll">
        <table class="w-full text-left text-xs text-slate-700 relative">
          
          <!-- Sticky Header -->
          <thead class="bg-slate-50 text-slate-600 uppercase font-mono text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th class="px-4 py-2.5">Produit</th>
              <th class="px-4 py-2.5">Catégorie BDD</th>
              <th class="px-4 py-2.5">Prix Unitaire</th>
              <th class="px-4 py-2.5">État du Stock</th>
              <th class="px-4 py-2.5">En Vedette</th>
              <th class="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr 
              v-for="prod in filteredProducts" 
              :key="prod.id" 
              class="hover:bg-slate-50/80 transition-colors"
              :class="{ 'bg-rose-50/40': (prod.stock_disponible || 0) <= (prod.stock_alerte || 10) }"
            >
              
              <!-- Product Image & Clean Name -->
              <td class="px-4 py-2 flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 p-0.5 flex items-center justify-center">
                  <img 
                    :src="getImgUrl(prod.url_image || prod.image_principale?.url_image)" 
                    :alt="prod.nom_commercial"
                    class="w-full h-full object-contain"
                    @error="(e) => e.target.src = fallbackImage"
                  />
                </div>
                <div>
                  <p class="font-bold text-slate-900 text-xs">{{ prod.nom_commercial }}</p>
                </div>
              </td>

              <!-- Category Badge -->
              <td class="px-4 py-2 font-sans text-xs">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="c in getProductCategories(prod)" 
                    :key="c.id || c.slug"
                    class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-[10px] text-emerald-800 font-bold flex items-center gap-1"
                  >
                    <i v-if="c.icon" :class="[c.icon, 'text-emerald-700 text-[10px]']"></i>
                    <span>{{ c.nom }}</span>
                  </span>
                </div>
              </td>

              <!-- Price -->
              <td class="px-4 py-2 font-mono font-bold text-emerald-700 text-xs">
                {{ formatPrice(prod.prix_unitaire || 0) }} FCFA
              </td>

              <!-- Stock & Low Stock Badge -->
              <td class="px-4 py-2 font-mono text-xs">
                <span 
                  v-if="(prod.stock_disponible || 0) <= 0" 
                  class="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-300 uppercase"
                >
                  🔴 Rupture
                </span>
                <span 
                  v-else-if="(prod.stock_disponible || 0) <= (prod.stock_alerte || 10)" 
                  class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase animate-pulse"
                >
                  ⚠️ Stock Baisse ({{ prod.stock_disponible }})
                </span>
                <span v-else class="text-slate-800 font-semibold">
                  {{ prod.stock_disponible }} dispo.
                </span>
              </td>

              <!-- Featured Toggle -->
              <td class="px-4 py-2">
                <button 
                  @click="toggleFeatured(prod)"
                  class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                  :class="prod.est_en_vedette || prod.featured ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500 border border-slate-200'"
                >
                  <Star class="w-3 h-3" :class="{ 'fill-current text-amber-600': prod.est_en_vedette || prod.featured }" />
                  <span>{{ prod.est_en_vedette || prod.featured ? 'En Vedette' : 'Standard' }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="px-4 py-2 text-right font-mono space-x-1.5">
                <button 
                  @click="openAffecterBoutiquesModal(prod)" 
                  class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                  title="Affecter ce produit aux boutiques"
                >
                  <Truck class="w-3 h-3 text-emerald-600" />
                  <span>Boutiques</span>
                </button>

                <button 
                  @click="openDetailModal(prod)" 
                  class="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Voir la fiche complète en modal"
                >
                  <Eye class="w-3.5 h-3.5 inline-block" />
                </button>

                <button 
                  @click="openEditModal(prod)" 
                  class="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Modifier le produit"
                >
                  <Pencil class="w-3.5 h-3.5 inline-block" />
                </button>

                <button 
                  @click="confirmDelete(prod)" 
                  class="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Supprimer ce produit"
                >
                  <Trash2 class="w-3.5 h-3.5 inline-block" />
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
        Aucun produit ne correspond aux filtres appliqués.
      </div>

    </div>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 1. POPUP FILTER MODAL -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isFilterModalOpen" class="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-2xl text-slate-800">
          
          <div class="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
              <Filter class="w-5 h-5 text-emerald-600" />
              <span>Filtrer les Produits du Catalogue</span>
            </h3>
            <button @click="isFilterModalOpen = false" class="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 uppercase">Recherche par Nom commercial</label>
              <input 
                v-model="filters.search" 
                type="text" 
                placeholder="ex: Urée, NPK, Insecticide..." 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-700 uppercase">Filtrer par Catégorie</label>
              <select 
                v-model="filters.category" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-medium"
              >
                <option value="">Toutes les catégories</option>
                <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">
                  {{ cat.nom }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-700 uppercase">Filtrer par Statut</label>
              <div class="grid grid-cols-4 gap-2">
                <button 
                  v-for="st in ['tous', 'actif', 'inactif', 'brouillon']" 
                  :key="st"
                  type="button"
                  @click="filters.status = st"
                  :class="[
                    'py-2 rounded-xl text-[11px] font-bold capitalize border transition-all cursor-pointer',
                    filters.status === st ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  {{ st }}
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <label class="block font-bold text-slate-700 uppercase">État du Stock</label>
              <select 
                v-model="filters.stockState" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-medium"
              >
                <option value="tous">Tous les états de stock</option>
                <option value="normal">Stock suffisant</option>
                <option value="baisse">⚠️ Stock en Baisse (Alerte)</option>
                <option value="rupture">🔴 Rupture de Stock</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-slate-200">
            <button 
              @click="resetFilters" 
              class="px-4 py-2 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Réinitialiser
            </button>
            <button 
              @click="isFilterModalOpen = false" 
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Appliquer les Filtres
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 2. EXHAUSTIVE ADMIN PRODUCT DETAIL MODAL POPUP -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isDetailModalOpen && selectedProductDetail" class="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div class="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] text-slate-800">
          
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
            <div>
              <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Fiche Administrateur Complète</span>
              <h2 class="text-xl font-black text-slate-900">{{ selectedProductDetail.nom_commercial }}</h2>
            </div>
            <button @click="isDetailModalOpen = false" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 custom-modal-scroll space-y-6">
            <div class="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div class="w-28 h-28 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-xs">
                <img :src="getImgUrl(selectedProductDetail.url_image || selectedProductDetail.image_principale?.url_image)" class="w-full h-full object-contain" />
              </div>
              <div class="space-y-1.5 text-center sm:text-left flex-1">
                <div class="flex items-center justify-center sm:justify-start gap-2">
                  <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                    Statut: {{ selectedProductDetail.statut || 'Actif' }}
                  </span>
                  <span :class="selectedProductDetail.est_en_vedette || selectedProductDetail.featured ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase">
                    {{ selectedProductDetail.est_en_vedette || selectedProductDetail.featured ? '⭐ En Vedette' : 'Standard' }}
                  </span>
                </div>
                <h3 class="text-lg font-black text-slate-900">{{ selectedProductDetail.nom_commercial }}</h3>
                <p class="text-xs font-mono text-slate-500">URL Slug: <span class="text-emerald-700 font-bold">/produits/{{ selectedProductDetail.slug || selectedProductDetail.id }}</span></p>
                <p class="text-xl font-black text-emerald-700 pt-1">
                  {{ formatPrice(selectedProductDetail.prix_unitaire || 0) }} FCFA 
                  <span class="text-xs text-slate-500 font-mono">/ {{ selectedProductDetail.unite_mesure || 'unité' }}</span>
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span class="text-slate-500 text-[10px] block uppercase">Stock Dispo</span>
                <span class="text-slate-900 font-bold text-sm">{{ selectedProductDetail.stock_disponible || 0 }}</span>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span class="text-slate-500 text-[10px] block uppercase">Stock Alerte</span>
                <span class="text-amber-700 font-bold text-sm">{{ selectedProductDetail.stock_alerte || 10 }}</span>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span class="text-slate-500 text-[10px] block uppercase">Poids</span>
                <span class="text-slate-800 font-bold text-sm">{{ formatPoidsDisplay(selectedProductDetail.poids) }}</span>
              </div>
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                <span class="text-slate-500 text-[10px] block uppercase">Dimensions</span>
                <span class="text-slate-800 font-bold text-xs truncate block">{{ selectedProductDetail.dimensions || '80cm x 50cm x 20cm' }}</span>
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Layers class="w-4 h-4 text-purple-600" />
                <span>Catégories Associées</span>
              </h4>
              <div class="flex flex-wrap gap-2 pt-1">
                <span 
                  v-for="cat in getProductCategories(selectedProductDetail)" 
                  :key="cat.id || cat.slug" 
                  class="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <i v-if="cat.icon" :class="[cat.icon, 'text-emerald-700']"></i>
                  <span>{{ cat.nom }}</span>
                </span>
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h4 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Info class="w-4 h-4 text-emerald-600" />
                <span>Informations Générales & Composition</span>
              </h4>

              <div class="space-y-1">
                <span class="font-bold text-slate-500 uppercase text-[10px]">Description détaillée :</span>
                <p class="text-slate-800 leading-relaxed font-sans">{{ selectedProductDetail.description || 'Produit agricole certifié à haute efficacité. Idéal pour stimuler la croissance vegetative et maximiser le rendement des cultures au Togo.' }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div class="space-y-1">
                  <span class="font-bold text-emerald-700 uppercase text-[10px]">Composition :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.composition || 'Éléments nutritifs majeurs (Azote N, Phosphore P2O5, Potasse K2O) enrichis en oligo-éléments.' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="font-bold text-emerald-700 uppercase text-[10px]">Principes actifs :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.principes_actifs || 'Formulation minérale à assimilation foliaire et racinaire rapide.' }}</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h4 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <ShieldAlert class="w-4 h-4 text-amber-600" />
                <span>Utilisation, Dosage & Sécurité</span>
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <span class="font-bold text-slate-500 uppercase text-[10px]">Mode d'emploi :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.mode_emploi || 'Appliquer de préférence tôt le matin ou en fin d\'après-midi sur sol humide.' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="font-bold text-slate-500 uppercase text-[10px]">Dosage recommandé :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.dosage_recommande || '2 à 4 sacs par hectare selon les besoins spécifiques de la culture.' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="font-bold text-amber-700 uppercase text-[10px]">Précautions d'usage :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.precautions_usage || 'Conserver dans un endroit sec, frais et bien ventilé à l\'abri de la lumière directe du soleil.' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="font-bold text-rose-700 uppercase text-[10px]">Contre-indications :</span>
                  <p class="text-slate-700">{{ selectedProductDetail.contre_indications || 'Ne pas appliquer sur sol détrempé ni mélanger directement avec des produits alcalins forts.' }}</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 class="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Globe class="w-4 h-4 text-blue-600" />
                <span>Référencement SEO Google</span>
              </h4>
              <div class="space-y-2 font-mono">
                <p class="text-slate-600"><strong class="text-slate-900">Meta Title :</strong> {{ selectedProductDetail.meta_title || `${selectedProductDetail.nom_commercial} - AgroShop Togo` }}</p>
                <p class="text-slate-600"><strong class="text-slate-900">Meta Description :</strong> {{ selectedProductDetail.meta_description || selectedProductDetail.description || 'Achetez en ligne au Togo au meilleur prix certifié.' }}</p>
              </div>
            </div>

          </div>

          <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
            <button @click="isDetailModalOpen = false" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer">
              Fermer
            </button>
            <NuxtLink :to="getPublicLink(selectedProductDetail)" target="_blank" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5">
              <span>Voir la Fiche Publique ↗</span>
            </NuxtLink>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 3. WIZARD MULTI-STEP MODAL POPUP -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div class="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 text-slate-800">
          
          <!-- Header Bar -->
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  Étape {{ currentStep }} sur {{ totalSteps }} — {{ stepTitles[currentStep - 1] }}
                </span>
                <h2 class="text-lg sm:text-xl font-black text-slate-900">
                  {{ editingId ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit' }}
                </h2>
              </div>

              <button @click="closeModal" class="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors">
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Steps Indicators -->
            <div class="grid grid-cols-6 gap-1.5">
              <button 
                v-for="step in totalSteps" 
                :key="step"
                @click="goToStep(step)"
                :class="[
                  'h-1.5 rounded-full transition-all cursor-pointer',
                  step === currentStep ? 'bg-emerald-600 shadow-xs' : step < currentStep ? 'bg-emerald-300' : 'bg-slate-200'
                ]"
                :title="`Étape ${step}: ${stepTitles[step - 1]}`"
              ></button>
            </div>
          </div>

          <!-- Step Error Alert -->
          <div v-if="stepErrorMessage" class="bg-rose-50 border-b border-rose-200 text-rose-800 px-6 py-2.5 text-xs font-bold flex items-center justify-between">
            <span>⚠️ {{ stepErrorMessage }}</span>
            <button @click="stepErrorMessage = ''" class="text-rose-600 hover:text-rose-900">✕</button>
          </div>

          <!-- Scrollable Modal Content -->
          <div class="p-6 overflow-y-auto flex-1 custom-modal-scroll space-y-6">
            
            <!-- ÉTAPE 1: Informations Générales -->
            <div v-if="currentStep === 1" class="space-y-4">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Info class="w-4 h-4 text-emerald-600" />
                <span>1. Informations générales</span>
              </h3>

              <div class="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p class="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <span></span> Assistan — Fiche Technique Automatique
                  </p>
                  <p class="text-xs text-slate-600 mt-1">
                    Saisissez le Nom commercial (et les Catégories à l'étape 5), puis laissez l'IA rédiger description, composition, mode d'emploi, dosages et SEO.
                  </p>
                </div>
                <button
                  type="button"
                  @click="genererFicheProduitIA"
                  :disabled="isAiGeneratingFiche"
                  class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/15 flex items-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <span v-if="isAiGeneratingFiche" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <Sparkles v-else class="w-4 h-4" />
                  <span>{{ isAiGeneratingFiche ? 'Génération en cours…' : '✨ Générer la fiche technique' }}</span>
                </button>
              </div>

              <div v-if="aiFicheMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{{ aiFicheMessage }}</span>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nom commercial * <span class="text-rose-600">(Obligatoire)</span></label>
                  <input 
                    v-model="form.nom_commercial" 
                    required 
                    type="text" 
                    placeholder="ex: Engrais NPK 15-15-15 SuperFert" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                  <textarea 
                    v-model="form.description" 
                    rows="3" 
                    placeholder="Description détaillée du produit..." 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Composition</label>
                    <textarea 
                      v-model="form.composition" 
                      rows="3" 
                      placeholder="Composition chimique du produit..." 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Principes actifs</label>
                    <textarea 
                      v-model="form.principes_actifs" 
                      rows="3" 
                      placeholder="Principes actifs..." 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- ÉTAPE 2: Utilisation et précautions -->
            <div v-else-if="currentStep === 2" class="space-y-4">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldAlert class="w-4 h-4 text-amber-600" />
                <span>2. Utilisation et précautions</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mode d'emploi</label>
                  <textarea 
                    v-model="form.mode_emploi" 
                    rows="3" 
                    placeholder="Instructions d'utilisation..." 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Dosage recommandé</label>
                  <textarea 
                    v-model="form.dosage_recommande" 
                    rows="3" 
                    placeholder="Dosages et fréquences d'application..." 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Précautions d'usage</label>
                  <textarea 
                    v-model="form.precautions_usage" 
                    rows="3" 
                    placeholder="Précautions à prendre..." 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Contre-indications</label>
                  <textarea 
                    v-model="form.contre_indications" 
                    rows="3" 
                    placeholder="Contre-indications et restrictions..." 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- ÉTAPE 3: Images du produit -->
            <div v-else-if="currentStep === 3" class="space-y-5">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Image class="w-4 h-4 text-blue-600" />
                <span>3. Image Principale & Galerie du Produit</span>
              </h3>

              <!-- Section A: Image Principale Dédiée -->
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span class="text-xs font-black text-emerald-700 uppercase tracking-wider block">📷 Image Principale Officielle</span>
                
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <!-- Large Main Image Preview Box -->
                  <div class="w-32 h-32 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center flex-shrink-0 shadow-xs relative">
                    <img 
                      :src="mainImagePreview || getImgUrl(form.url_image)" 
                      class="w-full h-full object-contain" 
                      @error="(e) => e.target.src = fallbackImage"
                    />
                    <span class="absolute bottom-1 right-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                      Principale
                    </span>
                  </div>

                  <div class="space-y-2.5 flex-1 w-full text-xs">
                    <!-- Option 1: File Upload for Main Image -->
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">A. Remplacer par un fichier image :</label>
                      <label class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-2 transition-colors shadow-xs">
                        <Upload class="w-3.5 h-3.5" />
                        <span>Téléverser l'Image Principale</span>
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" @change="handleMainImageUpload" class="hidden" />
                      </label>
                    </div>

                    <!-- Option 2: Text input URL for Main Image -->
                    <div>
                      <label class="block font-bold text-slate-700 uppercase mb-1">B. Ou saisir un chemin / URL direct :</label>
                      <input 
                        v-model="form.url_image" 
                        type="text" 
                        placeholder="storage/produits/votre_image.jpg" 
                        class="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section B: Galerie des Images Secondaires -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-slate-700 uppercase">Galerie des Images (Secondaires)</label>
                  <label class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs">
                    <Plus class="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Ajouter des images</span>
                    <input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" @change="handleImageUpload" class="hidden" />
                  </label>
                </div>

                <!-- Gallery Grid -->
                <div v-if="imagesList.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div 
                    v-for="(img, idx) in imagesList" 
                    :key="idx"
                    class="relative bg-slate-50 p-2 rounded-2xl border border-slate-200 flex flex-col items-center gap-2 group shadow-xs"
                  >
                    <div class="w-full h-24 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-200">
                      <img :src="img.preview" class="w-full h-full object-contain" />
                    </div>

                    <div class="flex items-center gap-1.5 w-full justify-between">
                      <button 
                        type="button" 
                        @click="setAsMainImage(img)" 
                        class="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex-1 text-center"
                        title="Définir cette image comme image principale"
                      >
                        ⭐ Principale
                      </button>
                      <button 
                        type="button" 
                        @click="removeImage(idx)" 
                        class="p-1 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-mono">
                  Aucune image supplémentaire dans la galerie
                </div>
              </div>
            </div>

            <!-- ÉTAPE 4: Prix et stock -->
            <div v-else-if="currentStep === 4" class="space-y-4">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <DollarSign class="w-4 h-4 text-emerald-600" />
                <span>4. Prix et stock</span>
              </h3>

              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p class="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Zap class="w-3.5 h-3.5 text-amber-600" />
                    Contrôle IA — Détecteur d'anomalies
                  </p>
                  <p class="text-xs text-slate-600 mt-1">
                    Vérification automatique : prix atypique, stock incoherent, produit non adapté à la boutique.
                  </p>
                </div>
                <button
                  type="button"
                  @click="validerSaisieIA"
                  :disabled="isAiValidating"
                  class="px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <span v-if="isAiValidating" class="w-4 h-4 border-2 border-slate-400/30 border-t-slate-700 rounded-full animate-spin"></span>
                  <ShieldAlert v-else class="w-4 h-4 text-amber-600" />
                  <span>{{ isAiValidating ? 'Analyse en cours…' : '🔍 Vérifier la saisie' }}</span>
                </button>
              </div>

              <div v-if="aiValidationWarnings.length > 0 || aiValidationInfos.length > 0" class="space-y-2">
                <div
                  v-for="(w, i) in aiValidationWarnings"
                  :key="'w'+i"
                  :class="w.severity === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'"
                  class="border rounded-xl px-4 py-2.5 text-xs font-semibold flex items-start gap-2"
                >
                  <AlertTriangle v-if="w.severity === 'error'" class="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <AlertCircle v-else class="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span class="uppercase tracking-wider text-[10px] font-black opacity-80">[{{ w.code }}]</span>
                    <p>{{ w.message }}</p>
                  </div>
                </div>
                <div
                  v-for="(inf, i) in aiValidationInfos"
                  :key="'i'+i"
                  class="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-start gap-2"
                >
                  <Info class="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <span class="uppercase tracking-wider text-[10px] font-black opacity-80">[INFO]</span>
                    <p>{{ inf.message }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Prix unitaire (FCFA) * <span class="text-rose-600">(Obligatoire)</span></label>
                  <input 
                    v-model.number="form.prix_unitaire" 
                    required 
                    type="number" 
                    placeholder="ex: 18500" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Unité de mesure * <span class="text-rose-600">(Obligatoire)</span></label>
                  <select 
                    v-model="form.unite_mesure" 
                    required 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-medium"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="sac 50kg">Sac 50kg</option>
                    <option value="sac 25kg">Sac 25kg</option>
                    <option value="sac 5kg">Sac 5kg</option>
                    <option value="flacon 1L">Flacon 1L</option>
                    <option value="bouteille 500ml">Bouteille 500ml</option>
                    <option value="unité">Unité</option>
                    <option value="kit complet">Kit complet</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Stock disponible</label>
                  <input 
                    v-model.number="form.stock_disponible" 
                    type="number" 
                    placeholder="0" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Stock d'alerte</label>
                  <input 
                    v-model.number="form.stock_alerte" 
                    type="number" 
                    placeholder="10" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-xs font-bold text-slate-700 uppercase">Poids</label>
                    <span v-if="poidsEquivalentText" class="text-[11px] font-semibold text-emerald-600">
                      (= {{ poidsEquivalentText }})
                    </span>
                  </div>
                  <div class="flex items-center">
                    <input 
                      v-model.number="poidsValeur" 
                      type="number" 
                      :step="poidsUnite === 'g' ? '1' : '0.01'" 
                      :placeholder="poidsUnite === 'g' ? 'ex: 500' : 'ex: 50'" 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      @input="updateFormPoids"
                    />
                    <select 
                      v-model="poidsUnite"
                      @change="onPoidsUniteChange"
                      class="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-r-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer transition-colors hover:bg-slate-200"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Dimensions</label>
                  <input 
                    v-model="form.dimensions" 
                    type="text" 
                    placeholder="Ex: 25cm x 15cm x 10cm" 
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            <!-- ÉTAPE 5: Catégories BDD -->
            <div v-else-if="currentStep === 5" class="space-y-4">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Layers class="w-4 h-4 text-purple-600" />
                <span>5. Catégories (Base de Données)</span>
              </h3>

              <div class="space-y-4">
                <label class="block text-xs font-bold text-slate-700 uppercase">Cochez les catégories associées au produit :</label>
                
                <div v-if="categoriesList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div 
                    v-for="cat in categoriesList" 
                    :key="cat.id"
                    @click="toggleCategory(cat.id)"
                    class="p-3.5 bg-white rounded-2xl border flex items-center gap-3 text-xs font-bold cursor-pointer transition-all active:scale-98"
                    :class="isCategorySelected(cat.id) ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/30' : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50'"
                  >
                    <div 
                      class="w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors"
                      :class="isCategorySelected(cat.id) ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-300 bg-white'"
                    >
                      <span v-if="isCategorySelected(cat.id)" class="text-white text-xs font-black">✓</span>
                    </div>
                    <i v-if="cat.icon" :class="[cat.icon, 'text-emerald-600 text-sm flex-shrink-0']"></i>
                    <span class="flex-1">{{ cat.nom }}</span>
                  </div>
                </div>

                <div v-else class="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono">
                  Chargement des catégories depuis la base de données...
                </div>

                <div class="pt-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Catégorie principale</label>
                  <select 
                    v-model="form.categorie_principale" 
                    class="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-medium"
                  >
                    <option :value="null">Aucune</option>
                    <option v-for="cat in categoriesList" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ÉTAPE 6: Configuration & SEO -->
            <div v-else-if="currentStep === 6" class="space-y-4">
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Globe class="w-4 h-4 text-blue-600" />
                <span>6. Configuration & SEO</span>
              </h3>

              <div class="space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Statut du produit</label>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="radio" v-model="form.statut" value="actif" class="accent-emerald-600" />
                        <span>Actif</span>
                      </label>
                      <label class="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="radio" v-model="form.statut" value="inactif" class="accent-emerald-600" />
                        <span>Inactif</span>
                      </label>
                      <label class="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input type="radio" v-model="form.statut" value="rupture" class="accent-emerald-600" />
                        <span>Rupture</span>
                      </label>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <input 
                      id="est_vedette_modal" 
                      v-model="form.est_en_vedette" 
                      type="checkbox" 
                      class="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                    />
                    <label for="est_vedette_modal" class="text-xs font-bold text-slate-800 cursor-pointer">
                      ⭐ Produit mis en avant (Accueil)
                    </label>
                  </div>
                </div>

                <div class="space-y-4 pt-2 border-t border-slate-200">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Slug (URL)</label>
                    <input 
                      v-model="form.slug" 
                      type="text" 
                      placeholder="Sera généré automatiquement si vide" 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between items-center mb-1">
                      <label class="block text-xs font-bold text-slate-700 uppercase">Meta Title</label>
                      <span class="text-[10px] font-mono text-slate-500">{{ (form.meta_title || '').length }}/200 caractères</span>
                    </div>
                    <input 
                      v-model="form.meta_title" 
                      maxlength="200" 
                      type="text" 
                      placeholder="Titre pour Google..." 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div>
                    <div class="flex justify-between items-center mb-1">
                      <label class="block text-xs font-bold text-slate-700 uppercase">Meta Description</label>
                      <span class="text-[10px] font-mono text-slate-500">{{ (form.meta_description || '').length }}/160 caractères</span>
                    </div>
                    <textarea 
                      v-model="form.meta_description" 
                      maxlength="160" 
                      rows="2" 
                      placeholder="Description pour les moteurs de recherche..." 
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none focus:bg-white font-medium"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Wizard Navigation Footer -->
          <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
            <button type="button" @click="currentStep > 1 ? currentStep-- : closeModal()" class="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer">
              <span>{{ currentStep > 1 ? '← Précédent' : '✕ Annuler' }}</span>
            </button>

            <button v-if="currentStep < totalSteps" type="button" @click="nextStep" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer">
              <span>Suivant →</span>
            </button>

            <button v-else type="button" @click="saveProduct" :disabled="isSaving" class="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2">
              <RefreshCw v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isSaving ? 'Sauvegarde BDD...' : '✓ Terminer & Enregistrer' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- 4. CUSTOM SYSTEM CONFIRMATION MODAL (NO BROWSER POPUPS) -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="isConfirmModalOpen" class="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          
          <div class="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400 shadow-inner">
            <AlertTriangle class="w-7 h-7 animate-pulse" />
          </div>

          <div class="space-y-1.5">
            <h3 class="text-lg font-black text-white">{{ confirmTitle }}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">{{ confirmMessage }}</p>
          </div>

          <div class="flex items-center justify-center gap-3 pt-2">
            <button 
              @click="isConfirmModalOpen = false" 
              class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Annuler
            </button>

            <button 
              @click="executeConfirmAction" 
              class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/40 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🔴 Confirmer la suppression</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- MODAL AFFECTATION DU PRODUIT AUX BOUTIQUES -->
    <Teleport to="body">
      <div v-if="isAffecterBoutiquesModalOpen" class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" @click.self="isAffecterBoutiquesModalOpen = false">
        <div class="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800 max-h-[90vh] flex flex-col">
          
          <div class="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Truck class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base font-black text-slate-900">Affecter le Produit aux Boutiques</h3>
                <p class="text-xs text-slate-500">Produit : <span class="font-bold text-slate-800">{{ selectedProductForBoutiques?.nom_commercial }}</span></p>
              </div>
            </div>
            <button @click="isAffecterBoutiquesModalOpen = false" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="loadingBoutiquesAffectation" class="py-12 text-center text-slate-500 text-xs font-mono">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Chargement des boutiques et des stocks...
          </div>

          <div v-else class="overflow-y-auto flex-1 space-y-4 pr-1">
            <p class="text-xs text-slate-600">Cochez les boutiques dans lesquelles ce produit doit être disponible et définissez le stock de départ :</p>

            <div class="space-y-3">
              <div 
                v-for="b in boutiquesAffectationList" 
                :key="b.id"
                class="p-4 rounded-2xl border transition-all"
                :class="b.affecte ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50 border-slate-200 opacity-80'"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 cursor-pointer select-none" @click="b.affecte = !b.affecte">
                    <input 
                      type="checkbox" 
                      v-model="b.affecte" 
                      @click.stop
                      class="w-4 h-4 text-emerald-600 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <p class="text-xs font-bold text-slate-900">{{ b.nom }}</p>
                      <p class="text-[10px] text-slate-500">{{ b.adresse || 'Lomé, Togo' }}</p>
                    </div>
                  </div>

                  <div v-if="b.affecte" class="flex items-center gap-3">
                    <div class="flex flex-col">
                      <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Stock Boutique</label>
                      <input 
                        type="number" 
                        v-model.number="b.stock_disponible" 
                        min="0"
                        class="w-20 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-slate-900 text-center focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div class="flex flex-col">
                      <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Seuil Alerte</label>
                      <input 
                        type="number" 
                        v-model.number="b.stock_alerte" 
                        min="1"
                        class="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 text-center focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="affectationSuccess" class="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {{ affectationSuccess }}
            </div>

            <div v-if="affectationError" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0" />
              {{ affectationError }}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
            <button @click="isAffecterBoutiquesModalOpen = false" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer">
              Annuler
            </button>
            <button 
              @click="submitAffectationBoutiques" 
              :disabled="savingBoutiquesAffectation"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{{ savingBoutiquesAffectation ? 'Enregistrement...' : '✅ Enregistrer l\'affectation' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Package, Search, RefreshCw, Star, Eye, Plus, Pencil, Trash2, Save, Info, ShieldAlert, Image, Upload, DollarSign, Layers, Globe, X, Filter, AlertTriangle, Sparkles, CheckCircle2, AlertCircle, Zap, Truck } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/produits',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({
  title: 'Gestion des Produits - AgroShop Admin'
})

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()
const { getImageUrl } = useMedia()

const fallbackImage = '/images/Agroshopproduit .png'

const isLoading = ref(true)
const isSaving = ref(false)
const isModalOpen = ref(false)
const isFilterModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const selectedProductDetail = ref(null)
const editingId = ref(null)
const stepErrorMessage = ref('')

const isConfirmModalOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref(null)

const isAiGeneratingFiche = ref(false)
const isAiValidating = ref(false)
const aiValidationWarnings = ref([])
const aiValidationInfos = ref([])
const aiFicheMessage = ref('')

// State Affectation Boutiques
const isAffecterBoutiquesModalOpen = ref(false)
const selectedProductForBoutiques = ref(null)
const boutiquesAffectationList = ref([])
const loadingBoutiquesAffectation = ref(false)
const savingBoutiquesAffectation = ref(false)
const affectationSuccess = ref(null)
const affectationError = ref(null)

const openAffecterBoutiquesModal = async (prod) => {
  selectedProductForBoutiques.value = prod
  isAffecterBoutiquesModalOpen.value = true
  loadingBoutiquesAffectation.value = true
  affectationSuccess.value = null
  affectationError.value = null
  boutiquesAffectationList.value = []

  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}/boutiques`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const list = res?.data || []
    boutiquesAffectationList.value = list.map(b => ({
      ...b,
      stock_disponible: b.stock_disponible || 10,
      stock_alerte: b.stock_alerte || 5
    }))
  } catch (e) {
    affectationError.value = "Impossible de charger la liste des boutiques."
  } finally {
    loadingBoutiquesAffectation.value = false
  }
}

const submitAffectationBoutiques = async () => {
  const selectedBoutiques = boutiquesAffectationList.value
    .filter(b => b.affecte)
    .map(b => ({
      boutique_id: b.id,
      stock_disponible: Number(b.stock_disponible) || 0,
      stock_alerte: Number(b.stock_alerte) || 5
    }))

  if (selectedBoutiques.length === 0) {
    affectationError.value = "Veuillez cocher au moins une boutique à affecter."
    return
  }

  savingBoutiquesAffectation.value = true
  affectationSuccess.value = null
  affectationError.value = null

  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/produits/${selectedProductForBoutiques.value.id}/affecter-boutiques`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}`, Accept: 'application/json' },
      body: { boutiques: selectedBoutiques }
    })
    affectationSuccess.value = res?.message || "Produit affecté aux boutiques avec succès !"
    setTimeout(() => {
      isAffecterBoutiquesModalOpen.value = false
    }, 1500)
  } catch (e) {
    affectationError.value = e?.data?.message || e?.message || "Erreur lors de l'affectation."
  } finally {
    savingBoutiquesAffectation.value = false
  }
}

const triggerConfirmModal = (title, message, actionFn) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmAction.value = actionFn
  isConfirmModalOpen.value = true
}

const executeConfirmAction = async () => {
  if (confirmAction.value) {
    await confirmAction.value()
  }
  isConfirmModalOpen.value = false
}

const currentStep = ref(1)
const totalSteps = 6
const stepTitles = ['Infos Générales', 'Utilisation', 'Images', 'Prix & Stock', 'Catégories BDD', 'SEO & Statut']

const products = ref([])
const categoriesList = ref([])
const imagesList = ref([])
const mainImageFile = ref(null)
const mainImagePreview = ref('')

const filters = ref({
  search: '',
  category: '',
  status: 'tous',
  stockState: 'tous'
})

const form = ref({
  nom_commercial: '',
  description: '',
  composition: '',
  principes_actifs: '',
  mode_emploi: '',
  dosage_recommande: '',
  precautions_usage: '',
  contre_indications: '',
  prix_unitaire: 18500,
  unite_mesure: 'sac 50kg',
  stock_disponible: 0,
  stock_alerte: 10,
  poids: null,
  dimensions: '',
  url_image: '',
  selectedCategories: [],
  categorie_principale: null,
  statut: 'actif',
  est_en_vedette: false,
  slug: '',
  meta_title: '',
  meta_description: ''
})

const poidsValeur = ref(null)
const poidsUnite = ref('kg')

const updateFormPoids = () => {
  if (poidsValeur.value === null || poidsValeur.value === undefined || poidsValeur.value === '' || isNaN(Number(poidsValeur.value))) {
    form.value.poids = null
    return
  }
  const val = Number(poidsValeur.value)
  if (poidsUnite.value === 'g') {
    form.value.poids = Number((val / 1000).toFixed(4))
  } else {
    form.value.poids = val
  }
}

const onPoidsUniteChange = () => {
  if (poidsValeur.value !== null && poidsValeur.value !== undefined && poidsValeur.value !== '' && !isNaN(Number(poidsValeur.value))) {
    const val = Number(poidsValeur.value)
    if (poidsUnite.value === 'g') {
      poidsValeur.value = Math.round(val * 1000)
    } else {
      poidsValeur.value = Number((val / 1000).toFixed(4))
    }
  }
  updateFormPoids()
}

const poidsEquivalentText = computed(() => {
  if (poidsValeur.value === null || poidsValeur.value === undefined || poidsValeur.value === '' || isNaN(Number(poidsValeur.value))) {
    return ''
  }
  const val = Number(poidsValeur.value)
  if (poidsUnite.value === 'g') {
    const inKg = Number((val / 1000).toFixed(4))
    return `${inKg} kg`
  } else {
    const inG = Math.round(val * 1000)
    return `${inG.toLocaleString('fr-FR')} g`
  }
})

const formatPoidsDisplay = (poidsInKg) => {
  if (poidsInKg === null || poidsInKg === undefined || poidsInKg === '') return 'Non spécifié'
  const p = Number(poidsInKg)
  if (isNaN(p) || p <= 0) return 'Non spécifié'
  if (p < 1) {
    const g = Math.round(p * 1000)
    return `${g} g (${p} kg)`
  }
  const g = Math.round(p * 1000)
  return `${p} kg (${g.toLocaleString('fr-FR')} g)`
}

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const getImgUrl = (img) => getImageUrl(img, fallbackImage)

const extractProduitFromApiResponse = (res) => {
  if (!res || typeof res !== 'object') return null
  const direct = res?.data?.produit || res?.produit || res?.data?.data?.produit
  if (direct && (direct.nom_commercial || direct.slug || direct.id)) {
    return direct
  }
  const obj = res?.data?.data || res?.data || res
  if (obj && (obj.nom_commercial || obj.slug || obj.id)) {
    return obj
  }
  return null
}

const getPublicLink = (prod) => {
  if (!prod) return '/produits'
  const s = String(prod.slug || prod.id)
  if (!s || s === 'undefined' || s === 'null') return '/produits'
  if (s.startsWith('http')) return s
  const cleanSlug = s.replace(/^\/produits\//, '').replace(/^\//, '')
  if (!cleanSlug) return '/produits'
  return `/produits/${cleanSlug}`
}

const isCategorySelected = (catId) => {
  return form.value.selectedCategories.includes(Number(catId))
}

const toggleCategory = (catId) => {
  const numId = Number(catId)
  const idx = form.value.selectedCategories.indexOf(numId)
  if (idx > -1) {
    form.value.selectedCategories.splice(idx, 1)
  } else {
    form.value.selectedCategories.push(numId)
  }
  if (!form.value.categorie_principale && form.value.selectedCategories.length > 0) {
    form.value.categorie_principale = form.value.selectedCategories[0]
  }
}

const getProductCategories = (prod) => {
  if (!prod) return [{ id: 1, nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn' }]
  if (Array.isArray(prod.categories) && prod.categories.length > 0) {
    return prod.categories.map(c => ({
      id: Number(c.id || c),
      nom: c.nom || c.name || c.slug || 'Catégorie',
      icon: c.icon || 'fa-solid fa-wheat-awn'
    }))
  }
  if (prod.categorie) {
    return [{
      id: Number(prod.categorie.id || prod.categorie),
      nom: prod.categorie.nom || prod.categorie.name || 'Catégorie',
      icon: prod.categorie.icon || 'fa-solid fa-wheat-awn'
    }]
  }
  if (prod.categorie_id && categoriesList.value.length > 0) {
    const match = categoriesList.value.find(c => Number(c.id) === Number(prod.categorie_id))
    if (match) return [match]
  }
  return [{ id: 1, nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn' }]
}

const isFilterActive = computed(() => {
  return !!filters.value.search.trim() || !!filters.value.category || filters.value.status !== 'tous' || filters.value.stockState !== 'tous'
})

const activeProductsCount = computed(() => {
  return products.value.filter(p => p.statut === 'actif' || !p.statut).length
})

const lowStockProductsCount = computed(() => {
  return products.value.filter(p => (p.stock_disponible || 0) <= (p.stock_alerte || 10)).length
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (filters.value.search.trim()) {
      const q = filters.value.search.toLowerCase()
      const matchName = p.nom_commercial?.toLowerCase().includes(q)
      const matchSlug = p.slug?.toLowerCase().includes(q)
      if (!matchName && !matchSlug) return false
    }

    if (filters.value.category) {
      const catIdNum = Number(filters.value.category)
      const catMatch = (p.categories || []).some(c => Number(c.id || c) === catIdNum || c.slug === filters.value.category) || Number(p.categorie_id) === catIdNum
      if (!catMatch) return false
    }

    if (filters.value.status !== 'tous') {
      if ((p.statut || 'actif') !== filters.value.status) return false
    }

    if (filters.value.stockState === 'normal') {
      if ((p.stock_disponible || 0) <= (p.stock_alerte || 10)) return false
    } else if (filters.value.stockState === 'baisse') {
      if ((p.stock_disponible || 0) > (p.stock_alerte || 10) || (p.stock_disponible || 0) <= 0) return false
    } else if (filters.value.stockState === 'rupture') {
      if ((p.stock_disponible || 0) > 0) return false
    }

    return true
  })
})

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: 'tous',
    stockState: 'tous'
  }
}

const fetchCategoriesFromDb = async () => {
  try {
    let list = []
    try {
      const resAdmin = await $fetch(`${config.public.apiBaseUrl}/admin/categories`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      list = resAdmin?.data?.data || resAdmin?.data || resAdmin || []
    } catch (e1) {
      const resPublic = await $fetch(`${config.public.apiBaseUrl}/categories`)
      list = resPublic?.data?.data || resPublic?.data || resPublic || []
    }

    if (Array.isArray(list) && list.length > 0) {
      const flat = []
      list.forEach(c => {
        flat.push({
          id: Number(c.id),
          slug: String(c.slug || c.id),
          nom: c.nom || c.name || c.slug,
          icon: c.icon || (c.parent_id ? 'fa-solid fa-tag' : 'fa-solid fa-wheat-awn')
        })
        if (Array.isArray(c.enfants) && c.enfants.length > 0) {
          c.enfants.forEach(child => {
            flat.push({
              id: Number(child.id),
              slug: String(child.slug || child.id),
              nom: child.nom || child.name,
              icon: child.icon || 'fa-solid fa-tag'
            })
          })
        }
      })
      const map = new Map()
      flat.forEach(c => map.set(c.id, c))
      categoriesList.value = Array.from(map.values())
    } else {
      categoriesList.value = fallbackDbCategories
    }
  } catch (e) {
    categoriesList.value = fallbackDbCategories
  }
}

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/produits?per_page=100`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const list = res?.data?.data || res?.data || res || []
    if (Array.isArray(list) && list.length > 0) {
      products.value = list
    } else {
      products.value = fallbackAdminProducts
    }
  } catch (e) {
    products.value = fallbackAdminProducts
  }
  isLoading.value = false
}

const validateCurrentStep = () => {
  stepErrorMessage.value = ''
  if (currentStep.value === 1) {
    if (!form.value.nom_commercial || !form.value.nom_commercial.trim()) {
      stepErrorMessage.value = 'Le Nom commercial est obligatoire à l\'Étape 1.'
      return false
    }
  } else if (currentStep.value === 4) {
    if (!form.value.prix_unitaire || form.value.prix_unitaire <= 0) {
      stepErrorMessage.value = 'Le Prix unitaire doit être supérieur à 0 FCFA à l\'Étape 4.'
      return false
    }
    if (!form.value.unite_mesure) {
      stepErrorMessage.value = 'L\'Unité de mesure est obligatoire à l\'Étape 4.'
      return false
    }
  }
  return true
}

const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

const goToStep = (targetStep) => {
  if (targetStep > currentStep.value) {
    if (!validateCurrentStep()) return
  }
  stepErrorMessage.value = ''
  currentStep.value = targetStep
}

const populateFormFromProd = (prod) => {
  imagesList.value = (prod.images && prod.images.length > 0)
    ? prod.images.map(img => ({ preview: getImgUrl(img.url_image), raw: img.url_image }))
    : (prod.url_image ? [{ preview: getImgUrl(prod.url_image), raw: prod.url_image }] : [])

  mainImageFile.value = null
  mainImagePreview.value = ''

  // Intelligent category extraction matching String, Number & Name
  const extractedIds = []

  if (Array.isArray(prod?.categories)) {
    prod.categories.forEach(c => {
      let id = typeof c === 'object' ? c.id : c
      if (id) {
        const num = Number(id)
        if (!isNaN(num) && num > 0 && !extractedIds.includes(num)) {
          extractedIds.push(num)
        } else {
          const found = categoriesList.value.find(cat => cat.slug === String(id) || cat.nom.toLowerCase() === String(id).toLowerCase())
          if (found && !extractedIds.includes(found.id)) extractedIds.push(found.id)
        }
      }
    })
  }

  if (prod?.categorie_id) {
    const num = Number(prod.categorie_id)
    if (!isNaN(num) && num > 0 && !extractedIds.includes(num)) {
      extractedIds.push(num)
    }
  }

  if (prod?.categorie) {
    const c = prod.categorie
    const num = Number(typeof c === 'object' ? c.id : c)
    if (!isNaN(num) && num > 0 && !extractedIds.includes(num)) {
      extractedIds.push(num)
    }
  }

  // Name keyword fallback (Urée/NPK -> Intrants #1, Insecticide -> Phyto #2, etc.)
  if (extractedIds.length === 0 && prod?.nom_commercial) {
    const name = prod.nom_commercial.toLowerCase()
    if (name.includes('urée') || name.includes('engrais') || name.includes('npk')) {
      const intrantsCat = categoriesList.value.find(c => c.slug.includes('intrants') || c.nom.toLowerCase().includes('intrants') || c.id === 1)
      if (intrantsCat) extractedIds.push(intrantsCat.id)
    } else if (name.includes('insecticide') || name.includes('herbicides') || name.includes('phyto') || name.includes('katana')) {
      const phytoCat = categoriesList.value.find(c => c.slug.includes('phyto') || c.nom.toLowerCase().includes('phyto') || c.id === 2)
      if (phytoCat) extractedIds.push(phytoCat.id)
    } else if (name.includes('irrigation') || name.includes('goutte') || name.includes('tuyau')) {
      const irrigCat = categoriesList.value.find(c => c.slug.includes('irrigation') || c.id === 3)
      if (irrigCat) extractedIds.push(irrigCat.id)
    } else if (name.includes('semence') || name.includes('maïs') || name.includes('graine')) {
      const semCat = categoriesList.value.find(c => c.slug.includes('semence') || c.id === 4)
      if (semCat) extractedIds.push(semCat.id)
    }
  }

  if (extractedIds.length === 0 && categoriesList.value.length > 0) {
    extractedIds.push(categoriesList.value[0].id)
  }

  const catMainId = prod.categories?.find(c => c.pivot?.principale)?.id 
    ? Number(prod.categories.find(c => c.pivot?.principale).id) 
    : (extractedIds[0] || (categoriesList.value[0]?.id || 1))

  const pKg = prod.poids !== null && prod.poids !== undefined ? Number(prod.poids) : null

  form.value = {
    nom_commercial: prod.nom_commercial || '',
    description: prod.description || '',
    composition: prod.composition || '',
    principes_actifs: prod.principes_actifs || '',
    mode_emploi: prod.mode_emploi || '',
    dosage_recommande: prod.dosage_recommande || '',
    precautions_usage: prod.precautions_usage || '',
    contre_indications: prod.contre_indications || '',
    prix_unitaire: Number(prod.prix_unitaire || 0),
    unite_mesure: prod.unite_mesure || 'sac 50kg',
    stock_disponible: Number(prod.stock_disponible || 0),
    stock_alerte: Number(prod.stock_alerte || 10),
    poids: pKg,
    dimensions: prod.dimensions || '',
    url_image: prod.image_principale?.url_image || prod.url_image || '',
    selectedCategories: extractedIds,
    categorie_principale: catMainId,
    statut: prod.statut || 'actif',
    est_en_vedette: !!(prod.est_en_vedette || prod.featured),
    slug: prod.slug || '',
    meta_title: prod.meta_title || (prod.nom_commercial ? `${prod.nom_commercial} - AgroShop Togo` : ''),
    meta_description: prod.meta_description || prod.description || 'Achetez en ligne au Togo au meilleur prix certifié.'
  }

  if (pKg !== null && !isNaN(pKg) && pKg > 0) {
    if (pKg < 1) {
      poidsUnite.value = 'g'
      poidsValeur.value = Math.round(pKg * 1000)
    } else {
      poidsUnite.value = 'kg'
      poidsValeur.value = pKg
    }
  } else {
    poidsUnite.value = 'kg'
    poidsValeur.value = null
  }
}

const openAddModal = () => {
  editingId.value = null
  currentStep.value = 1
  stepErrorMessage.value = ''
  imagesList.value = []
  mainImageFile.value = null
  mainImagePreview.value = ''
  
  const defaultCatId = categoriesList.value[0]?.id || 1

  form.value = {
    nom_commercial: '',
    description: '',
    composition: '',
    principes_actifs: '',
    mode_emploi: '',
    dosage_recommande: '',
    precautions_usage: '',
    contre_indications: '',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 100,
    stock_alerte: 10,
    poids: 50,
    dimensions: '',
    url_image: '',
    selectedCategories: [defaultCatId],
    categorie_principale: defaultCatId,
    statut: 'actif',
    est_en_vedette: false,
    slug: '',
    meta_title: '',
    meta_description: ''
  }
  poidsUnite.value = 'kg'
  poidsValeur.value = 50
  isModalOpen.value = true
}

const openEditModal = async (prod) => {
  editingId.value = prod.id
  currentStep.value = 1
  stepErrorMessage.value = ''
  
  populateFormFromProd(prod)
  isModalOpen.value = true

  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const full = res?.data || res
    if (full && full.id) {
      populateFormFromProd(full)
    }
  } catch (e) {
    console.warn('Edit product fetch notice', e)
  }
}

const openDetailModal = async (prod) => {
  selectedProductDetail.value = { ...prod }
  isDetailModalOpen.value = true

  try {
    const slugOrId = prod.slug || prod.id
    const res = await $fetch(`${config.public.apiBaseUrl}/produits/${slugOrId}`)
    const fullData = extractProduitFromApiResponse(res)
    if (fullData && typeof fullData === 'object') {
      const imgPrincipale = fullData.image_principale || fullData.imagePrincipale || prod.image_principale
      selectedProductDetail.value = {
        ...prod,
        ...fullData,
        image_principale: imgPrincipale,
        url_image: fullData.url_image || imgPrincipale?.url_image || prod.url_image,
        categories: fullData.categories || prod.categories || [],
        description: fullData.description || prod.description,
        composition: fullData.composition || prod.composition,
        principes_actifs: fullData.principes_actifs || prod.principes_actifs,
        mode_emploi: fullData.mode_emploi || prod.mode_emploi,
        dosage_recommande: fullData.dosage_recommande || prod.dosage_recommande,
        precautions_usage: fullData.precautions_usage || prod.precautions_usage,
        contre_indications: fullData.contre_indications || prod.contre_indications,
        meta_title: fullData.meta_title || prod.meta_title,
        meta_description: fullData.meta_description || prod.meta_description,
        slug: fullData.slug || prod.slug
      }
    }
  } catch (e) {
    console.warn('API detail fetch notice', e)
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const confirmDelete = (prod) => {
  triggerConfirmModal(
    'Supprimer le produit',
    `Voulez-vous vraiment supprimer le produit "${prod.nom_commercial}" ? Cette action masquera le produit du catalogue.`,
    async () => {
      products.value = products.value.filter(p => p.id !== prod.id)
      try {
        await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.token}` }
        })
      } catch (e) {
        console.warn('Delete error', e)
      }
    }
  )
}

const handleMainImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  mainImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    mainImagePreview.value = e.target.result
    form.value.url_image = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleImageUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagesList.value.push({ file, preview: e.target.result })
      if (!form.value.url_image) {
        form.value.url_image = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const setAsMainImage = (img) => {
  if (img.file) {
    mainImageFile.value = img.file
    mainImagePreview.value = img.preview
  } else {
    mainImageFile.value = null
    mainImagePreview.value = img.preview
  }
  form.value.url_image = img.raw || img.preview
}

const removeImage = (idx) => {
  imagesList.value.splice(idx, 1)
}

const saveProduct = async () => {
  if (!validateCurrentStep()) return
  isSaving.value = true

  try {
    const formData = new FormData()

    if (editingId.value) {
      formData.append('_method', 'PUT')
    }

    formData.append('nom_commercial', form.value.nom_commercial || '')
    if (form.value.description) formData.append('description', form.value.description)
    if (form.value.composition) formData.append('composition', form.value.composition)
    if (form.value.principes_actifs) formData.append('principes_actifs', form.value.principes_actifs)
    if (form.value.mode_emploi) formData.append('mode_emploi', form.value.mode_emploi)
    if (form.value.dosage_recommande) formData.append('dosage_recommande', form.value.dosage_recommande)
    if (form.value.precautions_usage) formData.append('precautions_usage', form.value.precautions_usage)
    if (form.value.contre_indications) formData.append('contre_indications', form.value.contre_indications)

    formData.append('prix_unitaire', String(form.value.prix_unitaire || 0))
    formData.append('unite_mesure', form.value.unite_mesure || 'unité')
    formData.append('stock_disponible', String(form.value.stock_disponible || 0))
    formData.append('stock_alerte', String(form.value.stock_alerte || 10))

    if (form.value.poids) formData.append('poids', String(form.value.poids))
    if (form.value.dimensions) formData.append('dimensions', form.value.dimensions)
    if (form.value.url_image) formData.append('url_image', form.value.url_image)

    // Upload Main Image File if uploaded separately
    if (mainImageFile.value) {
      formData.append('image', mainImageFile.value)
      formData.append('image_principale', mainImageFile.value)
    }

    formData.append('statut', form.value.statut || 'actif')
    formData.append('featured', form.value.est_en_vedette ? '1' : '0')

    if (form.value.slug) formData.append('slug', form.value.slug)
    if (form.value.meta_title) formData.append('meta_title', form.value.meta_title)
    if (form.value.meta_description) formData.append('meta_description', form.value.meta_description)

    // Send numeric category IDs as array
    if (Array.isArray(form.value.selectedCategories) && form.value.selectedCategories.length > 0) {
      form.value.selectedCategories.forEach((catId) => {
        formData.append('categories[]', String(catId))
      })
    }
    if (form.value.categorie_principale) {
      formData.append('categorie_principale', String(form.value.categorie_principale))
    }

    // Append newly selected binary image files
    imagesList.value.forEach((imgObj) => {
      if (imgObj.file) {
        formData.append('images[]', imgObj.file)
      }
    })

    if (editingId.value) {
      const idx = products.value.findIndex(p => p.id === editingId.value)
      if (idx !== -1) {
        const catObjects = categoriesList.value.filter(c => form.value.selectedCategories.includes(Number(c.id)))
        const newUrl = mainImagePreview.value || form.value.url_image || products.value[idx].url_image
        products.value[idx] = {
          ...products.value[idx],
          ...form.value,
          url_image: newUrl,
          image_principale: { url_image: newUrl },
          categories: catObjects.length > 0 ? catObjects : products.value[idx].categories
        }
      }
      await $fetch(`${config.public.apiBaseUrl}/admin/produits/${editingId.value}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData
      })
    } else {
      await $fetch(`${config.public.apiBaseUrl}/admin/produits`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData
      })
    }

    // Refresh products list from DB
    await fetchProducts()

  } catch (e) {
    console.error('Save product notice', e)
  }

  isSaving.value = false
  isModalOpen.value = false
}

const toggleFeatured = async (prod) => {
  const oldState = prod.est_en_vedette || prod.featured
  prod.est_en_vedette = !oldState
  prod.featured = !oldState
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}/toggle-featured`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch (e) {
    console.warn(e)
  }
}

// ====================================================================
// 🤖 FONCTIONS IA : Fiche produit + Validation anomalies
// ====================================================================
const genererFicheProduitIA = async () => {
  if (!form.value.nom_commercial?.trim()) {
    stepErrorMessage.value = 'Saisissez d\'abord un Nom commercial pour générer la fiche technique IA.'
    return
  }
  isAiGeneratingFiche.value = true
  aiFicheMessage.value = ''
  stepErrorMessage.value = ''

  try {
    const payload = {
      nom_commercial: form.value.nom_commercial.trim(),
      prix_unitaire: form.value.prix_unitaire || null,
      unite_mesure: form.value.unite_mesure || '',
      categories_ids: Array.isArray(form.value.selectedCategories) && form.value.selectedCategories.length > 0
        ? form.value.selectedCategories.map(c => Number(c)).filter(c => c > 0)
        : [],
    }
    const catPrincipale = categoriesList.value.find(c => Number(c.id) === Number(form.value.categorie_principale))
    if (catPrincipale) payload.categorie_nom = catPrincipale.nom

    const res = await $fetch(`${config.public.apiBaseUrl}/admin/ai/produits/generer-fiche`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = res?.data || res
    if (data && typeof data === 'object') {
      if (data.description) form.value.description = String(data.description)
      if (data.composition) form.value.composition = String(data.composition)
      if (data.principes_actifs) form.value.principes_actifs = String(data.principes_actifs)
      if (data.mode_emploi) form.value.mode_emploi = String(data.mode_emploi)
      if (data.dosage_recommande) form.value.dosage_recommande = String(data.dosage_recommande)
      if (data.precautions_usage) form.value.precautions_usage = String(data.precautions_usage)
      if (data.contre_indications) form.value.contre_indications = String(data.contre_indications)
      if (data.meta_title) form.value.meta_title = String(data.meta_title).slice(0, 200)
      if (data.meta_description) form.value.meta_description = String(data.meta_description).slice(0, 160)
      if (typeof data.suggestion_stock_alerte === 'number' && form.value.stock_alerte <= 0) {
        form.value.stock_alerte = data.suggestion_stock_alerte
      }
      if (typeof data.suggestion_poids_kg === 'number' && !form.value.poids) {
        const pKg = data.suggestion_poids_kg
        form.value.poids = pKg
        if (pKg < 1) {
          poidsUnite.value = 'g'
          poidsValeur.value = Math.round(pKg * 1000)
        } else {
          poidsUnite.value = 'kg'
          poidsValeur.value = pKg
        }
      }
      if (data.suggestion_dimensions && !form.value.dimensions) {
        form.value.dimensions = String(data.suggestion_dimensions)
      }
      aiFicheMessage.value = res?.message || 'Fiche technique générée avec succès !'
      aiValidationWarnings.value = []
      aiValidationInfos.value = []
    } else {
      stepErrorMessage.value = 'Aucune donnée retournée par l\'IA. Réessayez.'
    }
  } catch (e) {
    stepErrorMessage.value = e?.data?.message || e?.message || 'Erreur IA lors de la génération de la fiche.'
  } finally {
    isAiGeneratingFiche.value = false
  }
}

const validerSaisieIA = async () => {
  isAiValidating.value = true
  aiValidationWarnings.value = []
  aiValidationInfos.value = []
  try {
    const catPrincipale = categoriesList.value.find(c => Number(c.id) === Number(form.value.categorie_principale))
    const payload = {
      nom_commercial: form.value.nom_commercial || '',
      prix_unitaire: form.value.prix_unitaire || 0,
      stock_disponible: form.value.stock_disponible ?? null,
      stock_alerte: form.value.stock_alerte ?? null,
      categorie_principale_nom: catPrincipale?.nom || '',
      unite_mesure: form.value.unite_mesure || '',
      produit_id: editingId.value ? Number(editingId.value) : null,
    }
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/ai/produits/valider-saisie`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    aiValidationWarnings.value = res?.data?.warnings || []
    aiValidationInfos.value = res?.data?.infos || []
  } catch (e) {
    console.warn('Validation error', e)
  } finally {
    isAiValidating.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategoriesFromDb()
})

const fallbackDbCategories = [
  { id: 1, slug: 'intrants-agricoles', nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn' },
  { id: 2, slug: 'produits-phytosanitaires', nom: 'Produits Phytosanitaires', icon: 'fa-solid fa-bug' },
  { id: 3, slug: 'systemes-irrigation', nom: "Systèmes d'Irrigation", icon: 'fa-solid fa-droplet' },
  { id: 4, slug: 'semences', nom: 'Semences Certifiées', icon: 'fa-solid fa-seedling' },
  { id: 5, slug: 'machines-agricoles', nom: 'Machines Agricoles', icon: 'fa-solid fa-tractor' },
  { id: 6, slug: 'quincaillerie', nom: 'Quincaillerie & Outillage', icon: 'fa-solid fa-wrench' },
  { id: 7, slug: 'engrais-npk', nom: 'Engrais NPK', icon: 'fa-solid fa-flask' },
  { id: 8, slug: 'uree', nom: 'Urée', icon: 'fa-solid fa-vial' },
  { id: 9, slug: 'engrais-organiques', nom: 'Engrais Organiques', icon: 'fa-solid fa-leaf' },
  { id: 10, slug: 'insecticides', nom: 'Insecticides', icon: 'fa-solid fa-spray-can' },
  { id: 11, slug: 'fongicides', nom: 'Fongicides', icon: 'fa-solid fa-shield-halved' },
  { id: 12, slug: 'herbicides', nom: 'Herbicides', icon: 'fa-solid fa-scissors' },
  { id: 13, slug: 'nematicides', nom: 'Nématicides', icon: 'fa-solid fa-virus' },
  { id: 14, slug: 'outillage-manuel', nom: 'Outillage Manuel', icon: 'fa-solid fa-hammer' },
  { id: 15, slug: 'equipements-protection', nom: 'Équipements & Protection', icon: 'fa-solid fa-hard-hat' }
]

const fallbackAdminProducts = [
  {
    id: 1,
    nom_commercial: 'Urée YARA 46% N',
    slug: 'uree-yara-46-n',
    prix_unitaire: 15000,
    unite_mesure: 'sac 50kg',
    stock_disponible: 1000,
    stock_alerte: 20,
    poids: 50,
    dimensions: '80cm x 50cm x 20cm',
    statut: 'actif',
    est_en_vedette: true,
    featured: true,
    url_image: 'storage/produits/urea.jpg',
    description: 'Urée minérale certifiée titrant à 46% d\'azote assimilable. Engrais azoté de référence pour stimuler la croissance vegetative et la synthèse des protéines du maïs, du riz et du coton au Togo.',
    composition: '46% Azote total (N) sous forme uréique hautement solulable.',
    principes_actifs: 'Azote ammoniacal à diffusion progressive dans le complexe argilo-humique.',
    mode_emploi: 'Appliquer sur sol légèrement humide lors du premier ou deuxième sarclage. Enfouir légèrement.',
    dosage_recommande: '100 kg à 150 kg par hectare selon la spéculation et l\'état du sol.',
    precautions_usage: 'Stocker à l\'abri de l\'humidité sous bâche ou dans un entrepôt ventilé.',
    contre_indications: 'Ne pas appliquer sur sol inondé ni mélanger avec la chaux vive.',
    meta_title: 'Urée YARA 46% N Sac 50kg - Prix officiel Togo',
    meta_description: 'Urée 46% N certifiée Yara au Togo. Idéal pour riziculture et maïsiculture.',
    categories: [{ id: 1, nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn' }]
  },
  {
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 750,
    stock_alerte: 15,
    poids: 50,
    dimensions: '80cm x 50cm x 20cm',
    statut: 'actif',
    est_en_vedette: true,
    featured: true,
    url_image: 'storage/produits/npk.jpg',
    description: 'Engrais minéral complexe équilibré NPK 15-15-15 favorisant l\'enracinement, le tallage et la floraison des cultures céréalières et maraîchères.',
    composition: '15% Azote (N), 15% Anhydride Phosphorique (P2O5), 15% Oxyde de Potassium (K2O) + Oligo-éléments.',
    principes_actifs: 'Granulés de couleur rosée d\'une grande homogénéité physique.',
    mode_emploi: 'Épandage au semis ou au repiquage en apport de fond.',
    dosage_recommande: '200 kg / hectare.',
    precautions_usage: 'Tenir hors de portée des enfants et du bétail.',
    contre_indications: 'Éviter le contact direct des granulés avec la semence humide.',
    meta_title: 'Engrais NPK 15-15-15 SuperFert Sac 50kg Togo',
    meta_description: 'Engrais complet NPK 15-15-15 pour toutes cultures au Togo.',
    categories: [{ id: 1, nom: 'Intrants Agricoles (Engrais)', icon: 'fa-solid fa-wheat-awn' }]
  },
  {
    id: 3,
    nom_commercial: 'Insecticide Katana 50 EC',
    slug: 'insecticide-katana-50-ec',
    prix_unitaire: 7500,
    unite_mesure: 'flacon 1L',
    stock_disponible: 300,
    stock_alerte: 10,
    poids: 1,
    dimensions: '10cm x 10cm x 25cm',
    statut: 'actif',
    est_en_vedette: false,
    featured: false,
    url_image: 'storage/produits/katana.jpg',
    description: 'Insecticide polyvalent à spectre large à effet de choc et rémanence prolongée pour la protection des cultures contre les chenilles légionnaires et pucerons.',
    composition: '50 g/L Emamectine Benzoate + Lambda-Cyhalothrine.',
    principes_actifs: 'Action par contact et ingestion bloquant le système nerveux des ravageurs.',
    mode_emploi: 'Diluer le produit dans l\'eau propre du pulvérisateur et traiter dès l\'apparition des premiers symptômes.',
    dosage_recommande: '1 Litre par hectare dans 200 Litres d\'eau.',
    precautions_usage: 'Porter des équipements de protection individuelle (masque, gants, combinaison).',
    contre_indications: 'Ne pas traiter à proximité d\'un cours d\'eau ni durant le pic de présence des abeilles.',
    meta_title: 'Katana 50 EC Insecticide Flacon 1L AgroShop Togo',
    meta_description: 'Protection phytosanitaire efficace contre les ravageurs du maïs et légumes.',
    categories: [{ id: 2, nom: 'Produits Phytosanitaires', icon: 'fa-solid fa-bug' }]
  },
  {
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    stock_disponible: 500,
    stock_alerte: 10,
    poids: 5,
    dimensions: '30cm x 20cm x 10cm',
    statut: 'actif',
    est_en_vedette: true,
    featured: true,
    url_image: 'storage/produits/mais_pan53.jpg',
    description: 'Variété de maïs hybride à haut rendement tolérante à la sécheresse et aux viroses de la zone guinéenne et soudanienne.',
    composition: 'Semences certifiées de Maïs PAN 53 traitées au fongicide/insecticide de conservation.',
    principes_actifs: 'Taux de germination certifié > 95%.',
    mode_emploi: 'Semer 2 graines par poquet à 75 cm inter-lignes et 40 cm sur la ligne.',
    dosage_recommande: '25 kg de semences par hectare.',
    precautions_usage: 'Garder dans l\'emballage d\'origine au sec.',
    contre_indications: 'Graines traitées : ne pas consommer ni donner à manger aux animaux.',
    meta_title: 'Semence Maïs Hybride PAN 53 Sac 5kg - AgroShop',
    meta_description: 'Semence certifiée maïs hybride PAN 53 pour hauts rendements au Togo.',
    categories: [{ id: 4, nom: 'Semences Certifiées', icon: 'fa-solid fa-seedling' }]
  },
  {
    id: 5,
    nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²',
    slug: 'kit-irrigation-goutte-a-goutte-500m2',
    prix_unitaire: 85000,
    unite_mesure: 'kit complet',
    stock_disponible: 45,
    stock_alerte: 5,
    poids: 15,
    dimensions: '60cm x 60cm x 40cm',
    statut: 'actif',
    est_en_vedette: true,
    featured: true,
    url_image: 'storage/produits/irrigation_kit.jpg',
    description: 'Kit complet de précision prêt-à-monter pour l\'irrigation économe de 500 mètres carrés de cultures maraîchères (piment, tomate, oignon, gombo).',
    composition: 'Tuyau PE polyéthylène, gaines goutte-à-goutte 16mm avec goutteurs auto-régulants, filtre à disque, vannes et raccordements.',
    principes_actifs: 'Économie d\'eau de 60% par rapport à l\'arrosage manuel.',
    mode_emploi: 'Raccorder à un cuve surélevée d\'au moins 1,5m ou à une motopompe.',
    dosage_recommande: 'Utilisable en continu.',
    precautions_usage: 'Nettoyer le filtre à disque régulièrement.',
    contre_indications: 'Ne pas utiliser d\'eau limoneuse sans pré-filtration.',
    meta_title: 'Kit Irrigation Goutte-à-Goutte 500m² Togo AgroShop',
    meta_description: 'Kit d\'irrigation goutte à goutte complet pour maraîchage au Togo.',
    categories: [{ id: 3, nom: "Systèmes d'Irrigation", icon: 'fa-solid fa-droplet' }]
  },
  {
    id: 6,
    nom_commercial: 'Atomiseur STIHL SR 450',
    slug: 'atomiseur-stihl-sr-450',
    prix_unitaire: 515000,
    unite_mesure: 'unité',
    stock_disponible: 25,
    stock_alerte: 2,
    poids: 12.8,
    dimensions: '50cm x 40cm x 70cm',
    statut: 'actif',
    est_en_vedette: true,
    featured: true,
    url_image: 'storage/produits/stihl.jpg',
    description: 'Pulvérisateur thermique à dos STIHL SR 450 à moteur 2-MIX très puissant avec mécanisme de conversion 2-en-1 pour les liquides et les granulés.',
    composition: 'Moteur essence 2-temps STIHL 63.3 cm³, réservoir de 14 Litres.',
    principes_actifs: 'Portée horizontale jusqu\'à 14.5 mètres.',
    mode_emploi: 'Mélanger l\'essence Super avec 2% d\'huile 2T STIHL.',
    dosage_recommande: 'Utiliser selon la notice constructeur STIHL.',
    precautions_usage: 'Porter un casque antibruit et des lunettes de protection.',
    contre_indications: 'Ne pas faire tourner le moteur dans un local fermé.',
    meta_title: 'Atomiseur STIHL SR 450 Prix Togo AgroShop',
    meta_description: 'Atomiseur professionnel STIHL SR 450 garanti d\'origine.',
    categories: [{ id: 5, nom: 'Machines Agricoles', icon: 'fa-solid fa-tractor' }]
  }
]
</script>

<style scoped>
.custom-modal-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-modal-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 12px 0;
}
.custom-modal-scroll::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 9999px;
}
.custom-modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
