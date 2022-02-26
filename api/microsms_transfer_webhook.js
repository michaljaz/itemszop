import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super("microsms_transfer")
  }
  async check () {
    await this.checkBasicRegex()
    await this.checkMicrosmsIp()
    await this.checkMicrosmsUserId()
    await this.loadService()
    await this.checkMicrosmsTransferPrice()
    await this.checkPrice()
    await this.loadServer()
    await this.checkServerOwner()
    await this.sendRconCommands()
    await this.addPaymentToHistory()
    await this.addMonthlyGoal()
    await this.sendDiscordWebhook()
    await this.success()
  }

  error () {
    this.res.send('ERR')
  }
  success () {
    this.res.send('OK')
  }
}

module.exports = Router('/api/microsms_transfer_webhook', new Main())
