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
            :label="`${$t('email')}*`"
          />
          <v-text-field
            v-model="displayName"
            :rules="rules.displayName"
            :label="`${$t('display_name')}*`"
          />
          <v-text-field
            v-model="password"
            :label="`${$t('password')}*`"
            type="password"
            :rules="rules.password"
          />
          <v-text-field
            v-model="confirmPassword"
            :label="`${$t('repeat_password')}*`"
            type="password"
            :rules="rules.confirmPassword"
          />
          <small>*{{ $t('required_fields') }}</small>
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
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                v-if="nextButton"
                color="green darken-1"
                text
                @click="$router.push('/auth/signin')"
              >
                {{ $t('go_to_panel') }}
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
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
          text
          color="info"
          to="/auth/signin"
          large
        >
          {{ $t('sign_in') }}
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
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('wrong_format')
        ],
        displayName: [
          value => !!value || this.$t('write_display_name')
        ],
        password: [
          value => !!value || this.$t('write_password'),
          value => (value && value.length >= 6) || this.$t('min_6_chars')
        ],
        confirmPassword: [
          value => !!value || this.$t('write_password'),
          value =>
            value === this.password || this.$t('passwords_not_match')
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
      'errorCodes'
    ])
  },
  methods: {
    errorDialog (e) {
      this.dialogTitle = this.$t('error')
      this.dialogContent = this.errorCodes[e.code] || e.message
      this.nextButton = false
      this.dialog = true
    },
    successDialog () {
      this.dialogTitle = this.$t('email_sent')
      this.dialogContent = this.$t('check_mailbox')
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
