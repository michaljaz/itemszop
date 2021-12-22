<template>
  <v-app dark>
    <v-container>
      <center>
        <div class="display-2 mt-7">
          <span v-if="error.statusCode === 404">
            {{ pageNotFound }}
          </span>
          <span v-else>
            {{ otherError }}
          </span>
        </div>
        <v-btn to="/" color="primary" class="mt-10">
          Przejdź do strony głównej
        </v-btn>
      </center>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 - Nie znaleziono strony',
      otherError: 'Nastąpił błąd'
    }
  },
  head () {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return { title }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
