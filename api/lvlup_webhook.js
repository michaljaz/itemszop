import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super()
  }
	async check () {
    this.success()
  }
  success () {
    this.res.json({success: true})
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
}

module.exports = Router('/api/lvlup_webhook', new Main())
