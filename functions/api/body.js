import {
  request,
	validate
} from './lib/modules.js'

const req = request(async ({body}) => {
  return body
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
