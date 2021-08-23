import * as firebase from 'firebase/app'
import {firebaseConfig} from './config'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

const app = firebase.default.initializeApp({
    ...firebaseConfig
},'for-redux')

export default app