import {
  request,
	getNick,
	getShopId,
	getServiceId,
	getAmount,
	generateMicrosmsTransfer
} from './lib/modules.js'

const req = request(async ({params, apiBaseUrl, baseUrl, firebase}) => {
  const nick = await getNick(params.nick)
  const shopid = await getShopId(params.shopid)
  const serviceid = await getServiceId(params.serviceid)
  const amount = await getAmount(params.amount)

  const config = await firebase.get(`config/${shopid}`)
  const service = await firebase.get(`shops/${shopid}/services/${serviceid}`)

  const url = await generateMicrosmsTransfer({config, nick, shopid, serviceid, service, amount, apiBaseUrl, baseUrl})
  return url
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
