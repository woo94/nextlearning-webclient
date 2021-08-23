import React, { useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import * as firebase from 'firebase/app'
import 'firebase/database'

dayjs.extend(utc)
dayjs.extend(timezone)

function ChatList(props:{uid: string}) {
    const [chatPeek, setChatPeek] = useState({text: '', tp: 0})

    return (
        <Card>
            <CardHeader 
                avatar={
                    <Avatar>
                        {props.uid[0]}
                    </Avatar>
                }
                title={chatPeek.text}
                // subheader={}
            />
        </Card>
    )
}

export default ChatList