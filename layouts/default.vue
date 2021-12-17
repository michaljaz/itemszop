<template>
  <v-app dark>
    <v-main>
      <v-app-bar
        height="70"
        elevation="4"
      >
        <v-container class="pa-0 fill-height">
          <v-toolbar-title>
            ItemSzop
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            class="green darken-4"
          >
            Zaloguj się
          </v-btn>
          <v-btn
            class="ml-2 green"
          >
            Zarejestruj się
          </v-btn>
        </v-container>
      </v-app-bar>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} ItemSzop</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
    }
  }
}
</script>
