import React, {useState} from 'react'
import { useEffect } from 'react'
import {useAppDispatch, useAppSelector} from '../util/appState/hooks'
import {selectUser, getUserDoc, getIdToken} from '../util/appState/userSlice'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import SocketClientContainer from '../component/SocketClientContainer'
import MyInfo from './MyInfo'

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
            <Typography className={classes.headings} variant="h4">Socket Clients</Typography>
            <SocketClientContainer />
        </Container>
    )
}

export default Main