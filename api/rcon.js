
import {
  netlify,
  vercel,
  sendRconCommands
} from './lib/modules.js'

const handler = async (query) => {
  const { host, port, password, command } = query
  const response = await sendRconCommands({commands: command, nick: '', host, port, password})
  return response
}

if (process.env.NETLIFY || process.env.NETLIFY_DEV) {
  exports.handler = netlify(handler)
} else {
  module.exports = vercel(handler, __filename)
}
