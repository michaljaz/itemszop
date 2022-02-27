import request from './lib/request.js'
import firebase from './lib/firebase.js'
import {getNick, getShopId, getServiceId, getSmsCode} from './lib/params.js'
import {loadPayments, loadService} from './lib/loaders.js'
import {generateMicrosmsTransfer} from './lib/generators.js'

module.exports = request('/api/microsms_transfer', async (req) => {
  const nick = await getNick(req.query.nick)
  const shopid = await getShopId(req.query.shopid)
  const serviceid = await getServiceId(req.query.serviceid)

  const db = await firebase()

  const payments = await loadPayments({db, shopid})
  const service = await loadService({db, shopid, serviceid})

  const url = await generateMicrosmsTransfer({payments, nick, shopid, serviceid, service})
  return url
})
