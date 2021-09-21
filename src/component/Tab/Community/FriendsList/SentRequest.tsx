import React from 'react'
import * as firebase from 'firebase/app'
import 'firebase/functions'

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

function SentRequest(props: Props) {
    const handleUndo = async () => {
        const undoFriendRequest = functions.httpsCallable('undo_friend_request')
        const undoResult = await undoFriendRequest({
            friendUid: props.uid
        })
        console.log(undoResult)
    }

    return (
        <ListItem
            secondaryAction={
                <ButtonGroup>
                    <Button onClick={handleUndo} >undo</Button>
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

export default SentRequest