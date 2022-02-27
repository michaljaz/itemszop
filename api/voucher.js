import request from './lib/request.js'
import firebase from './lib/firebase.js'
import {getNick, getShopId, getVoucherCode} from './lib/params.js'
import {loadService, loadServer} from './lib/loaders.js'
import {sendRconCommands} from './lib/senders.js'
import {addPaymentToHistory, addMonthlyGoal} from './lib/savers.js'
import {checkServerOwner, checkVoucher} from './lib/checkers.js'

module.exports = request('/api/voucher', async (req) => {
  const nick = await getNick(req.query.nick)
  const shopid = await getShopId(req.query.shopid)
  const code = await getVoucherCode(req.query.code)
  const db = await firebase()

  const voucher = await checkVoucher({db, shopid, code})
  const service = await loadService({db, shopid, serviceid: voucher.service})
  const server = await loadServer({db, serverid: service.server})

  await checkServerOwner({db, shopid, server})

  await sendRconCommands({commands: service.commands, nick, host: server.serverIp, port: server.serverPort, password: server.serverPassword})
})
