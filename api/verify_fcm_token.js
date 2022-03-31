
import {
  request,
	verifyIdToken
} from './lib/modules.js'

const handler = async (query) => {
  const { idToken } = query
  await verifyIdToken({idToken})
}

module.exports = request(handler, __filename)
