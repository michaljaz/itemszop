<template>
  <div>
    <v-card class="pt-1 pb-4">
      <v-card-title class="headline justify-center">
        {{ $t('sign_up') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="email"
            :rules="rules.email"
            :label="`${$t('fields.email')}*`"
          />
          <v-text-field
            v-model="displayName"
            :rules="rules.displayName"
            :label="`${$t('fields.display_name')}*`"
          />
          <v-text-field
            v-model="password"
            :label="`${$t('fields.password')}*`"
            type="password"
            :rules="rules.password"
          />
          <v-text-field
            v-model="confirmPassword"
            :label="`${$t('fields.repeat_password')}*`"
            type="password"
            :rules="rules.confirmPassword"
          />
          <small>*{{ $t('misc.required_fields') }}</small>
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
                color="primary"
                text
                @click="dialog=false"
              >
                {{ $t('actions.cancel') }}
              </v-btn>
              <v-btn
                v-if="nextButton"
                color="success"
                text
                @click="$router.push('/auth/signin')"
              >
                {{ $t('actions.go_to_panel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-card-actions>
        <div class="ml-3">
          {{ $t('misc.privacy_policy_accept') }}
          <a href="https://www.freeprivacypolicy.com/live/3a8aa0bd-79f8-4882-b2c4-9a1a4b825bd2" target="_blank">
            {{ $t('misc.privacy_policy') }}
          </a>
        </div>
        <v-spacer />
        <v-btn
          text
          color="accent"
          to="/auth/signin"
          large
        >
          {{ $t('sign_in') }}
        </v-btn>
        <v-btn
          color="primary"
          large
          @click="submit"
        >
          {{ $t('actions.next') }}
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
      rules: {
        email: [
          v => this.$regex.email(v) || this.$t('formats.wrong_format')
        ],
        displayName: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty')
        ],
        password: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => this.$regex.min_6_chars(v) || this.$t('formats.min_6_chars')
        ],
        confirmPassword: [
          v => this.$regex.not_empty(v) || this.$t('formats.field_not_empty'),
          v => v === this.password || this.$t('formats.passwords_not_match')
        ]
      }
    }
  },
  head () {
    return {
      title: this.$t('sign_up')
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
    errorDialog (e) {
      this.dialogTitle = this.$t('titles.error')
      this.dialogContent = this.$t(`firebase.${e.code}`) || e.message
      this.nextButton = false
      this.dialog = true
    },
    successDialog () {
      this.dialogTitle = this.$t('misc.email_sent')
      this.dialogContent = this.$t('misc.check_mailbox')
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
