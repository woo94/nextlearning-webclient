import React, { useState, useContext, useRef, useEffect } from 'react'
import { Grid, Box, Typography, IconButton, FormControl, MenuItem, Select, Dialog, DialogContent, InputLabel, Avatar, TextField } from '@mui/material'
import { indigo, grey } from '@mui/material/colors'
import { ArrowBackIos, FormatListBulleted } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
import { __DOC__PLANNER } from 'src/util/types/firestore_planner'
import {getFirestore, doc, setDoc, collection} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import dayjs from 'dayjs'
import { thisMonth, today } from 'src/util/dateInfo'

const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DayItem = (props:
    { day: string, select: boolean, index: number, handleDaySelect: (index: number) => void }) => {
    return (
        <Grid onClick={props.handleDaySelect.bind(null, props.index)} sx={{ cursor: 'pointer', bgcolor: props.select ? indigo[100] : grey[100] }} flexGrow={1} item>
            <Box sx={{ textAlign: 'center', py: 1 }}>
                {props.day}
            </Box>
        </Grid>
    )
}


const WeekItem = (props: { select: boolean, index: number, handleWeekSelect: (index: number) => void }) => {
    return (
        <Grid onClick={props.handleWeekSelect.bind(null, props.index)} xs={6} flexGrow={1} item>
            <Box sx={{ textAlign: 'center', width: '80%', margin: '0 auto', border: '1px solid black', borderRadius: '30px', py: 3, my: 1, cursor: 'pointer', bgcolor: props.select ? indigo[100] : grey[100] }}>
                Week {`${props.index + 1}`}
            </Box>
        </Grid>
    )
}

interface Props {
    numberOfWeeks: number;
    dateObj: ReturnType<typeof dayjs>
    // presetData: __DOC__PLANNER;
}

const firestore = getFirestore()
const auth = getAuth()

