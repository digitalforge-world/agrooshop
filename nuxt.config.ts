import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      title: 'AgroShop Togo | Meilleure Entreprise Agricole - Engrais, Semences, Irrigations & Phytosanitaires',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AgroShop Togo : Vente d\'engrais certifiés (Urée 46% N, NPK 15-15-15), semences hybrides, produits phytosanitaires, systèmes d\'irrigation goutte-à-goutte, pompes et outillages agricoles. Livraison rapide à Lomé et dans tout le Togo.' },
        { name: 'keywords', content: 'agroshop, AgroShop Togo, agriculture Togo, boutique agricole Lomé, engrais NPK, Urée 46%, semences maïs, produits phytosanitaires, irrigation goutte à goutte, matériel agricole Togo, Yara Togo, insecticides, fongicides' },
        { name: 'author', content: 'AgroShop Togo' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        
        // Open Graph / Facebook / WhatsApp
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'AgroShop Togo' },
        { property: 'og:title', content: 'AgroShop Togo | Meilleure Entreprise Agricole au Togo' },
        { property: 'og:description', content: 'Achetez vos engrais, semences, produits phytosanitaires et matériels d\'irrigation certifiés avec livraison partout au Togo.' },
        { property: 'og:image', content: 'https://agroshoptg.store/images/logo.png' },
        { property: 'og:url', content: 'https://agroshoptg.store/' },
        { property: 'og:locale', content: 'fr_FR' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'AgroShop Togo | Solutions & Intrants Agricoles' },
        { name: 'twitter:description', content: 'Vente d\'engrais, semences, matériels d\'irrigation et outillages agricoles au Togo.' },
        { name: 'twitter:image', content: 'https://agroshoptg.store/images/logo.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'canonical', href: 'https://agroshoptg.store/' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            'name': 'AgroShop Togo',
            'description': 'Boutique et plateforme leader dans la vente d\'intrants agricoles, engrais certifiés, semences, phytosanitaires et systèmes d\'irrigation au Togo.',
            'url': 'https://agroshoptg.store/',
            'logo': 'https://agroshoptg.store/images/logo.png',
            'image': 'https://agroshoptg.store/images/logo.png',
            'telephone': '+22896538930',
            'priceRange': 'FCFA',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Av. de la chance, Tokoin',
              'addressLocality': 'Lomé',
              'addressRegion': 'Maritime',
              'postalCode': 'BP 12941',
              'addressCountry': 'TG'
            },
            'openingHoursSpecification': [
              {
                '@type': 'OpeningHoursSpecification',
                'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                'opens': '07:00',
                'closes': '18:00'
              }
            ]
          })
        }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      backendBaseUrl: process.env.NUXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000'
    }
  },

  nitro: {
    prerender: {
      ignore: ['/admin/**', '/admin']
    }
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'admin-sso-gateway',
        path: '/admin/auth/v1/sso-login-gateway-98f7a2b91c84',
        file: '~/pages/admin/sso-gateway.vue'
      })
      pages.push({
        name: 'admin-visites',
        path: '/admin/visites',
        file: '~/pages/admin/visites.vue'
      })
      pages.push({
        name: 'admin-visites-journal',
        path: '/admin/visites/journal',
        file: '~/pages/admin/visites-journal.vue'
      })
      pages.push({
        name: 'admin-produits',
        path: '/admin/produits',
        file: '~/pages/admin/produits.vue'
      })
      pages.push({
        name: 'admin-commandes',
        path: '/admin/commandes',
        file: '~/pages/admin/commandes.vue'
      })
      pages.push({
        name: 'admin-blog',
        path: '/admin/blog',
        file: '~/pages/admin/blog.vue'
      })
      pages.push({
        name: 'admin-categories',
        path: '/admin/categories',
        file: '~/pages/admin/categories.vue'
      })
      pages.push({
        name: 'admin-utilisateurs',
        path: '/admin/utilisateurs',
        file: '~/pages/admin/utilisateurs.vue'
      })
    }
  }
})
