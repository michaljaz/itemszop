<template>
  <iframe style="position:fixed;top:0px;left:0px;width:100%;height:100%;border:0px" :src="src" />
</template>
<script>
export default {
  name: 'SubPage',
  data () {
    return {
      src: ''
    }
  },
  mounted () {
    const sub = window.location.hostname.split('.')[0]
    this.src = `/shop/${sub}`
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]+\.itemszop\.ga$/.test(window.location.hostname)) {
      window.top.location.href = process.env.baseUrl
    }
  }
}
</script>
<style>
body,html{
  overflow:hidden;
}
</style>
