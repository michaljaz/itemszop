const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.json())
app.all('/api/hello', (req, res) => {
  res.json({ data: 'data' })
})

module.exports = app
