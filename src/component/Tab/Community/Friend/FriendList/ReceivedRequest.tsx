import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/auth'

import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'


interface Props {
    name: string;
    uid: string;
    tp: string;
}

const functions = firebase.default.functions()

function ReceivedRequest(props: Props) {
    const handleAccept = () => {
        const acceptFriendRequest = functions.httpsCallable('accept_friend_request')
        console.log('handleAccept')
        acceptFriendRequest({
            friendUid: props.uid
        }).then(res => {
            console.log(res)
        })
        
    }
    const handleDecline = () => {
        const declineFriendRequest = functions.httpsCallable('decline_friend_request')
        declineFriendRequest({
            friendUid: props.uid
        }).then(res => {
            console.log(res)
        })
    }

    return (
        <ListItem
            secondaryAction={
                <ButtonGroup>
                    <Button onClick={handleAccept} >accept</Button>
                    <Button onClick={handleDecline} >decline</Button>
                </ButtonGroup>
            }
        >
            <ListItemAvatar>
                <AccountCircleIcon />
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={props.tp} />
        </ListItem>
    )
}

export default ReceivedRequest