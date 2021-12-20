<template>
  <div>
    <v-card class="pt-1 pb-4">
      <v-card-title class="headline justify-center">
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
        <v-dialog
          v-model="dialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="text-h5">
              Błąd
            </v-card-title>
            <v-card-text>
              {{ dialogContent }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="dialog=false"
              >
                Anuluj
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn
              width="100%"
              color="primary"
              @click="submit"
            >
              Dalej
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              width="100%"
              color="info"
              to="/auth/signup"
            >
              Zarejestruj się
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignIn',
  layout: 'AuthLayout',
  data () {
    return {
      dialogContent: '',
      dialog: false,
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
  computed: {
    ...mapGetters([
      'loggedIn',
      'errorCodes'
    ])
  },
  watch: {
    loggedIn (newVal, oldVal) {
      if (newVal) {
        this.$router.push('/panel')
      }
    }
  },
  methods: {
    errorDialog (e) {
      this.dialogContent = this.errorCodes[e.code] || e.message
      this.dialog = true
    },
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            // nothing
          })
          .catch((e) => {
            this.errorDialog(e)
          })
      }
    }
  }
}
</script>
