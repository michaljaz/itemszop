import { Rcon } from 'rcon-client'
import app from './lib/app.js'

app.get('/api/rcon', (req, res) => {
  const { host, port, password, command } = req.query
  Rcon.connect({
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
})

module.exports = app
