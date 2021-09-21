import React, {useContext} from 'react'
import { Typography, Avatar, Grid, Badge, Box, Button, IconButton } from '@material-ui/core'
import {Stack, Paper} from '@mui/material'
import { Add, ArrowForwardIos } from '@material-ui/icons'
import { useAppSelector } from '../../../util/appState/hooks'
import { selectUser } from '../../../util/appState/userSlice'
import {ViewContext} from './ViewContext'


function FriendsOnline() {
    const user = useAppSelector(selectUser)
    const { viewTracer, modifyViewTracer } = useContext(ViewContext)

    return (
        <>
            <Box py={1} >
                <Grid alignItems="center" container>
                    <Grid item>
                        <Typography variant="h6" >
                            Friends Online
                            { }
                        </Typography>
                    </Grid>
                    <Grid item xs={4} ></Grid>
                    <Grid item>
                        <IconButton onClick={() => modifyViewTracer([...viewTracer, 'friend-list'])} > <ArrowForwardIos /> </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Stack direction="row" spacing={1} >
                {user.friend_list.filter(friend => friend.isOnline === false).map(({ name }) => {
                    return (
                        <Box textAlign="center" >
                            <Button  >
                                <Badge variant='dot' color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
                                    <Avatar variant="rounded"></Avatar>
                                </Badge>
                            </Button>
                            <Typography variant="body1">
                                {name}
                            </Typography>
                        </Box>
                    )
                })}
                {
                    <Grid item>
                        <Box onClick={() => modifyViewTracer([...viewTracer, 'add-friend'])} textAlign="center" >
                            <Button>
                                <Avatar variant="rounded"> <Add /> </Avatar>
                            </Button>
                            <Typography variant="body2">
                                Add
                            </Typography>
                        </Box>
                    </Grid>
                }
            </Stack>
        </>
    )
}

export default FriendsOnline