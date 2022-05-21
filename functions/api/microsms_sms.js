import {
  request,
	validate,
	checkMicrosmsCode,
  executeService
} from './lib/modules.js'

const req = request(async ({params, firebase, baseUrl}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const serviceid = await validate.serviceid(params.serviceid)
  const smscode = await validate.smscode(params.smscode)
  const smstype = await validate.amount(params.amount)

  const config = await firebase.get(`config/${shopid}`)
  const service = await firebase.get(`shops/${shopid}/services/${serviceid}`)
  let amount = 1
  let type = 'default'
  if (service.costslider) {
    let [type, amount] = service.microsms_sms_list.split('|')[smstype - 1].split('=')
  }
  await checkMicrosmsCode({service, config, smscode, type})

  await executeService({type: 'microsms_sms', firebase, serviceid, shopid, nick, validate, amount, baseUrl})
})

export const onRequest = req.cloudflare
export const handler = req.netlify
let filename = ""
try{
  filename = __filename
}catch(e){}
export default req.vercel(filename)
