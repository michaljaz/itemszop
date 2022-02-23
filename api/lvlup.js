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
    this.serviceid = req.query.serviceid
    this.nick = req.query.nick
    this.checkRegex()
  }
  checkRegex () {
    if(!/^[a-zA-Z0-9_]{2,16}$/.test(this.nick)){
      this.error('wrong_format_nick')
    }else if(!/^[A-Za-z0-9_]{4,}$/.test(this.shopid)){
      this.error('wrong_format_shopid')
    }else if(!/^[A-Za-z0-9_]{3,}$/.test(this.serviceid)){
      this.error('wrong_format_serviceid')
    }else{
      this.checkPayments()
    }
  }
  checkPayments () {
    this.db.child(`payments/${this.shopid}/lvlup_api`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.lvlup = new LvlupApi(snapshot.val(), {env: 'sandbox'})
        this.checkService()
      } else {
        this.error('payments_not_exist')
      }
    })
  }
  checkService(){
    this.db.child(`shops/${this.shopid}/services/${this.serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        this.service = snapshot.val()
        this.checkLvlup()
      } else {
        this.error('service_not_exist')
      }
    })
  }
  checkLvlup () {
    this.lvlup.createPayment(
      this.service.lvlup_cost,
      `${process.env.BASE_URL}/api/lvlup_webhook`,
      `${process.env.BASE_URL}/api/lvlup_webhook?nick=${this.nick}&shopid=${this.shopid}&serviceid=${this.serviceid}`
    ).then(({url}) => {
      if(url){
        this.success(url)
      }else{
        this.error('wrong_api_key')
      }
    }).catch(() => {
      this.error('lvlup_error')
    })
  }
}

module.exports = Router('/api/lvlup', new Main())
