import {Handler, Router} from './lib/Request.js'
import LvlupApi from 'lvlup-js'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkRegex()
    await this.loadPayments()
    await this.loadService()
    await this.checkLvlup()
  }
  checkRegex () {
    return new Promise((resolve, reject) => {
      if (!/^[a-zA-Z0-9_]{2,16}$/.test(this.nick) || typeof (this.nick) !== 'string') {
        reject()
        this.error('wrong_format_nick')
      } else if (!/^[A-Za-z0-9_]{4,}$/.test(this.shopid) || typeof (this.shopid) !== 'string') {
        reject()
        this.error('wrong_format_shopid')
      } else if (!/^[A-Za-z0-9_]{3,}$/.test(this.serviceid) || typeof (this.serviceid) !== 'string') {
        reject()
        this.error('wrong_format_serviceid')
      } else {
        resolve()
      }
    })
  }
  checkLvlup () {
    return new Promise((resolve, reject) => {
      const lvlup = new LvlupApi(this.payments.lvlup_api, {env: 'sandbox'})
      lvlup.createPayment(
        this.service.lvlup_cost,
        `${process.env.BASE_URL}/api/lvlup_webhook`,
        `${process.env.BASE_URL}/api/lvlup_webhook?nick=${this.nick}&shopid=${this.shopid}&serviceid=${this.serviceid}`
      ).then(({url}) => {
        if (url) {
          resolve()
          this.success(url)
        } else {
          reject()
          this.error('wrong_api_key')
        }
      }).catch(() => {
        reject()
        this.error('lvlup_error')
      })
    })
  }
}

module.exports = Router('/api/lvlup', new Main())
