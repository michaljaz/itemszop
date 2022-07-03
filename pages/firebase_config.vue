<template>
  <v-container>
    <h1 class="h1">
      Generator zmiennej środowiskowej FIREBASE_CONFIG
    </h1>
    <h3 class="h3">
      Wartości z przykładowego kodu js
    </h3>
    <v-text-field
      v-for="key in Object.keys(firebaseConfig.publicConfig)"
      :key="key"
      v-model="firebaseConfig.publicConfig[key]"
      :label="key"
    />
    <h3 class="h3">
      Wartości z pliku serviceAccountKey
    </h3>
    <v-text-field
      v-for="key in Object.keys(firebaseConfig.serviceAccount)"
      :key="key"
      v-model="firebaseConfig.serviceAccount[key]"
      :label="key"
    />
    <v-btn
      color="primary"
      @click="generate"
    >
      WYGENERUJ
    </v-btn>
    <v-textarea
      v-model="result"
      readonly
      label="Rezultat - zmienna FIREBASE_CONFIG"
    />
  </v-container>
</template>
<script>

export default {
  name: 'FirebaseConfig',
  data () {
    return {
      firebaseConfig: {
        publicConfig: {
          apiKey: '',
          authDomain: '',
          databaseURL: '',
          projectId: '',
          storageBucket: '',
          messagingSenderId: '',
          appId: ''
        },
        serviceAccount: {
          type: '',
          project_id: '',
          private_key_id: '',
          private_key: '',
          auth_uri: '',
          token_uri: '',
          auth_provider_x509_cert_url: '',
          client_x509_cert_url: '',
          client_email: ''
        }
      },
      result: ''
    }
  },
  methods: {
    generate () {
      this.firebaseConfig.serviceAccount.private_key = this.firebaseConfig.serviceAccount.private_key.replace('\\n', '')
      this.result = `FIREBASE_CONFIG=${JSON.stringify(this.firebaseConfig)}`
    }
  }
}
</script>
