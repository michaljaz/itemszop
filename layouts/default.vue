<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer class="justify-center">
      <span>
        &copy; {{ new Date().getFullYear() }}
        <a href="https://itemszop.vercel.app">ItemSzop</a>
        by
        <a href="https://github.com/michaljaz">michaljaz</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
