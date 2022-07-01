

// Zmień te dane na dane ze swojej bazy firebase z dokumentacji
// Rezultat zapisz w zmiennej środowiskowej

const serviceAccount={
	"type": "XXXXXXXXX",
	"project_id": "XXXXXXXXX",
	"private_key_id": "XXXXXXXXX",
	"private_key": "XXXXXXXXX",
	"auth_uri": "XXXXXXXXX",
	"token_uri": "XXXXXXXXX",
	"auth_provider_x509_cert_url": "XXXXXXXXX",
	"client_x509_cert_url": "XXXXXXXXX",
	"client_email": "XXXXXXXXX"
}
const publicConfig = {
  apiKey: "XXXXXXXXX",
  authDomain: "XXXXXXXXX",
  databaseURL: "XXXXXXXXX",
  projectId: "XXXXXXXXX",
  storageBucket: "XXXXXXXXX",
  messagingSenderId: "XXXXXXXXX",
  appId: "XXXXXXXXX"
};

const config = {serviceAccount, publicConfig}
const dotenv = `FIREBASE_CONFIG=${JSON.stringify(config)}`
console.log(dotenv)

// NODE.JS
// const fs = require('fs');
// fs.writeFileSync('.env', dotenv);
