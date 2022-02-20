<template>
  <v-app dark>
    <v-main>
      <nuxt v-if="!$slots.default" />
      <slot />
    </v-main>
    <v-footer class="justify-center">
      <span>
        &copy; {{ new Date().getFullYear() }}
        <a :href="mainUrl">ItemSzop</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      mainUrl: process.env.mainUrl
    }
  }
}
</script>
