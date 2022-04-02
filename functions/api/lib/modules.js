import axios from 'axios'
import * as admin from 'firebase-admin'
import md5 from 'md5'
import { Rcon } from 'rcon-client'
const app = require('express')()
const cors = require('cors')
app.use(cors())

let baseUrl
if (process.env.URL) {
  baseUrl = process.env.URL
} else if (process.env.VERCEL_URL) {
  baseUrl = `https://${process.env.VERCEL_URL}`
} else if (process.env.CF_PAGES_URL) {
  baseUrl = process.env.CF_PAGES_URL
}

const apiUrl = ((process.env.NETLIFY || process.env.NETLIFY_DEV) && !process.env.CF_PAGES) ? `${baseUrl}/.netlify/functions` : `${baseUrl}/api`

// REQUEST

exports.request = (handler, filename) => {
  let path = filename.split('.')[0].split('/')
  app.get(`/api/${path[path.length - 1]}`, (req, res) => {
    handler(req.query).then((data) => {
      res.json({success: true, data})
    }).catch((error) => {
      res.json({success: false, error})
    })
  })
  app.handler = async (event, context) => {
    return handler(event.queryStringParameters).then((data) => ({
      statusCode: 200,
      body: JSON.stringify({success: true, data})
    })).catch((error) => ({
      statusCode: 200,
      body: JSON.stringify({success: false, error})
    }))
  }
  return app
}

// SENDERS

exports.sendDiscordWebhook = ({shopid, db, nick, serviceName}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/webhook`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== '') {
        axios.post(snapshot.val(), {
          content: `${nick} właśnie kupił(a) ${serviceName}`
        }).then(() => {
          resolve()
        }).catch(() => {
          reject('discord_webhook_error')
        })
      } else {
        resolve()
      }
    })
  })
}

exports.sendRconCommands = ({commands, nick, host, port, password}) => {
  return new Promise((resolve, reject) => {
    let count = 0
    commands = commands.split('\n')
    for (let command of commands) {
      command = command.replace(/\[nick\]/g, nick)
      Rcon.connect({host, port, password}).then((rcon) => {
        rcon.send(command).then((response) => {
          count++
          if (count === commands.length) {
            resolve(response)
          }
        }).catch((e) => {
          reject('command_error')
        })
      }).catch((e) => {
        reject('auth_error')
      })
    }
  })
}

// SAVERS

exports.addMonthlyGoal = ({type, shopid, db, service}) => {
  return new Promise((resolve, reject) => {
    let cost
    if (type === 'microsms_sms') {
      cost = ({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 9, 8: 14, 9: 19, 10: 20, 11: 25})[service.microsms_sms_type]
    } else if (type === 'microsms_transfer') {
      cost = parseFloat(service.microsms_transfer_cost)
    } else if (type === 'lvlup') {
      cost = parseFloat(service.lvlup_cost)
    }
    db.child(`shops/${shopid}/collected`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        db.child(`shops/${shopid}/collected`).set(parseFloat(snapshot.val()) + cost).then(() => {
          resolve()
        }).catch(() => {
          reject('monthly_goal_error')
        })
      } else {
        db.child(`shops/${shopid}/collected`).set(cost).then(() => {
          resolve()
        }).catch(() => {
          reject('monthly_goal_error')
        })
      }
    })
  })
}

exports.addPaymentToHistory = ({db, shopid, nick, service, serviceid, type}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/history`).push().set({
      nick,
      service,
      serviceid,
      date: Date.now(),
      type
    }).then(() => {
      resolve()
    }).catch(() => {
      reject('history_error')
    })
  })
}

// PARAMS

exports.getNick = (nick) => {
  return new Promise((resolve, reject) => {
    if (!/^[a-zA-Z0-9_]{2,16}$/.test(nick) || typeof (nick) !== 'string') {
      reject('wrong_format_nick')
    } else {
      resolve(nick)
    }
  })
}

exports.getShopId = (shopid) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9_]{4,}$/.test(shopid) || typeof (shopid) !== 'string') {
      reject('wrong_format_shopid')
    } else {
      resolve(shopid)
    }
  })
}

exports.getServiceId = (serviceid) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9_]{3,}$/.test(serviceid) || typeof (serviceid) !== 'string') {
      reject('wrong_format_serviceid')
    } else {
      resolve(serviceid)
    }
  })
}

exports.getSmsCode = (code) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9]{8}$/.test(code) || typeof (code) !== 'string') {
      reject('wrong_format_code')
    } else {
      resolve(code)
    }
  })
}

exports.getVoucherCode = (code) => {
  return new Promise((resolve, reject) => {
    if (!/^[a-z0-9]{6,}$/.test(code) || typeof (code) !== 'string') {
      reject('wrong_format_voucher')
    } else {
      resolve(code)
    }
  })
}

