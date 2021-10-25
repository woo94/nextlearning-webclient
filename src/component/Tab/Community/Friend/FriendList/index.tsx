import React, {useContext} from 'react'
import TopController, {Props} from '../../../../Common/TopController'
import {useAppSelector} from '../../../../../util/appState/hooks'
import {selectFriend} from '../../../../../util/appState/friendSlice'
import {Button, Badge, Box} from '@material-ui/core'
import {Mail} from '@material-ui/icons'
import Typography from '@mui/material/Typography'
import FriendEntity from './FriendEntity'
import Divider from '@mui/material/Divider'

function FriendsList() {
    const friend = useAppSelector(selectFriend)

    const topControllerProps: Props = {
        text: 'Friends',
        backRoute: "/community",
        plusRoute: "/community/add-friend"
    }

    const showRequests = () => {
        // viewTracer.push('requests')
        // viewContext.modifyViewTracer(viewTracer)
    }
    
    return (
        <>
            <TopController {...topControllerProps} />
            <Box px={10} >
                <Badge color="secondary" showZero badgeContent={friend.friend_request.received.length} >
                    <Button color="primary" onClick={showRequests} endIcon={<Mail />} >requests</Button>
                </Badge>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    Online
                </Typography>
                {friend.friend_list.filter(friend => friend.online).map(friend => <FriendEntity {...friend} />)}
            </Box>
            <Divider variant="inset" />
            <Box>
                <Typography variant="subtitle1">
                    Offline
                </Typography>
                {friend.friend_list.filter(friend => !friend.online).map(friend => <FriendEntity {...friend} />)}
            </Box>
        </>
    )
}

export default FriendsList