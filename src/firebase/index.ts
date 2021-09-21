import * as firebase from 'firebase/app'
import {firebaseConfig} from './config'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'

firebase.default.initializeApp({
    ...firebaseConfig
})