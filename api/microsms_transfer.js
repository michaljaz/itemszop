
import {
  request,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  getSmsCode,
  getAmount,
  loadConfig,
  loadService,
  generateMicrosmsTransfer,
} from './lib/modules.js'

const handler = async (query) => {
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)
  const amount = await getAmount(query.amount)

  const db = await firebase()

  const config = await loadConfig({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateMicrosmsTransfer({config, nick, shopid, serviceid, service, amount})
  return url
}

module.exports = request(handler, __filename)
