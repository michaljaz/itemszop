import {
  request,
	validate,
	checkIfVoucherExpired,
  executeService
} from './lib/modules.js'

const req = request(async ({params, firebase, baseUrl}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const vouchercode = await validate.vouchercode(params.vouchercode)
  const voucher = await firebase.get(`vouchers/${shopid}/${vouchercode}`)

  await firebase.remove(`vouchers/${shopid}/${vouchercode}`)
  await checkIfVoucherExpired(voucher)
  const service = await firebase.get(`shops/${shopid}/services/${voucher.service}`)

  await executeService({type: 'voucher', firebase, serviceid: voucher.service, shopid, nick, amount: 1, validate, baseUrl})
})

export const onRequest = req.cloudflare
export const handler = req.netlify
let filename = ""
try{
  filename = __filename
}catch(e){}
export default req.vercel(filename)
