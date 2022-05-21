<template>
  <iframe :src="url" width="100%" style="border:0px;height:100%; position:absolute;" />
</template>
<script>

export default {
  name: 'ShopPreview',
  props: {
    shop: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }
}
</script>
