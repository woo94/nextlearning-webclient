import {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Container, Grid, Box, Typography, CircularProgress, LinearProgress, Button} from '@mui/material'
import TopController from 'src/component/Common/TopController'
import {MonthlyTask} from 'src/util/types'
import {updateDoc, getFirestore, doc} from 'firebase/firestore'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {selectTask} from 'src/util/appState/taskSlice'
import _ from 'lodash'
import { taskIdToAccessor } from 'src/util/snippets'

const firestore = getFirestore()

export default function TimerMode() {
    const user = useAppSelector(selectUser)
    const task = useAppSelector(selectTask)
    const history = useHistory()
    const {id} = history.location.state as {id: string}
    const {docId, fieldName, date} = taskIdToAccessor(id)
    const dailyAssignment = (task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask).daily_management[date]
    const [isTimerStartAvailable, setIsTimerStartAvailable] = useState(
        dailyAssignment.step === "define" || dailyAssignment.step === "ongoing" ? true : false
    )
    const [isPlusAvailable, setIsPlusAvailable] = useState(
        dailyAssignment.step === "define" || dailyAssignment.step === "ongoing" ? true : false
    )
    const [elapsedTime, setElapsedTime] = useState(dailyAssignment.fulfilled * 60)
    const [intervalTimeout, setIntervalTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if(dailyAssignment.step === "finish") {
            setIsPlusAvailable(false)
        }
    }, [dailyAssignment.step])

    useEffect(() => {
        if(isTimerStartAvailable || dailyAssignment.step === "finish") {
            return
        }

        const timeout = setInterval(() => {
            setElapsedTime(prev => prev + 1)
        }, 1000)

        setIntervalTimeout(timeout)

        return () => {
            clearInterval(timeout)
        }

    },[isTimerStartAvailable])

    useEffect(() => {
        if(elapsedTime === dailyAssignment.min * 60) {
            clearInterval(intervalTimeout as NodeJS.Timeout)
            updateFulfilled(true)
        }

    }, [elapsedTime])

    const updateFulfilled = (finish: boolean) => {
        const monthlyTaskRef = doc(firestore, 'user', user.uid, 'monthly_task', docId)
        const updateDocument: Partial<MonthlyTask.__DOC__MONTHLY_TASK> = { }
        const _task = _.cloneDeep(task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask)
        console.log(_task)
        _task.daily_management[date].fulfilled = Math.floor(elapsedTime / 60)
        
        if(finish) {
            _task.daily_management[date].step = "finish"
        }
        else {
            _task.daily_management[date].step = "ongoing"
        }
        
        updateDocument[fieldName] = _task
        updateDoc(monthlyTaskRef, updateDocument)
    }

    const updateMin = () => {
        const monthlyTaskRef = doc(firestore, 'user', user.uid, 'monthly_task', docId)
        const updateDocument: Partial<MonthlyTask.__DOC__MONTHLY_TASK> = { }
        const _task = _.cloneDeep(task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask)
        _task.daily_management[date].min = dailyAssignment.min + 30
        updateDocument[fieldName] = _task
        updateDoc(monthlyTaskRef, updateDocument)
    }

    const handleStart = () => {
        setIsTimerStartAvailable(false)
    }

    const handlePause = () => {
        setIsTimerStartAvailable(true)
        updateFulfilled(false)
    }

    const handleEnd = () => {

    }

    const extractMin = (time: number) => {
        return Math.floor((time / 60)).toString()
    }

    const extractSec = (time: number) => {
        const residue = Math.floor((time % 60)).toString()
        
        return residue.length === 1 ? '0' + residue : residue
    }

    const disablePause = () => {
        if(elapsedTime >= dailyAssignment.min * 60) {
            return true
        }

        return false
    }

    return (
        <Container maxWidth="sm">
            <TopController text="Timer Mode" plusRoute="" backRoute="/home/today" />
            <Typography sx={{textAlign: 'center'}} mt={8} mb={3} variant="h3">
                {dailyAssignment.name}
            </Typography>
            <LinearProgress variant="determinate" value={((elapsedTime/60) / dailyAssignment.min)*100} sx={{height: '20px'}} />
            <Typography mt={4} variant="subtitle1">
                Elapsed Time
            </Typography>
            <Typography my={3} variant="h4">
                {`${extractMin(elapsedTime)}:${extractSec(elapsedTime)}`}
            </Typography>
            <Typography my={3} variant="h6">
                Total
            </Typography>
            <Grid my={3} alignItems="center" container>
                <Grid item>
                    <Typography pr={5} variant="h6">
                        {dailyAssignment.min} min
                    </Typography>
                </Grid>
                <Grid item>
                    <Button disabled={!isPlusAvailable} onClick={updateMin} variant="contained">+30 min</Button>
                </Grid>
            </Grid>
            <Box>
                {
                    isTimerStartAvailable ?
                        <Button sx={{ height: '50px', width: '200px' }} onClick={handleStart} size="large" variant="contained">Start</Button> :
                        <>
                            <Button sx={{height: '50px', width: '200px', mr: 2}} disabled={disablePause()} variant="contained" onClick={handlePause}>Pause</Button>
                            <Button sx={{height: '50px', width: '200px'}} disabled={!disablePause()} variant="contained" onClick={handleEnd}>End</Button>
                        </>
                }
            </Box>

        </Container>
    )
}