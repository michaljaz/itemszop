import {
  request,
	getNick,
	getShopId,
	getVoucherCode,
	checkIfVoucherExpired
} from './lib/modules.js'

const req = request(async ({params, firebase}) => {
  const nick = await getNick(params.nick)
  const shopid = await getShopId(params.shopid)
  const code = await getVoucherCode(params.code)

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
