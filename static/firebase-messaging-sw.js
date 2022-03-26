
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js'
)
firebase.initializeApp({"apiKey":"AIzaSyAgqotnCT9d_zcmwrE8mHWiC9JL8r75U-s","authDomain":"sklepmc-c7516.firebaseapp.com","databaseURL":"https:\u002F\u002Fsklepmc-c7516-default-rtdb.europe-west1.firebasedatabase.app","projectId":"sklepmc-c7516","storageBucket":"sklepmc-c7516.appspot.com","messagingSenderId":"889784816765","appId":"1:889784816765:web:7c84a7bce9b480ce7d4d14"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body
  }

  self.registration.showNotification(notificationTitle,
  notificationOptions)
})
