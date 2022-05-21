<template>
  <v-app dark :style="$vuetify.theme.dark ? '' : `background:#eee`">
    <v-main>
      <nuxt v-if="!$slots.default" />
      <slot />
    </v-main>
    <v-footer v-if="!inframe" class="justify-center">
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
  },
  computed: {
    inframe () {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }
  }
}
</script>
