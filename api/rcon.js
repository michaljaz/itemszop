import {Handler, Router} from './lib/Request.js'

class Main extends Handler {
  constructor () {
    return super()
  }
  check () {
    const { host, port, password, command } = this.req.query
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
