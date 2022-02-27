const app = require('express')()
const cors = require('cors')
app.use(cors())

module.exports = (path, handler) => {
  app.get(path, (req, res) => {
	  handler(req).then((data) => {
	    res.json({success: true, data})
	  }).catch((error) => {
	    res.json({success: false, error})
	  })
  })
	return app
}
