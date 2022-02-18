<template>
  <v-app dark>
    <v-main>
      <nuxt v-if="!$slots.default" />
      <slot />
    </v-main>
    <v-footer class="justify-center">
      <span>
        &copy; {{ new Date().getFullYear() }}
        <a :href="baseUrl">ItemSzop</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      baseUrl: process.env.baseUrl
    }
  }
}
</script>
