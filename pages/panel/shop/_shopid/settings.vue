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
      console.log(this.$route.params.shopid)
      this.$fire.database.ref().child(`shops/${this.$route.params.shopid}`).remove().then(() => {
        this.$fire.database.ref().child(`users/${uid}/${this.$route.params.shopid}`).remove()
      })
    }
  }
}
</script>
