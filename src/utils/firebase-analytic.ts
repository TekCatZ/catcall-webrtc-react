import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAmyOq8Y0G8uaeUnhqQXQEE3Gm9xVtz8dI',
  authDomain: 'katcall-webrtc-reactjs.firebaseapp.com',
  projectId: 'katcall-webrtc-reactjs',
  storageBucket: 'katcall-webrtc-reactjs.appspot.com',
  messagingSenderId: '74741496139',
  appId: '1:74741496139:web:481dc287e50528515ad0ce',
  measurementId: 'G-3K5VJ8J5Y9',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export default analytics
