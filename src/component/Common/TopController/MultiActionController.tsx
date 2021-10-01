import React, {useContext} from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {Props} from './util'
import {useHistory} from 'react-router-dom'

function MultiActionController(props: Props) {
    const history = useHistory()

    const handleBackBtn = () => {
       history.goBack()
    }

    const handleAction = () => {
        // viewTracer.push(props.actions[0].view)
        // viewContext.modifyViewTracer(viewTracer)
    }

    return (
        <Grid container alignItems="center" >
            <Grid item>
                <IconButton onClick={handleBackBtn} > <ArrowBackIosIcon /> </IconButton>
            </Grid>
            <Grid item>
                <Typography variant="h6">
                    {props.text}
                </Typography>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid>
                <IconButton onClick={handleAction}><MoreHorizIcon /></IconButton>
            </Grid>
        </Grid>
    )
}

export default MultiActionController