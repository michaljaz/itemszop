import {Handler, Router} from './lib/Request.js'
import md5 from 'md5'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkBasicRegex()
    await this.loadPayments()
    await this.loadService()
    this.generate()
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
