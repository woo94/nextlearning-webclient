import {Container} from '@mui/material'
import {useHistory} from 'react-router-dom'
import TopController from 'src/component/Common/TopController'
import {Typography, Grid, Button, Box} from '@mui/material'
import WebCam from 'react-webcam'
import {useState, useRef, useEffect, useCallback} from 'react'
import {useAppSelector, useAppDispatch} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {selectTask} from 'src/util/appState/taskSlice'
import _ from 'lodash'
import {taskIdToAccessor} from 'src/util/snippets'
import { MonthlyTask } from 'src/util/types'
import {getFirestore, updateDoc, doc} from 'firebase/firestore'
import {getApp} from 'firebase/app'
import { v4 as uuidv4 } from 'uuid'
import {ref as storageRef, getStorage} from 'firebase/storage'
import {uploadRecordVideo} from 'src/util/appState/fileUploadSlice'

const app = getApp()
const firestore = getFirestore()
const storage = getStorage(app, 'gs://nextlearning-505ce-user')

export default function RecordMode() {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const task = useAppSelector(selectTask)
    const user = useAppSelector(selectUser)
    const {id} = history.location.state as {id: string}
    const {docId, fieldName, date} = taskIdToAccessor(id)
    const dailyAssignment = (task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask).daily_management[date]
    const webcamRef = useRef<null | WebCam>(null)
    const mediaRecorderRef = useRef<null | MediaRecorder>(null)
    const [recordedChunks, setRecordedChunks] = useState<Array<Blob>>([])
    const [elapsedTime, setElapsedTime] = useState(dailyAssignment.fulfilled * 60)
    const [isTimerStartAvailable, setIsTimerStartAvailable] = useState(
        dailyAssignment.step === "define" || dailyAssignment.step === "ongoing" ? true : false
    )
    const [isPlusAvailable, setIsPlusAvailable] = useState(
        dailyAssignment.step === "define" || dailyAssignment.step === "ongoing" ? true : false
    )
    const [intervalTimeout, setIntervalTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        console.log(dailyAssignment.step, 'step')
        if(dailyAssignment.step === "finish") {
            console.log(false)
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

    }, [isTimerStartAvailable])

    const updateFulfilled = (finish: boolean) => {
        const monthlyTaskRef = doc(firestore, 'user', user.uid, 'monthly_task', docId)
        const updateDocument: Partial<MonthlyTask.__DOC__MONTHLY_TASK> = { }
        const _task = _.cloneDeep(task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask)
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

    useEffect(() => {
        if(elapsedTime === dailyAssignment.min * 60) {
            clearInterval(intervalTimeout as NodeJS.Timeout)
            updateFulfilled(true)

            if(mediaRecorderRef.current === null) { return }
            mediaRecorderRef.current.stop()
        }
    }, [elapsedTime])

    const handleStartCapture = useCallback((timerStatus: boolean) => {
        if(webcamRef.current === null) { return }
        setIsTimerStartAvailable(timerStatus);

        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream as MediaStream, {
            mimeType: "video/webm"
        });

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();

    }, [webcamRef, setIsTimerStartAvailable, mediaRecorderRef]);

    const handleDataAvailable = useCallback(
        (e: BlobEvent) => {
            const data = e.data
            if(data.size > 0) {
                setRecordedChunks(prev => prev.concat(data))
            }
        },
        [setRecordedChunks]
    )

    const handlePauseCapture = useCallback(() => {
        if(mediaRecorderRef.current === null) { return }
        mediaRecorderRef.current.stop()
        setIsTimerStartAvailable(true)
    }, [mediaRecorderRef, webcamRef, setIsTimerStartAvailable])

    const handleEnd = () => {
        const fileName = Math.floor(Date.now() / 1000).toString() + '_' + uuidv4()
        const fileBlob = new Blob(recordedChunks, {
            type: "video/webm"
        })
        const cloudStorageRef = storageRef(storage, `${user.uid}/recording/${fileName}`)
        dispatch(uploadRecordVideo({
            uploader: user.uid,
            taskId: id,
            fileBlob,
            filePath: cloudStorageRef
        }))
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
            <TopController text="Record Mode" plusRoute="" backRoute="/home/today" />
            <Typography mt={5} mb={3} textAlign="center" variant="h3">
                {dailyAssignment.name}
            </Typography>
            <WebCam width="100%" ref={webcamRef} />
            <Grid my={3} alignItems="center" justifyContent="space-around" container>
                <Grid item>
                    <Typography variant="subtitle1">
                        Elapsed Time
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h4">
                        {`${extractMin(elapsedTime)}:${extractSec(elapsedTime)}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid my={3} alignItems="center" justifyContent="space-around" container>
                <Grid item>
                    <Typography textAlign="center" variant="h5">
                        Total: {dailyAssignment.min}:00
                    </Typography>
                </Grid>
                <Grid item>
                    <Button disabled={!isPlusAvailable} sx={{height: '50px', width: '150px'}} variant="contained">
                        +30 min
                    </Button>
                </Grid>
            </Grid>
            <Box>
                {
                    isTimerStartAvailable ?
                        <Button sx={{height: '50px', width: '200px'}} variant="contained" onClick={handleStartCapture.bind(null, false)}>
                            Start
                        </Button> :
                        <>
                            <Button disabled={disablePause()} sx={{height: '50px', width: '200px', mr: 2}} variant="contained" onClick={handlePauseCapture}>Pause</Button>
                            <Button disabled={!disablePause()} sx={{height: '50px', width: '200px'}} variant="contained" onClick={handleEnd}>End</Button>
                        </>
                }
            </Box>
        </Container>
    )
}