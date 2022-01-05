<template>
  <div>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pt-1 pb-4" elevation="10">
          <v-card-title class="headline">
            Ustawienia
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="Nazwa sklepu" />
            Cel miesięczny {{ goal }} zł
            <v-slider
              v-model="goal"
              min="1"
              max="500"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" rounded text @click="save">
              Zapisz
            </v-btn>
            <v-btn color="red" rounded text @click="remove">
              Usuń sklep
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'ShopSettings',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      goal: this.shop.goal,
      name: this.shop.name
    }
  },
  head () {
    return {
      title: 'Ustawienia'
    }
  },
  methods: {
    save () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}`).update({
        name: this.name,
        goal: this.goal
      })
    },
    remove () {
      if (this.shop.servers) {
        let deleted = 0
        for (const serverId in this.shop.servers) {
          this.$fire.database.ref().child(`servers/${serverId}`).remove().then(() => {
            deleted++
            if (deleted === Object.keys(this.shop.servers).length) {
              this.removeShop()
            }
          })
        }
      } else {
        this.removeShop()
      }
    },
    removeShop () {
      const { shopid } = this.$route.params
      const { uid } = this.$fire.auth.currentUser
      this.$fire.database.ref().child(`shops/${shopid}`).remove().then(() => {
        this.$fire.database.ref().child(`users/${uid}/${shopid}`).remove()
      })
    }
  }
}
</script>
