import * as firebase from 'firebase/app'
import {firebaseConfig} from './firebase_config'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

firebase.default.initializeApp(firebaseConfig)

export default firebase