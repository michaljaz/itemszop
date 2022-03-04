
import {
  request,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  getSmsCode,
  loadPayments,
  loadService,
  generateMicrosmsTransfer
} from './lib/modules.js'

module.exports = request(__filename, async (query) => {
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)

  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateMicrosmsTransfer({payments, nick, shopid, serviceid, service})
  return url
})
