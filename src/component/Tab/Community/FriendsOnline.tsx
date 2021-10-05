import React, {useContext} from 'react'
import { Typography, Avatar, Grid, Badge, Box, Button, IconButton } from '@material-ui/core'
import {Stack, Paper} from '@mui/material'
import { Add, ArrowForwardIos } from '@mui/icons-material'
import { useAppSelector } from '../../../util/appState/hooks'
import { selectFriend } from '../../../util/appState/friendSlice'
import {Link, useRouteMatch} from 'react-router-dom'


function FriendsOnline() {
    const friend = useAppSelector(selectFriend)
    const {url} = useRouteMatch()

    return (
        <>
            <Box py={1} >
                <Grid alignItems="center" container>
                    <Grid item>
                        <Typography variant="h6" >
                            Friends Online
                        </Typography>
                    </Grid>
                    <Grid item xs={4} ></Grid>
                    <Grid item>
                        <Link to={`${url}/friend-list`} >
                        <IconButton> <ArrowForwardIos /> </IconButton>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            <Stack direction="row" spacing={1} >
                {friend.friend_list.filter(friend => friend.online === true).map(({ name }) => {
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
                        <Box textAlign="center" >
                            <Button>
                                <Link to={`${url}/add-friend`}>
                                    <Avatar variant="rounded"> <Add /> </Avatar>
                                </Link>
                            </Button>
                            <Typography variant="body1">
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