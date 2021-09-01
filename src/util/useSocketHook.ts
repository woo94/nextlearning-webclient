import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import {io} from 'socket.io-client'
import { useAppSelector, useAppDispatch } from './appState/hooks'
import {selectUser, friendOnline, friendOffline} from './appState/userSlice'
import {SOCKET_SERVER_URL} from '../config'

interface Friend {
    uid: string;
    online: boolean;
}

export function useSocket() {
    const user = useAppSelector(selectUser)
    const socketRef = useRef(io({autoConnect: false}))
    const [isSocketAvailable, setIsSocketAvailable] = useState(false)
    const dispatch = useAppDispatch()

    const dispatchFriendList = (friendList: Array<Friend>) => {
        console.log(friendList)
        friendList.forEach(friend => {
            if(friend.online) {
                dispatch(friendOnline(friend.uid))
            }
        })
    }

    useEffect(() => {
        console.log(user.idToken.length)
        if(user.idToken === "") {
            console.log("empty idToken")
            return
        }

        socketRef.current = io(SOCKET_SERVER_URL, {
            extraHeaders: {
                Authorization: `bearer ${user.idToken}`
            },
            auth: {
                uid: user.uid
            },
            autoConnect: true
        })

        const socket = socketRef.current
        
        setIsSocketAvailable(true)

        // connection and handshake events
        socket.on("connect", () => {
            console.log("socket connected / MyInfo")
        })
        
        socket.on("connect_error", (err) => {
            console.log(err)
        })

        // broadcast events
        socket.on("broadcast:user.online", (uid) => {
            console.log("broadcast:user.online event", uid)
            if(uid === user.uid) {
                return
            }
            dispatch(friendOnline(uid))
        })

        socket.on("broadcast:user.offline", (uid) => {
            console.log("broadcast:user.offline event", uid)
            if(uid === user.uid) {
                return
            }
            dispatch(friendOffline(uid))
        })

        socket.on("sres.init-friend_list", dispatchFriendList)

        socket.on("sres.get-friend_list", dispatchFriendList)

        socket.on("sres.add-friend", dispatchFriendList)

        return () => {
            console.log('clean up socket')
            socketRef.current.close()
        }

    }, [user.idToken])

    return {
        isSocketAvailable,
        setIsSocketAvailable,
        socketRef
    }
}