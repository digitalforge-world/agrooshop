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
      title: 'AgroShop TG | Premier Fournisseur d\'Intrants & Équipements Agricoles au Togo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AgroShop TG - Vente d\'engrais certifiés, produits phytosanitaires, semences, systèmes d\'irrigation et équipements agricoles au Togo. BP 12941 Lomé.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/Agroshopproduit .png' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
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
