import React from 'react'
import {getFunctions, httpsCallable} from 'firebase/functions'

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

const functions = getFunctions()

function SentRequest(props: Props) {
    const handleUndo = async () => {
        const undoFriendRequest = httpsCallable(functions, 'undo_friend_request')
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