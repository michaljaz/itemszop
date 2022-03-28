import colors from 'vuetify/es5/util/colors'

const mainUrl = 'https://itemszop.tk'
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080
const netlifyPort = 8888

let baseUrl = process.env.NETLIFY_DEV ? `http://localhost:${netlifyPort}` : `http://localhost:${port}`
if (process.env.NODE_ENV === 'production') {
  baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.URL
}

let firebaseConfig
try {
  firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
} catch (e) {
  console.error('Klucze zostały źle skonfigurowane w zmiennej środowiskowej FIREBASE_CONFIG')
  process.exit()
}

let inject = (() => {
  messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
      body: payload.notification.body
    }

    self.registration.showNotification(notificationTitle,
  notificationOptions)
  })
}).toString()
inject = inject.substring(8, inject.length - 1)

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: (process.env.VERCEL || process.env.NETLIFY) ? 'static' : 'server',

  ssr: false,

  loadingIndicator: {
    name: 'rotating-plane',
    color: '#1976d2',
    background: 'black'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'ItemSzop - %s',
    title: 'Darmowy sklep serwera minecraftowego',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    mainUrl,
    baseUrl,
    singleShopId: process.env.SINGLE_SHOP
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/gtag.js', mode: 'client' },
    { src: '~/plugins/tiptapvuetify.js', mode: 'client' },
    { src: '~/plugins/regex.js' },
    { src: '~/plugins/vuedraggable.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv',
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', {
      fix: true
    }],
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    ['@nuxtjs/pwa', {
      meta: {
        title: 'ItemSzop',
        author: 'michaljaz'
      },
      manifest: {
        name: 'ItemSzop',
        short_name: 'ItemSzop',
        description: 'Darmowy sklep serwera minecraftowego',
        lang: 'pl'
      }
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    [
      '@nuxtjs/firebase',
      {
        config: firebaseConfig.publicConfig,
        services: {
          messaging: {
            createServiceWorker: true,
            inject
          },
          database: true,
          auth: {
            initialize: {
              onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION'
            }
          }
        }
      }
    ],
    [
      '@nuxtjs/i18n',
      {
        locales: [
          {
            code: 'pl',
            file: 'pl.js'
          }
        ],
        defaultLocale: 'pl',
        langDir: 'lang/'
      }
    ],
    [
      'nuxt-webfontloader',
      {
        google: {
          families: ['Roboto:100,300,400,500,700,900&display=swap'] // Loads Roboto in all weights.
        }
      }
    ],
    ['@nuxtjs/router', {
      path: 'router',
      fileName: 'index.js',
      keepDefaultRouter: true
    }]
  ],

  axios: {
    baseURL: (process.env.NETLIFY || process.env.NETLIFY_DEV) ? `${baseUrl}/.netlify/functions` : `${baseUrl}/api`
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.darken2
        },
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.blue.darken2
        }
      }
    },
    defaultAssets: {
      font: false
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/lib', 'tiptap-vuetify'],
    extractCSS: true
  },
  serverMiddleware: process.env.VERCEL || process.env.NETLIFY || process.env.NETLIFY_DEV ? [] : [
    '~/api/rcon.js',
    '~/api/voucher.js',
    '~/api/microsms_transfer.js',
    '~/api/microsms_sms.js',
    '~/api/lvlup.js',
    '~/api/lvlup_webhook.js'
  ],
  server: {
    port,
    host
  },
  generate: {
    fallback: true
  }
}
