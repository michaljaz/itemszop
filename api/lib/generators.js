import md5 from 'md5'
import LvlupApi from 'lvlup-js'

const generateMicrosmsTransfer = ({payments, nick, shopid, serviceid, service}) => {
  const params = new URLSearchParams({
    shopid: payments.microsms_transfer_id,
    amount: service.microsms_transfer_cost,
    signature: md5(`${payments.microsms_transfer_id}${payments.microsms_transfer_hash}${service.microsms_transfer_cost}`),
    description: `${service.name} dla ${nick}`,
    control: `${shopid}|${serviceid}|${nick}`,
    returl_url: `${process.env.BASE_URL}/shop/${shopid}/payment_success`,
    returl_urlc: `${process.env.BASE_URL}/api/microsms_transfer_webhook`
  })
  return `https://microsms.pl/api/bankTransfer/?${params}`
}

const generateLvlup = ({payments, nick, shopid, serviceid, service}) => {
  return new Promise((resolve, reject) => {
    const lvlup = new LvlupApi(payments.lvlup_api)
		// const lvlup = new LvlupApi(payments.lvlup_api, {env: 'sandbox'})
    lvlup.createPayment(service.lvlup_cost, `${process.env.BASE_URL}`, `${process.env.BASE_URL}/api/lvlup_webhook?nick=${nick}&shopid=${shopid}&serviceid=${serviceid}`).then(({url}) => {
      if (url) {
        resolve(url)
      } else {
        reject('wrong_api_key')
      }
    }).catch(() => {
      reject('lvlup_error')
    })
  })
}

module.exports = {generateMicrosmsTransfer, generateLvlup}
