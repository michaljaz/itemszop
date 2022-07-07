<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="pagesList"
      sort-by="name"
      class="elevation-2"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ $t('titles.pages') }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn
            color="primary"
            dark
            @click="newPage"
          >
            {{ $t('actions.new_page') }}
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn color="primary" @click="applyPage(item);dialog=true">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn color="error" @click="dialog=false;dialogDelete=true;currentItem=item">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      max-width="700px"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">{{ $t('titles.page_config') }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="name"
                :label="$t('fields.page_name')"
                :rules="rules.name"
              />
              <v-text-field
                v-model="pageId"
                :label="$t('fields.page_id')"
                :rules="rules.pageId"
              />
              <TiptapEditor :editorcontent="content" @content="content=$event" />
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="accent"
            text
            @click="dialog=false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="savePage"
          >
            {{ $t('actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card outlined>
        <v-card-title class="text-h5">
          {{ $t('titles.are_you_sure') }}
        </v-card-title>
        <v-card-text>
          {{ $t('misc.after_server_delete') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialogDelete = false"
          >
            {{ $t('actions.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            text
            @click="deletePage"
          >
            {{ $t('actions.remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>

export default {
  name: 'ShopPages',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      valid: false,
      currentItem: null,
      dialog: false,
      dialogDelete: false,
      pageId: '',
      name: '',
      content: '',
      headers: [
        {
          text: this.$t('fields.page_name'),
          align: 'start',
          value: 'name'
        },
        {
          text: this.$t('fields.page_id'),
          value: 'pageId'
        },
        {
          text: this.$t('fields.actions'),
          value: 'actions',
          sortable: false
        }
      ],
      rules: {
        pageId: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        name: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('titles.pages')
    }
  },
  computed: {
    pagesList () {
      const result = []
      for (const pageId in this.shop.pages) {
        const page = Object.assign({}, this.shop.pages[pageId])
        page.pageId = pageId
        result.push(page)
      }
      return result
    }
  },
  methods: {
    applyPage (page) {
      this.pageId = page.pageId
      this.content = page.content
      this.name = page.name
    },
    savePage () {
      this.$refs.form.validate()
      if (this.valid) {
        const { shopid } = this.$route.params
        const { name, content, pageId } = this
        this.$fire.database.ref().child(`shops/${shopid}/pages/${pageId}`).set({
          name,
          content
        })
        this.dialog = false
      }
    },
    deletePage () {
      const { shopid } = this.$route.params
      const { pageId } = this.currentItem
      this.$fire.database.ref().child(`shops/${shopid}/pages/${pageId}`).remove()
      this.dialog = false
      this.dialogDelete = false
    },
    newPage () {
      this.dialog = true
      this.pageId = `${Math.random().toString(36).replace('0.', '')}`
      this.content = 'Treść'
      this.name = 'Strona'
    }
  }
}
</script>
