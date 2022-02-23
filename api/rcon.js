import {Handler, Router} from './lib/Request.js'

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
    const { host, port, password, command } = req.query
    this.rcon.connect({
      host, port, password
    }).then((rcon) => {
      rcon.send(command)
        .then((response) => {
          this.success(response)
        })
        .catch((e) => {
          this.error('command')
        })
    }).catch((e) => {
      this.error('auth')
    })
  }
}

module.exports = Router('/api/rcon', new Main())
