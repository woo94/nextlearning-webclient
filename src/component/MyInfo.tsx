import React, {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from '../util/appState/hooks'
import Button from '@material-ui/core/Button'
import {logout, selectUser, friendOnline, setIsOnline} from '../util/appState/userSlice'
import SocketClient from './SocketClient'
import {useSocket} from '../util/customHook'
import ChatClient from './ChatClient'

function MyInfo() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const {isSocketAvailable, socketRef} = useSocket()

    useEffect(() => {
        if(!isSocketAvailable) {
            return
        }
        const socket = socketRef.current

        dispatch(setIsOnline())
        
        socket.on("connect", () => {
            console.log("socket connected / MyInfo")
        })
        
        socket.on("connect_error", (err) => {
            console.log(err)
        })

        socket.emit("__req__set-friend-list", user.friendList.map(friend => friend.uid))

        socket.on("__req__get-friend-list", (friendList: Array<{uid: string, online: string}>) => {
            friendList.forEach(friend => {
                dispatch(friendOnline(friend.uid))
            })
        })

        socket.on("user.online", (uid) => {
            console.log("user.online event", uid)
        })

        socket.on("user.offline", (uid) => {
            console.log("user.offline event", uid)
        })

        socket.emit("ping")

        socket.on("pong", () => {
            console.log("pong")
        })
    }, [isSocketAvailable])
    
    return (
        <>
            <SocketClient uid={user.uid} />
            <ChatClient uid={user.uid} />
            <Button onClick={() => {dispatch(logout())}} variant="contained" color='secondary' >logout</Button>
        </>
    )
}

export default MyInfo