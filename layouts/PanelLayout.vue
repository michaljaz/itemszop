<template>
  <v-app dark>
    <v-main>
      <v-app-bar
        height="70"
        elevation="4"
        fixed
      >
        <v-container class="pa-0 fill-height justify-space-between">
          <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer" />
          <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
            ItemSzop
          </v-toolbar-title>
          <v-menu
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-toolbar-items>
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  Konto
                </v-btn>
              </v-toolbar-items>
            </template>

            <v-list>
              <v-list-item
                @click="signOut"
              >
                <v-list-item-title>Wyloguj się</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-app-bar-nav-icon class="hidden-md-and-up" to="/github">
            <v-icon>mdi-github</v-icon>
          </v-app-bar-nav-icon>
        </v-container>
      </v-app-bar>
      <Nuxt />
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} ItemSzop</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'PanelLayout',
  methods: {
    signOut () {
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
