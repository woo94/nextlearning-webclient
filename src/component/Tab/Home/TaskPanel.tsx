
import {useRouteMatch} from 'react-router-dom'
import {Box, Grid, Typography} from '@mui/material'
import {ThumbUp, ThumbDown, Timer} from '@mui/icons-material'
import {grey} from '@mui/material/colors'

export default function TaskPanel() {
    const {path, url} = useRouteMatch()
    

    return (
        <Box sx={{minHeight: '300px', bgcolor: grey[100], borderRadius: "20px", p: 3}}>
            <div data-task="10" style={{cursor: 'pointer'}} onClick={() => {alert('task')}}>
                <Grid alignItems="center" container>
                    <Grid xs={1} item></Grid>
                    <Grid xs={1} item>
                        <ThumbUp fontSize="large" />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid xs={4} item>
                        <Typography variant='h6'>
                            Task Name1
                        </Typography>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid textAlign="end" xs={1} item>
                        <Timer fontSize="small" />
                    </Grid>
                    <Grid xs={1} item>
                        30min
                    </Grid>
                    <Grid xs={1} item></Grid>
                </Grid>
            </div>
        </Box>
    )
}