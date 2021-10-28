import {useState, useContext, useRef} from 'react'
import {Grid, Box, Typography, IconButton, FormControl, MenuItem, Select, Container, InputLabel, Avatar, TextField} from '@mui/material'
import {indigo, grey} from '@mui/material/colors'
import {ArrowBackIos, FormatListBulleted} from '@mui/icons-material'
import {selectTask} from 'src/util/appState/taskSlice'
import {MonthlyTask, Common} from 'src/util/types'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {useAppSelector} from 'src/util/appState/hooks'
import MonthlyPlannerContext, {PlannerContext} from 'src/util/context/MonthlyPlannerContext'
import { appliedDays, getPossibleDays} from 'src/util/snippets'
import { deleteField } from '@firebase/firestore'

const DayItem = (props: {day: string, select: boolean, index: number, handler: (start: number) => void }) => {
    return (
        <Grid onClick={props.handler.bind(null, props.index)} sx={{ cursor: 'pointer', bgcolor: props.select ? indigo[100] : grey[100] }} flexGrow={1} item>
            <Box sx={{ textAlign: 'center', py: 1 }}>
                {props.day}
            </Box>
        </Grid>
    )
}


const WeekItem = (props: {weekNum: number, select: boolean, index: number, handler: (start: number) => void}) => {
    return (
        <Grid xs={6} flexGrow={1} item>
            <Box onClick={props.handler.bind(null, props.index)} sx={{textAlign: 'center', width: '80%', margin: '0 auto', border: '1px solid black', borderRadius: '30px', py: 3, my: 1, cursor: 'pointer', bgcolor: props.select ? indigo[100] : grey[100]}}>
                Week {props.weekNum}
            </Box>
        </Grid>
    )
}

interface HistoryBase {
    mode: "create" | "edit";
    monthSelect: number;
}

interface HistoryStateOnCreation extends HistoryBase {
    category: Common.Category;
    name: string;
    documentCounter: number;
}

interface HistoryStateOnEditing extends HistoryBase, MonthlyTask.TaskMetadata {

}

