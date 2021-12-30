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
          <v-switch
            v-model="sms"
            label="Płatność SMS'em"
          />
          <v-select
            v-if="sms"
            :items="smsTypes"
            label="Wybierz sms"
          />
          <v-switch
            v-model="przelew"
            label="Płatność przelewem"
          />
          <v-text-field
            v-if="przelew"
            type="number"
            label="Koszt (w zł)"
            autocomplete="new-password"
          />
          <v-select
            item-text="serverName"
            item-value="serverId"
            :items="servers"
            label="Wybierz serwer"
          />
          <v-textarea
            label="Komendy do wywołania na serwerze"
            value="say [nick] kupil cos tam"
          />
          <Editor />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            rounded
            @click="dialog = false"
          >
            Anuluj
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            rounded
            @click="saveService"
          >
            Zapisz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col
        v-for="service in services"
        :key="service.title"
        cols="12"
        lg="4"
        md="6"
      >
        <v-card max-width="344" elevation="10">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ service.title }}
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
            <v-btn text color="blue" rounded>
              Edytuj
            </v-btn>
            <v-btn text color="red" rounded>
              Usuń
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
    },
    services: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      dialog: false,
      sms: false,
      przelew: false,
      smsTypes: [
        '71480 - 1zł (1.23 z VAT)',
        '72480 - 2zł (2.46 z VAT)',
        '73480 - 3zł (3.69 z VAT)',
        '74480 - 4zł (4.92 z VAT)',
        '75480 - 5zł (6.15 z VAT)',
        '76480 - 6zł (7.38 z VAT)',
        '79480 - 9zł (11.07 z VAT)',
        '91400 - 14zł (17.22 z VAT)',
        '91900 - 19zł (23.37 z VAT)',
        '92022 - 20zł (24.60 z VAT)',
        '92521 - 25zł (30.75 z VAT)',
        '92550 - 25zł (30.75 z VAT)'
      ]
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
