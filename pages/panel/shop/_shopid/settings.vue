<template>
  <div>
    <v-text-field label="Nazwa sklepu" />
    Cel miesięczny {{ goal }} zł
    <v-slider
      v-model="goal"
      min="1"
      max="500"
    />
    <v-btn color="red" @click="remove">
      Usuń sklep
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopSettings',
  props: {
    shop: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      goal: 0
    }
  },
  methods: {
    remove () {
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref().child(`shops/${this.$route.params.shopid}`).remove().then(() => {
        this.$fire.database.ref().child(`users/${uid}/${this.$route.params.shopid}`).remove()
      })
    }
  }
}
</script>
