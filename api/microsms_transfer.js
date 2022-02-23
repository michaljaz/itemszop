import {Handler, Router} from './lib/Request.js'
import md5 from 'md5'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkRegex()
    await this.loadPayments()
    await this.loadService()
    this.generate()
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
  generate () {
    const params = new URLSearchParams({
      shopid: this.payments.microsms_transfer_id,
      amount: this.service.przelewCost,
      signature: md5(`${this.payments.microsms_transfer_id}${this.payments.microsms_transfer_hash}${this.service.przelewCost}`),
      description: `${this.service.name} dla ${this.nick}`,
      control: `${this.shopid}|${this.serviceid}|${this.nick}`,
      returl_url: `${process.env.BASE_URL}/shop/${this.shopid}/payment_success`,
      returl_urlc: `${process.env.BASE_URL}/api/microsms_transfer_webhook`
    })
    this.success(`https://microsms.pl/api/bankTransfer/?${params}`)
  }
}

module.exports = Router('/api/microsms_transfer', new Main())
