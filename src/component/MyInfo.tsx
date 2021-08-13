import React, {useState} from 'react'
import {useAppSelector, useAppDispatch} from '../util/appState/hooks'
import Button from '@material-ui/core/Button'
import {logout, setSocketConnected, friendOnline, friendOffline, selectUser, setIsOnline} from '../util/appState/userSlice'
import SocketClient from './SocketClient'
import { useEffect } from 'react'
import {createClientSocket} from '../util/Socket'
import { io } from 'socket.io-client'

function MyInfo() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const idToken = user.idToken
    const [socket, setSocket] = useState(io({autoConnect: false}))

    useEffect(() => {
        setSocket()
        // if(user.idToken.length !== 0) {
        //     const socket = createClientSocket(idToken)
        //     socket.on("connect", () => {
        //         console.log(socket.id)
        //         dispatch(setSocketConnected())
        //         dispatch(setIsOnline())

        //         socket.emit("set-friend-list", user.friendList.map(friend => friend.uid))

        //         socket.emit("get-friend-list")
            
        //         socket.on("friend-online-status", (friendList) => {
        //             console.log(friendList)
        //             friendList.forEach((friend: {uid: string, online: string}) => {
        //                 if(friend.online === "true") {
        //                     dispatch(friendOnline(friend.uid))
        //                 }
        //                 else {
        //                     dispatch(friendOffline(friend.uid))
        //                 }
        //             })
        //         })

        //         socket.on("user.online", (uid) => {
        //             console.log('user.online', uid)
        //         })
        //     })

        //     return () => {
        //         socket.close()
        //     }
        // }
    }, 
    // [user.idToken]
    []
    )
    
    return (
        <>
            <SocketClient uid={user.uid} />
            <Button onClick={() => {dispatch(logout())}} variant="contained" color='secondary' >logout</Button>
        </>
    )
}

export default MyInfo