const loadPayments = ({db, shopid}) => {
  return new Promise((resolve, reject) => {
    db.child(`payments/${shopid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('payments_not_exist')
      }
    })
  })
}

const loadServer = ({db, serverid}) => {
  return new Promise((resolve, reject) => {
    db.child(`servers/${serverid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('server_not_exist')
      }
    })
  })
}

const loadService = ({db, serviceid, shopid}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/services/${serviceid}`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val())
      } else {
        reject('service_not_exist')
      }
    })
  })
}

module.exports = {loadPayments, loadServer, loadService}
