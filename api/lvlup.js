
import {
  request,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  loadPayments,
  loadService,
  generateLvlup
} from './lib/modules.js'

module.exports = request('/api/lvlup', async (req) => {
  const nick = await getNick(req.query.nick)
  const shopid = await getShopId(req.query.shopid)
  const serviceid = await getServiceId(req.query.serviceid)
  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateLvlup({payments, nick, shopid, serviceid, service})
  return url
})
