<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        {{ $t('titles.temp_announcement') }}
      </v-card-title>
      <v-card-text>
        <v-switch
          v-model="enabled"
          class="mt-0"
          :label="$t('fields.module_enabled')"
        />
        <TiptapEditor v-if="enabled" :editorcontent="content" @content="content=$event" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="save">
          {{ $t('actions.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ShopTemp',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      content: this.shop.announcement,
      enabled: this.shop.announcement
    }
  },
  methods: {
    save () {
      const { shopid } = this.$route.params
      this.$fire.database.ref().child(`shops/${shopid}`).update({
        announcement: this.enabled ? this.content : ''
      })
    }
  }
}
</script>
