import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super("microsms_sms")
  }
  async check () {
    await this.checkBasicRegex()
    await this.checkSmsCodeRegex()
    await this.loadPayments()
    await this.loadService()
    await this.checkMicrosmsCode()
    await this.loadServer()
    await this.checkServerOwner()
    await this.sendRconCommands()
    await this.addPaymentToHistory()
    await this.addMonthlyGoal()
    await this.sendDiscordWebhook()
    this.success()
  }
}

module.exports = Router('/api/microsms_sms', new Main())
