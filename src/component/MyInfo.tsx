import React, {useEffect} from 'react'
import {useAppSelector, useAppDispatch} from '../util/appState/hooks'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Grid from '@material-ui/core/Grid'
import {logout, selectUser, setIsOnline, friendOnline} from '../util/appState/userSlice'
import SocketClient from './SocketClient'
import {useSocket} from '../util/useSocketHook'


function MyInfo() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const {isSocketAvailable, setIsSocketAvailable, socketRef} = useSocket()

    const handleConnectBtn = () => {
        socketRef.current.connect()
        dispatch(setIsOnline(true))
        setIsSocketAvailable(true)
        console.log("connect!")
        console.log(isSocketAvailable, "isSocketAvailable")
    }

    const handleDisconnectBtn = () => {
        if(isSocketAvailable) {
            socketRef.current.close()
            dispatch(setIsOnline(false))
            setIsSocketAvailable(false)
            console.log("disconnect!")
            console.log(isSocketAvailable, "isSocketAvailable")
        }
    }

    useEffect(() => {
        if(!isSocketAvailable) {
            return
        }
        const socket = socketRef.current
        dispatch(setIsOnline(true))

        socket.emit("creq.init-friend_list", JSON.stringify({data: user.friend_list.map(friend => friend.uid)}))

        socket.emit("ping")

        socket.on("pong", () => {
            console.log("pong")
        })
    }, [isSocketAvailable])
    
    return (
        <>
            <Grid alignItems="center" spacing={4} container>
                <Grid item>
                    <SocketClient uid={user.uid} />
                </Grid>
                <Grid item>
                    <ButtonGroup>
                        <Button onClick={handleConnectBtn} color="primary">connect</Button>
                        <Button onClick={handleDisconnectBtn} color="secondary">disconnect</Button>
                    </ButtonGroup>
                </Grid>
                <Button onClick={() => { dispatch(logout()) }} variant="contained" color='secondary' >logout</Button>
            </Grid>
        </>
    )
}

export default MyInfo