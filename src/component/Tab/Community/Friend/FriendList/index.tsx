import React, {useContext} from 'react'
import TopController, {Props} from '../../../../Common/TopController'
import {useAppSelector} from '../../../../../util/appState/hooks'
import {selectUser} from '../../../../../util/appState/userSlice'
import {Button, Badge, Box} from '@material-ui/core'
import {Mail} from '@material-ui/icons'
import Typography from '@mui/material/Typography'
import FriendEntity from './FriendEntity'
import Divider from '@mui/material/Divider'

function FriendsList() {
    const user = useAppSelector(selectUser)

    const topControllerProps: Props = {
        text: 'Friends',
        actions: [{description: '', routes: '/community/add-friend'}]
    }

    const showRequests = () => {
        // viewTracer.push('requests')
        // viewContext.modifyViewTracer(viewTracer)
    }
    
    return (
        <>
            <TopController {...topControllerProps} />
            <Box px={10} >
                <Badge color="secondary" showZero badgeContent={user.friend_request.received.length} >
                    <Button color="primary" onClick={showRequests} endIcon={<Mail />} >requests</Button>
                </Badge>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    Online
                </Typography>
                {user.friend_list.filter(friend => friend.online).map(friend => <FriendEntity {...friend} />)}
            </Box>
            <Divider variant="inset" />
            <Box>
                <Typography variant="subtitle1">
                    Offline
                </Typography>
                {user.friend_list.filter(friend => !friend.online).map(friend => <FriendEntity {...friend} />)}
            </Box>
        </>
    )
}

export default FriendsList