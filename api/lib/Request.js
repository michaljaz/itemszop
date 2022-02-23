import * as admin from 'firebase-admin'
import { Rcon } from 'rcon-client'
import axios from 'axios'
const app = require('express')()
const cors = require('cors')
app.use(cors())

class Handler {
  constructor () {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
    const {serviceAccount, databaseURL} = firebaseConfig
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL
      })
    }
    this.rcon = Rcon
    this.axios = axios
    this.admin = admin
    this.db = admin.database().ref()
  }
  success (data) {
    this.res.json({success: true, data})
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
}

const Router = (r, c) => {
  app.all(r, c)
  return app
}

module.exports = {Handler, Router}
