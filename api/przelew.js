import {Handler, Router} from './lib/Request.js'

class PrzelewHandler extends Handler {
  constructor () {
    super()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.req = req
    this.res = res
    const [shopid, serviceid, nick] = req.control.split('|')
    this.shopid = shopid
    this.serviceid = serviceid
    this.nick = nick
    this.checkRegex()
  }
  checkRegex () {
    if (/^[A-Za-z0-9_]{4,}$/.test(this.shopid) && /^[A-Za-z0-9_]{4,}$/.test(this.serviceid) && /^[a-zA-Z0-9_]{2,16}$/.test(this.nick)) {
      this.checkIp()
    } else {
      this.error()
    }
  }
  checkIp () {
    // check if ip is correct
    const ip = this.req.headers['x-forwarded-for'] || this.req.socket.remoteAddress
    this.axios.get('https://microsms.pl/psc/ips/').then((response) => {
      if (response.data.split(',').includes(ip) && status) {
        this.checkUserId()
      } else {
        this.error()
      }
    })
  }
  checkUserId () {
    // compare shop userid with payment userid
    const {userid} = this.req.query
    this.db.child(`shops/${this.shopid}/payments/paymentsUserId`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() === userid) {
        this.checkService()
      } else {
        this.error()
      }
    })
  }
  checkService () {
    // check if service exists and check cost
    this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists() && this.req.amountUni === this.service.przelewCost) {
        this.service = snapshot.val()
        this.checkServer()
      } else {
        this.error()
      }
    })
  }
  checkServer () {
    // check if server exists
    this.db.child(`servers/${this.service.server}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.server = snapshot.val()
        this.checkOwner()
      } else {
        this.error()
      }
    })
  }
  checkOwner () {
    // check server owner == shop owner
    this.db.child(`shop/${this.shopid}/owner`).once('value', (snapshot) => {
      if (snapshot.exists() && this.server.owner === snapshot.val()) {
        this.checkRcon()
      } else {
        this.error()
      }
    })
  }
  checkRcon () {
    // send rcon commands to server
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
      serviceid: this.serviceid,
      date: Date.now()
    }).then(() => {
      this.addMothlyGoal()
    }).catch(() => {
      this.error()
    })
  }
  addMothlyGoal () {
    this.db.child(`shops/${this.shopid}/collected`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.db.child(`shops/${this.shopid}/collected`).set(parseFloat(snapshot.val()) + parseFloat(this.service.przelewCost)).then(() => {
          this.sendDiscordMessage()
        }).catch(() => {
          this.error()
        })
      } else {
        this.db.child(`shops/${this.shopid}/collected`).set(parseFloat(this.service.przelewCost)).then(() => {
          this.sendDiscordMessage()
        }).catch(() => {
          this.error()
        })
      }
    })
  }
  sendDiscordMessage () {
    this.db.child(`shops/${this.shopid}/webhook`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== '') {
        const webhookUrl = snapshot.val()
        this.axios.post(webhookUrl, {
          content: `${this.nick} właśnie kupił(a) ${this.service.name}`
        }).then(() => {
          this.success()
        }).catch(() => {
          this.error()
        })
      } else {
        this.success()
      }
    })
  }
  error () {
    this.res.send('ERR')
  }
  success () {
    this.res.send('OK')
  }
}

module.exports = Router('/api/przelew', new PrzelewHandler())
