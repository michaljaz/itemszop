import {
  request,
	validate,
  checkLvlupTransfer,
  executeService,
  checkMicrosmsIp
} from './lib/modules.js'

const req = request(async ({params, body, firebase, ip}) => {
  const paymenttype = await validate.paymenttype(params.paymenttype)
  if (paymenttype === 'lvlup') {
    // lvlup payment webhook
    const {paymentId, status} = body
    const {nick, shopid, serviceid, amount} = await checkLvlupTransfer({paymentId, firebase})

    await executeService({type: 'lvlup', firebase, nick, shopid, serviceid, amount, validate})
  } else {
    // microsms payment webhook

    // await executeService({type: 'microsms_transfer', firebase, nick, shopid, serviceid, amount, validate})
  }
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
