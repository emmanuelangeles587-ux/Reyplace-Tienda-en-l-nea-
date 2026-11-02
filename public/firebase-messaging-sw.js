import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// This file must be named firebase-messaging-sw.js
// Firebase will automatically look for this file at the root
// You need to import your firebase config.
// Since this is a service worker file, it cannot import files normally.
// You must import the config via importScripts or hardcode it if necessary.
// For simplicity in this environment, I'll assume standard Firebase SDK usage.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCjiNRxMaahVl-5uHVGz6JceswSLb9nk6I",
  authDomain: "gen-lang-client-0775139818.firebaseapp.com",
  projectId: "gen-lang-client-0775139818",
  storageBucket: "gen-lang-client-0775139818.firebasestorage.app",
  messagingSenderId: "1012365046700",
  appId: "1:1012365046700:web:27536551db690205f38009"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
