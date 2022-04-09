import {
  request,
	validate,
	checkIfVoucherExpired
} from './lib/modules.js'

const req = request(async ({params, firebase}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const code = await validate.vouchercode(params.vouchercode)

  const voucher = await firebase.get(`vouchers/${shopid}/${code}`)
  await firebase.remove(`vouchers/${shopid}/${code}`)
  await checkIfVoucherExpired(voucher)

  const service = await firebase.get(`shops/${shopid}/services/${voucher.service}`)
  const server = await firebase.get(`servers/${service.server}`)

	// TODO: sending commands to server
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
