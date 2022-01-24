import {Handler, Router} from './lib/Request.js'

class RconHandler extends Handler {
  constructor () {
    super()
    return (req, res) => {
      this.check(req, res)
    }
  }
  check (req, res) {
    const { host, port, password, command } = req.query
    this.rcon.connect({
      host, port, password
    }).then((rcon) => {
      rcon.send(command)
        .then((response) => {
          res.json({ response, error: false })
        })
        .catch((e) => {
          res.json({ error: 'command' })
        })
    }).catch((e) => {
      res.json({ error: 'auth' })
    })
  }
}

module.exports = Router('/api/rcon', new RconHandler())
