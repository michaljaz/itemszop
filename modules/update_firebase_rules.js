import * as admin from 'firebase-admin'
import fs from 'fs'

// update firebase rules
export default function () {
  const {serviceAccount, publicConfig} = JSON.parse(process.env.FIREBASE_CONFIG)
  const {databaseURL} = publicConfig
  if (admin.apps.length === 0) {
	  admin.initializeApp({
	    credential: admin.credential.cert(serviceAccount),
	    databaseURL
	  })
	  let rules
	  if (process.env.OWNER_ID) {
	    rules = fs.readFileSync('./misc/one_owner_firebase.rules.json', 'utf-8').replace(/OWNER_ID/g, process.env.OWNER_ID)
	  } else {
	    rules = fs.readFileSync('./misc/firebase.rules.json', 'utf-8')
	  }
	  admin.database().setRules(rules).then(() => {
	    console.log('Rules updated successfully')
	  }).catch((e) => {
	    console.error(e)
	  }).finally(()=>{
      admin.database().goOffline()
    })
  }
}
