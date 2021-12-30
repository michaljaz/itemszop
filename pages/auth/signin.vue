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
          <v-text-field v-model="email" :rules="rules.email" label="Email" />
          <v-text-field
            v-model="password"
            :rules="rules.password"
            label="Hasło"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-btn
            text
            color="indigo"
            small
            @click="reset_dialog=true"
          >
            Resetowanie hasła
          </v-btn>
        </v-form>
        <v-snackbar
          v-model="snackbar"
        >
          Wysłano emaila z linkiem do zresetowania hasła
          <template #action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Zamknij
            </v-btn>
          </template>
        </v-snackbar>
        <v-dialog
          v-model="reset_dialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="text-h5">
              Resetowanie hasła
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form_reset"
                v-model="reset_valid"
              >
                <v-text-field v-model="reset_email" :rules="rules.email" label="Email" />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="reset_dialog=false"
              >
                Anuluj
              </v-btn>
              <v-btn
                color="green darken-1"
                @click="resetPassword"
              >
                Resetuj
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        <v-spacer />
        <v-btn
          class="indigo darken-4"
          large
          @click="submit"
        >
          Dalej
        </v-btn>
        <v-btn
          text
          color="info"
          to="/auth/signup"
          large
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
  data () {
    return {
      snackbar: false,
      reset_valid: false,
      reset_email: '',
      reset_dialog: false,
      dialogContent: '',
      dialog: false,
      valid: false,
      email: '',
      password: '',
      showPassword: false,
      rules: {
        email: [
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Nieprawidłowy format'
        ],
        password: [
          value => !!value || 'Wpisz hasło',
          value => (value && value.length >= 6) || 'Minimalnie 6 znaków'
        ]
      }
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
    resetPassword () {
      this.$refs.form_reset.validate()
      if (this.reset_valid) {
        this.$fire.auth.sendPasswordResetEmail(this.reset_email)
          .then(() => {
            this.snackbar = true
          })
      }
    },
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
