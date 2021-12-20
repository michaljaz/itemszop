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
  mounted () {
    console.log(this.$fire.auth)
  },
  methods: {
    signOut () {
      this.$fire.auth.signOut()
      this.$router.push('/')
    }
  }
}
</script>
