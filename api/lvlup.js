import {Handler, Router} from './lib/Request.js'
import LvlupApi from 'lvlup-js'

class Main extends Handler {
  constructor () {
    super()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    this.req = req
    this.res = res
    this.shopid = req.query.shopid
    this.checkPayments()
  }
  checkPayments () {
    this.db.child(`payments/${this.shopid}/lvlup_api`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.lvlup = new LvlupApi(snapshot.val(), {env: 'sandbox'})
        this.checkLvlup()
      } else {
        this.error('payments_not_exist')
      }
    })
  }
  checkLvlup () {
    this.lvlup.createPayment('1', `${process.env.BASE_URL}`, `${process.env.BASE_URL}/api/lvlup_webhook`).then(({url}) => {
      if(url){
        this.url = url
        this.success()
      }else{
        this.error('wrong_api_key')
      }
    }).catch(() => {
      this.error('lvlup_error')
    })
  }
  success () {
    this.res.json({success: true, url: this.url})
  }
  error (message) {
    this.res.json({success: false, error: message})
  }
}

module.exports = Router('/api/lvlup', new Main())
