<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->
    <div v-html="page.content" />
    <!--eslint-enable-->
  </div>
</template>
<script>
export default {
  name: 'ServicePage',
  layout: 'shop',
  props: {
    shopId: {
      type: String,
      required: true
    },
    shopPath: {
      type: String,
      required: true
    },
    shop: {
      type: Object,
      required: true
    },
    servers: {
      type: Object,
      required: true
    },
    config: {
      type: Object,
      required: true
    }
  },
  head () {
    return {
      title: this.$t('actions.description')
    }
  },
  computed: {
    page () {
      return this.shop.pages[this.$route.params.pageid]
    }
  },
  watch: {
    servers () {
      this.updateBreadCrumb()
    }
  },
  mounted () {
    this.updateBreadCrumb()
  },
  methods: {
    updateBreadCrumb () {
      this.$emit('breadcrumb', [{
        text: this.$t('titles.shop'),
        disabled: false,
        href: `${this.shopPath}/`
      },
      {
        text: this.page.name,
        disabled: true
      }])
    }
  }
}
</script>
