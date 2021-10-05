import React, {useState, useEffect, useRef} from 'react'
import {useRouteMatch, useHistory, useLocation} from 'react-router-dom'
import {getDatabase, ref as dbRef, set, get, push, query, limitToLast, onChildAdded, off, startAfter} from 'firebase/database'
import {getStorage, ref as storageRef, uploadBytes} from 'firebase/storage'
import TopController from 'src/component/Common/TopController'
import {selectStudyGroup, pushChat, chatFetched} from 'src/util/appState/studyGroupSlice'
import {selectUser} from 'src/util/appState/userSlice'
import {useAppSelector, useAppDispatch} from 'src/util/appState/hooks'
import {TextField, IconButton, Grid, Button, Paper} from '@mui/material'
import {AttachFile, Image} from '@mui/icons-material'
import {cyan} from '@mui/material/colors'
import { v4 as uuidv4 } from 'uuid'
import {upload, selectFileUpload} from 'src/util/appState/fileUploadSlice'

const db = getDatabase()

function GroupChatRoom() {
    const user = useAppSelector(selectUser)
    const fileUpload = useAppSelector(selectFileUpload)
    const dispatch = useAppDispatch()
    const studyGroup = useAppSelector(selectStudyGroup)
    const [message, setMessage] = useState('')
    const [uploadingFiles, setUploadingFiles] = useState<Map<string, string>>(new Map())
    
    const chatViewRef = useRef<null | HTMLDivElement>(null)
    const inputRef = useRef<null | HTMLInputElement>(null)
    
    const location = useLocation()
    const gid = location.pathname.split('/').pop() || ""

    const group = studyGroup.groups.find(val => val.gid === gid)
    const chatMessages = studyGroup.chats[gid]

    const chatRef = dbRef(db, gid)

    const sendMessage = () => {
        const newMessageRef = push(chatRef)
        set(newMessageRef, {
            type: "text",
            tp: Date.now(),
            sender: user.uid,
            message
        })
        setMessage('')
    }

    const openFinder = () => {
        if (!inputRef.current) { return }

        inputRef.current.click()
    }

    const handleOnInput = async () => {
        if(!inputRef.current) { return }

        if(!inputRef.current.files) { return }

        if(inputRef.current.files.length === 0) { return }

        if(inputRef.current.files.item(0) === null) { return }

        const storage = getStorage()
        const fileName = uuidv4()

        const cloudStorageRef = storageRef(storage, `study_group/${gid}/${fileName}`)
        dispatch(upload({
            fileName,
            fileBlob: inputRef.current.files.item(0) as Blob,
            filePath: cloudStorageRef
        }))

    }

    useEffect(() => {

    }, [uploadingFiles])

    useEffect(() => {
        if(chatViewRef.current) {
            chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight
        }
    }, [chatMessages.length])

    useEffect(() => {
        if(!group?.chatFetched) {
            const recentChatQuery = query(chatRef, limitToLast(10))
            get(recentChatQuery).then(messages => {
                messages.forEach(message => {
                    dispatch(pushChat({
                        gid,
                        data: {
                            randomKey: message.key,
                            ...message.val()
                        }
                    }))
                })

                dispatch(chatFetched(gid))

                return Object.keys(messages.val() || {})
            })
            .then((randomKeys) => {
                if(randomKeys.length === 0) {
                    onChildAdded(query(chatRef), child => {
                        dispatch(pushChat({
                            gid,
                            data: {
                                randomKey: child.key,
                                ...child.val()
                            }
                        }))
                    })
                }
                else {
                    onChildAdded(query(chatRef, startAfter(null, randomKeys[randomKeys.length-1])), child => {
                        dispatch(pushChat({
                            gid,
                            data: {
                                randomKey: child.key,
                                ...child.val()
                            }
                        }))
                    })
                }
            })
        }

        return () => {
            off(chatRef, "child_added")
        }
    }, [])

    return (
        <>
            <TopController text={group?.title || ""} actions={[]} />
            <Grid ref={chatViewRef} overflow="scroll" wrap="nowrap" sx={{height: '80vh'}} direction="column" container>
                <Grid flexGrow={1} flexShrink={1} item>
                    <Grid direction="column" container>
                    {
                        chatMessages.map(chat => (
                            <Grid item>
                                <Grid flexDirection={chat.sender === user.uid ? "row-reverse" : "row"} container>
                                    <Grid item>
                                        <Paper sx={{p: 1, m: 1, bgcolor: cyan[50] }} >
                                            {chat.message}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))
                    }
                    </Grid>
                </Grid>
                <Grid item>
                    <TextField
                    value={message} 
                    onChange={(e) => {setMessage(e.target.value)}} 
                    onKeyPress={(e) => { 
                        if(e.key === 'Enter') {
                            console.log('enter and send')
                            sendMessage()
                        }
                    }}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <>
                                <IconButton
                                    onClick={openFinder}
                                >
                                    <Image />
                                </IconButton>
                                <IconButton
                                    onClick={openFinder}
                                >
                                    <AttachFile />
                                </IconButton>
                                <Button onClick={sendMessage}>
                                    send
                                </Button>
                            </>
                        )
                    }}
                    />
                </Grid>
            </Grid>
            <input accept="image/*" multiple={false} onInput={handleOnInput}
                style={{ display: 'none' }} ref={inputRef} type="file" />
        </>
    )
}

export default GroupChatRoom