exports.getAmount = (amount) => {
  return new Promise((resolve, reject) => {
    if (!/^[1-9][0-9]*$/.test(amount) || typeof (amount) !== 'string') {
      reject('wrong_format_amount')
    } else {
      resolve(parseFloat(amount))
    }
  })
}

// LOADERS

exports.loadConfig = ({db, shopid}) => {
  return new Promise((resolve, reject) => {
    db.child(`config/${shopid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('config_not_exist')
      }
    })
  })
}

exports.loadServer = ({db, serverid}) => {
  return new Promise((resolve, reject) => {
    db.child(`servers/${serverid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('server_not_exist')
      }
    })
  })
}

exports.loadService = ({db, serviceid, shopid}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/services/${serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('service_not_exist')
      }
    })
  })
}

// GENERATORS

exports.generateMicrosmsTransfer = ({config, nick, shopid, serviceid, service, amount}) => {
  const cost = service.microsms_transfer_cost * amount
  const params = new URLSearchParams({
    shopid: config.microsms_transfer_id,
    amount: cost,
    signature: md5(`${config.microsms_transfer_id}${config.microsms_transfer_hash}${cost}`),
    description: `${service.name} dla ${nick}`,
    control: `${shopid}|${serviceid}|${nick}`,
    returl_url: `${baseUrl}/shop/${shopid}/payment_success`,
    returl_urlc: `${apiUrl}/microsms_transfer_webhook`
  })
  return `https://microsms.pl/api/bankTransfer/?${params}`
}

exports.generateLvlup = ({config, nick, shopid, serviceid, service, amount}) => {
  let cost = String(parseFloat(service.lvlup_cost) * amount)
  cost = (+(Math.round(cost + "e+2")  + "e-2")).toFixed(2)
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post('https://api.lvlup.pro/v4/wallet/up', {
        amount: cost,
        redirectUrl: `${baseUrl}`,
        webhookUrl: `${apiUrl}/lvlup_webhook?nick=${nick}&shopid=${shopid}&serviceid=${serviceid}`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.lvlup_api}`
        }
      })
      if (res.status === 200) {
        resolve(res.data.url)
      } else {
        reject('lvlup_error')
      }
    } catch (e) {
      reject('lvlup_error')
    }
  })
}

// FIREBASE

function firebase_init () {
  const {serviceAccount, publicConfig} = JSON.parse(process.env.FIREBASE_CONFIG)
  const {databaseURL} = publicConfig
  if (admin.apps.length === 0) {
	  admin.initializeApp({
	    credential: admin.credential.cert(serviceAccount),
	    databaseURL
	  })
  }
}

exports.firebase = () => {
  firebase_init()
  return admin.database().ref()
}

exports.verifyIdToken = ({idToken}) => {
  firebase_init()
  return admin.messaging().send({token: idToken}, true)
}

// CHECKERS

exports.checkServerOwner = ({db, shopid, server}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/owner`).once('value', (snapshot) => {
      if (snapshot.exists() && server.owner === snapshot.val()) {
        resolve()
      } else {
        reject('server_owner_error')
      }
    })
  })
}

const getDate = () => {
  let d = new Date()
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
  return `${ye}-${mo}-${da}`
}

exports.checkVoucher = ({db, shopid, code}) => {
  return new Promise((resolve, reject) => {
    db.child(`vouchers/${shopid}/${code}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        db.child(`vouchers/${shopid}/${code}`).remove()
        const voucher = snapshot.val()
        if (((voucher.end && voucher.start <= getDate()) || (!voucher.end && voucher.start === getDate())) && ((voucher.end && voucher.end >= getDate()) || !voucher.end)) {
          resolve(voucher)
        } else {
          reject('voucher_expired')
        }
      } else {
        reject('voucher_not_exist')
      }
    })
  })
}

exports.checkMicrosmsCode = ({service, config, code}) => {
  return new Promise((resolve, reject) => {
    const number = ({
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
    })[service.microsms_sms_type]
    axios.get(`https://microsms.pl/api/check.php?userid=${config.microsms_user_id}&number=${number}&code=${code}&serviceid=${config.microsms_sms_id}`).then(({data}) => {
      if (data.split(',')[0] === '1') {
        resolve()
      } else {
        reject('wrong_code')
      }
    })
  })
}

exports.checkMicrosmsIp = ({req}) => {
  return new Promise((resolve, reject) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    axios.get('https://microsms.pl/psc/ips/').then((response) => {
      if (response.data.split(',').includes(ip) && status) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

exports.checkMicrosmsTransferPrice = ({req, service}) => {
  return new Promise((resolve, reject) => {
    if (req.amountUni === service.microsms_transfer_cost) {
      resolve()
    } else {
      reject()
    }
  })
}

exports.checkMicrosmsUserId = ({db, shopid, userid}) => {
  return new Promise((resolve, reject) => {
    db.child(`config/${shopid}/microsms_user_id`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() === userid) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
