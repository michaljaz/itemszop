<template>
  <div>
    <h1 class="display-1 mb-4">
      Ustawienia
    </h1>
    <v-text-field v-model="email" label="Email" readonly />
    <v-text-field v-model="displayName" label="Pseudonim" />
    <v-btn>Aktualizuj</v-btn>
  </div>
</template>
<script>
export default {
  name: 'PanelSettings',
  data () {
    return {
      email: this.$store.state.user.email,
      displayName: this.$store.state.user.displayName
    }
  },
  head () {
    return {
      title: 'Ustawienia'
    }
  }
}
</script>
