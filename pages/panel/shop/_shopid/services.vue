<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card elevation="10" outlined>
        <v-card-title>
          <span class="text-h5">Konfiguracja usługi</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Nazwa usługi"
            autocomplete="new-password"
          />
          <v-select
            item-text="serverName"
            item-value="serverId"
            :items="servers"
            label="Wybierz serwer"
          />
          <Editor />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="saveService"
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card
      max-width="344"
      elevation="10"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Pakiet VIP
          </v-list-item-title>
          <v-list-item-subtitle>
            SMS: 10zł
            <br>
            Przelew: 10zł
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
          tile
          size="80"
          color="grey"
        />
      </v-list-item>

      <v-card-actions>
        <v-spacer />
        <v-btn text color="blue">
          Edytuj
        </v-btn>
        <v-btn text color="red">
          Usuń
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-btn
      large
      block
      text
      color="blue"
      class="mt-5"
      @click="newService"
    >
      Nowa usługa
    </v-btn>
  </div>
</template>
<script>
import Editor from '~/components/TiptapEditor'

export default {
  name: 'ShopServices',
  components: {
    Editor
  },
  props: {
    shop: {
      type: Object,
      default: () => ({})
    },
    servers: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      dialog: false
    }
  },
  head () {
    return {
      title: 'Usługi'
    }
  },
  methods: {
    newService () {
      this.dialog = true
    },
    saveService () {
      this.dialog = false
    }
  }
}
</script>
