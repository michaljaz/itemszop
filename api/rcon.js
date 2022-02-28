
import {
  request,
  sendRconCommands
} from './lib/modules.js'

module.exports = request('/api/rcon', async (req) => {
  const { host, port, password, command } = req.query
  const response = await sendRconCommands({commands: command, nick: '', host, port, password})
  return response
})
