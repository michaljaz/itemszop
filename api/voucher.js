import {Handler, Router} from './lib/Request.js'

class VoucherHandler extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkRegex()
    await this.checkVoucher()
    await this.loadService()
    await this.loadServer()
    await this.checkRcon()
    await this.success()
  }
  checkRegex () {
    return new Promise((resolve, reject) => {
      if (!/^[a-z0-9]{6,}$/.test(this.code) || typeof (this.code) !== 'string') {
        reject()
        this.error('wrong_format_voucher')
      } else if (!/^[a-zA-Z0-9_]{2,16}$/.test(this.nick) || typeof (this.nick) !== 'string') {
        reject()
        this.error('wrong_format_nick')
      } else if (!/^[A-Za-z0-9_]{4,}$/.test(this.shopid) || typeof (this.shopid) !== 'string') {
        reject()
        this.error('wrong_format_shopid')
      } else {
        resolve()
      }
    })
  }
}

module.exports = Router('/api/voucher', new VoucherHandler())
