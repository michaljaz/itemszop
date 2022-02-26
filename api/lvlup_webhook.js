import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super("lvlup")
  }
  async check () {
    await this.checkBasicRegex()
    await this.loadPayments()
    await this.loadService()
    await this.loadServer()
    await this.checkServerOwner()
    await this.sendRconCommands()
    await this.addPaymentToHistory()
    await this.addMonthlyGoal()
    await this.sendDiscordWebhook()
    this.success()
  }
}

module.exports = Router('/api/lvlup_webhook', new Main())
