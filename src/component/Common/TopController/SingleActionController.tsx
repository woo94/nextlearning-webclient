import React, {useContext} from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import {Props} from './util'
import {useHistory, Link} from 'react-router-dom'

function SingleActionController(props: Props) {
    const history = useHistory()

    const handleBackBtn = () => {
        history.goBack()
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
                props.actions.length === 1
                    ?
                    <Grid item>
                        <Link to={props.actions[0].routes}>
                            <AddIcon />
                        </Link>
                    </Grid>
                    :
                    null
            }

        </Grid>
    )
}

export default SingleActionController