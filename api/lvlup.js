import {Handler, Router} from './lib/Request.js'
const LvlupApi = require('lvlup-js');

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
    this.generate()
  }
  generate () {
		const lvlup = new LvlupApi('bsVAIgGURFTBnnGSOhlVVCGiNZepqbcD', {env: 'sandbox'});
		lvlup.createPayment('1', 'https://example.site/redirect', 'https://example.site/webhook').then((link)=>{
			console.log(link)
			this.res.redirect(link.url);
		}).catch(()=>{
			this.res.json({success: false})
		})
  }
}

module.exports = Router('/api/lvlup_gen', new Main())
