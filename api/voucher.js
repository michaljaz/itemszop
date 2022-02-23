import {Handler, Router} from './lib/Request.js'

class VoucherHandler extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkRegex()
    await this.checkVoucher()
    await this.checkService()
    await this.checkServer()
    await this.checkRcon()
    this.success()
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
  checkVoucher () {
    return new Promise((resolve, reject) => {
      this.db.child(`vouchers/${this.shopid}/${this.code}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.db.child(`vouchers/${this.shopid}/${this.code}`).remove()
          this.voucher = snapshot.val()
          if (((this.voucher.end && this.voucher.start <= this.getDate()) || (!this.voucher.end && this.voucher.start === this.getDate())) && ((this.voucher.end && this.voucher.end >= this.getDate()) || !this.voucher.end)) {
            resolve()
          } else {
            reject()
            this.error('voucher_expired')
          }
        } else {
          reject()
          this.error('voucher_not_exist')
        }
      })
    })
  }
  getDate () {
    let d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${ye}-${mo}-${da}`
  }
}

module.exports = Router('/api/voucher', new VoucherHandler())
