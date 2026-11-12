import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Dummy Shop',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
  routeRules: {
    '/': { redirect: '/products' }
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['hostlink-pc.tail389639.ts.net']
    }
  }
})
