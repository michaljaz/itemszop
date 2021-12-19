<template>
  <div>
    <v-card>
      <v-card-title class="headline">
        Zarejestruj się
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field v-model="email" :rules="emailRules" label="Email" />
          <v-text-field v-model="displayName" label="Pseudonim (opjonalnie)" />
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
          to="/auth/signin"
        >
          Zaloguj się
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
      valid: false,
      displayName: '',
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
  },
  methods: {
    submit () {
      this.$refs.form.validate()
      if (this.valid) {
        this.register()
      }
    },
    register () {
      const { displayName } = this
      try {
        this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
          .then((response) => {
            const { user } = response
            user.updateProfile({ displayName })
              .then(() => {
                user.sendEmailVerification()
                  .then(() => {
                    console.log('email sent')
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              })
          })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
