import React, {useEffect, useState} from 'react'
import Login from './component/Login'
import Main from './component/Main'
import {selectUser} from './util/appState/userSlice'
import {useAppSelector, useAppDispatch} from './util/appState/hooks'
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import {SocketContext} from './socket/context'
import { io } from 'socket.io-client'
import {SOCKET_SERVER_URL} from './socket/config'
import {Friend} from './util/appState/userSlice'
import {friendOnline, friendOffline} from './util/appState/friendSlice'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getFirestore, getDoc, doc} from 'firebase/firestore'
import {setMyinfo} from 'src/util/appState/userSlice'
import {__DOC__USER} from 'src/util/types/firestore_user'

const auth = getAuth()
const firestore = getFirestore()

function App() {
    const history = useHistory()
    const dispatch = useAppDispatch()
    

    useEffect(() => {
        const unsubscribeAuthChange = onAuthStateChanged(auth, async (user) => {
            if(user) {
                console.log(user.uid, user.email)
                const idToken = await user.getIdToken()
                const uid = user.uid
                const userDocRef = doc(firestore, 'user', uid)
                const userDoc = await getDoc(userDocRef)
                const userDocData = userDoc.data()
                if (userDocData) {
                    const data = userDocData as __DOC__USER
                    dispatch(setMyinfo({
                        img: data['img'],
                        idToken,
                        name: data['name'],
                        grade: data['grade'],
                        uid
                    }))
                }
                history.push('/home')
            }
        })

        return () => {
            unsubscribeAuthChange()
        }
    }, [])
    // const user = useAppSelector(selectUser)
    // const [socket, setSocket] = useState(io({autoConnect: false}))
    // const [isSocketAvailable, setIsSocketAvailable] = useState(false)
    // const dispatch = useAppDispatch()

    // const dispatchFriendList = (friendList: Array<Friend>) => {
    //     friendList.forEach(friend => {
    //         if(friend.online) {
    //             dispatch(friendOnline(friend.uid))
    //         }
    //     })
    // }

    // useEffect(() => {
    //     if(user.idToken !== "") {
    //         const _socket = io(SOCKET_SERVER_URL, {
    //             extraHeaders: {
    //                 Authorization: `bearer ${user.idToken}`
    //             },
    //             auth: {
    //                 uid: user.uid
    //             },
    //             autoConnect: true
    //         })

    //         _socket.on("connect", () => {
    //             console.log(_socket.id, 'connected')
    //             setIsSocketAvailable(true)
    //         })

    //         _socket.on("broadcast:user.online", (uid) => {
    //             console.log("broadcast:user.online event", uid)
    //             if(uid === user.uid) {
    //                 return
    //             }
    //             dispatch(friendOnline(uid))
    //         })
    
    //         _socket.on("broadcast:user.offline", (uid) => {
    //             console.log("broadcast:user.offline event", uid)
    //             if(uid === user.uid) {
    //                 return
    //             }
    //             dispatch(friendOffline(uid))
    //         })
    
    //         _socket.on("sres.init-friend_list", dispatchFriendList)
    
    //         _socket.onAny((eventName, args) => {
    //             console.log(eventName, args)
    //         })
    //         _socket.on("sres.get-friend_list", dispatchFriendList)
    
    //         _socket.on("sres.add-friend", dispatchFriendList)


    //         setSocket(_socket)
    //     }

    //     if(isSocketAvailable) {
    //         return () => {
    //             console.log(`close socket ${socket.id}`)
    //             socket.close()
    //         }
    //     }

    // }, [user.idToken])

    // useEffect(() => {
    //     if(user.uid === "") {
    //         return
    //     }
    //     const sb = new Sendbird.default({appId: 'C29BA10D-E983-418C-B8FC-3F186AB48686' })
    //     console.log(user.uid)
    //     sb.connect(user.uid, (user, error) => {
    //         if(error) {
    //             console.log(error)
    //             return
    //         }
    //         console.log(user)
    //         console.log(sb.getConnectionState())
    //     })

    //     return () => {
    //         sb.disconnect((response, error) => {
    //             console.log(response)
    //         })
    //     }

    // }, [user.uid])

    // return (
    //     user.isLogin ?
    //     <SocketContext.Provider value={{socket, isSocketAvailable}}>
    //         <Main />
    //     </SocketContext.Provider>
    //     :
    //     <Login />
    // )
    return (
        <Switch>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/home">
                <div>home</div>
            </Route>
        </Switch>
    )
}

export default App