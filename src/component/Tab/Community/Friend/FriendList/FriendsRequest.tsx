import React from 'react'
import {useAppSelector} from '../../../../../util/appState/hooks'
import { selectFriend } from '../../../../../util/appState/friendSlice' 
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import TopController, {Props} from '../../../../Common/TopController'
import ReceivedRequest from './ReceivedRequest'
import SentRequest from './SentRequest'

dayjs.extend(utc)
dayjs.extend(timezone)

const guessedTimezone = dayjs.tz.guess()

function FriendsRequest() {
    const friend = useAppSelector(selectFriend)
    const viewChangerProps: Props = {
        text: 'Friend requests',
        backRoute: "/community/friend-list",
        plusRoute: ""
    }

    return (
        <>
            <TopController {...viewChangerProps} />
            <Typography variant="subtitle1">
                Received Requests
            </Typography>
            <List>
                {
                    friend.friend_request.received.map(req => {
                        const dayjsObj = dayjs.unix(req.tp).tz(guessedTimezone)

                        return (
                            <ReceivedRequest key={req.uid} name={req.name} uid={req.uid} tp={dayjsObj.format('YYYY-MM-DD HH:mm')} />
                        )
                    })
                }
            </List>
            <Divider variant="middle" />
            <Typography variant="subtitle1">
                Sent requests
            </Typography>
            <List>
                {
                    friend.friend_request.sent.map(req => {
                        const dayjsObj = dayjs.unix(req.tp).tz(guessedTimezone)

                        return (
                            <SentRequest name={req.name} uid={req.uid} tp={dayjsObj.format('YYYY-MM-DD HH:mm')} />
                        )
                    })
                }
            </List>
        </>
    )
}

export default FriendsRequest