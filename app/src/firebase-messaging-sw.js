// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

var open = indexedDB.open("neutrinos_firebase_db", 1);

let config = {};
open.onupgradeneeded = function () {
    var db = open.result;
    var store = db.createObjectStore("neutrinos_firebase_db_store");
};

open.onsuccess = function () {
    var db = open.result;
    var tx = db.transaction("neutrinos_firebase_db_store", "readwrite");
    var store = tx.objectStore("neutrinos_firebase_db_store");
    config['messagingSenderId'] = store.get("firebaseSenderId");

    let request = store.get("firebaseSenderId");

    request.onsuccess = function () {
        firebase.initializeApp({
            "messagingSenderId": request.result
        });

        const messaging = firebase.messaging();

        messaging.setBackgroundMessageHandler(function (payload) {
            if (payload && payload['notification']) {
                let notificationObj = payload['notification'];
                let options = {
                    body: notificationObj.body,
                    icon: notificationObj.icon
                }
                return self.registration.showNotification(notificationObj.title, options);
            }
            return self.registration.showNotification('Empty', {});
        });
        tx.oncomplete = function () {
            db.close();
        };
    }

}
