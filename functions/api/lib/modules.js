
const { getTokenFromGCPServiceAccount } = require('@sagi.io/workers-jwt')
const md5 = require('md5')
let fetch

// REQUEST

function getBaseUrl (url) {
  const l = url.split('/')
  return `${l[0]}//${l[2]}`
}

exports.request = (handler) => {
  return {
    async cloudflare ({request, env}) {
      fetch = globalThis.fetch
      const params = {}
      const queryString = new URL(request.url).search.slice(1).split('&')
      queryString.forEach(item => {
        const kv = item.split('=')
        if (kv[0]) params[kv[0]] = kv[1] || true
      })
      const url = request.url
      return handler({
        params,
        url,
        baseUrl: getBaseUrl(url),
        apiBaseUrl: `${getBaseUrl(url)}/api`,
        firebase: await new Firebase(env.FIREBASE_CONFIG).init_cloudflare(),
        fetch
      }).then((data) => (
        new Response(JSON.stringify({success: true, data}), {headers: {'content-type': 'application/json'}})
      )).catch((error) => (
        new Response(JSON.stringify({success: false, error}), {headers: {'content-type': 'application/json'}})
      ))
    },
    async netlify (event, context) {
      const a = 'node-fetch'
      fetch = require(a)
      const url = event.rawUrl
      return handler({
        params: event.queryStringParameters,
        url,
        baseUrl: getBaseUrl(url),
        apiBaseUrl: `${getBaseUrl(url)}/.netlify/functions`,
        firebase: await new Firebase(process.env.FIREBASE_CONFIG).init(),
        fetch
      }).then((data) => ({
        statusCode: 200,
        body: JSON.stringify({success: true, data})
      })).catch((error) => ({
        statusCode: 200,
        body: JSON.stringify({success: false, error})
      }))
    },
    vercel () {
      try {
        const a = 'node-fetch'
        fetch = require(a)
        const b = 'express'
        const app = require(b)()
        app.get(`/api/:name`, async (req, res) => {
          const url = req.protocol + '://' + req.get('host') + req.originalUrl
          handler({
            params: req.query,
            url,
            baseUrl: getBaseUrl(url),
            apiBaseUrl: `${getBaseUrl(url)}/api`,
            firebase: await new Firebase(process.env.FIREBASE_CONFIG).init(),
            fetch
          }).then((data) => {
            res.json({success: true, data})
          }).catch((error) => {
            res.json({success: false, error})
          })
        })
        return app
      } catch (e) {}
    }
  }
}

// FIREBASE

class Firebase {
  constructor (firebaseConfig) {
    const {publicConfig, serviceAccount} = JSON.parse(firebaseConfig)
    this.publicConfig = publicConfig
    this.serviceAccount = serviceAccount
  }
  async init () {
    this.access_token = await new Promise((resolve, reject) => {
      const a = 'googleapis'
      const {google} = require(a)
      var jwtClient = new google.auth.JWT(
        this.serviceAccount.client_email,
        null,
        this.serviceAccount.private_key,
        [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/firebase.database'
        ]
      )
      jwtClient.authorize(function (error, tokens) {
        if (error) {
          reject(`Error making request to generate access token: ${error}`)
        } else if (tokens.access_token === null) {
          reject('Provided service account does not have permission to generate access tokens')
        } else {
          resolve(tokens.access_token)
        }
      })
    })
    return this
  }
  async init_cloudflare () {
    const jwtToken = await getTokenFromGCPServiceAccount({
      serviceAccountJSON: this.serviceAccount,
      aud: 'https://oauth2.googleapis.com/token',
      payloadAdditions: {
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/firebase.database'
        ].join(' ')
      }
    })
    const {access_token} = await (
      await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwtToken
        })
      })
    ).json()
    this.access_token = access_token
    return this
  }
  get (path) {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${this.publicConfig.databaseURL}/${path}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.access_token}`
        }
      })
      const result = await response.json()
      if (result) {
        resolve(result)
      } else {
        reject(`reference_not_found`)
      }
    })
  }
  async remove (path) {
    const response = await fetch(`${this.publicConfig.databaseURL}/${path}.json`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.access_token}`
      }
    })
  }
  async update (path, val) {
    const response = await fetch(`${this.publicConfig.databaseURL}/${path}.json`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.access_token}`
      },
      body: JSON.stringify(val)
    })
  }
}

// VALIDATORS

exports.validate = {
  nick (text) {
    return new Promise((resolve, reject) => {
      if (!/^[a-zA-Z0-9_]{2,16}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_nick')
      } else {
        resolve(text)
      }
    })
  },
  shopid (text) {
    return new Promise((resolve, reject) => {
      if (!/^[A-Za-z0-9_]{4,}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_shopid')
      } else {
        resolve(text)
      }
    })
  },
  serviceid (text) {
    return new Promise((resolve, reject) => {
      if (!/^[A-Za-z0-9_]{3,}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_serviceid')
      } else {
        resolve(text)
      }
    })
  },
  smscode (text) {
    return new Promise((resolve, reject) => {
      if (!/^[A-Za-z0-9]{8}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_code')
      } else {
        resolve(text)
      }
    })
  },
  vouchercode (text) {
    return new Promise((resolve, reject) => {
      if (!/^[a-z0-9]{6,}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_vouchercode')
      } else {
        resolve(text)
      }
    })
  },
  amount (text) {
    return new Promise((resolve, reject) => {
      if (!/^[1-9][0-9]*$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_amount')
      } else {
        resolve(parseFloat(text))
      }
    })
  },
  paymenttype (text) {
    return new Promise((resolve, reject) => {
      if (!/^[a-z_]{4,}$/.test(text) || typeof (text) !== 'string') {
        reject('wrong_format_paymenttype')
      } else {
        resolve(text)
      }
    })
  }
}

// GENERATORS

exports.generateLvlup = async({config, nick, shopid, serviceid, service, amount, apiBaseUrl, baseUrl}) => {
  let cost = String(parseFloat(service.lvlup_cost) * amount)
  cost = (+(Math.round(cost + 'e+2') + 'e-2')).toFixed(2)
  const response = await fetch('https://api.lvlup.pro/v4/wallet/up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.lvlup_api}`
    },
    body: JSON.stringify({
      amount: cost,
      redirectUrl: baseUrl,
      webhookUrl: `${apiBaseUrl}/api/lvlup_webhook?nick=${nick}&shopid=${shopid}&serviceid=${serviceid}`
    })
  })
  return (await response.json()).url
}

