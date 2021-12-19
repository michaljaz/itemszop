<template>
  <div>
    User panel
  </div>
</template>

<script>
export default {
  name: 'PanelPage',
  mounted () {
    console.log(this.$fire.auth)
  }
}
</script>
