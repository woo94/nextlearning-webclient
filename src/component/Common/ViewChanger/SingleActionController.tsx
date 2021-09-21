import React, {useContext} from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {Props} from './util'

function SingleActionController(props: Props) {
    const viewContext = useContext(props.context)
    const viewTracer = [...viewContext.viewTracer]

    const handleBackBtn = () => {
        viewTracer.pop()
        viewContext.modifyViewTracer([...viewTracer])
    }

    const handleAction = () => {
        if(props.actions.length === 0) {
            return
        }
        viewTracer.push(props.actions[0].view)
        viewContext.modifyViewTracer(viewTracer)
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
            {
                props.actions.length > 0
                    ?
                    <Grid>
                        <IconButton onClick={handleAction}><AddIcon /></IconButton>
                    </Grid>
                    :
                    null
            }

        </Grid>
    )
}

export default SingleActionController