export default function SetTask(props: Props) {
    const [taskTitle, setTaskTitle] = useState('')
    const [taskTimeOption, setTaskTimeOption] = useState('anytime')
    const [taskCategory, setTaskCategory] = useState('school')

    const [daySelect, setDaySelect] = useState(dayOptions.map(val => false))
    const [weekSelect, setWeekSelect] = useState(new Array(props.numberOfWeeks).fill(false))

    const history = useHistory()

    const handleSave = async () => {
        const uid = auth.currentUser?.uid
        if(!uid) {
            return
        }
        const docRef = doc(collection(firestore, 'user', uid, 'planner'))
        const docId = docRef.id
        const day_list = daySelect.map((val, index) => {
            if(val) {
                return index
            }
            else {
                return -1
            }
        }).filter(val => val != -1)

        const week_list = weekSelect.map((val, index) => {
            if(val) {
                return index
            }
            else {
                return -1
            }
        }).filter(val => val != -1)

        const plannerDoc: __DOC__PLANNER = {
            planner_id: docId,
            year_month: props.dateObj.format('YYYY-M'),
            category: taskCategory,
            task_group: '',
            task_subject: '',
            name: taskTitle,
            time_option: taskTimeOption,
            day_list,
            week_list,
            define_date_list: calculateDates(day_list, week_list),
            done_date_list: []
        }

        // console.log(plannerDoc)

        await setDoc(docRef, plannerDoc)
        history.goBack()
    }

    const calculateDates = (day_list: Array<number>, week_list: Array<number>) => {
        const thisMonth = props.dateObj.month() + 1
        const startingIsoWeek = props.dateObj.startOf('month').isoWeek()
        const dates: Array<number> = []

        for(let i=0; i<week_list.length; i++) {
            for(let j=0; j<day_list.length; j++) {
                const targetDateObj = dayjs().isoWeek(startingIsoWeek + week_list[i]).day(day_list[j])
                // console.log(thisMonth, targetDateObj.month() + 1)
                if(targetDateObj.month() + 1 === thisMonth) {
                    dates.push(targetDateObj.date())
                }
            }
        }

        return dates
    }

    const handleDaySelect = (index: number) => {
        setDaySelect(prev => {
            const _prev = [...prev]
            _prev[index] = !_prev[index]
            return _prev
        })
    }

    const handleWeekSelect = (index: number) => {
        const weekOfMonthToday = today.isoWeek() - thisMonth.startOf('month').isoWeek()
        if(index < weekOfMonthToday) {
            alert("can't select past weeks")
            return;
        }

        setWeekSelect(prev => {
            const _prev = [...prev]
            _prev[index] = !_prev[index]
            return _prev
        })
    }

    return (
        <>
            <Grid alignItems="center" container>
                <Grid xs={2} item>
                    <IconButton onClick={() => {history.goBack()}}>
                        <ArrowBackIos />
                    </IconButton>
                </Grid>
                <Grid xs={2} item></Grid>
                <Grid xs={6} item>
                    <Grid sx={{ py: 1 }} alignItems="center" container>
                        <Grid item>
                            <TextField value={taskTitle} onChange={(e) => setTaskTitle.call(null, e.target.value)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Typography sx={{ my: 2 }} variant="h6">
                Recurrence
            </Typography>
            <Typography sx={{ my: 2 }} variant="h6">
                - Day
            </Typography>
            <Grid sx={{ my: 3, bgcolor: grey[100] }} container>
                <DayItem index={0} select={daySelect[0]} handleDaySelect={handleDaySelect} day="Sun" />
                <DayItem index={1} select={daySelect[1]} handleDaySelect={handleDaySelect} day="Mon" />
                <DayItem index={2} select={daySelect[2]} handleDaySelect={handleDaySelect} day="Tue" />
                <DayItem index={3} select={daySelect[3]} handleDaySelect={handleDaySelect} day="Wed" />
                <DayItem index={4} select={daySelect[4]} handleDaySelect={handleDaySelect} day="Thu" />
                <DayItem index={5} select={daySelect[5]} handleDaySelect={handleDaySelect} day="Fri" />
                <DayItem index={6} select={daySelect[6]} handleDaySelect={handleDaySelect} day="Sat" />
            </Grid>

            <Typography sx={{ my: 2 }} variant="h6">
                {props.dateObj.format('MMMM')}
            </Typography>
            <Grid container>
                {
                    weekSelect.map((val, index) => <WeekItem key={index} handleWeekSelect={handleWeekSelect} select={val} index={index} />)
                }
            </Grid>

            <Grid sx={{ my: 2 }} alignItems="center" container>
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
                            onChange={(e) => { setTaskTimeOption(e.target.value) }}
                        >
                            <MenuItem value="anytime">Anytime</MenuItem>
                            <MenuItem value="morning">Morning</MenuItem>
                            <MenuItem value="afternoon">Afternoon</MenuItem>
                            <MenuItem value="night">Night</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* <Typography my={2} variant="h6">
                {`- ${historyState.monthSelect === 0 ? task.dates.this_month.monthFullStr : task.dates.next_month.monthFullStr }`}
            </Typography>
            <Grid sx={{my: 2}} container>
                {
                    WeekItemList
                }
            </Grid> */}

            <Grid sx={{ my: 4 }} alignItems="center" container>
                <Grid flexGrow={1} item>
                    <Typography variant="h6">
                        Select category
                    </Typography>
                </Grid>
                <Grid flexGrow={1} item>
                    <FormControl fullWidth>
                        <Select
                            value={taskCategory}
                            onChange={(e) => { setTaskCategory(e.target.value) }}
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
                    <Box
                        onClick={handleSave} 
                        sx={{ bgcolor: grey[300], cursor: 'pointer', textAlign: 'center', py: 2, borderRadius: '30px', my: 2 }}>
                        <Typography variant="h6">
                            Save
                        </Typography>
                    </Box>
                </Grid>
                {/* <Grid flexGrow={1} item>
                    <Box
                        // onClick={handleDelete} 
                        sx={{ bgcolor: grey[300], cursor: 'pointer', textAlign: 'center', py: 2, borderRadius: '30px', my: 2 }}>
                        <Typography variant="h6">
                            Delete
                        </Typography>
                    </Box>
                </Grid> */}
            </Grid>
        </>
    )
}