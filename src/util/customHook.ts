import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import {io} from 'socket.io-client'
import { useAppSelector } from './appState/hooks'
import {selectUser} from './appState/userSlice'
import {SOCKET_SERVER_URL} from '../config'

export function useSocket() {
    const user = useAppSelector(selectUser)
    const socketRef = useRef(io({autoConnect: false}))
    const [isSocketAvailable, setIsSocketAvailable] = useState(false)

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
            autoConnect: true
        })
        
        setIsSocketAvailable(true)

    }, [user.idToken])

    return {
        isSocketAvailable,
        socketRef
    }
}