import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Badge from '@material-ui/core/Badge'
import FaceIcon from '@material-ui/icons/Face'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, setIsOnline} from '../util/appState/userSlice'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import firebase from 'firebase/app'
import 'firebase/firestore'

function SocketClient(props: {uid: string}) {
    const user = useAppSelector(selectUser)
    const [userName, setUserName] = useState('')
    const userList = user.friend_list.concat([{ uid: user.uid, online: user.online, name: user.name, img: user.img, email: user.email }])
    const uidUser = userList.find(user => user.uid === props.uid)
    
    useEffect(() => {
        const firestore = firebase.firestore()
        const infoDocRef = firestore.collection("user").doc(props.uid).collection("public").doc("info")
        const run = async () => {
            const infoDoc = await infoDocRef.get()
            const infoDocData = infoDoc.data()
            if(infoDocData) {
                setUserName(infoDocData['name'])
            }
        }

        run()
    }, [])

    return (
        <>
            <Grid container alignItems="center" spacing={4}>
                <Grid item>
                    <h3>{userName}</h3>
                </Grid>
                <Grid item>
                    <Badge color={uidUser?.online ? "secondary" : "default"} variant="dot">
                        <FaceIcon />
                    </Badge>
                </Grid>
            </Grid>
        </>
    )
}

export default SocketClient