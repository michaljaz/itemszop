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

		// update og meta tags
    if (process.env.SINGLE_SHOP) {
      let baseUrl
      if (process.env.URL) {
        baseUrl = process.env.URL
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      } else if (process.env.CF_PAGES_URL) {
        baseUrl = process.env.CF_PAGES_URL
      }
      console.log(baseUrl)
      this.nuxt.options.head.meta[5].content = baseUrl
      const SHOP_NAME = await admin.database().ref(`shops/${process.env.SINGLE_SHOP}/name`).once('value')
	    this.nuxt.options.head.meta[7].content = `Sklep serwera ${SHOP_NAME.val()}`
      this.nuxt.options.head.meta[8].content = `Sprawdź sklep serwerowy ${SHOP_NAME.val()}`
      const ICON_URL = await admin.database().ref(`shops/${process.env.SINGLE_SHOP}/icon`).once('value')
      this.nuxt.options.head.meta[9].content = ICON_URL.val()
      console.log('Updated single shop og meta tags!')
    }
  }
}
