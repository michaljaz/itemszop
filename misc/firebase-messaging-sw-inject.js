messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)

  // const notificationTitle = payload.notification.title
  // const notificationOptions = {
  //   body: payload.notification.body
  // }

  // self.registration.showNotification(notificationTitle, notificationOptions)
})
