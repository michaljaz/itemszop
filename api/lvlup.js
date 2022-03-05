
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

const handler = async (query) => {
  console.log(query.nick)
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)
  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateLvlup({payments, nick, shopid, serviceid, service})
  return url
}

module.exports = request(handler, __filename)
