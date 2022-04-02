const { getTokenFromGCPServiceAccount } = require('@sagi.io/workers-jwt')

async function getAccessToken (firebaseConfig) {
  const jwtToken = await getTokenFromGCPServiceAccount({
    serviceAccountJSON: JSON.parse(firebaseConfig).serviceAccount,
    aud: 'https://oauth2.googleapis.com/token',
    payloadAdditions: {
      scope: [
        // scope required for firestore
        'https://www.googleapis.com/auth/datastore',
        // The following scopes are required only for realtime database
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/firebase.database'
      ].join(' ')
    }
  })

  const accessToken = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken // the JWT token generated in the previous step
      })
    })
  ).json()

  return accessToken.access_token
}

export async function onRequest (context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data // arbitrary space for passing data between middlewares
  } = context

  const {databaseURL} = JSON.parse(env.FIREBASE_CONFIG).publicConfig
  const token = await getAccessToken(env.FIREBASE_CONFIG)

  const result = await (
    await fetch(`${databaseURL}/shops.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  ).json()

  return new Response(JSON.stringify(result))
}
