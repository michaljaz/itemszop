<template>
  <div>
    <v-card class="pt-1 pb-4">
      <v-card-title class="headline justify-center">
        Zarejestruj się
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field v-model="email" :rules="emailRules" label="Email" />
          <v-text-field v-model="displayName" :rules="nameRules" label="Pseudonim" />
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
        </v-form>
        <v-dialog
          v-model="dialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="text-h5">
              {{ dialogTitle }}
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
              <v-btn
                v-if="nextButton"
                color="green darken-1"
                text
                @click="$router.push('/auth/signin')"
              >
                Przejdź do panelu
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
          to="/auth/signin"
          large
        >
          Zaloguj się
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SignUp',
  data () {
    return {
      nextButton: false,
      dialogTitle: '',
      dialogContent: '',
      dialog: false,
      valid: false,
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailRules: [
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Nieprawidłowy format'
      ],
      nameRules: [
        value => !!value || 'Wpisz pseudonim'
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
  },
  computed: {
    ...mapGetters([
      'errorCodes'
    ])
  },
  methods: {
    errorDialog (e) {
      this.dialogTitle = 'Błąd'
      this.dialogContent = this.errorCodes[e.code] || e.message
      this.nextButton = false
      this.dialog = true
    },
    successDialog () {
      this.dialogTitle = 'Email został wysłany'
      this.dialogContent = 'Sprawdź swojego maila, aby móc się zalogować na swoje konto.'
      this.nextButton = true
      this.dialog = true
    },
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.register()
      }
    },
    register () {
      const { displayName } = this
      this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          const { user } = response
          user.updateProfile({ displayName })
            .then(() => {
              user.sendEmailVerification()
                .then(() => {
                  this.successDialog()
                })
                .catch((e) => {
                  // EMAIL FAILED
                })
            })
        })
        .catch((e) => {
          this.errorDialog(e)
        })
    }
  }
}
</script>
