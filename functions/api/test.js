import {request} from './lib/modules.js'

const req = request(async (params, baseUrl) => {
  return baseUrl
})

export const onRequest = req
export default req
try {
  module.exports.handler = req
}catch(e){}
