<template>
  <div class="space-y-8">
    
    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- MODE 1: LIST VIEW (TABLE OF PRODUCTS) -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <div v-if="viewMode === 'list'" class="space-y-8">
      
      <!-- Title & Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Package class="w-7 h-7 text-emerald-400" />
            <span>Gestion du Catalogue Produits</span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">Gérez vos engrais, semences et matériels agricoles certifiés</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Add Product Button -->
          <button 
            @click="openAddForm" 
            class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Plus class="w-4 h-4" />
            <span>Ajouter un nouveau produit</span>
          </button>

          <!-- Refresh Button -->
          <button 
            @click="fetchProducts" 
            :disabled="isLoading"
            class="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          </button>
        </div>
      </div>

      <!-- Search Bar & Counter Strip -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div class="relative flex-1 w-full">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom de produit, engrais, semence..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        <span class="text-xs font-mono text-slate-400 flex-shrink-0">
          {{ filteredProducts.length }} produit(s) trouvé(s)
        </span>
      </div>

      <!-- Products Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        
        <div v-if="isLoading" class="py-16 text-center text-xs font-mono text-slate-500">
          <div class="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Chargement du catalogue produits...
        </div>

        <div v-else-if="filteredProducts.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="px-5 py-3.5">Produit</th>
                <th class="px-5 py-3.5">Prix Unitaire</th>
                <th class="px-5 py-3.5">Stock & Alerte</th>
                <th class="px-5 py-3.5">En Vedette (Accueil)</th>
                <th class="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-slate-800/40 transition-colors">
                
                <td class="px-5 py-3.5 flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-white border border-slate-700 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                    <img 
                      :src="getImgUrl(prod.image_principale?.url_image || prod.url_image)" 
                      :alt="prod.nom_commercial"
                      class="w-full h-full object-contain"
                      @error="(e) => e.target.src = fallbackImage"
                    />
                  </div>
                  <div>
                    <p class="font-bold text-white text-xs">{{ prod.nom_commercial }}</p>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5">ID: #{{ prod.id }} | Unité : {{ prod.unite_mesure || 'unité' }}</p>
                  </div>
                </td>

                <td class="px-5 py-3.5 font-mono font-bold text-emerald-400">
                  {{ formatPrice(prod.prix_unitaire || 0) }} FCFA
                </td>

                <td class="px-5 py-3.5 font-mono">
                  <span :class="(prod.stock_disponible || 0) > (prod.stock_alerte || 10) ? 'text-slate-200' : 'text-rose-400 font-bold'">
                    {{ prod.stock_disponible || 0 }} dispo. (Alerte: {{ prod.stock_alerte || 10 }})
                  </span>
                </td>

                <td class="px-5 py-3.5">
                  <button 
                    @click="toggleFeatured(prod)"
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    :class="prod.est_en_vedette ? 'bg-amber-950 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'"
                  >
                    <Star class="w-3.5 h-3.5" :class="{ 'fill-current': prod.est_en_vedette }" />
                    <span>{{ prod.est_en_vedette ? 'En Vedette' : 'Standard' }}</span>
                  </button>
                </td>

                <td class="px-5 py-3.5 text-right font-mono space-x-2">
                  <button 
                    @click="openEditForm(prod)" 
                    class="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Modifier le produit"
                  >
                    <Pencil class="w-4 h-4 inline-block" />
                  </button>

                  <NuxtLink 
                    :to="`/produits/${prod.slug || prod.id}`" 
                    target="_blank" 
                    class="p-1.5 text-slate-400 hover:text-white transition-colors"
                    title="Voir la fiche publique"
                  >
                    <Eye class="w-4 h-4 inline-block" />
                  </NuxtLink>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="py-12 text-center text-xs text-slate-500 font-mono">
          Aucun produit correspondant à votre recherche.
        </div>

      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════ -->
    <!-- MODE 2: FORM VIEW (ADD / EDIT PRODUCT FULL FORM) -->
    <!-- ════════════════════════════════════════════════════════════════ -->
    <div v-else class="space-y-8">
      
      <!-- Top Form Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <button 
            @click="viewMode = 'list'" 
            class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Retour à la liste</span>
          </button>
          <h1 class="text-2xl sm:text-3xl font-black text-white">
            {{ editingId ? 'Modifier le Produit' : 'Ajouter un nouveau produit' }}
          </h1>
          <p class="text-xs text-slate-400 mt-1">Créez ou mettez à jour un produit dans votre catalogue</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="viewMode = 'list'" 
            class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button 
            @click="saveProduct" 
            :disabled="isSaving"
            class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save class="w-4 h-4" />
            <span>{{ isSaving ? 'Enregistrement...' : 'Enregistrer le Produit' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form Sections (Grid 2 Cols on XL screens) -->
      <form @submit.prevent="saveProduct" class="space-y-8">
        
        <!-- SECTION 1: Informations Générales -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Info class="w-5 h-5 text-emerald-400" />
            <span>Informations générales</span>
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Nom commercial *</label>
              <input 
                v-model="form.nom_commercial" 
                required 
                type="text" 
                placeholder="ex: Engrais NPK 15-15-15 SuperFert" 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
              <textarea 
                v-model="form.description" 
                rows="4" 
                placeholder="Description détaillée du produit..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Composition</label>
                <textarea 
                  v-model="form.composition" 
                  rows="3" 
                  placeholder="Composition chimique du produit..." 
                  class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Principes actifs</label>
                <textarea 
                  v-model="form.principes_actifs" 
                  rows="3" 
                  placeholder="Principes actifs..." 
                  class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: Utilisation et précautions -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldAlert class="w-5 h-5 text-amber-400" />
            <span>Utilisation et précautions</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Mode d'emploi</label>
              <textarea 
                v-model="form.mode_emploi" 
                rows="3" 
                placeholder="Instructions d'utilisation..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Dosage recommandé</label>
              <textarea 
                v-model="form.dosage_recommande" 
                rows="3" 
                placeholder="Dosages et fréquences d'application..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Précautions d'usage</label>
              <textarea 
                v-model="form.precautions_usage" 
                rows="3" 
                placeholder="Précautions à prendre..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Contre-indications</label>
              <textarea 
                v-model="form.contre_indications" 
                rows="3" 
                placeholder="Contre-indications et restrictions..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- SECTION 3: Images du produit -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Image class="w-5 h-5 text-blue-400" />
            <span>Images du produit</span>
          </h3>

          <div class="space-y-4">
            <div class="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-950/60">
              <Upload class="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <label class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer inline-block transition-colors shadow-md">
                <span>Ajouter des images</span>
                <input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" @change="handleImageUpload" class="hidden" />
              </label>
              <p class="text-[11px] text-slate-400 mt-2">
                Formats acceptés : JPG, PNG, GIF, WEBP. Première image ajoutée = image principale.
              </p>
            </div>

            <!-- Image Previews Stream -->
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Aperçu des images</label>
              <div v-if="imagesList.length > 0" class="flex flex-wrap items-center gap-3">
                <div 
                  v-for="(img, idx) in imagesList" 
                  :key="idx"
                  class="relative w-24 h-24 rounded-2xl bg-white p-1 border border-slate-700 overflow-hidden group shadow-md"
                >
                  <img :src="img.preview" class="w-full h-full object-contain" />
                  <span v-if="idx === 0" class="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    Principale
                  </span>
                  <button 
                    type="button" 
                    @click="removeImage(idx)" 
                    class="absolute top-1 right-1 bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div v-else class="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-center text-xs text-slate-500 font-mono">
                Aucune image sélectionnée
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 4: Prix et stock -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <DollarSign class="w-5 h-5 text-emerald-400" />
            <span>Prix et stock</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Prix unitaire (FCFA) *</label>
              <input 
                v-model.number="form.prix_unitaire" 
                required 
                type="number" 
                placeholder="ex: 18500" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Unité de mesure *</label>
              <select 
                v-model="form.unite_mesure" 
                required 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
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
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Stock disponible</label>
              <input 
                v-model.number="form.stock_disponible" 
                type="number" 
                placeholder="0" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Stock d'alerte</label>
              <input 
                v-model.number="form.stock_alerte" 
                type="number" 
                placeholder="10" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Poids (kg)</label>
              <input 
                v-model.number="form.poids" 
                type="number" 
                step="0.1" 
                placeholder="ex: 50" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Dimensions</label>
              <input 
                v-model="form.dimensions" 
                type="text" 
                placeholder="Ex: 25cm x 15cm x 10cm" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <!-- SECTION 5: Catégories -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layers class="w-5 h-5 text-purple-400" />
            <span>Catégories</span>
          </h3>

          <div class="space-y-4">
            <label class="block text-xs font-bold text-slate-300 uppercase">Cochez les catégories associées :</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <label 
                v-for="cat in availableCategories" 
                :key="cat.slug"
                class="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <input 
                  type="checkbox" 
                  :value="cat.slug" 
                  v-model="form.selectedCategories" 
                  class="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>{{ cat.nom }}</span>
              </label>
            </div>

            <div class="pt-2">
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Catégorie principale</label>
              <select 
                v-model="form.categorie_principale" 
                class="w-full sm:w-1/2 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="">Aucune</option>
                <option v-for="cat in availableCategories" :key="cat.slug" :value="cat.slug">{{ cat.nom }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECTION 6: Configuration -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Settings class="w-5 h-5 text-emerald-400" />
            <span>Configuration</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-2">Statut du produit</label>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input type="radio" v-model="form.statut" value="actif" class="accent-emerald-500" />
                  <span>Actif</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input type="radio" v-model="form.statut" value="inactif" class="accent-emerald-500" />
                  <span>Inactif</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input type="radio" v-model="form.statut" value="brouillon" class="accent-emerald-500" />
                  <span>Brouillon</span>
                </label>
              </div>
            </div>

            <div class="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <input 
                id="est_vedette_form" 
                v-model="form.est_en_vedette" 
                type="checkbox" 
                class="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
              <label for="est_vedette_form" class="text-xs font-bold text-slate-200 cursor-pointer">
                ⭐ Produit mis en avant (Carrousel & Accueil)
              </label>
            </div>
          </div>
        </div>

        <!-- SECTION 7: SEO -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
          <h3 class="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Globe class="w-5 h-5 text-blue-400" />
            <span>SEO & Moteurs de Recherche</span>
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Slug (URL)</label>
              <input 
                v-model="form.slug" 
                type="text" 
                placeholder="Sera généré automatiquement si vide" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-bold text-slate-300 uppercase">Meta Title</label>
                <span class="text-[10px] font-mono text-slate-500">{{ (form.meta_title || '').length }}/200 caractères</span>
              </div>
              <input 
                v-model="form.meta_title" 
                maxlength="200" 
                type="text" 
                placeholder="Titre pour Google..." 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-xs font-bold text-slate-300 uppercase">Meta Description</label>
                <span class="text-[10px] font-mono text-slate-500">{{ (form.meta_description || '').length }}/160 caractères</span>
              </div>
              <textarea 
                v-model="form.meta_description" 
                maxlength="160" 
                rows="2" 
                placeholder="Description pour les moteurs de recherche..." 
                class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Form Submit Footer Action Bar -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-800">
          <button 
            type="button" 
            @click="viewMode = 'list'" 
            class="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            ← Retour à la liste
          </button>

          <button 
            type="submit" 
            :disabled="isSaving" 
            class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-emerald-900/40 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Save class="w-4 h-4" />
            <span>{{ isSaving ? 'Enregistrement en cours...' : 'Enregistrer le Produit' }}</span>
          </button>
        </div>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Package, Search, RefreshCw, Star, Eye, Plus, Pencil, ArrowLeft, Save, Info, ShieldAlert, Image, Upload, DollarSign, Layers, Settings, Globe } from 'lucide-vue-next'
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

const viewMode = ref('list') // 'list' | 'form'
const isLoading = ref(true)
const isSaving = ref(false)
const editingId = ref(null)

const products = ref([])
const searchQuery = ref('')
const imagesList = ref([])

const availableCategories = ref([
  { slug: 'intrants-agricoles', nom: 'Intrants Agricoles' },
  { slug: 'produits-phytosanitaires', nom: 'Produits Phytosanitaires' },
  { slug: 'systemes-irrigation', nom: 'Systèmes d\'Irrigation' },
  { slug: 'semences', nom: 'Semences' },
  { slug: 'machines-agricoles', nom: 'Machines Agricoles' },
  { slug: 'quincaillerie', nom: 'Quincaillerie' },
  { slug: 'engrais-npk', nom: 'Engrais NPK (Sous-catégorie)' },
  { slug: 'uree', nom: 'Urée (Sous-catégorie)' },
  { slug: 'engrais-organiques', nom: 'Engrais Organiques (Sous-catégorie)' },
  { slug: 'insecticides', nom: 'Insecticides (Sous-catégorie)' },
  { slug: 'fongicides', nom: 'Fongicides (Sous-catégorie)' },
  { slug: 'herbicides', nom: 'Herbicides (Sous-catégorie)' },
  { slug: 'nematicides', nom: 'Nématicides (Sous-catégorie)' }
])

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
  selectedCategories: [],
  categorie_principale: '',
  statut: 'actif',
  est_en_vedette: false,
  slug: '',
  meta_title: '',
  meta_description: ''
})

