import app from './lib/app.js'
import admin from './lib/admin.js'
import axios from 'axios'
import { Rcon } from 'rcon-client'

class PrzelewVerification {
  constructor () {
    this.db = admin.database().ref()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.req = req
    this.res = res
    const [shopid, service, nick] = req.control.split('|')
    this.shopid = shopid
    this.serviceId = serviceId
    this.nick = nick
    this.checkIp()
  }
  checkIp () {
    // check if ip is correct
    const ip = this.req.headers['x-forwarded-for'] || this.req.socket.remoteAddress
    axios.get('https://microsms.pl/psc/ips/').then((response) => {
      if (response.data.split(',').includes(ip) && status) {
        this.checkUserId()
      } else {
        this.error()
      }
    })
  }
  checkUserId () {
    // compare shop userid with payment userid
    const {userid} = this.req.query
    this.db.child(`shops/${this.shopid}/payments/paymentsUserId`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() === userid) {
        this.checkService()
      } else {
        this.error()
      }
    })
  }
  checkService () {
    // check if service exists and check cost
    this.db.child(`shops/${this.shopid}/services/${this.serviceId}`).once('value', (snapshot) => {
      if (snapshot.exists() && this.req.amountUni === this.service.przelewCost) {
        this.service = snapshot.val()
        this.checkServer()
      } else {
        this.error()
      }
    })
  }
  checkServer () {
    // check if server exists
    this.db.child(`servers/${this.service.server}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.server = snapshot.val()
        this.checkOwner()
      } else {
        this.error()
      }
    })
  }
  checkOwner () {
    //check server owner == shop owner
    this.db.child(`shop/${this.shopid}/owner`).once('value', (snapshot) => {
      if (snapshot.exists() && this.server.owner === snapshot.val()) {
        this.checkRcon()
      } else {
        this.error()
      }
    })
  }
  checkRcon () {
    //send rcon commands to server
    let count = 0
    const commands = this.service.commands.split('\n')
    for (let command of commands) {
      command = command.replace(/\[nick\]/g, this.nick)
      const config = {
        host: this.server.serverIp,
        port: this.server.serverPort,
        password: this.server.serverPassword
      }
      Rcon.connect(config).then((rcon) => {
        rcon.send(command)
          .then((response) => {
            count++
            if (count === commands.length) {
              this.success()
            }
          })
          .catch((e) => {
            this.error()
          })
      }).catch((e) => {
        this.error()
      })
    }
  }
  error () {
    this.res.send('ERR')
  }
  success () {
    this.res.send('OK')
  }
}

app.get('/api/przelew', new PrzelewVerification())

module.exports = app
