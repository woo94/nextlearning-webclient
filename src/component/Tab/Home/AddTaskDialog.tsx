import React, {useState} from 'react'
import {Dialog, DialogContent, TextField, InputAdornment, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box} from '@mui/material'
import {StarBorder, Timer}from '@mui/icons-material'
import {useRouteMatch, useLocation} from 'react-router-dom'
import {grey} from '@mui/material/colors'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {doc, getFirestore, updateDoc, arrayUnion, increment} from 'firebase/firestore'
import {createSingleTask} from 'src/util/snippets'
import {selectTask} from 'src/util/appState/taskSlice'
import {Common, MonthlyTask} from 'src/util/types'

interface Props {
    setOpenAddTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openAddTaskDialog: boolean;
}

const firestore = getFirestore()

export default function AddTaskDialog(props: Props) {
    const [taskTimeOption, setTaskTimeOption] = useState<MonthlyTask.TimeOption>('')
    const [taskName, setTaskName] = useState('')
    const [taskTimeSelect, setTaskTimeSelect] = useState(30)
    const [taskCategory, setTaskCategory] = useState<Common.Category>('school')
    const {url} = useRouteMatch()
    const user = useAppSelector(selectUser)
    const task = useAppSelector(selectTask)
    const location = useLocation()

    const saveTask = () => {
        const day = location.pathname.includes('today') ? "today" : "tomorrow"
        const dayInfo = task.dates[day]
        const docId = `${dayInfo.year}-${dayInfo.monthIntStr}`
        const counter = task.monthly_task_docs[docId].counter

        const taskDocRef = doc(firestore, 'user', user.uid, 'monthly_task', docId)
        const updateDocObject: MonthlyTask.__DOC__MONTHLY_TASK = {
            counter: counter + 1
        }
        const daily_management: MonthlyTask.DailyManagement = {}
        daily_management[dayInfo.date] = {
            id: `${docId}-${dayInfo.date}-task${counter}`,
            result_list: [],
            step: "define",
            time_option: taskTimeOption,
            fulfilled: 0,
            name: taskName,
            mode: "",
            min: taskTimeSelect
        }
        updateDocObject[`task${counter}`] = {
            category: taskCategory,
            name: taskName,
            counter,
            time_option: taskTimeOption,
            day_list: [dayInfo.day],
            week_list: [dayInfo.week],
            daily_management,
            min: taskTimeSelect
        }

        props.setOpenAddTaskDialog(false)
        setTaskName('')
        setTaskTimeOption('')
        setTaskTimeSelect(30)
        setTaskCategory('school')

        return updateDoc(taskDocRef, updateDocObject)
    }

    return (
        <Dialog fullWidth maxWidth="sm" onClose={() => { props.setOpenAddTaskDialog(false) }} open={props.openAddTaskDialog}>
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
                    value={taskName}
                    onChange={(e) => {setTaskName(e.target.value)}}
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
                                value={taskTimeOption}
                                onChange={(e) => { setTaskTimeOption(e.target.value as MonthlyTask.TimeOption) }}
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
                                onChange={(e) => {setTaskCategory(e.target.value as Common.Category)}}
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