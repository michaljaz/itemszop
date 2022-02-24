import {Handler, Router} from './lib/Request.js'
import LvlupApi from 'lvlup-js'

class Main extends Handler {
  constructor () {
    return super()
  }
  async check () {
    await this.checkBasicRegex()
    await this.loadPayments()
    await this.loadService()
    await this.generateLvlup()
  }
}

module.exports = Router('/api/lvlup', new Main())
