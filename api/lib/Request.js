import * as admin from 'firebase-admin'
import { Rcon } from 'rcon-client'
import axios from 'axios'
import md5 from 'md5'
const app = require('express')()
const cors = require('cors')
app.use(cors())

class Handler {
  constructor (type) {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG)
    const {serviceAccount, databaseURL} = firebaseConfig
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL
      })
    }
    this.type = type
    this.rcon = Rcon
    this.axios = axios
    this.admin = admin
    this.db = admin.database().ref()
    return (req, res) => {
      this.req = req
      this.res = res
      this.code = req.query.code
      this.userid = req.query.userid
      if (req.query.control) {
        const [shopid, serviceid, nick] = req.query.control.split('|')
        this.shopid = shopid
        this.serviceid = serviceid
        this.nick = nick
      } else {
        this.nick = req.query.nick
        this.shopid = req.query.shopid
        this.serviceid = req.query.serviceid
      }
      this.check()
    }
  }
  loadPayments () {
    return new Promise((resolve, reject) => {
      this.db.child(`payments/${this.shopid}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.payments = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('payments_not_exist')
        }
      })
    })
  }
  loadService () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.service = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('service_not_exist')
        }
      })
    })
  }
  loadServer () {
    return new Promise((resolve, reject) => {
      this.db.child(`servers/${this.service.server}`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.server = snapshot.val()
          resolve()
        } else {
          reject()
          this.error('server_not_exist')
        }
      })
    })
  }
  sendRconCommands () {
    return new Promise((resolve, reject) => {
      let count = 0
      const commands = this.service.commands.split('\n')
      for (let command of commands) {
        command = command.replace(/\[nick\]/g, this.nick)
        const config = {
          host: this.server.serverIp,
          port: this.server.serverPort,
          password: this.server.serverPassword
        }
        this.rcon.connect(config).then((rcon) => {
          rcon.send(command)
            .then((response) => {
              count++
              if (count === commands.length) {
                resolve()
              }
            })
            .catch((e) => {
              reject()
              this.error('command_error')
            })
        }).catch((e) => {
          reject()
          this.error('auth_error')
        })
      }
    })
  }
  sendDiscordWebhook () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/webhook`).once('value', (snapshot) => {
        if (snapshot.exists() && snapshot.val() !== '') {
          const webhookUrl = snapshot.val()
          this.axios.post(webhookUrl, {
            content: `${this.nick} właśnie kupił(a) ${this.service.name}`
          }).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('discord_webhook_error')
          })
        } else {
          resolve()
        }
      })
    })
  }
  addPaymentToHistory () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/history`).push().set({
        nick: this.nick,
        service: this.service.name,
        serviceid: this.serviceid,
        date: Date.now(),
        type: this.type
      }).then(() => {
        resolve()
      }).catch(() => {
        reject()
        this.error('history_error')
      })
    })
  }
  addMonthlyGoal () {
    return new Promise((resolve, reject) => {
      if (this.type === 'microsms_sms') {
        this.cost = ({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 9, 8: 14, 9: 19, 10: 20, 11: 25})[this.service.microsms_sms_type]
      } else if (this.type === 'microsms_transfer') {
        this.cost = parseFloat(this.service.microsms_transfer_cost)
      } else if (this.type === 'lvlup') {
        this.cost = parseFloat(this.service.lvlup_cost)
      }
      this.db.child(`shops/${this.shopid}/collected`).once('value', (snapshot) => {
        if (snapshot.exists()) {
          this.db.child(`shops/${this.shopid}/collected`).set(parseFloat(snapshot.val()) + this.cost).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('monthly_goal_error')
          })
        } else {
          this.db.child(`shops/${this.shopid}/collected`).set(this.cost).then(() => {
            resolve()
          }).catch(() => {
            reject()
            this.error('monthly_goal_error')
          })
        }
      })
    })
  }
  checkServerOwner () {
    return new Promise((resolve, reject) => {
      this.db.child(`shops/${this.shopid}/owner`).once('value', (snapshot) => {
        if (snapshot.exists() && this.server.owner === snapshot.val()) {
          resolve()
        } else {
          reject()
          this.error('server_owner_error')
        }
      })
    })
  }
  checkBasicRegex () {
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
  checkSmsCodeRegex () {
    return new Promise((resolve, reject) => {
      if (!/^[A-Za-z0-9]{8}$/.test(this.code) || typeof (this.code) !== 'string') {
        reject()
        this.error('wrong_format_code')
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
  checkMicrosmsCode () {
    return new Promise((resolve, reject) => {
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
  getDate () {
    let d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${ye}-${mo}-${da}`
  }
  generateMicrosmsTransfer () {
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
  generateLvlup () {
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
  checkMicrosmsIp () {
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
  checkMicrosmsTransferPrice(){
    return new Promise((resolve, reject) => {
      if (this.req.amountUni === this.service.microsms_transfer_cost) {
        this.cost = parseFloat(this.service.microsms_transfer_cost)
        resolve()
      } else {
        reject()
        this.error()
      }
    })
  }
  checkMicrosmsUserId () {
    return new Promise((resolve, reject) => {
      this.db.child(`payments/${this.shopid}/microsms_user_id`).once('value', (snapshot) => {
        if (snapshot.exists() && snapshot.val() === this.userid) {
          resolve()
        } else {
          reject()
          this.error()
        }
      })
    })
  }
  success (data) {
    this.res.json({success: true, data})
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
}

const Router = (r, c) => {
  app.all(r, c)
  return app
}

module.exports = {Handler, Router}
