import React, {useEffect, useState} from 'react'
import Login from './component/Login'
import Main from './component/Main'
import {selectUser} from './util/appState/userSlice'
import {useAppSelector, useAppDispatch} from './util/appState/hooks'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {SocketContext} from './socket/context'
import { io } from 'socket.io-client'
import {SOCKET_SERVER_URL} from './socket/config'
import {Friend, friendOnline, friendOffline} from './util/appState/userSlice'
import * as Sendbird from 'sendbird'

function App() {
    const user = useAppSelector(selectUser)
    const [socket, setSocket] = useState(io({autoConnect: false}))
    const [isSocketAvailable, setIsSocketAvailable] = useState(false)
    const dispatch = useAppDispatch()

    const dispatchFriendList = (friendList: Array<Friend>) => {
        console.log(friendList)
        console.log('hi!')
        friendList.forEach(friend => {
            if(friend.online) {
                dispatch(friendOnline(friend.uid))
            }
        })
    }

    useEffect(() => {
        if(user.idToken !== "") {
            const _socket = io(SOCKET_SERVER_URL, {
                extraHeaders: {
                    Authorization: `bearer ${user.idToken}`
                },
                auth: {
                    uid: user.uid
                },
                autoConnect: true
            })

            _socket.on("connect", () => {
                console.log(_socket.id, 'connected')
                setIsSocketAvailable(true)
            })

            _socket.on("broadcast:user.online", (uid) => {
                console.log("broadcast:user.online event", uid)
                if(uid === user.uid) {
                    return
                }
                dispatch(friendOnline(uid))
            })
    
            _socket.on("broadcast:user.offline", (uid) => {
                console.log("broadcast:user.offline event", uid)
                if(uid === user.uid) {
                    return
                }
                dispatch(friendOffline(uid))
            })
    
            _socket.on("sres.init-friend_list", dispatchFriendList)
    
            _socket.onAny((eventName, args) => {
                console.log(eventName, args)
            })
            _socket.on("sres.get-friend_list", dispatchFriendList)
    
            _socket.on("sres.add-friend", dispatchFriendList)


            setSocket(_socket)
        }

        if(isSocketAvailable) {
            return () => {
                console.log(`close socket ${socket.id}`)
                socket.close()
            }
        }

    }, [user.idToken])

    useEffect(() => {
        if(user.uid === "") {
            return
        }
        const sb = new Sendbird.default({appId: 'C29BA10D-E983-418C-B8FC-3F186AB48686' })
        console.log(user.uid)
        sb.connect(user.uid, (user, error) => {
            if(error) {
                console.log(error)
                return
            }
            console.log(user)
            console.log(sb.getConnectionState())
        })

        return () => {
            sb.disconnect((response, error) => {
                console.log(response)
            })
        }

    }, [user.uid])

    return (
        user.isLogin ?
        <SocketContext.Provider value={{socket, isSocketAvailable}}>
            <Main />
        </SocketContext.Provider>
        :
        <Login />
    )
}

export default App