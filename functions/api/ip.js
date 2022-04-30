import {
  request,
} from './lib/modules.js'

const req = request(async ({ip}) => {
	return ip
})

export const onRequest = req.cloudflare
export const handler = req.netlify
export default req.vercel()
