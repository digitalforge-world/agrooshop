<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Store class="w-6 h-6 text-emerald-600" />
          <span>Gestion des Boutiques</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">Gérez vos différentes boutiques (Quincaillerie, Intrants / Semences, ou Mixte)</p>
      </div>

      <button 
        @click="openModal()" 
        class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/10 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Nouvelle Boutique</span>
      </button>
    </div>

    <!-- Stats summary badges -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Boutiques</p>
          <h2 class="text-2xl font-black text-slate-900 mt-1">{{ boutiques.length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Store class="w-5 h-5" />
        </div>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actives</p>
          <h2 class="text-2xl font-black text-emerald-700 mt-1">{{ boutiques.filter(b => b.is_active).length }}</h2>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <CheckCircle class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Boutiques List Table -->
    <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Liste des Boutiques</h2>
        <div class="relative w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4">Nom de la Boutique</th>
              <th class="px-6 py-4">Type(s) de Boutique</th>
              <th class="px-6 py-4">Localisation</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4">📊 Prévision IA</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Chargement...
              </td>
            </tr>
            <tr v-else-if="filteredBoutiques.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                <Store class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Aucune boutique trouvée</p>
                <button @click="openModal()" class="mt-3 text-emerald-700 hover:underline text-xs font-bold">+ Créer la première boutique</button>
              </td>
            </tr>
            <tr v-for="boutique in filteredBoutiques" :key="boutique.id" class="hover:bg-emerald-50/30 transition-colors">
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 text-sm">{{ boutique.nom }}</p>
                <p class="text-[11px] text-slate-400">Créée le {{ new Date(boutique.created_at).toLocaleDateString('fr-FR') }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="t in getTypesList(boutique)" 
                    :key="t"
                    :class="t === 'quincaillerie' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'" 
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize inline-flex items-center gap-1"
                  >
                    <Hammer v-if="t === 'quincaillerie'" class="w-3 h-3 text-orange-600" />
                    <Sprout v-else class="w-3 h-3 text-emerald-600" />
                    {{ t === 'quincaillerie' ? 'Quincaillerie' : 'Agricole / Semences' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ boutique.localisation || '—' }}
              </td>
              <td class="px-6 py-4">
                <span :class="boutique.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'" class="px-2.5 py-1 rounded-full text-[10px] font-bold border">
                  {{ boutique.is_active ? 'Active' : 'Désactivée' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  @click="openPrevision(boutique)"
                  :disabled="!boutique.is_active"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                  title="Voir la prévision IA de réapprovisionnement"
                >
                  <BarChart3 class="w-3 h-3 text-violet-600" />
                  <Sparkles class="w-3 h-3" />
                  Prévision
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="inline-flex items-center gap-1.5 justify-end">
                  <!-- Bouton Approvisionner -->
                  <button 
                    @click="openApprovisionnementModal(boutique)" 
                    :disabled="!boutique.is_active"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    title="Approvisionner le stock de cette boutique"
                  >
                    <Truck class="w-3.5 h-3.5" />
                    <span>Approvisionner</span>
                  </button>

                  <button 
                    @click="openModal(boutique)" 
                    class="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl transition-all cursor-pointer border border-slate-200/60 hover:border-emerald-200 shadow-2xs"
                    title="Éditer la boutique"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button 
                    @click="toggleStatut(boutique)" 
                    class="p-2 rounded-xl transition-all cursor-pointer border shadow-2xs"
                    :class="boutique.is_active ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'"
                    :title="boutique.is_active ? 'Désactiver la boutique' : 'Activer la boutique'"
                  >
                    <Power v-if="boutique.is_active" class="w-4 h-4" />
                    <CheckCircle2 v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===================== MODAL Ajouter / Éditer ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" @click.self="closeModal">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Store class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">{{ isEditing ? 'Modifier la Boutique' : 'Nouvelle Boutique' }}</h2>
                  <p class="text-[11px] text-slate-500">{{ isEditing ? 'Modifiez les informations de la boutique' : 'Créez une nouvelle succursale' }}</p>
                </div>
              </div>
              <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Body / Form -->
            <form @submit.prevent="saveBoutique" class="p-6 space-y-4">
              
              <!-- Nom -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nom de la Boutique <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nom"
                  type="text"
                  required
                  placeholder="Ex: AgroShop Centrale Lomé"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                />
              </div>

              <!-- Types (Multi-sélection : Quincaillerie et/ou Agricole) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Type(s) de Produits Vendus <span class="text-red-500">*</span>
                  <span class="ml-2 text-slate-400 normal-case font-normal">(cochez un ou les deux)</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <!-- Option Quincaillerie -->
                  <div
                    @click="toggleType('quincaillerie')"
                    :class="form.types.includes('quincaillerie') ? 'border-orange-500 bg-orange-50/80 text-orange-800 font-bold' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'"
                    class="p-3.5 rounded-xl border-2 text-xs transition-all flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input 
                      type="checkbox" 
                      :checked="form.types.includes('quincaillerie')" 
                      class="w-4 h-4 rounded text-orange-600 accent-orange-600"
                    />
                    <div class="flex items-center gap-2">
                      <Hammer class="w-4 h-4 text-orange-600" />
                      <span>Quincaillerie</span>
                    </div>
                  </div>

                  <!-- Option Agricole / Semences -->
                  <div
                    @click="toggleType('agricole')"
                    :class="form.types.includes('agricole') ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-bold' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'"
                    class="p-3.5 rounded-xl border-2 text-xs transition-all flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input 
                      type="checkbox" 
                      :checked="form.types.includes('agricole')" 
                      class="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                    />
                    <div class="flex items-center gap-2">
                      <Sprout class="w-4 h-4 text-emerald-600" />
                      <span>Semences & Engrais</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Localisation -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Localisation</label>
                <input
                  v-model="form.localisation"
                  type="text"
                  placeholder="Ex: Lomé Centre, Quartier Bè, Agoè..."
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description (optionnel)</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  placeholder="Informations complémentaires sur la boutique..."
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Statut (edit only) -->
              <div v-if="isEditing" class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span class="text-xs font-bold text-slate-700">Boutique Active</span>
                <button
                  type="button"
                  @click="form.is_active = !form.is_active"
                  :class="form.is_active ? 'bg-emerald-600' : 'bg-slate-300'"
                  class="relative w-10 h-5 rounded-full transition-colors"
                >
                  <span :class="form.is_active ? 'translate-x-5' : 'translate-x-0.5'" class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-xs"></span>
                </button>
              </div>

              <!-- Error -->
              <div v-if="formError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle class="w-4 h-4 flex-shrink-0" />
                {{ formError }}
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 pt-2">
                <button type="button" @click="closeModal" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                  Annuler
                </button>
                <button type="submit" :disabled="saving || !form.nom || form.types.length === 0" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{{ saving ? 'Enregistrement...' : (isEditing ? 'Mettre à Jour' : 'Créer la Boutique') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL PRÉVISION IA RÉAPPRO ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showPrevisionModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" @click.self="showPrevisionModal = false">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            
            <div class="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-900/20">
                  <BarChart3 class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
                    📊 Prévision IA — Réapprovisionnement
                  </h2>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    Boutique : <span class="font-bold text-slate-700">{{ selectedBoutiqueForPrevision?.nom || '-' }}</span>
                    {{ selectedBoutiqueForPrevision?.localisation ? ` · ${selectedBoutiqueForPrevision.localisation}` : '' }}
                  </p>
                </div>
              </div>
              <button @click="showPrevisionModal = false" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div v-if="previsionLoading" class="p-12 text-center text-slate-500 font-mono text-xs flex-shrink-0">
              <div class="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Analyse IA en cours — Calcul des besoins de stock...
            </div>

            <div v-else class="overflow-y-auto p-5 space-y-5 flex-1">
              
              <!-- 3 mini stats KPI -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-1.5">
                    <AlertTriangle class="w-4 h-4 text-rose-600" />
                    <span class="text-[10px] font-bold uppercase tracking-wider text-rose-700">Produits prioritaires</span>
                  </div>
                  <p class="text-2xl font-black text-rose-700 font-mono">{{ previsionData.nombre_prioritaires }}</p>
                </div>

                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-1.5">
                    <Package class="w-4 h-4 text-emerald-600" />
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Coût estimé total</span>
                  </div>
                  <p class="text-2xl font-black text-emerald-700 font-mono">{{ Number(previsionData.total_estime || 0).toLocaleString('fr-FR') }} <span class="text-xs font-semibold text-emerald-600">FCFA</span></p>
                </div>

                <div class="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-1.5">
                    <Sparkles class="w-4 h-4 text-violet-600" />
                    <span class="text-[10px] font-bold uppercase tracking-wider text-violet-700">Statut</span>
                  </div>
                  <p class="text-2xl font-black text-violet-700 font-mono">
                    {{ previsionData.nombre_prioritaires > 5 ? '⚠️ Action requise' : previsionData.nombre_prioritaires > 0 ? '📋 Suivi conseillé' : '✅ Stock OK' }}
                  </p>
                </div>
              </div>

              <!-- AI Summary -->
              <div v-if="previsionData.ai_summary" class="bg-gradient-to-r from-indigo-950 via-violet-900 to-indigo-950 text-white rounded-2xl p-5 border border-violet-700/40 shadow-inner">
                <div class="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  <Sparkles class="w-3.5 h-3.5" />
                  Résumé IA
                </div>
                <p class="text-xs leading-relaxed text-violet-100">{{ previsionData.ai_summary }}</p>
              </div>

              <!-- Tableau des produits prioritaires -->
              <div>
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                  <Package class="w-3.5 h-3.5 text-slate-500" />
                  Produits à réapprovisionner en priorité
                </h3>
                <div class="border border-slate-200 rounded-xl overflow-hidden">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 uppercase text-[10px] font-mono tracking-wider text-slate-500 border-b border-slate-200">
                      <tr>
                        <th class="px-4 py-2.5">Produit</th>
                        <th class="px-4 py-2.5 text-center">Stock actuel</th>
                        <th class="px-4 py-2.5 text-center">Qté suggérée</th>
                        <th class="px-4 py-2.5 text-right">Coût estimé</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-if="!previsionData.prioritaires || previsionData.prioritaires.length === 0">
                        <td colspan="4" class="px-4 py-6 text-center text-slate-400 text-xs">
                          Aucun produit prioritaire détecté — Stock sain ✅
                        </td>
                      </tr>
                      <tr v-for="(p, i) in previsionData.prioritaires.slice(0, 20)" :key="p.id || p.produit_id || i" class="hover:bg-slate-50/80 transition-colors">
                        <td class="px-4 py-2.5">
                          <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                              !
                            </span>
                            <div class="min-w-0">
                              <p class="font-bold text-slate-900 truncate max-w-[220px]">{{ p.nom_commercial || p.nom || p.produit_nom || 'Produit #' + (p.id || p.produit_id || i) }}</p>
                              <p class="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">Priorité: {{ p.priorite || p.urgence || 'Haute' }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-2.5 text-center font-mono">
                          <span class="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                            {{ p.stock_actuel ?? p.stock_disponible ?? p.stock ?? '?' }}
                          </span>
                        </td>
                        <td class="px-4 py-2.5 text-center font-mono font-bold text-slate-800 text-[12px]">
                          +{{ p.quantite_suggeree ?? p.quantite ?? p.qte ?? '?' }}
                          <span class="text-[10px] text-slate-400 font-normal ml-0.5">{{ p.unite || 'unités' }}</span>
                        </td>
                        <td class="px-4 py-2.5 text-right font-mono font-bold text-emerald-700 text-[12px]">
                          {{ Number(p.cout_estime ?? p.cout ?? p.prix_total ?? 0).toLocaleString('fr-FR') }}
                          <span class="text-[10px] text-emerald-600 font-normal">FCFA</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div class="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl flex-shrink-0">
              <button @click="showPrevisionModal = false" class="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===================== MODAL Approvisionnement de Boutique ===================== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showApprovisionnementModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" @click.self="closeApprovisionnementModal">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Truck class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-base font-bold text-slate-900">Approvisionner : {{ selectedBoutiqueForAppro?.nom }}</h2>
                  <p class="text-[11px] text-slate-500">Cochez les produits du catalogue à approvisionner et ajustez les quantités.</p>
                </div>
              </div>
              <button @click="closeApprovisionnementModal" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 overflow-y-auto flex-1 space-y-4">
              
              <!-- Filtre et stats rapides -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div class="relative w-full sm:w-72">
                  <input 
                    v-model="searchProduitQuery" 
                    type="text" 
                    placeholder="Rechercher un produit..." 
                    class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                  <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button 
                    type="button" 
                    @click="toggleAllProduits" 
                    class="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {{ allProduitsSelected ? 'Tout décocher' : 'Tout cocher' }}
                  </button>
                  <div class="text-xs text-slate-600 font-medium">
                    <span class="font-bold text-emerald-700">{{ selectedProduitsCount }}</span> produit(s) coché(s) | Total : <span class="font-bold font-mono text-slate-900">{{ totalQuantiteAjoutee }}</span> unités
                  </div>
                </div>
              </div>

              <!-- Loading state -->
              <div v-if="loadingProduits" class="py-12 text-center text-slate-500">
                <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Chargement des produits du catalogue...
              </div>

              <!-- Empty list state -->
              <div v-else-if="filteredProduitsAppro.length === 0" class="py-10 text-center text-slate-400">
                <Package class="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p class="text-xs">Aucun produit ne correspond à votre recherche</p>
              </div>

              <!-- Liste des produits -->
              <div v-else class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div 
                  v-for="p in filteredProduitsAppro" 
                  :key="p.id" 
                  class="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                  :class="p.selected ? 'bg-emerald-50/40' : 'hover:bg-slate-50'"
                >
                  <!-- Checkbox + Info Produit -->
                  <div class="flex items-center gap-3 cursor-pointer select-none" @click="p.selected = !p.selected">
                    <input 
                      type="checkbox" 
                      v-model="p.selected" 
                      @click.stop 
                      class="w-4 h-4 text-emerald-600 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                    />
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-xs font-bold text-slate-900">{{ p.nom_commercial }}</p>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {{ p.categorie_nom }}
                        </span>
                        <span v-if="p.deja_associe" class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Stock actuel: {{ p.stock_actuel }} {{ p.unite_mesure }}
                        </span>
                      </div>
                      <p class="text-[11px] font-mono text-amber-700 font-semibold mt-0.5">
                        {{ p.prix_unitaire?.toLocaleString('fr-FR') }} FCFA / {{ p.unite_mesure || 'unité' }}
                      </p>
                    </div>
                  </div>

                  <!-- Contrôle de Quantité si coché -->
                  <div v-if="p.selected" class="flex items-center gap-3 self-end sm:self-auto bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                    <div class="flex flex-col">
                      <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Quantité à ajouter</label>
                      <div class="flex items-center gap-1 mt-0.5">
                        <button 
                          type="button" 
                          @click="p.quantite = Math.max(1, (p.quantite || 1) - 1)" 
                          class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                        >-</button>
                        <input 
                          type="number" 
                          v-model.number="p.quantite" 
                          min="1" 
                          class="w-16 px-1.5 py-0.5 text-center font-mono font-bold text-xs text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600"
                        />
                        <button 
                          type="button" 
                          @click="p.quantite = (p.quantite || 1) + 1" 
                          class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                        >+</button>
                      </div>
                    </div>

                    <div class="flex flex-col border-l border-slate-100 pl-3">
                      <label class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Seuil Alerte</label>
                      <input 
                        type="number" 
                        v-model.number="p.stock_alerte" 
                        min="1" 
                        class="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-xs text-slate-700 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-600 mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error message -->
              <div v-if="approError" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertCircle class="w-4 h-4 flex-shrink-0" />
                {{ approError }}
              </div>

              <!-- Success message -->
              <div v-if="approSuccess" class="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center gap-2">
                <CheckCircle class="w-4 h-4 flex-shrink-0 text-emerald-600" />
                {{ approSuccess }}
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50 rounded-b-2xl flex-shrink-0">
              <button 
                type="button" 
                @click="closeApprovisionnementModal" 
                class="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              
              <button 
                type="button" 
                @click="submitApprovisionnement" 
                :disabled="submittingAppro || selectedProduitsCount === 0" 
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center gap-2 cursor-pointer"
              >
                <span v-if="submittingAppro" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <Truck v-else class="w-4 h-4" />
                <span>{{ submittingAppro ? 'Approvisionnement...' : `Approvisionner (${selectedProduitsCount} produit(s))` }}</span>
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Store, Plus, Search, CheckCircle, X, Hammer, Sprout, AlertCircle, Sparkles, BarChart3, Package, AlertTriangle, Pencil, Power, CheckCircle2, Truck } from 'lucide-vue-next'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({
  path: '/admin/boutiques',
  layout: 'admin',
  middleware: 'admin-auth'
})

useHead({ title: 'Boutiques - Administration AgroShop' })

const authStore = useAdminAuthStore()
const config = useRuntimeConfig()
const { adminFetch } = useAdminFetch()

// ---- State ----
const searchQuery = ref('')
const boutiques = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const formError = ref(null)
const editingId = ref(null)

const defaultForm = () => ({ nom: '', types: ['agricole'], localisation: '', description: '', is_active: true })
const form = ref(defaultForm())

// AI Prévision / Réappro State
const showPrevisionModal = ref(false)
const previsionLoading = ref(false)
const selectedBoutiqueForPrevision = ref(null)
const previsionData = ref({
  nombre_prioritaires: 0,
  total_estime: 0,
  ai_summary: '',
  prioritaires: []
})

// ---- Fetch ----
const fetchBoutiques = async () => {
  loading.value = true
  try {
    const res = await adminFetch('/admin/boutiques')
    boutiques.value = res?.data ?? (Array.isArray(res) ? res : [])
  } catch (e) {
    if (e?.status !== 401 && e?.statusCode !== 401) {
      boutiques.value = [
        { id: 1, nom: 'AgroShop Quincaillerie Centre', type: 'quincaillerie', types: ['quincaillerie'], localisation: 'Lomé Centre', is_active: true, created_at: '2025-01-01' },
        { id: 2, nom: 'AgroShop Engrais Nord', type: 'agricole', types: ['agricole'], localisation: 'Agoë', is_active: true, created_at: '2025-02-15' },
        { id: 3, nom: 'AgroShop Grand Marché (Complet)', type: 'quincaillerie,agricole', types: ['quincaillerie', 'agricole'], localisation: 'Grand Marché', is_active: true, created_at: '2025-03-01' }
      ]
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchBoutiques)

// ---- Helper ----
const getTypesList = (boutique) => {
  if (boutique.types && Array.isArray(boutique.types) && boutique.types.length > 0) {
    return boutique.types
  }
  if (boutique.type) {
    return boutique.type.split(',').map(t => t.trim()).filter(Boolean)
  }
  return ['agricole']
}

const toggleType = (t) => {
  const idx = form.value.types.indexOf(t)
  if (idx > -1) {
    if (form.value.types.length > 1) {
      form.value.types.splice(idx, 1)
    }
  } else {
    form.value.types.push(t)
  }
}

// ---- Computed ----
const filteredBoutiques = computed(() => {
  if (!searchQuery.value) return boutiques.value
  const q = searchQuery.value.toLowerCase()
  return boutiques.value.filter(b => b.nom.toLowerCase().includes(q) || (b.localisation || '').toLowerCase().includes(q))
})

// ---- Modal ----
const openModal = (boutique = null) => {
  formError.value = null
  if (boutique) {
    isEditing.value = true
    editingId.value = boutique.id
    form.value = { 
      nom: boutique.nom, 
      types: getTypesList(boutique), 
      localisation: boutique.localisation || '', 
      description: boutique.description || '', 
      is_active: boutique.is_active 
    }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formError.value = null
}

// ---- Save ----
const saveBoutique = async () => {
  saving.value = true
  formError.value = null
  if (form.value.types.length === 0) {
    formError.value = 'Veuillez choisir au moins un type pour la boutique.'
    saving.value = false
    return
  }
  try {
    const endpoint = isEditing.value
      ? `/admin/boutiques/${editingId.value}`
      : '/admin/boutiques'
    const method = isEditing.value ? 'PUT' : 'POST'

    const payload = {
      ...form.value,
      type: form.value.types.join(',')
    }

    const res = await adminFetch(endpoint, { method, body: payload })
    const saved = res?.data || res
    if (isEditing.value) {
      const idx = boutiques.value.findIndex(b => b.id === editingId.value)
      if (idx !== -1) boutiques.value[idx] = saved
    } else {
      boutiques.value.unshift(saved)
    }
    closeModal()
  } catch (e) {
    formError.value = e?.data?.message || e?.message || 'Erreur lors de l\'enregistrement. Vérifiez les champs.'
  } finally {
    saving.value = false
  }
}

// ---- Toggle Statut ----
const toggleStatut = async (boutique) => {
  try {
    await adminFetch(`/admin/boutiques/${boutique.id}`, {
      method: 'PUT',
      body: { ...boutique, is_active: !boutique.is_active }
    })
    boutique.is_active = !boutique.is_active
  } catch (e) {
    if (e?.status !== 401) boutique.is_active = !boutique.is_active
  }
}

// ---- AI Prévision Réappro ----
const openPrevision = async (boutique) => {
  selectedBoutiqueForPrevision.value = boutique
  showPrevisionModal.value = true
  previsionLoading.value = true
  previsionData.value = { nombre_prioritaires: 0, total_estime: 0, ai_summary: '', prioritaires: [] }
  try {
    const res = await adminFetch(`/admin/ai/boutiques/${boutique.id}/suggerer-reappro`)
    const d = res?.data || res
    previsionData.value.nombre_prioritaires = d.nombre_prioritaires || d.prioritaires?.length || 0
    previsionData.value.total_estime = d.total_estime || d.cout_total || 0
    previsionData.value.ai_summary = d.ai_summary || d.resume || ''
    previsionData.value.prioritaires = d.prioritaires || d.produits || []
  } catch (e) {
    console.warn('Prevision fetch error', e)
  } finally {
    previsionLoading.value = false
  }
}

// ---- Approvisionnement de Boutique ----
const showApprovisionnementModal = ref(false)
const selectedBoutiqueForAppro = ref(null)
const produitsAppro = ref([])
const loadingProduits = ref(false)
const searchProduitQuery = ref('')
const submittingAppro = ref(false)
const approError = ref(null)
const approSuccess = ref(null)

const openApprovisionnementModal = async (boutique) => {
  selectedBoutiqueForAppro.value = boutique
  showApprovisionnementModal.value = true
  loadingProduits.value = true
  approError.value = null
  approSuccess.value = null
  searchProduitQuery.value = ''
  produitsAppro.value = []

  try {
    const res = await adminFetch(`/admin/boutiques/${boutique.id}/produits-approvisionnement`)
    const list = res?.data || []
    produitsAppro.value = list.map(p => ({
      ...p,
      selected: false,
      quantite: 10,
      stock_alerte: p.stock_alerte || 10
    }))
  } catch (e) {
    approError.value = "Impossible de charger les produits du catalogue."
  } finally {
    loadingProduits.value = false
  }
}

const closeApprovisionnementModal = () => {
  showApprovisionnementModal.value = false
  selectedBoutiqueForAppro.value = null
  approError.value = null
  approSuccess.value = null
}

const filteredProduitsAppro = computed(() => {
  if (!searchProduitQuery.value) return produitsAppro.value
  const q = searchProduitQuery.value.toLowerCase()
  return produitsAppro.value.filter(p => 
    p.nom_commercial?.toLowerCase().includes(q) || 
    p.categorie_nom?.toLowerCase().includes(q)
  )
})

const selectedProduitsCount = computed(() => {
  return produitsAppro.value.filter(p => p.selected).length
})

const totalQuantiteAjoutee = computed(() => {
  return produitsAppro.value
    .filter(p => p.selected)
    .reduce((acc, p) => acc + (Number(p.quantite) || 0), 0)
})

const allProduitsSelected = computed(() => {
  return filteredProduitsAppro.value.length > 0 && filteredProduitsAppro.value.every(p => p.selected)
})

const toggleAllProduits = () => {
  const targetState = !allProduitsSelected.value
  filteredProduitsAppro.value.forEach(p => { p.selected = targetState })
}

const submitApprovisionnement = async () => {
  const itemsToSubmit = produitsAppro.value
    .filter(p => p.selected && Number(p.quantite) > 0)
    .map(p => ({
      produit_id: p.id,
      quantite: Number(p.quantite),
      stock_alerte: Number(p.stock_alerte) || 10
    }))

  if (itemsToSubmit.length === 0) {
    approError.value = "Veuillez cocher au moins un produit avec une quantité valide."
    return
  }

  submittingAppro.value = true
  approError.value = null
  approSuccess.value = null

  try {
    const res = await adminFetch(`/admin/boutiques/${selectedBoutiqueForAppro.value.id}/approvisionner`, {
      method: 'POST',
      body: { items: itemsToSubmit }
    })

    approSuccess.value = res?.message || "Boutique approvisionnée avec succès !"
    fetchBoutiques() // Rafraîchir la liste principale
    setTimeout(() => {
      closeApprovisionnementModal()
    }, 1500)
  } catch (e) {
    approError.value = e?.data?.message || e?.message || "Erreur lors de l'approvisionnement."
  } finally {
    submittingAppro.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.97); }
</style>
