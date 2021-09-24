import {createContext} from 'react'
import {io} from 'socket.io-client'

export const SocketContext = createContext({
    socket: io({autoConnect: false}),
    isSocketAvailable: false
})