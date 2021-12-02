
import {Box, Typography} from '@mui/material'
import {CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar'


const extractMin = (time: number) => time / 60 < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60)
const extractSec = (time: number) => time % 60 < 10 ? `0${time % 60}` : time % 60

interface Props {
    elapsedTime: number;
    endTime: number;
    isTaskDone: boolean;
}

export default function CircularProgressBar(props: Props) {
    const {elapsedTime, endTime, isTaskDone} = props

    return (
        <Box sx={{ width: '80%', mx: 'auto', py: 8 }}>
            <CircularProgressbarWithChildren background backgroundPadding={6} strokeWidth={3} styles={buildStyles({ pathColor: '#b0cf99', strokeLinecap: 'round', backgroundColor: '#ffffff' })} value={elapsedTime / (endTime * 60) * 100}>
                <Typography variant="h6">
                    Elapsed Time
                </Typography>
                <Typography variant="h2">
                    {
                        isTaskDone ?
                        `${extractMin(endTime * 60)}:00` :
                        `${extractMin(elapsedTime)}:${extractSec(elapsedTime)}`
                    }
                </Typography>
            </CircularProgressbarWithChildren>
        </Box>
    )
}