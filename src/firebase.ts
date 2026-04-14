import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAS8ZlgtiXYex3Y6feMKVEocg4COQR9qfs',
  authDomain: 'prop-f2434.firebaseapp.com',
  projectId: 'prop-f2434',
  storageBucket: 'prop-f2434.firebasestorage.app',
  messagingSenderId: '735319139104',
  appId: '1:735319139104:web:da94635c0c7e10bc536d45',
  measurementId: 'G-ENG57QKKJ8',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
