import {
  request,
	validate,
	checkMicrosmsCode,
  executeService
} from './lib/modules.js'

const req = request(async ({params, firebase, ip}) => {
  const nick = await validate.nick(params.nick)
  const shopid = await validate.shopid(params.shopid)
  const serviceid = await validate.serviceid(params.serviceid)
  const smscode = await validate.smscode(params.smscode)

  const config = await firebase.get(`config/${shopid}`)
  const service = await firebase.get(`shops/${shopid}/services/${serviceid}`)
  await checkMicrosmsCode({service, config, smscode})

  await executeService({type: 'microsms_sms', firebase, service, serviceid, shopid, nick, validate})
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
