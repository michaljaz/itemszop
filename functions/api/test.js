import {request} from './lib/modules.js'

const req=request(async (params) => {
  return params
})

export const onRequest = req
export const handler = req
export default req
