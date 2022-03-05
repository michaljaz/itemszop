
import {
  request,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  loadPayments,
  loadService,
  loadServer,
  checkServerOwner,
  sendRconCommands,
  sendDiscordWebhook,
  addPaymentToHistory,
  addMonthlyGoal
} from './lib/modules.js'

const handler = async (query) => {
  const type = 'lvlup'
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)
  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})
  const server = await loadServer({db, serverid: service.server})

  await checkServerOwner({db, shopid, server})
  await sendRconCommands({commands: service.commands, nick, host: server.serverIp, port: server.serverPort, password: server.serverPassword})
  await addPaymentToHistory({db, shopid, nick, service: service.name, serviceid, type})
  await addMonthlyGoal({type, shopid, db, service})
  await sendDiscordWebhook({shopid, db, nick, serviceName: service.name})
}

module.exports = request(handler, __filename)
