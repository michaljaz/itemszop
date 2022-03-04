
import {
  request,
  sendRconCommands
} from './lib/modules.js'

module.exports = request('/api/rcon', async (query) => {
  const { host, port, password, command } = query
  const response = await sendRconCommands({commands: command, nick: '', host, port, password})
  return response
})
