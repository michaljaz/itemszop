<template>
  <div>
    <v-btn color="red" @click="remove">
      Usuń sklep
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopSettings',
  methods: {
    remove () {
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref().child(`users/${uid}`).remove()
    }
  }
}
</script>
