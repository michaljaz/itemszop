<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Zaloguj się
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="email" :rules="rulesEmail" label="Email" />
        <v-text-field
          v-model="password"
          name="input-10-2"
          :rules="rulesPassword"
          label="Hasło"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
        >
          Dalej
        </v-btn>
        <v-btn
          color="info"
          to="/auth/signup"
        >
          Nie mam jeszcze konta
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  layout: 'AuthLayout',
  data () {
    return {
      email: '',
      password: '',
      showPassword: false,
      rulesEmail: [
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Nieprawidłowy format'
      ],
      rulesPassword: [
        value => !!value || 'Wpisz hasło',
        value => (value && value.length >= 6) || 'Minimalnie 6 znaków'
      ]
    }
  },
  head () {
    return {
      title: 'Logowanie'
    }
  }
}
</script>