const formatPrice = (val) => Number(val || 0).toLocaleString('fr-FR')
const getImgUrl = (img) => getImageUrl(img, fallbackImage)

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    p.nom_commercial?.toLowerCase().includes(q) || 
    p.slug?.toLowerCase().includes(q)
  )
})

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
    console.warn('Admin products fetch error', e)
    products.value = fallbackAdminProducts
  }
  isLoading.value = false
}

const openAddForm = () => {
  editingId.value = null
  imagesList.value = []
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
    stock_disponible: 0,
    stock_alerte: 10,
    poids: null,
    dimensions: '',
    selectedCategories: ['intrants-agricoles'],
    categorie_principale: 'intrants-agricoles',
    statut: 'actif',
    est_en_vedette: false,
    slug: '',
    meta_title: '',
    meta_description: ''
  }
  viewMode.value = 'form'
}

const openEditForm = (prod) => {
  editingId.value = prod.id
  imagesList.value = prod.url_image ? [{ preview: getImgUrl(prod.url_image) }] : []
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
    stock_disponible: prod.stock_disponible || 0,
    stock_alerte: prod.stock_alerte || 10,
    poids: prod.poids || null,
    dimensions: prod.dimensions || '',
    selectedCategories: (prod.categories || []).map(c => c.slug || c.nom),
    categorie_principale: prod.categories?.[0]?.slug || '',
    statut: prod.statut || 'actif',
    est_en_vedette: !!prod.est_en_vedette,
    slug: prod.slug || '',
    meta_title: prod.meta_title || '',
    meta_description: prod.meta_description || ''
  }
  viewMode.value = 'form'
}

const handleImageUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = (e) => {
      imagesList.value.push({ file, preview: e.target.result })
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (idx) => {
  imagesList.value.splice(idx, 1)
}

const saveProduct = async () => {
  isSaving.value = true
  try {
    const payload = { ...form.value }
    if (!payload.slug) {
      payload.slug = payload.nom_commercial.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    if (editingId.value) {
      const idx = products.value.findIndex(p => p.id === editingId.value)
      if (idx !== -1) {
        products.value[idx] = { ...products.value[idx], ...payload }
      }
      await $fetch(`${config.public.apiBaseUrl}/admin/produits/${editingId.value}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    } else {
      const newProd = { id: Date.now(), ...payload }
      products.value.unshift(newProd)
      await $fetch(`${config.public.apiBaseUrl}/admin/produits`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: payload
      })
    }
  } catch (e) {
    console.warn('Save product warning', e)
  }
  isSaving.value = false
  viewMode.value = 'list'
}

const toggleFeatured = async (prod) => {
  const oldState = prod.est_en_vedette
  prod.est_en_vedette = !oldState
  try {
    await $fetch(`${config.public.apiBaseUrl}/admin/produits/${prod.id}/toggle-featured`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
  } catch (e) {
    console.warn(e)
  }
}

onMounted(() => {
  fetchProducts()
})

const fallbackAdminProducts = [
  {
    id: 1,
    nom_commercial: 'Urée YARA 46% N',
    slug: 'uree-yara-46-n',
    prix_unitaire: 15000,
    unite_mesure: 'sac 50kg',
    stock_disponible: 1000,
    stock_alerte: 10,
    est_en_vedette: true,
    url_image: 'storage/produits/urea.jpg'
  },
  {
    id: 2,
    nom_commercial: 'Engrais NPK 15-15-15 SuperFert',
    slug: 'engrais-npk-15-15-15-superfert',
    prix_unitaire: 18500,
    unite_mesure: 'sac 50kg',
    stock_disponible: 750,
    stock_alerte: 10,
    est_en_vedette: true,
    url_image: 'storage/produits/npk.jpg'
  },
  {
    id: 3,
    nom_commercial: 'Insecticide Katana 50 EC',
    slug: 'insecticide-katana-50-ec',
    prix_unitaire: 7500,
    unite_mesure: 'flacon 1L',
    stock_disponible: 300,
    stock_alerte: 10,
    est_en_vedette: false,
    url_image: 'storage/produits/katana.jpg'
  },
  {
    id: 4,
    nom_commercial: 'Semence Maïs Hybride PAN 53',
    slug: 'semence-mais-hybride-pan-53',
    prix_unitaire: 12000,
    unite_mesure: 'sac 5kg',
    stock_disponible: 500,
    stock_alerte: 10,
    est_en_vedette: true,
    url_image: 'storage/produits/mais_pan53.jpg'
  },
  {
    id: 5,
    nom_commercial: 'Kit d\'Irrigation Goutte-à-Goutte 500m²',
    slug: 'kit-irrigation-goutte-a-goutte-500m2',
    prix_unitaire: 85000,
    unite_mesure: 'kit complet',
    stock_disponible: 45,
    stock_alerte: 5,
    est_en_vedette: true,
    url_image: 'storage/produits/irrigation_kit.jpg'
  },
  {
    id: 6,
    nom_commercial: 'Atomiseur STIHL SR 450',
    slug: 'atomiseur-stihl-sr-450',
    prix_unitaire: 515000,
    unite_mesure: 'unité',
    stock_disponible: 25,
    stock_alerte: 2,
    est_en_vedette: true,
    url_image: 'storage/produits/stihl.jpg'
  }
]
</script>
