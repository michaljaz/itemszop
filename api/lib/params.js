
const getNick = (nick) => {
  return new Promise((resolve, reject) => {
    if (!/^[a-zA-Z0-9_]{2,16}$/.test(nick) || typeof (nick) !== 'string') {
      reject('wrong_format_nick')
    } else {
      resolve(nick)
    }
  })
}

const getShopId = (shopid) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9_]{4,}$/.test(shopid) || typeof (shopid) !== 'string') {
      reject('wrong_format_shopid')
    } else {
      resolve(shopid)
    }
  })
}

const getServiceId = (serviceid) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9_]{3,}$/.test(serviceid) || typeof (serviceid) !== 'string') {
      reject('wrong_format_serviceid')
    } else {
      resolve(serviceid)
    }
  })
}

const getSmsCode = (code) => {
  return new Promise((resolve, reject) => {
    if (!/^[A-Za-z0-9]{8}$/.test(code) || typeof (code) !== 'string') {
      reject('wrong_format_code')
    } else {
      resolve(code)
    }
  })
}

const getVoucherCode = (code) => {
  return new Promise((resolve, reject) => {
    if (!/^[a-z0-9]{6,}$/.test(code) || typeof (code) !== 'string') {
      reject('wrong_format_voucher')
    } else {
      resolve(code)
    }
  })
}

module.exports = {getNick, getShopId, getServiceId, getSmsCode, getVoucherCode}
