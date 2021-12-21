<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-btn class="mb-2 pl-2" to="/" text>
          <v-icon>mdi-arrow-left-thin</v-icon>
          Powrót do strony głównej
        </v-btn>
        <nuxt-child />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'BaseAuth'
}
</script>
