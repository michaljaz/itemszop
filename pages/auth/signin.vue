<template>
  <div>
    <v-card class="pt-1 pb-4">
      <v-card-title class="headline justify-center">
        {{ $t('sign_in') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="email"
            :rules="rules.email"
            :label="$t('fields.email')"
          />
          <v-text-field
            v-model="password"
            :rules="rules.password"
            :label="$t('fields.password')"
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
            {{ $t('actions.password_reset') }}
          </v-btn>
        </v-form>
        <v-snackbar
          v-model="snackbar"
        >
          {{ $t('misc.email_sent') }}
          <template #action="{ attrs }">
            <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              {{ $t('actions.cancel') }}
            </v-btn>
          </template>
        </v-snackbar>
        <v-dialog
          v-model="reset_dialog"
          max-width="400"
        >
          <v-card>
            <v-card-title class="text-h5">
              {{ $t('actions.password_reset') }}
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form_reset"
                v-model="reset_valid"
              >
                <v-text-field
                  v-model="reset_email"
                  :rules="rules.email"
                  :label="$t('fields.email')"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="reset_dialog=false"
              >
                {{ $t('actions.cancel') }}
              </v-btn>
              <v-btn
                color="green darken-1"
                @click="resetPassword"
              >
                {{ $t('actions.reset') }}
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
              {{ $t('titles.error') }}
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
                {{ $t('actions.cancel') }}
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
          {{ $t('actions.next') }}
        </v-btn>
        <v-btn
          text
          color="info"
          to="/auth/signup"
          large
        >
          {{ $t('sign_up') }}
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
          v => this.$regex.email(v) || this.$t('formats.wrong_format')
        ],
        password: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.min_6_chars(v) || this.$t('formats.min_6_chars')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('sign_in')
    }
  },
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
      this.dialogContent = this.$t(`firebase.${e.code}`) || e.message
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
