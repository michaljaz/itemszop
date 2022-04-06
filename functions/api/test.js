import {request} from './lib/modules.js'

const req = request(async (params, baseUrl) => {
  return "TEST"
})

export const onRequest = req.cloudflare
export default req.vercel()
try {
  exports.handler = req.netlify
}catch(e){}
