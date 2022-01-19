import app from './lib/app.js'
import admin from './lib/admin.js'
import { Rcon } from 'rcon-client'

class VoucherVerification {
  constructor () {
    this.db = admin.database().ref()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.res = res
    this.shopid = req.query.shopid
    this.nick = req.query.nick
    this.code = req.query.code
    this.checkRegex()
  }
  checkRegex () {
    if (/^[a-z0-9]{6,}$/.test(this.code) && /^[a-zA-Z0-9_]{2,16}$/.test(this.nick)) {
      this.checkVoucher()
    } else {
      this.error('wrong-format')
    }
  }
  checkVoucher () {
    this.db.child(`vouchers/${this.shopid}/${this.code}`)
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.db.child(`vouchers/${this.shopid}/${this.code}`).remove()
        this.voucher = snapshot.val()
        if (((this.voucher.end && this.voucher.start <= this.getDate()) || (!this.voucher.end && this.voucher.start === this.getDate())) && ((this.voucher.end && this.voucher.end >= this.getDate()) || !this.voucher.end)) {
          this.checkService()
        } else {
          this.error('expired')
        }
      } else {
        this.error('voucher-not-exist')
      }
    })
  }
  checkService () {
    this.db.child(`shops/${this.shopid}/services/${this.voucher.service}`)
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.service = snapshot.val()
        this.checkServer()
      } else {
        this.error('service-not-exist')
      }
    })
  }
  checkServer () {
    this.db.child(`servers/${this.service.server}`)
    .once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.server = snapshot.val()
        this.checkRcon()
      } else {
        this.error('server-not-exist')
      }
    })
  }
  checkRcon () {
    let count = 0
    const commands = this.service.commands.split('\n')
    for (let command of commands) {
      command = command.replace(/\[nick\]/g, this.nick)
      const config = {
        host: this.server.serverIp,
        port: this.server.serverPort,
        password: this.server.serverPassword
      }
      Rcon.connect(config).then((rcon) => {
        rcon.send(command)
          .then((response) => {
            count++
            if (count === commands.length) {
              this.success()
            }
          })
          .catch((e) => {
            this.error('command-error')
          })
      }).catch((e) => {
        this.error('auth-error')
      })
    }
  }
  getDate () {
    let d = new Date()
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${ye}-${mo}-${da}`
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
  success () {
    this.res.json({success: true})
  }
}

app.get('/api/voucher', new VoucherVerification())

module.exports = app
