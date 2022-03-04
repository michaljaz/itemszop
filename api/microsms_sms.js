
import {
  request,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  getSmsCode,
  loadPayments,
  loadService,
  loadServer,
  checkMicrosmsCode,
  checkServerOwner,
  sendRconCommands,
  sendDiscordWebhook,
  addPaymentToHistory,
  addMonthlyGoal
} from './lib/modules.js'

module.exports = request('/api/microsms_sms', async (query) => {
  const type = 'microsms_sms'
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)
  const code = await getSmsCode(query.code)
  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})
  await checkMicrosmsCode({code, payments, service})

  const server = await loadServer({db, serverid: service.server})
  await checkServerOwner({db, shopid, server})
  await sendRconCommands({commands: service.commands, nick, host: server.serverIp, port: server.serverPort, password: server.serverPassword})

  await addPaymentToHistory({db, shopid, nick, service: service.name, serviceid, type})
  await addMonthlyGoal({type, shopid, db, service})
  await sendDiscordWebhook({shopid, db, nick, serviceName: service.name})
})
