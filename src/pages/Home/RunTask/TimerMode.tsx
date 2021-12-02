
import {__DOC__DAILY_TASK} from 'src/util/types/firestore_daily_task'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import {Grid, Typography, IconButton, Button, CircularProgress, Box} from '@mui/material'
import {ArrowBackIos, AddCircle, Pause, Check, PlayArrow} from '@mui/icons-material'
import {useHistory} from 'react-router-dom'
import useTimer from 'src/util/hooks/useTimer'
import {useEffect, useState} from 'react'
import CircularProgressBar from 'src/component/Home/CircularProgressBar'
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import GreyWallpaper from 'src/component/Home/GreyWallpaper'
import TaskHeader from 'src/component/Home/TaskHeader'

interface Props {
    task: Partial<__DOC__PLANNER & __DOC__DAILY_TASK>
}


const firestore = getFirestore()
const auth = getAuth()

export default function TimerMode(props: Props) {
    const {name, step, min, fulfilled, year_month, date, planner_id} = props.task
    const history = useHistory()
    const [endTime, setEndTime] = useState(0)
    const [isPaused, setIsPaused] = useState(true)
    const [isTaskDone, setIsTaskDone] = useState(false)
    const elapsedTime = useTimer(fulfilled || 0, endTime, isTaskDone, isPaused)
    const [enableUserAction, setEnableUserAction] = useState(false)
    

    useEffect(() => {
        if(!min || min === 0) {
            return
        }

        if(elapsedTime >= ((min || 0) * 60)) {
            setIsTaskDone(true)
        }

    }, [elapsedTime])

    useEffect(() => {
        if(isTaskDone) {
            handleFulfilledUpdate()
        }

    },[isTaskDone])

    useEffect(() => {
        if(min) {
            setEndTime(min)
            setEnableUserAction(true)
        }
    }, [min])

    const handleBack = async () => {
        handleFulfilledUpdate()
        history.goBack()
    }

    const handleStart = () => {
        if(isTaskDone) {
            return
        }
        setIsPaused(false)
    }

    const handlePause = () => {
        setIsPaused(true)
        handleFulfilledUpdate()
    }

    const getTaskDocRef = () => {
        const uid = auth.currentUser?.uid
        if(!uid) {
            // some error message or require login
            return
        }

        const taskId = `${year_month}-${date}-${planner_id}`
        return doc(firestore, 'user', uid, 'daily_task', taskId)
    }


    const handleFulfilledUpdate = async () => {
        // 이 액션을 취해도 된다는 것은 enableUserAction이 true임을 암묵적으로 동의한다.
        
        const taskDocRef = getTaskDocRef()
        if(!taskDocRef) {
            return 
        }

        const updateData: Partial<__DOC__DAILY_TASK> = { }
        const fulfilledMin = Math.floor(elapsedTime / 60)
        updateData['fulfilled'] = fulfilledMin

        if(fulfilledMin < (min as number)) {
            updateData['step'] = "ongoing"
        }
        else {
            updateData['step'] = "finish"
        }

        await updateDoc(taskDocRef, updateData)
    }

    const handleAddTaskTime = async () => {
        const taskDocRef = getTaskDocRef()
        if(!taskDocRef) {
            return
        }

        if(isTaskDone) {
            return
        }

        const updateData: {[key: string]: any} = {}
        updateData['min'] = increment(10)
        
        await updateDoc(taskDocRef, updateData)
    }

    return (
        <Box sx={{height: '100%'}}>
            <TaskHeader handleBack={handleBack} name={name || ""} />

            <GreyWallpaper>
                <CircularProgressBar isTaskDone={isTaskDone} elapsedTime={elapsedTime} endTime={endTime} />
                <Grid justifyContent="space-evenly" container>
                    <Grid xs={7} sx={{}} item>
                        <Grid sx={{ py: 2, px: 3, bgcolor: 'white', borderRadius: '2rem' }} alignItems="center" justifyContent="space-between" container>
                            <Grid item>
                                <Typography variant="subtitle1">
                                    Total
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">
                                    {`${min}:00`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid onClick={handleAddTaskTime} sx={{cursor: 'pointer'}} xs={3} item>
                        <Grid sx={{ py: 2, px: 1, bgcolor: isTaskDone ? '#efefef' : '#b0cf99', borderRadius: '1rem' }} justifyContent="space-evenly" alignItems="center" container>
                            <Grid item>
                                <AddCircle sx={{ color: 'white' }} />
                            </Grid>
                            <Grid item>
                                <Typography color="white">
                                    10min
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>


                <Grid sx={{ my: 10 }} justifyContent="space-evenly" container>
                    {
                        isPaused ? 
                            <>
                                <Grid onClick={handleStart} textAlign="center" sx={{ bgcolor: '#f5d572', py: 1, borderRadius: '1rem', cursor: 'pointer' }} xs={3} item>
                                    <PlayArrow sx={{ color: 'white' }} />
                                </Grid>
                                <Grid textAlign="center" sx={{ bgcolor: '#efefef', py: 1, borderRadius: '1rem' }} xs={3} item>
                                    <Check sx={{ color: 'white' }} />
                                </Grid>
                            </>
                            :
                            <>
                                <Grid onClick={handlePause} textAlign="center" sx={{ bgcolor: isTaskDone ? '#efefef' : '#f69268', py: 1, borderRadius: '1rem', cursor: 'pointer' }} xs={3} item>
                                    <Pause sx={{ color: 'white' }} />
                                </Grid>
                                <Grid textAlign="center" sx={{ bgcolor: isTaskDone ? '#8bca83' : '#efefef', py: 1, borderRadius: '1rem' }} xs={3} item>
                                    <Check sx={{ color: 'white' }} />
                                </Grid>
                            </>
                    }
                    
                </Grid>
                
            </GreyWallpaper>
        </Box>
    )
}