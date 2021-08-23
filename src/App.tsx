import React from 'react'
import Login from './component/Login'
import Main from './component/Main'
import {selectUser} from './util/appState/userSlice'
import {useAppSelector} from './util/appState/hooks'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { useState, createContext } from 'react'
import {firebaseConfig} from './firebase/config'
import {getPrivateChatInstanceById} from './util/shardChatDB'
import {FirebaseContext} from './firebase/context'

// class 방식으로 한번 해보기 이전에 functional component rendering 방식 한번 이해해보기
function App() {
    const user = useAppSelector(selectUser)
    // const [firebaseApp, setFirebaseApp] = useState(firebase.default.initializeApp({
    //     ...firebaseConfig,
    //     databaseURL: getPrivateChatInstanceById(user.uid).url
    // }, 'apppp'))
    return (
        user.isLogin ? 
        // <FirebaseContext.Provider value={firebaseApp}>
            <Main /> 
        // </FirebaseContext.Provider>
        :
        <Login />
    )
}

export default App