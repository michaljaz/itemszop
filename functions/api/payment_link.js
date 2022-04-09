import {
  request,
	validate,
	generateLvlup,
  generateMicrosmsTransfer
} from './lib/modules.js'

const req = request(async ({params, apiBaseUrl, baseUrl, firebase}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const serviceid = await validate.serviceid(params.serviceid)
  const amount = await validate.amount(params.amount)
  const paymenttype = await validate.paymenttype(params.paymenttype)

  const config = await firebase.get(`config/${shopid}`)
  const service = await firebase.get(`shops/${shopid}/services/${serviceid}`)

  if (paymenttype === 'lvlup') {
    return await generateLvlup({config, nick, shopid, serviceid, service, amount, apiBaseUrl, baseUrl})
  } else if (paymenttype === 'microsms_transfer') {
    return await generateMicrosmsTransfer({config, nick, shopid, serviceid, service, amount, apiBaseUrl, baseUrl})
  } else {
    throw 'wrong_paymenttype'
  }
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
