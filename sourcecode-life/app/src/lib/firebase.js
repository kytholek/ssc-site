/**
 * Firebase initialisation — shared singleton for the whole app.
 * Exports `auth` and `db` for use in bridge.js.
 */
import { initializeApp, getApps } from 'firebase/app'
import { getAuth }      from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyBA82OFYJm47yRF59DuQSoo8_piOyP1hZs',
  authDomain:        'game-of-life-7b620.firebaseapp.com',
  databaseURL:       'https://game-of-life-7b620-default-rtdb.firebaseio.com',
  projectId:         'game-of-life-7b620',
  storageBucket:     'game-of-life-7b620.firebasestorage.app',
  messagingSenderId: '115903423480',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
