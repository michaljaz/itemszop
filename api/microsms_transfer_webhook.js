import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkBasicRegex()
    await this.checkIp()
    await this.checkUserId()
    await this.loadService()
    await this.checkPrice()
    await this.loadServer()
    await this.checkOwner()
    await this.sendRcon()
    await this.addPaymentToHistory('microsms_transfer')
    await this.addMonthlyGoal()
    await this.sendDiscord()
    this.success()
  }
  checkIp () {
    return new Promise((resolve, reject) => {
      const ip = this.req.headers['x-forwarded-for'] || this.req.socket.remoteAddress
      this.axios.get('https://microsms.pl/psc/ips/').then((response) => {
        if (response.data.split(',').includes(ip) && status) {
          resolve()
        } else {
          reject()
          this.error()
        }
      })
    })
  }
  checkUserId () {
    return new Promise((resolve, reject) => {
      const {userid} = this.req.query
      this.db.child(`payments/${this.shopid}/microsms_user_id`).once('value', (snapshot) => {
        if (snapshot.exists() && snapshot.val() === userid) {
          resolve()
        } else {
          reject()
          this.error()
        }
      })
    })
  }
  checkPrice () {
    return new Promise((resolve, reject) => {
      if (this.req.amountUni === this.service.przelewCost) {
        this.cost = parseFloat(this.service.przelewCost)
        resolve()
      } else {
        reject()
        this.error()
      }
    })
  }
  error () {
    this.res.send('ERR')
  }
  success () {
    this.res.send('OK')
  }
}

module.exports = Router('/api/microsms_transfer_webhook', new Main())
