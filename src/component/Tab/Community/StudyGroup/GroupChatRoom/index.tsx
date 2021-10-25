import React, {useState, useEffect, useRef} from 'react'
import {useRouteMatch, useHistory, useLocation} from 'react-router-dom'
import {getDatabase, ref as dbRef, set, get, push, query, limitToLast, onChildAdded, off, startAfter} from 'firebase/database'
import {getStorage, ref as storageRef, uploadBytes} from 'firebase/storage'
import TopController from 'src/component/Common/TopController'
import {selectStudyGroup} from 'src/util/appState/studyGroupSlice'
import {selectUser} from 'src/util/appState/userSlice'
import {useAppSelector, useAppDispatch} from 'src/util/appState/hooks'
import {TextField, IconButton, Grid, Button, Paper} from '@mui/material'
import {AttachFile, Image} from '@mui/icons-material'
import {cyan} from '@mui/material/colors'
import { v4 as uuidv4 } from 'uuid'
import {uploadStudyGroupFileMessage, selectFileUpload} from 'src/util/appState/fileUploadSlice'
import {getApp} from 'firebase/app'
import ImageDialog from './ImageDialog'
import {StudyGroup} from 'src/util/types'
import produce from 'immer'

const app = getApp()
const db = getDatabase()
const storage = getStorage(app, 'gs://nextlearning-505ce-study-group')

function GroupChatRoom() {
    const user = useAppSelector(selectUser)
    const fileUpload = useAppSelector(selectFileUpload)
    const dispatch = useAppDispatch()
    const studyGroup = useAppSelector(selectStudyGroup)
    const [message, setMessage] = useState('')

    interface CHAT extends StudyGroup.CHAT_MESSAGE {
        randomKey: string;
    }

    const [chats, setChats] = useState<Array<CHAT>>([])
    
    const chatViewRef = useRef<null | HTMLDivElement>(null)
    const inputRef = useRef<null | HTMLInputElement>(null)
    
    const location = useLocation()
    const gid = location.pathname.split('/').pop() || ""

    const group = studyGroup.groups.find(val => val.gid === gid)

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

        const fileName = Math.floor(Date.now() / 1000).toString() + '_' + uuidv4()

        const cloudStorageRef = storageRef(storage, `${gid}/files/${fileName}`)
        dispatch(uploadStudyGroupFileMessage({
            sender: user.uid,
            fileName,
            fileBlob: inputRef.current.files.item(0) as Blob,
            filePath: cloudStorageRef
        }))

    }
    
    useEffect(() => {
        if(chatViewRef.current) {
            chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight
            // chatViewRef.current.onscroll = (e) => {
            //     if(chatViewRef.current?.scrollTop === 0) {
            //         console.log('show me more message')
            //     }
            // }
        }
    }, [chats.length])

    useEffect(() => {
        
        const recentChatQuery = query(chatRef, limitToLast(10))
        get(recentChatQuery).then(messages => {            
            messages.forEach(message => {
                setChats(
                    produce((draft) => {
                        draft.push({...message.val(), randomKey: message.key})
                    })
                )
            })

            return Object.keys(messages.val() || {}) 
        })
            .then((randomKeys) => {
                console.log(randomKeys)
                if (randomKeys.length === 0) {
                    onChildAdded(query(chatRef), child => {
                        setChats(
                            produce(draft => {
                                draft.push({...child.val(), randomKey: child.key})
                            })
                        )
                    })
                }
                else {
                    onChildAdded(query(chatRef, startAfter(null, randomKeys[randomKeys.length - 1])), child => {
                        setChats(
                            produce(draft => {
                                draft.push({...child.val(), randomKey: child.key})
                            })
                        )
                    })
                }
            })

        return () => {
            console.log('off listener')
            off(chatRef, "child_added")
        }
    }, [])

    return (
        <>
            <TopController text={group?.title || ""} backRoute="/community" plusRoute="" />
            <Grid ref={chatViewRef} wrap="nowrap" sx={{ overflowY: "scroll", height: '80vh'}} direction="column" container>
                <Grid flexGrow={1} flexShrink={1} item>
                    <Grid direction="column" container>
                    {
                        chats.map(chat => {
                            if(chat.type === "text") {
                                return (
                                    <Grid key={chat.randomKey} item>
                                        <Grid flexDirection={chat.sender === user.uid ? "row-reverse" : "row"} container>
                                            <Grid item>
                                                <Paper sx={{ p: 1, m: 1, bgcolor: cyan[50] }} >
                                                    {chat.message}
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            }
                            else if(chat.type.startsWith("image")) {
                                return (
                                    <ImageDialog myUid={user.uid} sender={chat.sender} downloadURL={chat.message} />
                                )
                            }
                        })
                    }
                    </Grid>
                </Grid>
                <Grid item>
                    <TextField
                    value={message} 
                    onChange={(e) => {setMessage(e.target.value)}} 
                    onKeyPress={(e) => { 
                        if(e.key === 'Enter') {
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