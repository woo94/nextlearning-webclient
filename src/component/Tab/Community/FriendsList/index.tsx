import React, {useContext} from 'react'
import {ViewContext} from '../ViewContext'
import ViewChanger, {Props} from '../../../Common/ViewChanger'
import {useAppSelector} from '../../../../util/appState/hooks'
import {selectUser} from '../../../../util/appState/userSlice'
import {Button, Badge, Box} from '@material-ui/core'
import {Mail} from '@material-ui/icons'
import Typography from '@mui/material/Typography'
import FriendEntity from './FriendEntity'
import Divider from '@mui/material/Divider'

function FriendsList() {
    const user = useAppSelector(selectUser)
    const viewContext = useContext(ViewContext)
    const viewTracer = [...viewContext.viewTracer]

    const viewChangerProps: Props = {
        text: 'Friends',
        actions: [{description: '', view: 'add-friend'}],
        context: ViewContext
    }

    const showRequests = () => {
        viewTracer.push('requests')
        viewContext.modifyViewTracer(viewTracer)
    }
    
    return (
        <>
            <ViewChanger {...viewChangerProps} />
            <Box px={10} >
                <Badge color="secondary" showZero badgeContent={user.friend_request.received.length} >
                    <Button color="primary" onClick={showRequests} endIcon={<Mail />} >requests</Button>
                </Badge>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    Online
                </Typography>
                {user.friend_list.filter(friend => friend.isOnline).map(friend => <FriendEntity {...friend} />)}
            </Box>
            <Divider variant="inset" />
            <Box>
                <Typography variant="subtitle1">
                    Offline
                </Typography>
                {user.friend_list.filter(friend => !friend.isOnline).map(friend => <FriendEntity {...friend} />)}
            </Box>
        </>
    )
}

export default FriendsList