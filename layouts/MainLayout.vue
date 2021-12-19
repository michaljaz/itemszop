<template>
  <v-app dark>
    <v-main>
      <v-app-bar
        height="70"
        elevation="4"
      >
        <v-container class="pa-0 fill-height justify-space-between">
          <v-app-bar-nav-icon class="hidden-md-and-up" />
          <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
            ItemSzop
          </v-toolbar-title>

          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn
              text
              to="/auth/signin"
            >
              Zaloguj się
            </v-btn>
            <v-btn
              text
              to="/auth/signup"
            >
              Zarejestruj się
            </v-btn>
          </v-toolbar-items>
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
  name: 'MainLayout'
}
</script>
