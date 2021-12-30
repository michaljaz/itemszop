<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-card-title class="headline justify-center">
            Ustawienia
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="email" label="Email" readonly />
            <v-text-field v-model="displayName" label="Pseudonim" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" rounded text @click="update">
              Aktualizuj
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'PanelSettings',
  data () {
    return {
      email: this.$store.state.user.email,
      displayName: this.$store.state.user.displayName
    }
  },
  head () {
    return {
      title: 'Ustawienia'
    }
  },
  methods: {
    update () {
      const { displayName } = this
      this.$fire.auth.currentUser.updateProfile({ displayName }).then(() => {
        document.location.reload()
      })
    }
  }
}
</script>
