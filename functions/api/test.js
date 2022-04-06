import {request} from './lib/modules.js'

const req = request(async (params, baseUrl) => {
  return baseUrl
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
