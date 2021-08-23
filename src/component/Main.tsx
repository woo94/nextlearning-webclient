import React, {useState} from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, getUserDoc, getIdToken} from '../util/appState/userSlice'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ClientContainer from './ClientContainer'
import MyInfo from './MyInfo'
import { Box } from '@material-ui/core'
import ChatClientContainer from './ChatListContainer'

const useStyles = makeStyles({
    headings: {
        margin: "2rem 0"
    }
})

function Main() {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const classes = useStyles()

    useEffect(() => {
        const uid = user.uid
        const run = async () => {
            await dispatch(getUserDoc(uid))
            await dispatch(getIdToken())
        }
        run()
    }, [])

    return (
        <Container>
            <Typography className={classes.headings} variant="h4">MyInfo</Typography>
            <MyInfo />
            <Typography className={classes.headings} variant="h4">Socket Clients(Persistent)</Typography>
            <Grid container>
                <Grid item xs={6}>
                    <ClientContainer />
                </Grid>
                <Grid item xs={6}>
                    <ChatClientContainer />
                </Grid>
            </Grid>
            
            <Typography className={classes.headings} variant="h4">Socket Clients(Temporary)</Typography>
        </Container>
    )
}

export default Main