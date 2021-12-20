<template>
  <div>
    <v-btn color="red" @click="signOut">
      Wyloguj się
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  methods: {
    signOut () {
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
