<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ server.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            Coś tam
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-for="item in shop.servers"
      :key="item.name"
      large
      block
      text
      class="mb-2"
      @click="serverDialog(item)"
    >
      {{ item.name }}
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'ShopIndex',
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
      dialog: false,
      server: {
        name: ''
      }
    }
  },
  methods: {
    serverDialog (server) {
      this.dialog = true
      this.server = server
    }
  }
}
</script>
