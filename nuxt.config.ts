import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  app: {
    head: {
      title: 'AgroShop - Intrants Agricoles & Quincaillerie au Togo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plateforme N°1 en engrais, produits phytosanitaires, semences, systèmes d\'irrigation et matériel de quincaillerie au Togo.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      backendBaseUrl: process.env.NUXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000'
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
        file: '~/pages/admin/visites/journal.vue'
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
