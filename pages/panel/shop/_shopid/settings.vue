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
            <v-btn color="green" rounded text @click="save">
              Zapisz
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="pt-1 mt-5 pb-4" elevation="10">
          <v-card-title class="headline">
            Ustawienia zaawansowane
          </v-card-title>
          <v-card-text>
            <v-btn color="red" @click="removeDialog">
              Usuń sklep
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Czy jesteś tego pewien?
        </v-card-title>
        <v-card-text>
          <v-alert
            border="left"
            color="red"
            dark
          >
            Jeśli tego nie przeczytasz staną się nieoczekiwane złe rzeczy!
          </v-alert>
          Tej czynności nie można cofnąć.
          Spowoduje to trwałe usunięcie sklepu serwera oraz wszystkich rzeczy w tym sklepie takich jak Serwerów, Usług, Voucherów, Płatności.
          <br>
          <div class="pt-2">
            Wpisz <strong>{{ $route.params.shopid }}</strong> aby potwierdzić swoją operację:
            <v-text-field v-model="cdel" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" text rounded @click="dialog=false">
            Anuluj
          </v-btn>
          <v-btn color="red" :disabled="cdel===$route.params.shopid ? false : true" @click="remove()">
            Usuwam sklep
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      cdel: '',
      goal: this.shop.goal,
      name: this.shop.name,
      dialog: false
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
    removeDialog () {
      this.dialog = true
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
