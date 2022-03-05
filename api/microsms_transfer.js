
import {
  netlify,
  vercel,
  firebase,
  getNick,
  getShopId,
  getServiceId,
  getSmsCode,
  loadPayments,
  loadService,
  generateMicrosmsTransfer
} from './lib/modules.js'

const handler = async (query) => {
  const nick = await getNick(query.nick)
  const shopid = await getShopId(query.shopid)
  const serviceid = await getServiceId(query.serviceid)

  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateMicrosmsTransfer({payments, nick, shopid, serviceid, service})
  return url
}

if (process.env.NETLIFY || process.env.NETLIFY_DEV) {
  exports.handler = netlify(handler)
} else {
  module.exports = vercel(handler, __filename)
}