exports.generateMicrosmsTransfer = ({config, nick, shopid, serviceid, service, amount, apiBaseUrl, baseUrl}) => {
  const cost = service.microsms_transfer_cost * amount
  const params = new URLSearchParams({
    shopid: config.microsms_transfer_id,
    amount: cost,
    signature: md5(`${config.microsms_transfer_id}${config.microsms_transfer_hash}${cost}`),
    description: `${service.name} dla ${nick}`,
    control: `${shopid}|${serviceid}|${nick}`,
    returl_url: `${baseUrl}/shop/${shopid}/payment_success`,
    returl_urlc: `${apiBaseUrl}/microsms_transfer_webhook`
  })
  return `https://microsms.pl/api/bankTransfer/?${params}`
}

// CHECKERS

const getDate = () => {
  let d = new Date()
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
  return `${ye}-${mo}-${da}`
}

exports.checkIfVoucherExpired = (voucher) => {
  return new Promise((resolve, reject) => {
    if (((voucher.end && voucher.start <= getDate()) || (!voucher.end && voucher.start === getDate())) && ((voucher.end && voucher.end >= getDate()) || !voucher.end)) {
      resolve(voucher)
    } else {
      reject('voucher_expired')
    }
  })
}

exports.checkMicrosmsCode = ({service, config, smscode}) => {
  return new Promise(async (resolve, reject) => {
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
    const response = await fetch(`https://microsms.pl/api/check.php?userid=${config.microsms_user_id}&number=${number}&code=${smscode}&serviceid=${config.microsms_sms_id}`)
    const data = await response.text()
    if (data.split(',')[0] === '1') {
      resolve()
    } else {
      reject('wrong_code')
    }
  })
}

// SENDERS

exports.sendCommands = ({firebase, service, nick, shopid}) => {
  return new Promise((resolve, reject) => {
    firebase.get(`servers/${service.server}`).then((server) => {
      const commands = service.commands.split('\n')
      const newCommands = {}
      for (let command of commands) {
        const commandId = Math.random().toString(36).replace('0.', '')
        newCommands[commandId] = command.replace(/\[nick\]/g, nick)
      }
      firebase.get(`shops/${shopid}/owner`).then((shopOwner) => {
        if (shopOwner === server.owner) {
          firebase.update(`servers/${service.server}/commands`, newCommands).then(() => {
            resolve()
          }).catch(() => {
            reject('commands_error')
          })
        }
      }).catch((e) => {
        reject('wrong_shopid')
      })
    }).catch((e) => {
      reject('server_not_found')
    })
  })
}

// exports.sendDiscordWebhook = async ({shopid, nick, serviceName}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`shops/${shopid}/webhook`).once('value', (snapshot) => {
//       if (snapshot.exists() && snapshot.val() !== '') {
//         axios.post(snapshot.val(), {
//           content: `${nick} właśnie kupił(a) ${serviceName}`
//         }).then(() => {
//           resolve()
//         }).catch(() => {
//           reject('discord_webhook_error')
//         })
//       } else {
//         resolve()
//       }
//     })
//   })
// }
//
//
// // SAVERS
//
// exports.addMonthlyGoal = ({type, shopid, db, service}) => {
//   return new Promise((resolve, reject) => {
//     let cost
//     if (type === 'microsms_sms') {
//       cost = ({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 9, 8: 14, 9: 19, 10: 20, 11: 25})[service.microsms_sms_type]
//     } else if (type === 'microsms_transfer') {
//       cost = parseFloat(service.microsms_transfer_cost)
//     } else if (type === 'lvlup') {
//       cost = parseFloat(service.lvlup_cost)
//     }
//     db.child(`shops/${shopid}/collected`).once('value', (snapshot) => {
//       if (snapshot.exists()) {
//         db.child(`shops/${shopid}/collected`).set(parseFloat(snapshot.val()) + cost).then(() => {
//           resolve()
//         }).catch(() => {
//           reject('monthly_goal_error')
//         })
//       } else {
//         db.child(`shops/${shopid}/collected`).set(cost).then(() => {
//           resolve()
//         }).catch(() => {
//           reject('monthly_goal_error')
//         })
//       }
//     })
//   })
// }
//
// exports.addPaymentToHistory = ({db, shopid, nick, service, serviceid, type}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`shops/${shopid}/history`).push().set({
//       nick,
//       service,
//       serviceid,
//       date: Date.now(),
//       type
//     }).then(() => {
//       resolve()
//     }).catch(() => {
//       reject('history_error')
//     })
//   })
// }
//

