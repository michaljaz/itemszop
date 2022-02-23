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
    return (req, res) => {
      this.req = req
      this.res = res
      this.code = req.query.code
      if (req.query.control) {
        const [shopid, serviceid, nick] = req.query.control.split('|')
        this.shopid = shopid
        this.serviceid = serviceid
        this.nick = nick
      } else {
        this.nick = req.query.nick
        this.shopid = req.query.shopid
        this.serviceid = req.query.serviceid
      }
      this.check(req, res)
    }
  }
  loadPayments () {
    return new Promise((resolve, reject) => {
      this.db.child(`payments/${this.shopid}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.payments = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('payments_not_exist')
        }
      })
    })
  }
  loadService () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.service = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('service_not_exist')
        }
      })
    })
  }
  loadServer () {
    return new Promise((resolve, reject) => {
      this.db.child(`servers/${this.service.server}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.server = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('server_not_exist')
        }
      })
    })
  }
  sendRcon () {
    return new Promise((resolve, reject) => {
      let count = 0
      const commands = this.service.commands.split('\n')
      for (let command of commands) {
        command = command.replace(/\[nick\]/g, this.nick)
        const config = {
          host: this.server.serverIp,
          port: this.server.serverPort,
          password: this.server.serverPassword
        }
        this.rcon.connect(config).then((rcon) => {
          rcon.send(command)
            .then((response) => {
              count++
              if (count === commands.length) {
                resolve()
              }
            })
            .catch((e) => {
              reject()
              this.error('command_error')
            })
        }).catch((e) => {
          reject()
          this.error('auth_error')
        })
      }
    })
  }
  sendDiscord () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/webhook`).once('value', (snapshot) => {
        if (snapshot.exists() && snapshot.val() !== '') {
          const webhookUrl = snapshot.val()
          this.axios.post(webhookUrl, {
            content: `${this.nick} właśnie kupił(a) ${this.service.name}`
          }).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('discord_webhook_error')
          })
        } else {
          resolve()
        }
      })
    })
  }
  addPaymentToHistory (type) {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/history`).push().set({
        nick: this.nick,
        service: this.service.name,
        serviceid: this.serviceid,
        date: Date.now(),
        type
      }).then(() => {
        resolve()
      }).catch(() => {
        reject()
        this.error('history_error')
      })
    })
  }
  addMonthlyGoal () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/collected`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.db.child(`shops/${this.shopid}/collected`).set(parseFloat(snapshot.val()) + this.cost).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('monthly_goal_error')
          })
        } else {
          this.db.child(`shops/${this.shopid}/collected`).set(this.cost).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('monthly_goal_error')
          })
        }
      })
    })
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
