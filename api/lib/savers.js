
const addMonthlyGoal = ({type, shopid, db, service}) => {
  return new Promise((resolve, reject) => {
    let cost
    if (type === 'microsms_sms') {
      cost = ({1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 9, 8: 14, 9: 19, 10: 20, 11: 25})[service.microsms_sms_type]
    } else if (type === 'microsms_transfer') {
      cost = parseFloat(service.microsms_transfer_cost)
    } else if (type === 'lvlup') {
      cost = parseFloat(service.lvlup_cost)
    }
    db.child(`shops/${shopid}/collected`).once('value', (snapshot) => {
      if (snapshot.exists()) {
        db.child(`shops/${shopid}/collected`).set(parseFloat(snapshot.val()) + cost).then(() => {
          resolve()
        }).catch(() => {
          reject('monthly_goal_error')
        })
      } else {
        db.child(`shops/${shopid}/collected`).set(cost).then(() => {
          resolve()
        }).catch(() => {
          reject('monthly_goal_error')
        })
      }
    })
  })
}

const addPaymentToHistory = ({db, shopid, nick, service, serviceid, type}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/history`).push().set({
      nick,
      service,
      serviceid,
      date: Date.now(),
      type
    }).then(() => {
      resolve()
    }).catch(() => {
      reject('history_error')
    })
  })
}

module.exports = {addMonthlyGoal, addPaymentToHistory}
