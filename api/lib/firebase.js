import * as admin from 'firebase-admin'

module.exports = () => {
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
  const {serviceAccount, databaseURL} = firebaseConfig
  if (admin.apps.length === 0) {
	  admin.initializeApp({
	    credential: admin.credential.cert(serviceAccount),
	    databaseURL
	  })
  }
  return admin.database().ref()
}
