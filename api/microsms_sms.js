import request from './lib/request.js'
import firebase from './lib/firebase.js'
import {getNick, getShopId, getServiceId, getSmsCode} from './lib/params.js'
import {loadPayments, loadService, loadServer} from './lib/loaders.js'
import {checkMicrosmsCode, checkServerOwner} from './lib/checkers.js'
import {sendRconCommands, sendDiscordWebhook} from './lib/senders.js'
import {addPaymentToHistory, addMonthlyGoal} from './lib/savers.js'

module.exports = request('/api/microsms_sms', async (req) => {
  const type = 'microsms_sms'
  const nick = await getNick(req.query.nick)
  const shopid = await getShopId(req.query.shopid)
  const serviceid = await getServiceId(req.query.serviceid)
  const code = await getSmsCode(req.query.code)
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
