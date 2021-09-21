import React from 'react'
import {useAppSelector} from '../../../../util/appState/hooks'
import {selectUser}  from '../../../../util/appState/userSlice'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import ViewChanger, {Props} from '../../../Common/ViewChanger'
import {ViewContext} from '../ViewContext'
import ReceivedRequest from './ReceivedRequest'
import SentRequest from './SentRequest'

dayjs.extend(utc)
dayjs.extend(timezone)

const guessedTimezone = dayjs.tz.guess()

function FriendsRequest() {
    const user = useAppSelector(selectUser)
    const viewChangerProps: Props = {
        text: 'Friend requests',
        actions: [],
        context: ViewContext
    }

    return (
        <>
            <ViewChanger {...viewChangerProps} />
            <Typography variant="subtitle1">
                Received Requests
            </Typography>
            <List>
                {
                    user.friend_request.received.map(req => {
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
                    user.friend_request.sent.map(req => {
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