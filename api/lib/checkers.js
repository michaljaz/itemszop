import axios from 'axios'

const checkServerOwner = ({db, shopid, server}) => {
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

const checkVoucher = ({db, shopid, code}) => {
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

const checkMicrosmsCode = ({service, payments, code}) => {
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
    axios.get(`https://microsms.pl/api/check.php?userid=${payments.microsms_user_id}&number=${number}&code=${code}&serviceid=${payments.microsms_sms_id}`).then(({data}) => {
      if (data.split(',')[0] === '1') {
        resolve()
      } else {
        reject('wrong_code')
      }
    })
  })
}

const checkMicrosmsIp = ({req}) => {
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

const checkMicrosmsTransferPrice = ({req, service}) => {
  return new Promise((resolve, reject) => {
    if (req.amountUni === service.microsms_transfer_cost) {
      resolve()
    } else {
      reject()
    }
  })
}

const checkMicrosmsUserId = ({db, shopid, userid}) => {
  return new Promise((resolve, reject) => {
    db.child(`payments/${shopid}/microsms_user_id`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() === userid) {
        resolve()
      } else {
        reject()
      }
    })
  })
}

module.exports = {checkServerOwner, checkVoucher, checkMicrosmsCode, checkMicrosmsIp, checkMicrosmsTransferPrice, checkMicrosmsUserId}
