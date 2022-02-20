import {Handler, Router} from './lib/Request.js'
import md5 from 'md5'

class Main extends Handler {
  constructor () {
    super()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.req = req
    this.res = res
    this.nick = req.query.nick
    this.shopid = req.query.shopid
    this.serviceid = req.query.serviceid
    this.checkRegex()
  }
  checkRegex () {
    if (!/^[a-zA-Z0-9_]{2,16}$/.test(this.nick)) {
      this.error('wrong_format_nick')
    } else if (!/^[A-Za-z0-9_]{4,}$/.test(this.shopid)) {
      this.error('wrong_format_shopid')
    } else if (!/^[A-Za-z0-9_]{3,}$/.test(this.serviceid)) {
      this.error('wrong_format_serviceid')
    } else {
      this.checkPayments()
    }
  }
  checkPayments () {
    this.db.child(`payments/${this.shopid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.payments = snapshot.val()
        this.checkService()
      } else {
        this.error('payments_not_exist')
      }
    })
  }
  checkService () {
    this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.service = snapshot.val()
        this.success()
      } else {
        this.error('service_not_exist')
      }
    })
  }
  success () {
    const params = new URLSearchParams({
      shopid: this.payments.microsms_transfer_id,
      amount: this.service.przelewCost,
      signature: md5(`${this.payments.microsms_transfer_id}${this.payments.microsms_transfer_hash}${this.service.przelewCost}`),
      description: `${this.service.name} dla ${this.nick}`,
      control: `${this.shopid}|${this.serviceid}|${this.nick}`,
      returl_url: `${process.env.BASE_URL}/shop/${this.shopid}/payment_success`,
      returl_urlc: `${process.env.BASE_URL}/api/microsms_transfer_webhook`
    })
    const url = `https://microsms.pl/api/bankTransfer/?${params}`
    this.res.json({success: true, url})
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
}

module.exports = Router('/api/microsms_transfer', new Main())
