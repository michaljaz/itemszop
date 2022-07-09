import * as admin from 'firebase-admin'
import fs from 'fs'

export default async function () {
  const {serviceAccount, publicConfig} = JSON.parse(process.env.FIREBASE_CONFIG)
  const {databaseURL} = publicConfig
  if (admin.apps.length === 0) {
    // initialize firebase
	  admin.initializeApp({
	    credential: admin.credential.cert(serviceAccount),
	    databaseURL
	  })
	  let rules

    // update firebase rules
	  if (process.env.OWNER_ID) {
	    rules = fs.readFileSync('./rules/one_owner_firebase.rules.json', 'utf-8').replace(/OWNER_ID/g, process.env.OWNER_ID)
	  } else {
	    rules = fs.readFileSync('./rules/firebase.rules.json', 'utf-8')
	  }
    await admin.database().setRules(rules)
    console.log('Updated firebase rules!')

  }
}
