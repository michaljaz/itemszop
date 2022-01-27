import colors from 'vuetify/es5/util/colors'

const productionUrl = 'https://itemszop.tk'
const baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : 'http://localhost:8080'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

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

  router: {
    middleware: [
      'auth'
    ]
  },

  env: {
    baseUrl
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/TiptapVuetify.js', mode: 'client' }
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
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: 'AIzaSyAgqotnCT9d_zcmwrE8mHWiC9JL8r75U-s',
          authDomain: 'sklepmc-c7516.firebaseapp.com',
          databaseURL: 'https://sklepmc-c7516-default-rtdb.europe-west1.firebasedatabase.app',
          projectId: 'sklepmc-c7516',
          storageBucket: 'sklepmc-c7516.appspot.com',
          messagingSenderId: '889784816765',
          appId: '1:889784816765:web:7c84a7bce9b480ce7d4d14'
        },
        services: {
          database: true,
          auth: {
            initialize: {
              onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION'
            }
          }
        }
      }
    ]
  ],

  axios: {
    baseURL:`${baseUrl}/api`
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
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
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/lib', 'tiptap-vuetify']
  },
  serverMiddleware: process.env.NODE_ENV === 'production' ? [] : ['~/api/rcon.js','~/api/voucher.js','~/api/przelew.js','~/api/sms.js'],
  server: {
    port: 8080
  }
}
