Je vais d'abord explorer le projet pour comprendre l'architecture existante, les fonctionnalités de l'API et l'ancien design, afin de vous fournir des recommandations UI/UX personnalisées et basées sur la psychologie.
        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: view_folder
            
status: success
          
c:\composer\agroshop\api
          

        
            
toolName: view_folder
            
status: success
          
c:\composer\agroshop\agroshopphp
          

        
            
toolName: view_folder
            
status: success
          
c:\composer\agroshop\front-end
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\routes\api.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\agroshopphp\index.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\front-end\nuxt.config.ts
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\front-end\package.json
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\agroshopphp\includes\style.css
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\app\Http\Controllers\Client\HomeController.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\app\Models\Produit.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\app\Models\Categorie.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\app\Http\Controllers\Client\ProduitController.php
          

        
            
toolName: view_files
            
status: success
          
            
filePath: c:\composer\agroshop\api\app\Http\Controllers\Client\CommandeController.php
          

        
            
toolName: view_folder
            
status: success
          
c:\composer\agroshop\front-end\app
          

        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
Parfait ! J'ai analysé en profondeur votre API Laravel ([api.php](file:///c:/composer/agroshop/api/routes/api.php)), vos modèles métier ([Produit.php](file:///c:/composer/agroshop/api/app/Models/Produit.php), [Categorie.php](file:///c:/composer/agroshop/api/app/Models/Categorie.php)), l'ancien design ([index.php](file:///c:/composer/agroshop/agroshopphp/index.php)) et le setup Nuxt 4 existant ([nuxt.config.ts](file:///c:/composer/agroshop/front-end/nuxt.config.ts), [package.json](file:///c:/composer/agroshop/front-end/package.json)).

Voici des recommandations complètes basées sur la **psychologie cognitive**, l'**ergonomie e-commerce** et un design moderne **à dominante verte**.

---

## 🌿 I. DESIGN SYSTEM — Palette & Principes (Psychologie des couleurs)

### Palette "AgroShop V2" (à définir dans `nuxt.config.ts` + Tailwind)

| Rôle | Couleur | HEX | Pourquoi ? |
|---|---|---|---|
| **Primaire (Vert Nature)** | Forest Green | `#15803D` → `#166534` | Confiance, croissance, nature. C'est votre ADN. |
| **Secondaire (Vert Éclat)** | Emerald | `#10B981` | Interactions, CTA secondaires, succès. |
| **Accent Chaleureux** | Golden Amber | `#F59E0B` → `#D97706` | **Psychologie clé** : contraste chaud/froid. Le jaune-orangé attire l'œil sur les boutons d'achat (couleur du soleil = abondance). |
| **Neutre** | Slate/White | `#F8FAFC`, `#0F172A` | Lisibilité max. Fond légèrement cassé pour éviter la fatigue oculaire. |
| **Alerte/Erreur** | Soft Red | `#DC2626` | Rouges doux (pas trop agressif pour l'agriculture). |
| **Info** | Sky Blue | `#0EA5E9` | Eau, irrigation → cohérent avec le secteur agro. |

### Typographie recommandée
- **Titres** : `Poppins` ou `Plus Jakarta Sans` (moderne, lisible, "premium")
- **Corps** : `Inter` (optimisée pour le web)
- **Ratio 1.333 (Perfect Fourth)** : h1=2.986rem → petite=0.75rem

---

## 📐 II. ARCHITECTURE COMPLÈTE DES PAGES (Sitemap Nuxt)

Basé sur vos endpoints API, voici les pages à créer dans `front-end/app/` :

### 🔹 1. Partie Publique / E-commerce

```
app/
├── pages/
│   ├── index.vue                 # ✅ Page d'accueil (détaillée ci-dessous)
│   ├── produits/
│   │   ├── index.vue             # Catalogue complet (filtres, tri, recherche, pagination)
│   │   └── [slug].vue            # Fiche produit détaillée (galerie, similaires, docs)
│   ├── categories/
│   │   ├── index.vue             # Toutes les catégories (arbre visuel)
│   │   └── [slug].vue            # Page catégorie = produits filtrés
│   ├── blog/
│   │   ├── index.vue             # Liste articles (filtres tags, recherche)
│   │   └── [slug].vue            # Article complet + produits liés
│   ├── commande/
│   │   ├── panier.vue            # Panier (récap, modif qté, suppression)
│   │   ├── checkout.vue          # Checkout multi-étapes (coordonnées → livraison → paiement → confirmation)
│   │   ├── confirmation.vue      # Succès commande + code référence (appel POST /api/commandes)
│   │   └── suivi.vue             # Suivi commande par référence/téléphone (GET /suivi/{ref})
│   ├── contact.vue               # Formulaire contact (POST /api/contact) + infos + carte
│   ├── faq.vue                   # FAQ dynamique (GET /api/faq)
│   ├── a-propos.vue              # À propos (histoire AgroShop, équipe, valeurs)
│   └── mention-legales.vue       # CGU, politique confidentialité, cookies
```

### 🔹 2. Layouts Globaux (à créer dans `app/layouts/`)
- `default.vue` — Navbar + Panier latéral (slide-in) + Footer
- `admin.vue` — Layout admin séparé (sidebar gauche + topbar)

### 🔹 3. Composants Réutilisables (`app/components/`)
```
app/components/
├── ui/
│   ├── AppNavbar.vue            # Barre navigation sticky (recherche, panier, menu mobile)
│   ├── AppFooter.vue            # Footer 4 colonnes
│   ├── CartSidebar.vue          # Panier latéral avec micro-interactions
│   ├── ToastNotification.vue    # Notifications toast (succès/erreur)
│   ├── SearchBar.vue            # Barre recherche autosuggest
│   └── BackToTop.vue            # Bouton retour en haut (psychologie : réduit la friction)
├── product/
│   ├── ProductCard.vue          # Carte produit (hover lift + "Ajouter au panier" animé)
│   ├── ProductGrid.vue          # Grille produit + options affichage (grille/liste)
│   ├── ProductGallery.vue       # Galerie images (zoom, vignettes)
│   └── ProductFilter.vue        # Filtres latéraux (prix, catégories, tri)
├── home/
│   ├── HeroSection.vue          # Section héros
│   ├── CategoryCards.vue        # Cartes catégories
│   ├── FeatureStrip.vue         # 3-4 avantages clés
│   ├── PartnerOrbit.vue         # Animation partenaires (revisitée)
│   └── TestimonialSection.vue   # Avis clients (preuve sociale)
└── forms/
    ├── CheckoutForm.vue         # Formulaire multi-étapes
    └── ContactForm.vue          # Formulaire contact
```

### 🔹 4. État Global (Pinia recommandé dans `app/stores/`)
- `cart.ts` — État du panier (persisté dans localStorage)
- `catalog.ts` — Filtres produits, recherches récentes
- `ui.ts` — États UI (sidebar ouverte, toasts, loading states)

---

## 🏠 III. LA PAGE D'ACCUEIL — Architecture Section par Section (Détaillée)

C'est la page la plus stratégique. Elle doit répondre en **3 secondes** à : *"Qu'est-ce que c'est ? En quoi ça m'aide ? Que dois-je faire ?"*

### Ordre des sections (du haut vers le bas) et leur justification psychologique :

---

### 🎯 SECTION 1 — NAVBAR STICKY (Toujours visible)
**Éléments obligatoires** (de gauche à droite) :
1. **Logo AgroShop** cliquable → retour accueil (SVG animé)
2. **Menu principal** : Accueil · Produits · Catégories · Blog · Contact · FAQ
3. **Barre de recherche** (icône loupe → s'étend au clic ou champ inline)
   - 🔑 **Psycho :** 20-30% des visiteurs utilisent la recherche en premier. Ajoutez **l'autocomplétion** avec mini aperçu produit.
4. **Compte client** (icône utilisateur → page connexion/inscription)
5. **Icône panier** avec **badge compteur animé** (pulse lors ajout)
   - Au clic : ouverture du `CartSidebar.vue` (slide depuis la droite)

> ✅ **Version mobile :** icône menu hamburger (menu slide gauche) + icône panier + recherche.

---

### 🚀 SECTION 2 — HERO PRINCIPAL (Above the fold — Zone critique)

Visibilité : **100% des visiteurs la voient**. Doit convertir en < 5 secondes.

**Structure 2 colonnes (desktop) / 1 colonne (mobile) :**

| COLONNE GAUCHE (60%) — Texte | COLONNE DROITE (40%) — Visuel |
|---|---|
| ✅ **Pill/Tag accroche** (ex: "🌱 Livraison gratuite dès 15.000 FCFA")<br><br>✅ **Titre H1** (8-12 mots max, 1 ligne, 48px+) :<br>ex: *"Cultivez votre réussite avec les meilleurs produits agricoles"*<br><br>✅ **Sous-titre P** (1-2 phrases, 18px, gris moyen) :<br>ex: *"Intrants certifiés, semences premium, équipements d'irrigation et conseils d'experts pour votre exploitation."*<br><br>✅ **Deux CTA alignés** :<br>• 🔴 **CTA Primaire** (fond AMBRE #F59E0B, plein, ombre, scale 105 hover) : **"🛒 Voir nos produits"** → scroll vers section produits<br>• ⚪ **CTA Secondaire** (bordure verte, fond transparent) : **"▶ Découvrir notre blog"** → /blog | **Psycho :** l'ambre contraste + attire l'action instantanée. Le vert 2e CTA est "safe" pour les indécis.<br><br>✅ **Micro-preuves sociales** sous CTA (petit texte) :<br>ex: "⭐ 4.8/5 · +2000 agriculteurs nous font confiance" | ✅ **Visuel HERO impactant** :<br>• Image haute qualité : **fermier souriant + matériel agricole** (photo réelle, pas de stock générique)<br>• OU : **Illustration 3D stylisée** (tracteur, plantes, goutte d'eau)<br>• **Animation flottante douce** (translateY ±15px en 6s loop)<br>• **Formes organiques floues** en arrière-plan (blobs verts gradient, opacité 0.15) → ajoute de la profondeur |

> 🔑 **Psycho-clé :** Utilisez **une seule image HERO (statique)** au lieu du slider d'images. Les sliders réduisent le taux de clic de 80% sur les slides 2+. L'animation flottante suffit pour capter l'attention sans surcharger.

---

### 💎 SECTION 3 — STRIP AVANTAGES (Trust = Confiance)
**Juste après le HERO** : 4 cartes horizontales (icône + titre + description courte).

**Les 4 avantages NON-NÉGOCIABLES pour AgroShop :**
1. 🚚 **"Livraison rapide"** — "Livraison à Lomé en 24h · Retrait agence gratuit"
2. ✅ **"Produits certifiés"** — "Sélection rigoureuse · Garantie qualité Yara, Bayer, Bejo"
3. 📞 **"Conseil expert"** — "Agronomes disponibles 7j/7 pour vous accompagner"
4. 💳 **"Paiement flexible"** — "MoMo, carte bancaire, paiement à la livraison"

**Design** : Icônes dans cercle vert pâle (hover → cercle vert plein + icône blanche, transition 300ms). Texte centré.

> 🔑 **Psycho-clé :** La confiance se construit dans les 3 premières secondes. Ces 4 preuves dissipent l'anxiété d'achat en ligne ("est-ce sérieux ?").

---

### 🏷️ SECTION 4 — CATÉGORIES DE PRODUITS (Navigation principale)
**Titre H2** : "Explorez par catégorie" + sous-titre.

**6 cartes catégories** (grid 3×2 desktop / 2×3 tablette / 1×6 mobile) — basées sur [HomeController.php](file:///c:/composer/agroshop/api/app/Http/Controllers/Client/HomeController.php) :

1. 🧪 **Intrants agricoles** (engrais NPK, urée)
2. 🛡️ **Produits phytosanitaires**
3. 💧 **Systèmes d'irrigation**
4. 🌱 **Semences**
5. 🚜 **Machines agricoles**
6. 🔧 **Quincaillerie agricole**

**Design carte catégorie — Version améliorée (vs ancien design) :**
- Carte hauteur fixe (300px) avec **image de fond + overlay vert dégradé** (opacity 0→0.7 top-bottom)
- Icône catégorie en grand en haut (64px, couleur blanche, fond de l'icône = couleur signature de la catégorie)
- Nom catégorie en **gras blanc** (24px)
- Compteur produits : *"142 produits"* (petit, gris-clair)
- **Bouton "Découvrir →"** invisible au repos → **apparaît en slide-up au hover**
- **Hover :** lift de -8px, ombre ++, zoom image fond 1.05

---

### ⭐ SECTION 5 — PRODUITS VEDETTES (Featured = Meilleures ventes)
**Titre H2** : "Produits vedettes" + **Lien "Voir tout →"** aligné à droite.

**Design :**
- Grid 4 colonnes desktop / 2 colonnes mobile
- Carte produit `ProductCard.vue` avec :
  1. Image produit (hauteur 220px, object-contain, fond gris très clair)
  2. **Badge "⭐ Vedette"** (haut gauche) OU **Badge "Promo -15%"** (si applicable)
  3. **Icône cœur** (haut droite) → ajout favoris (localStorage)
  4. Nom produit (18px, max 2 lignes, ellipsis)
  5. Nom catégorie (petit, vert émeraude)
  6. **Prix FCFA** (24px, gras, **VERT FONCÉ** — couleur argent)
  7. **Stock status** : "🟢 En stock" (vert) / "🟡 Stock limité" (ambre) / "🔴 Rupture" (rouge, bouton grisé)
  8. **Bouton "Ajouter au panier"** : invisible au repos → apparaît en slide-up sur hover de la carte. Mobile : toujours visible.

> 🔑 **Psycho-clé :** Le prix est **toujours en gras et en vert foncé** → association subconsciente "vert = argent bien dépensé".

---

### 🆕 SECTION 6 — NOUVEAUTÉS (Effet rareté / nouveauté)
**Même structure que Section 5** mais avec :
- Badge "NOUVEAU 🆕" sur chaque carte
- Titre : "Nos dernières arrivées"
- Source : endpoint `/api/home` → `nouveautes` (limité à 8 produits)

---

### 🌍 SECTION 7 — PARTENAIRES (Preuve sociale = Sécurité)
L'ancien design avait un système solaire planétaire cool mais **complexe et non-responsive** (l'animation a 400 lignes de media queries !).

**Version V2 — Mieux, plus simple, tout aussi captivante :**

**"Ruban de logos défilant infini"** (marquee CSS horizontal) :
- 2 rangées de logos qui **défilent en continu lentement** (20s, linear, infinite)
- Rangée 1 (gauche→droite) : Yara · Bayer · Bejo · Sanfu · Happy
- Rangée 2 (droite→gauche) : GSN Semences · Autres partenaires…
- Au hover d'un logo : **pause de l'animation + zoom 1.1 + ombre**
- Au centre ou sur le côté : titre "Ils nous font confiance" + sous-titre

> ✅ Avantages : CSS uniquement (pas de JS), **100% responsive**, fluide, lisible, pas d'overwhelm visuel.

---

### 💬 SECTION 8 — TÉMOIGNAGES CLIENTS (Preuve sociale N°1)
**🔑 Obligatoire** : 72% des consommateurs font confiance aux avis en ligne autant qu'à un bouche-à-oreille.

**Design — Carrousel de 3 témoignages** (dot navigation + flèches) :
- Photo (avatar) du client (ou icône si pas de photo)
- **5 étoiles jaunes** ⭐⭐⭐⭐⭐ au-dessus du texte
- Citation (texte italic, gris moyen, 18px, entre guillemets)
- Nom + prénom + *"Agriculteur à Kpalimé"*
- Optionnel : montant de sa commande ou type de produits achetés

**Contenu (à démarrer avec ces exemples avant d'avoir de vrais avis) :**
> *"Les engrais Yara d'AgroShop ont doublé mon rendement de maïs cette année. Service impeccable !"*
> — **Kossi A.**, Agriculteur à Sokodé

---

### 📚 SECTION 9 — BLOG (Contenu = Crédibilité)
3 derniers articles de blog (endpoint `/api/home` → `derniers_articles`)

**Carte article :**
- Image en-tête (hauteur 200px, cover)
- **Tag couleur** (ex: "Conseils" = badge vert, "Équipement" = badge bleu, "Saison" = badge orange)
- Date de publication (petit, gris)
- Titre article (gras, 20px, max 2 lignes)
- Extrait (3 lignes max, ellipsis)
- **Lien "Lire la suite →"** (vert émeraude, souligné au hover)
- CTA sous la grille : **"Voir tous les articles →"**

---

### 📧 SECTION 10 — NEWSLETTER (Capture de leads)
**Section pleine largeur, fond dégradé vert foncé → vert émeraude**

**2 colonnes :**
| Texte | Formulaire |
|---|---|
| H2 blanc : "Recevez nos conseils agricoles et offres exclusives"<br>P blanc cassé : "1 email par semaine, pas de spam. Désabonnez-vous en 1 clic." | Champ **email** (placeholder "Votre adresse email") + **Bouton AMBRE "S'inscrire →"** (même style que CTA HERO)<br>Sous le champ : case opt-in (cochée par défaut) "J'accepte de recevoir la newsletter" |

> 🔑 **Psycho-clé :** Mettez une **micro-offerte** si possible → *"Inscrivez-vous et recevez -5% sur votre première commande"* → x3 plus d'inscriptions.

---

### 🏁 SECTION 11 — FOOTER (4 colonnes)
**Toujours les mêmes infos, partout sur le site :**

| COL 1 — AgroShop | COL 2 — Navigation | COL 3 — Aide | COL 4 — Contact |
|---|---|---|---|
| Logo<br>Courte description<br>Réseaux sociaux (WhatsApp business, Facebook, Instagram, TikTok) | Accueil<br>Nos produits<br>Catégories<br>Blog<br>À propos | FAQ<br>Contact<br>Suivi commande<br>CGU<br>Politique confidentialité | 📞 +228 XX XX XX XX<br>📞 +228 XX XX XX XX<br>📞 WhatsApp direct (bouton flottant !)<br>📍 Adresse physique, Lomé<br>🕐 Horaires d'ouverture |

**Copyright** : © 2026 AgroShop — Tous droits réservés · Paiement : MoMo · CB · Cash

---

### 🎁 ÉLÉMENTS FLOTTANTS OBLIGATOIRES (Toujours visibles)
1. **Bouton WhatsApp flottant** (bas-droite, icône verte, pulse) → `https://wa.me/XXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20produits`
   - 🔑 **Psycho-clé :** 60%+ des interactions clients passeront par WhatsApp. **INCONTOURNABLE** pour l'Afrique.
2. **Bouton "Retour en haut ↑"** (visible quand scroll > 300px, fond vert, coin inférieur gauche)

---

## 🧠 IV. LES 12 ÉLÉMENTS "INCONTOURNABLES" POUR QU'ON NE PUISSE PLUS S'EN PASSER

| # | Élément | Pourquoi c'est indispensable |
|---|---|---|
| 1 | **Panier persisté** (localStorage + Pinia) | L'utilisateur ferme l'onglet → rouvre → panier toujours là = ✅ réassurance |
| 2 | **Badge panier animé** (shake + chiffre incrémental) | Feedback sensoriel instantané → plaisir d'achat |
| 3 | **Recherche autosuggest** (mini aperçu produit) | Les 20% de rechercheurs convertissent 2x plus vite |
| 4 | **Micro-interactions partout** (hover lift, scale 1.03, slide-up boutons) | Notre cerveau aime les petits mouvements fluides → impression "qualité premium" |
| 5 | **Skeleton loaders** (faux contenu gris pendant chargement) | Réduit la frustration perçue du temps de chargement de -40% |
| 6 | **Toast notifications** (couleur selon statut) | Feedback immédiat sans bloquer le parcours |
| 7 | **Checkout en 3 étapes max** (coord → livraison → paie) | Chaque étape supplémentaire = -20% de conversion |
| 8 | **Suivi commande via numéro téléphone** (pas seulement référence) | Les agriculteurs oublient souvent la référence, mais retiennent leur numéro |
| 9 | **Stock visible** (En stock / Limité / Rupture) | Crée de l'urgence ("Il reste 3 en stock → j'achète vite") |
| 10 | **Produits similaires** sur la fiche produit | +25% de valeur panier moyenne via upsell |
| 11 | **Formulaire multi-étapes avec barre de progression** | L'utilisateur voit où il en est → abandon -30% |
| 12 | **Accessibilité (a11y)** | Alt text, contrastes OK, tabindex, aria-labels → meilleur référencement + inclusif |

---

## ⚙️ V. STACK TECHNIQUE RECOMMANDÉ POUR NUXT

À installer dans votre projet [front-end](file:///c:/composer/agroshop/front-end/) :

```bash
# Dans c:\composer\agroshop\front-end
npm install @pinia/nuxt pinia-plugin-persistedstate @vueuse/nuxt tailwindcss @tailwindcss/vite @nuxt/image @heroicons/vue
```

| Library | Usage |
|---|---|
| `@pinia/nuxt` + `pinia-plugin-persistedstate` | État global + persistance automatique panier |
| `@vueuse/nuxt` | useLocalStorage, useScroll, useDebounceFn (gain de code énorme) |
| `tailwindcss@3.4` + `@tailwindcss/vite` | Styling utility-first + design tokens cohérents |
| `@nuxt/image` | Optimisation + lazy loading images (images + rapides = + SEO + conversions) |
| `@heroicons/vue` | Icônes (lucide est mieux) |

---

Prêt à commencer l'implémentation ? Je peux :
1. **Créer le design system complet** (Tailwind config + palettes + composants UI de base)
2. **Coder la page d'accueil entière** (sections 1 à 11 + flottants)
3. **Créer l'architecture des pages + stores Pinia** (panier, etc.)

Dites-moi par où vous voulez commencer, et je lance ! 🚀🌿
        
            
toolName: todo_write
            
status: success
          
Todos updated: 4 items
          
Toutes les recommandations sont détaillées ci-dessus. Dis-moi quelle partie tu veux implémenter en premier !