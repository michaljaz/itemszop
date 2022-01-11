const app = require('express')()
const cors = require('cors')
import * as admin from "firebase-admin"

if(process.env.FIREBASE_SERVICE_ACCOUNT_KEY===undefined){
  console.log("FIREBASE_SERVICE_ACCOUNT_KEY is not set")
}else{
  const buff = new Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64')
  const text = buff.toString('ascii')
  const serviceAccount = JSON.parse(text)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  }
}

app.use(cors())
app.get('/api/voucher', async (req, res) => {
  const { shopid,nick,code } = req.query
  admin.database().ref().child(`vouchers/${shopid}/${code}`)
  .once('value',(snapshot)=>{
    if(snapshot.exists()){
      admin.database().ref().child(`vouchers/${shopid}/${code}`).remove()
      res.json({voucher:snapshot.val()})
    }else{
      res.json({voucher:false})
    }
  })
})

module.exports = app
