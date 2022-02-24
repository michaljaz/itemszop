import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkBasicRegex()
    await this.loadPayments()
    await this.loadService()
    await this.generateMicrosmsTransfer()
  }
}

module.exports = Router('/api/microsms_transfer', new Main())
