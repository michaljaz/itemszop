import request from './lib/request.js'
import firebase from './lib/firebase.js'
import {loadPayments, loadService, loadServer} from './lib/loaders.js'
import {checkServerOwner} from './lib/checkers.js'
import {sendRconCommands, sendDiscordWebhook} from './lib/senders.js'
import {addPaymentToHistory, addMonthlyGoal} from './lib/savers.js'

module.exports = request('/api/lvlup_webhook', async (req) => {
  const type = 'lvlup'
  const nick = await getNick(req.query.nick)
  const shopid = await getShopId(req.query.shopid)
  const serviceid = await getServiceId(req.query.serviceid)
  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})
  const server = await loadServer({db, serverid: service.server})

  await checkServerOwner({db, shopid, server})
  await sendRconCommands({commands: service.commands, nick, host: server.serverIp, port: server.serverPort, password: server.serverPassword})
  await addPaymentToHistory({db, shopid, nick, service: service.name, serviceid, type})
  await addMonthlyGoal({type, shopid, db, service})
  await sendDiscordWebhook({shopid, db, nick, serviceName: service.name})
})
