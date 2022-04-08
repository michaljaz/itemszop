import {
  request,
  getBaseUrl
} from './lib/modules.js'

const req = request(async ({url}) => {
  return getBaseUrl(url)
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