export default function SetTask() {
    const task = useAppSelector(selectTask)

    const monthlyPlannerContextValue = useContext(MonthlyPlannerContext)
    console.log(monthlyPlannerContextValue)

    const history = useHistory()
    console.log(history)
    const historyState = history.location.state as HistoryBase

    const match = useRouteMatch()

    const monthSelect = historyState.monthSelect
    const numberOfWeeks = monthSelect === 0 ?
    task.dates.this_month.numberOfWeeks :
    task.dates.next_month.numberOfWeeks
    const yearMonth = monthSelect === 0 ?
    task.dates.this_month.yearMonth : 
    task.dates.next_month.yearMonth

    const [daySelect, setDaySelect] = useState<Array<boolean>>((() => {
        const arr = new Array(7)
        arr.fill(false)
        
        if(historyState.mode === "create") {
            return arr
        }
        
        const {day_list} = historyState as HistoryStateOnEditing

        day_list.forEach((day) => {
            arr[day] = true
        })

        return arr
    })())

    const [weekSelect, setWeekSelect] = useState<Array<boolean>>((() => {
        const arr = new Array(numberOfWeeks)
        arr.fill(false)

        if(historyState.mode === "create") {
            return arr
        }

        const {week_list} = historyState as HistoryStateOnEditing

        week_list.forEach((week) => {
            arr[week] = true
        })

        return arr
    })())

    const [taskCounter] = useState((() => {
        if(historyState.mode === "create") {
            return (historyState as HistoryStateOnCreation).documentCounter
        }
        return (historyState as HistoryStateOnEditing).counter
    })())

    const [taskTimeOption, setTimeOption] = useState<MonthlyTask.TimeOption>((() => {
        if(historyState.mode === "create") {
            return ""
        }
        return (historyState as HistoryStateOnEditing).time_option
    })())

    const [taskTimeSelect, setTaskTimeSelect] = useState((() => {
        if(historyState.mode === "create") {
            return 30
        }
        return ((historyState as HistoryStateOnEditing).min) as number
    })())

    const [taskCategory, setTaskCategory] = useState<Common.Category>((() => {
        if(historyState.mode === "create") {
            return (historyState as HistoryStateOnCreation).category
        }
        return (historyState as HistoryStateOnEditing).category
    })())

    const [taskName, setTaskName] = useState((() => {
        if(historyState.mode === "create") {
            return (historyState as HistoryStateOnCreation).name
        }
        return (historyState as HistoryStateOnEditing).name
    })())

    const taskNameField = useRef((() => {
        if(historyState.mode === "create") {
            return (historyState as HistoryStateOnCreation).name
        }
        else {
            return (historyState as HistoryStateOnEditing).name
        }
    })())

    const handleWeekSelect = (start: number) => {
        if(monthSelect === 0 && task.dates.this_month.currentWeek > start) {
            alert("can't edit passed week task")
            return
        }

        const day_list = (() => {
            const arr: Array<number> = []
            daySelect.forEach((value, index) => {
                if(value === true) {
                    arr.push(index)
                }
            })
            return arr
        })()

        if(monthSelect === 0 && getPossibleDays(start, day_list, yearMonth, parseInt(task.dates.today.date)).length === 0) {
            alert('no match day')
            return
        }

        const _weekSelect = [...weekSelect]
        _weekSelect.splice(start, 1, !_weekSelect[start])
        setWeekSelect(_weekSelect)
    }

    const WeekItemList: Array<ReturnType <typeof WeekItem>> = []
    for(let i=0; i<numberOfWeeks; i++) {
        WeekItemList.push(
            <WeekItem index={i} select={weekSelect[i]} weekNum={i+1} handler={handleWeekSelect} />
        )
    }

    const handleDaySelect = (start: number) => {
        const _daySelect = [...daySelect]
        _daySelect.splice(start, 1, !daySelect[start])
        setDaySelect(_daySelect)
    }

    // handleSave uses MonthlyPlannerContext's editPlanner method
    const handleSave = () => {
        const day_list = (() => {
            const arr: Array<number> = []
            daySelect.forEach((value, index) => {
                if(value === true) {
                    arr.push(index)
                }
            })

            return arr
        })()
        if(day_list.length === 0) {
            alert('select applying days')
            return
        }

        const week_list = weekSelect.map((val, index) => val ? index : -1).filter(val => val > 0)
        if(week_list.length === 0) {
            alert('select applying weeks')
            return
        }

        const daily_management: MonthlyTask.DailyManagement = {}
        const day = task.dates.today.date

        const isEditingThisMonth = ((mode: "create" | "edit", monthSelect: number) => mode === "edit" && monthSelect === 0).call(null, historyState.mode, monthSelect)

        if(isEditingThisMonth) {
            if(monthSelect === 0) {
                // get existing daily_management kv until today
                const existingKeys = Object.keys(((monthlyPlannerContextValue as PlannerContext).this_month[`task${taskCounter}`] as MonthlyTask.SingleTask).daily_management)
                const preservedKeys = existingKeys.filter(key => key < day)
                preservedKeys.forEach(key => {
                    daily_management[key] = ((monthlyPlannerContextValue as PlannerContext).this_month[`task${taskCounter}`] as MonthlyTask.SingleTask).daily_management[key]
                })
            }
        }

        // start tomorrow -> grab all available days
        const appliedDayList = appliedDays(week_list, day_list, yearMonth, isEditingThisMonth ? day : '0')
        appliedDayList.forEach(day => {
            daily_management[day] = {
                id: `${yearMonth}-${day}-task${taskCounter}`,
                fulfilled: 0,
                result_list: [],
                step: "define",
                min: taskTimeSelect,
                time_option: taskTimeOption,
                name: taskName,
                mode: ""
            }
        })

        const updateDoc: MonthlyTask.SingleTask = {
            time_option: taskTimeOption,
            category: taskCategory,
            min: taskTimeSelect,
            week_list,
            day_list,
            daily_management,
            name: taskName,
            counter: taskCounter
        }

        monthlyPlannerContextValue?.editPlan(monthSelect, `task${taskCounter}`, updateDoc)
        if(match.url.split('/').includes('this_month')){
            history.push('/monthly-plan/this_month')
        }
        else {
            history.push('/monthly-plan/next_month')
        }
    }

    const handleBackBtn = () => {
        const month = monthSelect === 0 ? "this_month" : "next_month"

        if(historyState.mode === "edit") {
            history.push(`/monthly-plan/${month}`)
            return
        }

        history.push(`/monthly-plan/${month}/create-task`)
    }

    const handleDelete = () => {
        monthlyPlannerContextValue?.deletePlan(monthSelect, `task${taskCounter}`)
        if(match.url.split('/').includes('this_month')){
            history.push('/monthly-plan/this_month')
        }
        else {
            history.push('/monthly-plan/next_month')
        }
    }

    return (
        <Container sx={{py: 3}} maxWidth="sm">
            <Grid container>
                <Grid xs={2} item>
                    <IconButton onClick={handleBackBtn}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid xs={2} item></Grid>
                <Grid xs={6} item>
                    <Grid sx={{ py: 1 }} alignItems="center" container>
                        <Grid sx={{ px: 1 }} item>
                            <Avatar>
                                <FormatListBulleted />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            {
                            taskNameField.current !== "" ? 
                            taskName :
                            <TextField onChange={(e) => setTaskName.call(null, e.target.value)} />
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Typography sx={{my: 2}} variant="h6">
                Recurrence
            </Typography>
            <Typography sx={{my: 2}} variant="h6">
                - Day
            </Typography>
            <Grid sx={{ my: 3, bgcolor: grey[100]}} container>
                <DayItem handler={handleDaySelect} index={0} select={daySelect[0]} day="Sun" />
                <DayItem handler={handleDaySelect} index={1} select={daySelect[1]} day="Mon" />
                <DayItem handler={handleDaySelect} index={2} select={daySelect[2]} day="Tue" />
                <DayItem handler={handleDaySelect} index={3} select={daySelect[3]} day="Wed" />
                <DayItem handler={handleDaySelect} index={4} select={daySelect[4]} day="Thu" />
                <DayItem handler={handleDaySelect} index={5} select={daySelect[5]} day="Fri" />
                <DayItem handler={handleDaySelect} index={6} select={daySelect[6]} day="Sat" />
            </Grid>

            <Grid sx={{my: 2}} alignItems="center" container>
                <Grid flexGrow={1} item>
                    <Typography variant="h6">
                        - Time (optional)
                    </Typography>
                </Grid>
                <Grid flexGrow={1} item>
                    <FormControl fullWidth>
                        <InputLabel id="time-optional-select">select</InputLabel>
                        <Select
                            value={taskTimeOption}
                            labelId="time-optional-select"
                            label="select"
                            onChange={(e) => { setTimeOption(e.target.value as MonthlyTask.TimeOption) }}
                        >
                            <MenuItem value="">select</MenuItem>
                            <MenuItem value="morning">Morning</MenuItem>
                            <MenuItem value="afternoon">Afternoon</MenuItem>
                            <MenuItem value="evening">Evening</MenuItem>
                            <MenuItem value="night">Night</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Typography my={2} variant="h6">
                {`- ${historyState.monthSelect === 0 ? task.dates.this_month.monthFullStr : task.dates.next_month.monthFullStr }`}
            </Typography>
            <Grid sx={{my: 2}} container>
                {
                    WeekItemList
                }
            </Grid>

            <Grid sx={{my: 4}} alignItems="center" container>
                <Grid flexGrow={1} item>
                    <Typography variant="h6">
                        Task time
                    </Typography>
                </Grid>
                <Grid flexGrow={1} item>
                    <FormControl fullWidth>
                        <Select
                            value={taskTimeSelect}
                            onChange={(e) => { setTaskTimeSelect(e.target.value as number) }}
                        >
                            <MenuItem value={30}>30 min</MenuItem>
                            <MenuItem value={60}>60 min</MenuItem>
                            <MenuItem value={90}>90 min</MenuItem>
                            <MenuItem value={120}>120 min</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid sx={{my: 4}} alignItems="center" container>
                <Grid flexGrow={1} item>
                    <Typography variant="h6">
                        Select category
                    </Typography>
                </Grid>
                <Grid flexGrow={1} item>
                    <FormControl fullWidth>
                        <Select
                            value={taskCategory}
                            onChange={(e) => { setTaskCategory(e.target.value as Common.Category) }}
                        >
                            <MenuItem value="school">School</MenuItem>
                            <MenuItem value="extracurricular">Extracurricular</MenuItem>
                            <MenuItem value="challenges">Challenges</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid spacing={2} container>
                <Grid flexGrow={1} item>
                    <Box onClick={handleSave} sx={{ bgcolor: grey[300], cursor: 'pointer', textAlign: 'center', py: 2, borderRadius: '30px', my: 2 }}>
                        <Typography variant="h6">
                            Save
                        </Typography>
                    </Box>
                </Grid>
                <Grid flexGrow={1} item>
                    <Box onClick={handleDelete} sx={{ bgcolor: grey[300], cursor: 'pointer', textAlign: 'center', py: 2, borderRadius: '30px', my: 2 }}>
                        <Typography variant="h6">
                            Delete
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}