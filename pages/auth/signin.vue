<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Zaloguj się
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field v-model="email" :rules="rulesEmail" label="Email" />
          <v-text-field
            v-model="password"
            :rules="rulesPassword"
            label="Hasło"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="submit"
        >
          Dalej
        </v-btn>
        <v-btn
          color="info"
          to="/auth/signup"
        >
          Zarejestruj się
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignIn',
  layout: 'AuthLayout',
  computed: {
    ...mapGetters([
      'loggedIn'
    ])
  },
  watch: {
    loggedIn (newVal, oldVal) {
      if (newVal) {
        this.$router.push('/panel')
      }
    }
  },
  data () {
    return {
      valid: false,
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
  },
  methods: {
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            // nothing
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
}
</script>
