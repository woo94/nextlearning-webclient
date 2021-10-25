import React, {useState} from 'react'
import {Dialog, DialogContent, TextField, InputAdornment, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box} from '@mui/material'
import {StarBorder, Timer}from '@mui/icons-material'
import {useRouteMatch} from 'react-router-dom'
import {grey} from '@mui/material/colors'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {doc, getFirestore, updateDoc, arrayUnion, FieldValue} from 'firebase/firestore'
import {createSingleTask} from 'src/util/snippets'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault(dayjs.tz.guess())

interface Props {
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openDialog: boolean;
}

const firestore = getFirestore()

export default function AddTaskDialog(props: Props) {
    const [timeOptionalSelect, setTimeOptionalSelect] = useState('')
    const [taskTitle, setTaskTitle] = useState('')
    const [taskTimeSelect, setTaskTimeSelect] = useState(30)
    const [taskCategory, setTaskCategory] = useState('school')
    const {url} = useRouteMatch()
    const user = useAppSelector(selectUser)

    const saveTask = () => {
        const dayInfo = url.split('/')[2]
        console.log(dayInfo)

        let dayjsObj = dayjs()
        
        if(dayInfo === "tomorrow") {
            dayjsObj = dayjsObj.add(1, 'day')
        }

        const year = dayjsObj.year()
        const month = dayjsObj.month() + 1
        const day = dayjsObj.date().toString()

        const taskDocRef = doc(firestore, 'user', user.uid, 'monthly_task', `${year}-${month}`)
        const updateDocObject: {[key: string]: FieldValue} = {}
        updateDocObject[day] = arrayUnion(createSingleTask(taskCategory, parseInt(dayjsObj.format('YYYYMMDD')), taskTimeSelect, taskTitle, timeOptionalSelect))

        props.setOpenDialog(false)
        setTaskTitle('')
        setTimeOptionalSelect('')
        setTaskTimeSelect(30)
        setTaskCategory('school')

        return updateDoc(taskDocRef, updateDocObject)
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={() => { props.setOpenDialog(false) }} open={props.openDialog}>
            {/* <DialogTitle>this is a dialog</DialogTitle> */}
            <DialogContent>
                <div style={{margin: '0 auto', textAlign: 'center'}}>
                <TextField
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <StarBorder />
                            </InputAdornment>
                        )
                    }}
                    value={taskTitle}
                    onChange={(e) => {setTaskTitle(e.target.value)}}
                    placeholder={"title"}
                />
                </div>
                <Grid alignItems="center" sx={{ px: 3, py: 2 }} container>
                    <Grid flexGrow={1} item>
                        <Typography variant="body2">
                            Time(optional)
                        </Typography>
                    </Grid>
                    <Grid flexGrow={1} item>
                        <FormControl fullWidth>
                            <InputLabel id="time-optional-select" >select</InputLabel>
                            <Select
                                labelId="time-optional-select"
                                id="time-optional-select"
                                label="select"
                                value={timeOptionalSelect}
                                onChange={(e) => { setTimeOptionalSelect(e.target.value) }}
                                defaultValue=""
                            >
                                <MenuItem value="">
                                    select
                                </MenuItem>
                                <MenuItem value="morning">
                                    Monrning
                                </MenuItem>
                                <MenuItem value="afternoon">
                                    Afternoon
                                </MenuItem>
                                <MenuItem value="evening">
                                    Evening
                                </MenuItem>
                                <MenuItem value="night">
                                    Night
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid alignItems="center" sx={{ px: 3, py: 2 }} container>
                    <Grid flexGrow={1} item>
                        <Typography variant="body2">
                            Task time
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>

                            <Select
                                labelId="task-time-select"
                                id="task-time-select"
                                value={taskTimeSelect}
                                onChange={(e) => { setTaskTimeSelect(e.target.value as number) }}
                            >
                                <MenuItem value={30}>
                                    <Grid container>
                                        <Grid sx={{ px: 1 }} item>
                                            <Timer />
                                        </Grid>
                                        <Grid item>
                                            30 min
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                                <MenuItem value={60}>
                                    <Grid container>
                                        <Grid sx={{ px: 1 }} item>
                                            <Timer />
                                        </Grid>
                                        <Grid item>
                                            60 min
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                                <MenuItem value={90}>
                                    <Grid container>
                                        <Grid sx={{ px: 1 }} item>
                                            <Timer />
                                        </Grid>
                                        <Grid item>
                                            90 min
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid sx={{ px: 3, py: 2 }} alignItems="center" container>
                    <Grid flexGrow={1} item>
                        <Typography variant="body2">
                            Select Category
                        </Typography>
                    </Grid>
                    <Grid flexGrow={1} item>
                        <FormControl fullWidth>
                            <Select
                                value={taskCategory}
                                onChange={(e) => {setTaskCategory(e.target.value)}}
                            >
                                <MenuItem value="school">
                                    School
                                </MenuItem>
                                <MenuItem value="extracurricular">
                                    Extracurricular
                                </MenuItem>
                                <MenuItem value="challenges">
                                    Challenges
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ py: 2, borderRadius: '30px', bgcolor: grey[300], cursor: "pointer"}} onClick={saveTask} >
                    <Typography textAlign="center" variant="h5">
                        Save
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}