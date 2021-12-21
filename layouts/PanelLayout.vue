<template>
  <v-app dark>
    <v-main>
      <v-app-bar
        height="70"
        elevation="4"
        fixed
        app
      >
        <v-container class="pa-0 fill-height justify-space-between">
          <v-toolbar-title style="cursor: pointer" class="hidden-sm-and-down mr-3" @click="$router.push('/')">
            ItemSzop
          </v-toolbar-title>

          <v-menu
            offset-y
            right
          >
            <template #activator="{ on, attrs }">
              <v-toolbar-items>
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="hidden-md-and-up">
                    mdi-cart
                  </v-icon>
                  <span class="hidden-sm-and-down">Sklepy</span>
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </v-toolbar-items>
            </template>

            <v-list>
              <v-list-item
                v-for="item in shops"
                :key="item"
                link
              >
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-toolbar-title style="cursor: pointer" class="hidden-md-and-up" @click="$router.push('/')">
            ItemSzop
          </v-toolbar-title>
          <v-spacer class="hidden-sm-and-down" />
          <v-menu
            offset-y
            left
          >
            <template #activator="{ on, attrs }">
              <v-toolbar-items>
                <v-btn
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon class="hidden-md-and-up">
                    mdi-account
                  </v-icon>
                  <span class="hidden-sm-and-down">Konto</span>
                  <v-icon>mdi-menu-down</v-icon>
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
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'PanelLayout',
  computed: {
    ...mapGetters([
      'shops'
    ])
  },
  mounted () {
    const { uid } = this.$fire.auth.currentUser
    const ref = this.$fire.database.ref(`users/${uid}`)
    ref.get().then((s) => {
      const shops = s.val()
      if (shops) {
        this.updateShops(Object.keys(shops))
      }
    })
  },
  methods: {
    ...mapMutations([
      'updateShops'
    ]),
    signOut () {
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
