<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Zarejestruj się
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="email" :rules="emailRules" label="Email" />
        <v-text-field v-model="nick" label="Pseudonim" />
        <v-text-field
          v-model="password"
          label="Hasło"
          type="password"
          :rules="passwordRules"
        />
        <v-text-field
          v-model="confirmPassword"
          label="Powtórz Hasło"
          type="password"
          :rules="confirmPasswordRules"
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
          to="/auth/signin"
        >
          Mam już konto
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  layout: 'AuthLayout',
  data () {
    return {
      nick: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailRules: [
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Nieprawidłowy format'
      ],
      passwordRules: [
        value => !!value || 'Wpisz hasło',
        value => (value && value.length >= 6) || 'Minimum 6 znaków'
      ],
      confirmPasswordRules: [
        value => !!value || 'Wpisz hasło',
        value =>
          value === this.password || 'Hasła do siebie nie pasują.'
      ]
    }
  },
  head () {
    return {
      title: 'Rejestracja'
    }
  }
}
</script>
