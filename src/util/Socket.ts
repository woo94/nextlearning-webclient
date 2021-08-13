import {io} from 'socket.io-client'
import {SOCKET_SERVER_URL} from '../config'

export function createClientSocket(idToken: string) {
    const socket = io(SOCKET_SERVER_URL, {
        extraHeaders: {
            Authorization: `bearer ${idToken}`
        }
    })

    socket.on("connect_error", (err) => [
        console.log(err)
    ])

    socket.on("user-connected", (...arg) => {
        console.log('user.online event', arg)
    })

    socket.on("online-friend-list", (friendList) => {
        console.log('online-friend-list', friendList)
    })

    return socket
}