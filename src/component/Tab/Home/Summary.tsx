import React, {useState} from 'react'
import {Grid, Avatar, Typography, Chip} from '@mui/material'
import {AccountCircle, Lightbulb} from '@mui/icons-material'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'

export default function Summary() {
    const user = useAppSelector(selectUser)

    return (
        <Grid sx={{py: 2}} justifyContent="space-between" alignItems="center" maxWidth="sm" container>
            <Grid item>
                <Grid alignItems="center" container>
                    <Grid sx={{ mr: 1 }} item>
                        <Avatar>
                            <AccountCircle fontSize="large" />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5">
                            Hello {user.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid alignItems="center" container>
                    <Grid sx={{ mr: 1 }} item>
                        <Avatar>
                            <Lightbulb />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Chip label={"Points: 300"} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}