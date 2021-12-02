
import {__DOC__DAILY_TASK} from 'src/util/types/firestore_daily_task'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import {Grid, Typography} from '@mui/material'
import {ArrowBackIos} from '@mui/icons-material'

interface Props {
    task: Partial<__DOC__PLANNER & __DOC__DAILY_TASK>
}

export default function RecordingMode(props: Props) {
    console.info(props)
    const {name} = props.task

    return (
        <>
            <Grid alignItems="center" container>
                <Grid item>
                    <ArrowBackIos />
                </Grid>
                <Grid item>
                    <Typography>
                        {name}
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}