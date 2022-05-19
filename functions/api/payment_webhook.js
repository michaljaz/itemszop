import {
  request,
	validate,
  checkLvlupPayment,
  executeService
} from './lib/modules.js'

const req = request(async ({params, body, firebase}) => {
  const paymenttype = await validate.paymenttype(params.paymenttype)
  if (paymenttype === 'lvlup') {
    // lvlup payment webhook
    const {paymentId, status} = body
    const {nick, shopid, serviceid, amount} = await checkLvlupPayment({paymentId, firebase})
    
    await executeService({type: 'lvlup', firebase, nick, shopid, serviceid, amount, validate})
  } else {
    // microsms payment webhook
  }
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
