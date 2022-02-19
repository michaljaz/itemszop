
const fs = require('fs');

// YOU HAVE TO CHANGE THIS DATA TO YOUR FIREBASE DATA
/*
const serviceAccount={
	"type": "XXXXXXXXX",
	"project_id": "XXXXXXXXX",
	"private_key_id": "XXXXXXXXX",
	"private_key": "XXXXXXXXX",
	"auth_uri": "XXXXXXXXX",
	"token_uri": "XXXXXXXXX",
	"auth_provider_x509_cert_url": "XXXXXXXXX",
	"client_x509_cert_url": "XXXXXXXXX"
}
const databaseURL="XXXXXXXXX"
const publicConfig = {
  apiKey: "XXXXXXXXX",
  authDomain: "XXXXXXXXX",
  databaseURL: "XXXXXXXXX",
  projectId: "XXXXXXXXX",
  storageBucket: "XXXXXXXXX",
  messagingSenderId: "XXXXXXXXX",
  appId: "XXXXXXXXX"
};
*/

const config = {serviceAccount, databaseURL, publicConfig}
const dotenv = `FIREBASE_CONFIG=${JSON.stringify(config)}`
console.log(dotenv)
fs.writeFileSync('.env', dotenv);
