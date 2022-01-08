const app = require('express')()
const cors = require('cors')
app.use(cors())
app.get('/api/voucher', async (req, res) => {
  res.send("OK")
})

module.exports = app
