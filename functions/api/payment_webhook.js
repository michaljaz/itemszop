import {
  request,
	validate,
  checkLvlupTransfer,
  executeService,
  checkMicrosmsTransfer
} from './lib/modules.js'

const req = request(async ({params, body, firebase, ip, baseUrl}) => {
  const paymenttype = await validate.paymenttype(params.paymenttype)
  if (paymenttype === 'lvlup') {
    // lvlup payment webhook
    const {nick, shopid, serviceid, amount} = await checkLvlupTransfer({firebase, body})

    await executeService({type: 'lvlup', firebase, nick, shopid, serviceid, amount, validate, baseUrl})
  } else {
    // microsms payment webhook
    const {nick, shopid, serviceid, amount} = await checkMicrosmsTransfer({ip, firebase, body, validate})

    await executeService({type: 'microsms_transfer', firebase, nick, shopid, serviceid, amount, validate, baseUrl})
    return 'OK'
  }
})

export const onRequest = req.cloudflare
export const handler = req.netlify
let filename = ""
try{
  filename = __filename
}catch(e){}
export default req.vercel(filename)
