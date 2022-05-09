import {
  request,
	validate
} from './lib/modules.js'

const req = request(async ({params, body}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const serviceid = await validate.serviceid(params.serviceid)
  const amount = await validate.amount(params.amount)
  const paymenttype = await validate.paymenttype(params.paymenttype)
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
