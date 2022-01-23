import { Rcon } from 'rcon-client'
import app from './lib/app.js'

app.get('/api/sms', (req, res) => {
  const { code, nick, shopid, serviceid } = req.query
  res.send("OK")
})

module.exports = app
