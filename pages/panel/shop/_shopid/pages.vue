<template>
  <div>
    <h1 class="display-1 mt-3 mb-5">
      {{ $t('titles.pages') }}
    </h1>
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
  head () {
    return {
      title: this.$t('titles.pages')
    }
  }
}
</script>
