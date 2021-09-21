/// <reference path="../util/ChatSchema.d.ts" />
import React, {useState, useRef, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import * as firebase from 'firebase/app'
import 'firebase/database'
import {getPrivateChatInstanceById} from '../util/shardChatDB'
import {selectUser} from '../util/appState/userSlice'
import {useAppSelector} from '../util/appState/hooks'

function ChatClient(props: {uid: string}) {
    const [text, setText] = useState('')
    const user = useAppSelector(selectUser)

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }

    const app = useRef<firebase.default.app.App>()

    const sendChat = () => {
        const message: ChatSchema.PrivateMessage = {
            sender: user.uid,
            receiver: props.uid,
            text: text,
            tp: Date.now(),
            read: true
        }

        const db = firebase.default.database(app.current)
        const chatRef = `/${user.uid}/${props.uid}`
        db.ref(chatRef).push().set(message).catch(err => {
            console.log(err)
        })
    }

    return (
        <Grid alignItems="center" container spacing={4}>
                <Grid style={{margin: '1rem 0'}} item>
                    <TextField onChange={handleText} placeholder="send message" />
                </Grid>
                <Grid>
                    <Button onClick={sendChat} variant="contained" startIcon={<SendIcon />}>send</Button>
                </Grid>
        </Grid>
    )
}

export default ChatClient