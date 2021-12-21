<template>
  <div>
    <v-container>
      <v-btn
        v-for="item in shops"
        :key="item"
      >
        {{ item }}
      </v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  layout: 'PanelLayout',
  data () {
    return {
      shops: []
    }
  },
  mounted () {
    const { uid } = this.$fire.auth.currentUser
    const ref = this.$fire.database.ref(`users/${uid}`)
    ref.get().then((s) => {
      const shops = s.val()
      console.log(shops)
      if (shops) {
        this.shops = Object.keys(shops)
      }
    })
  }
}
</script>
