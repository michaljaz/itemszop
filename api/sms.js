import {Handler, Router} from './lib/Request.js'

class SmsHandler extends Handler {
  constructor () {
    super()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.res = res
    this.code = req.query.code
    this.nick = req.query.nick
    this.shopid = req.query.shopid
    this.serviceid = req.query.serviceid
    this.checkRegex()
  }
  checkRegex () {
    if (/^[A-Za-z0-9]{8}$/.test(this.code) && /^[a-zA-Z0-9_]{2,16}$/.test(this.nick) && /^[A-Za-z0-9_]{4,}$/.test(this.shopid) && /^[A-Za-z0-9_]{4,}$/.test(this.serviceid)) {
      this.checkService()
    } else {
      this.error()
    }
  }
  checkService () {
    this.success()
  }
  success () {
    this.res.send('OK')
  }
  error () {
    this.res.send('ERR')
  }
}

module.exports = Router('/api/sms', new SmsHandler())
