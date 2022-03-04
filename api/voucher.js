
import {
  request,
  firebase,
  getNick,
  getShopId,
  getVoucherCode,
  loadService,
  loadServer,
  sendRconCommands,
  addPaymentToHistory,
  addMonthlyGoal,
  checkServerOwner,
  checkVoucher
} from './lib/modules.js'

module.exports = request('/api/voucher', async (query) => {
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const code = await getVoucherCode(query.code)
  const db = await firebase()

  const voucher = await checkVoucher({db, shopid, code})
  const service = await loadService({db, shopid, serviceid: voucher.service})
  const server = await loadServer({db, serverid: service.server})

  await checkServerOwner({db, shopid, server})

  await sendRconCommands({commands: service.commands, nick, host: server.serverIp, port: server.serverPort, password: server.serverPassword})
})
