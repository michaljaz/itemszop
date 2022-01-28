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
      this.checkPayments()
    } else {
      this.error()
    }
  }
  checkPayments () {
    this.db.child(`shops/${this.shopid}/payments`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.payments = snapshot.val()
        this.checkService()
      } else {
        this.error()
      }
    })
  }
  checkService () {
    this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.service = snapshot.val()
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
        })[this.service.smsType]
        this.checkServer()
      } else {
        this.error()
      }
    })
  }
  checkServer () {
    this.db.child(`servers/${this.service.server}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.server = snapshot.val()
        this.checkCode()
      } else {
        this.error()
      }
    })
  }
  checkCode () {
    this.axios.get(`https://microsms.pl/api/check.php?userid=${this.payments.paymentsUserId}&number=${this.number}&code=${this.code}&serviceid=${this.payments.paymentsShopId}`).then(({data}) => {
      if (data.split(',')[0] === '1') {
        this.checkRcon()
      } else {
        this.error()
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
      this.rcon.connect(config).then((rcon) => {
        rcon.send(command)
          .then((response) => {
            count++
            if (count === commands.length) {
              this.addPaymentHistory()
            }
          })
          .catch((e) => {
            this.error()
          })
      }).catch((e) => {
        this.error()
      })
    }
  }
  addPaymentHistory () {
    // update payments history
    this.db.child(`shops/${this.shopid}/history`).push().set({
      nick: this.nick,
      service: this.service.name,
      date: Date.now()
    }).then(() => {
      this.success()
    }).catch(() => {
      this.error()
    })
  }
  success () {
    this.res.send('OK')
  }
  error () {
    this.res.send('ERR')
  }
}

module.exports = Router('/api/sms', new SmsHandler())