//
// // LOADERS
//
// exports.loadConfig = ({db, shopid}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`config/${shopid}`).once('value', (snapshot) => {
//       if (snapshot.exists()) {
//         resolve(snapshot.val())
//       } else {
//         reject('config_not_exist')
//       }
//     })
//   })
// }
//
// exports.loadServer = ({db, serverid}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`servers/${serverid}`).once('value', (snapshot) => {
//       if (snapshot.exists()) {
//         resolve(snapshot.val())
//       } else {
//         reject('server_not_exist')
//       }
//     })
//   })
// }
//
// exports.loadService = ({db, serviceid, shopid}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`shops/${shopid}/services/${serviceid}`).once('value', (snapshot) => {
//       if (snapshot.exists()) {
//         resolve(snapshot.val())
//       } else {
//         reject('service_not_exist')
//       }
//     })
//   })
// }
//
// // GENERATORS
//
// exports.generateMicrosmsTransfer = ({config, nick, shopid, serviceid, service, amount}) => {
//   const cost = service.microsms_transfer_cost * amount
//   const params = new URLSearchParams({
//     shopid: config.microsms_transfer_id,
//     amount: cost,
//     signature: md5(`${config.microsms_transfer_id}${config.microsms_transfer_hash}${cost}`),
//     description: `${service.name} dla ${nick}`,
//     control: `${shopid}|${serviceid}|${nick}`,
//     returl_url: `${baseUrl}/shop/${shopid}/payment_success`,
//     returl_urlc: `${apiUrl}/microsms_transfer_webhook`
//   })
//   return `https://microsms.pl/api/bankTransfer/?${params}`
// }
//
// exports.generateLvlup = ({config, nick, shopid, serviceid, service, amount}) => {
//   let cost = String(parseFloat(service.lvlup_cost) * amount)
//   cost = (+(Math.round(cost + 'e+2') + 'e-2')).toFixed(2)
//   return new Promise(async (resolve, reject) => {
//     try {
//       const res = await axios.post('https://api.lvlup.pro/v4/wallet/up', {
//         amount: cost,
//         redirectUrl: `${baseUrl}`,
//         webhookUrl: `${apiUrl}/lvlup_webhook?nick=${nick}&shopid=${shopid}&serviceid=${serviceid}`
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${config.lvlup_api}`
//         }
//       })
//       if (res.status === 200) {
//         resolve(res.data.url)
//       } else {
//         reject('lvlup_error')
//       }
//     } catch (e) {
//       reject('lvlup_error')
//     }
//   })
// }
//
// // CHECKERS
//
//
//
// exports.checkMicrosmsCode = ({service, config, code}) => {
//   return new Promise((resolve, reject) => {
//     const number = ({
//       1: '71480',
//       2: '72480',
//       3: '73480',
//       4: '74480',
//       5: '75480',
//       6: '76480',
//       7: '79480',
//       8: '91400',
//       9: '91900',
//       10: '92022',
//       11: '92550'
//     })[service.microsms_sms_type]
//     axios.get(`https://microsms.pl/api/check.php?userid=${config.microsms_user_id}&number=${number}&code=${code}&serviceid=${config.microsms_sms_id}`).then(({data}) => {
//       if (data.split(',')[0] === '1') {
//         resolve()
//       } else {
//         reject('wrong_code')
//       }
//     })
//   })
// }
//
// exports.checkMicrosmsIp = ({req}) => {
//   return new Promise((resolve, reject) => {
//     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
//     axios.get('https://microsms.pl/psc/ips/').then((response) => {
//       if (response.data.split(',').includes(ip) && status) {
//         resolve()
//       } else {
//         reject()
//       }
//     })
//   })
// }
//
// exports.checkMicrosmsTransferPrice = ({req, service}) => {
//   return new Promise((resolve, reject) => {
//     if (req.amountUni === service.microsms_transfer_cost) {
//       resolve()
//     } else {
//       reject()
//     }
//   })
// }
//
// exports.checkMicrosmsUserId = ({db, shopid, userid}) => {
//   return new Promise((resolve, reject) => {
//     db.child(`config/${shopid}/microsms_user_id`).once('value', (snapshot) => {
//       if (snapshot.exists() && snapshot.val() === userid) {
//         resolve()
//       } else {
//         reject()
//       }
//     })
//   })
// }
