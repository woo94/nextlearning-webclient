import React from 'react'
import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import FaceIcon from '@material-ui/icons/Face'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, setIsOnline} from '../util/appState/userSlice'

function SocketClient(props: {uid: string}) {
    const user = useAppSelector(selectUser)
    const uidList = user.friendList.concat({uid: user.uid, name: user.name, isOnline: user.isOnline})
    const uidUser = uidList.find(elem => elem.uid === props.uid)    

    return (
        <Grid container alignItems="center" spacing={4}>
            <Grid item>
                <h3>{uidUser?.name}</h3>
            </Grid>
            <Grid item>
                <Badge color={uidUser?.isOnline ? "secondary" : "default"} variant="dot">
                    <FaceIcon />
                </Badge>
            </Grid>
        </Grid>
    )
}

export default SocketClient