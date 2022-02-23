import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkRegex()
    await this.loadPayments()
    await this.loadService()
    await this.checkCode()
    await this.loadServer()
    await this.sendRcon()
    await this.addPaymentToHistory('microsms_sms')
    await this.addMonthlyGoal()
    await this.sendDiscord()
    this.success()
  }
  checkRegex () {
    return new Promise((resolve, reject) => {
      if (!/^[A-Za-z0-9]{8}$/.test(this.code) || typeof (this.code) !== 'string') {
        reject()
        this.error('wrong_format_code')
      } else if (!/^[a-zA-Z0-9_]{2,16}$/.test(this.nick) || typeof (this.nick) !== 'string') {
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
  checkCode () {
    return new Promise((resolve, reject) => {
      this.cost = ({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 9, 8: 14, 9: 19, 10: 20, 11: 25})[this.service.smsType]
      this.number = ({
        1: '71480',
        2: '72480',
        3: '73480',
        4: '74480',
        5: '75480',
        6: '76480',
        7: '79480',
        8: '91400',
        9: '91900',
        10: '92022',
        11: '92550'
      })[this.service.microsms_sms_type]
      this.axios.get(`https://microsms.pl/api/check.php?userid=${this.payments.microsms_user_id}&number=${this.number}&code=${this.code}&serviceid=${this.payments.microsms_sms_id}`).then(({data}) => {
        if (data.split(',')[0] === '1') {
          resolve()
        } else {
          reject()
          this.error('wrong_code')
        }
      })
    })
  }
}

module.exports = Router('/api/microsms_sms', new Main())
