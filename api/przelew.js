import app from './lib/app.js'
import admin from './lib/admin.js'
import axios from 'axios'

class PrzelewVerification {
  constructor () {
    this.db=admin.database().ref()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.req = req
    this.res = res
    this.checkIp()
  }
  checkIp () {
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
    const {userid} = this.req.query
    this.db.child(`shops/${shopid}/payments/paymentsUserId`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() === userid) {
        this.success()
      } else {
        this.error()
      }
    })
  }
  error (message) {
    this.res.send('ERR')
  }
  success () {
    this.res.send('OK')
  }
}

app.get('/api/przelew', new PrzelewVerification())

module.exports = app
