<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
    <v-footer class="justify-center">
      <span>&copy; {{ new Date().getFullYear() }} ItemSzop</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
