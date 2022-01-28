import * as admin from 'firebase-admin'
import { Rcon } from 'rcon-client'
import axios from 'axios'
const app = require('express')()
const cors = require('cors')
app.use(cors())

class Handler {
  constructor () {
    const serviceAccount = JSON.parse((new Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64')).toString('ascii'))
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      })
    }
    this.rcon = Rcon
    this.axios = axios
    this.admin = admin
    this.db = admin.database().ref()
  }
}

const Router = (r, c) => {
  app.get(r, c)
  return app
}

module.exports = {Handler, Router}
