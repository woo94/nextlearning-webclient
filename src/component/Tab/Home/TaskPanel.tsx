import React, { useEffect, useState } from 'react'
import {useRouteMatch} from 'react-router-dom'
import {Box, Grid, Typography} from '@mui/material'
import {ThumbUp, ThumbDown, Timer} from '@mui/icons-material'
import {grey} from '@mui/material/colors'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectTask} from 'src/util/appState/taskSlice'
import TaskItem from './TaskItem'
import {MonthlyTask} from 'src/util/types'
import SelectModeDialog from './SelectModeDialog'

interface Props {
    setOpenAddTaskDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openSelectModeDialog: boolean;
    setOpenSelectModeDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TaskPanel(props: Props) {
    const task = useAppSelector(selectTask)
    const {url} = useRouteMatch()
    const dayPath = url.split('/')[2]
    const dayInfo = (() => {
        switch(dayPath) {
            case "yesterday":
                return task.dates.yesterday
            case "today": 
                return task.dates.today
            case "tomorrow":
                return task.dates.tomorrow
            default:
                return task.dates.today
        }
    })()

    const [dailyTaskList, setDailyTaskList] = useState<Array<MonthlyTask.DailyAssignment>>([])
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(0)

    useEffect(() => {
        setDailyTaskList(task.calenders[`${dayInfo.year}-${dayInfo.monthIntStr}`][dayInfo.date])
    },[task.calenders, dayPath])

    return (
        <Box sx={{ overflow: 'scroll', height: '300px', bgcolor: grey[100], borderRadius: "20px", p: 3}}>
            {
                dailyTaskList.map((dailyTask, index) => (<TaskItem key={index} index={index} id={dailyTask.id} setSelectedTaskIndex={setSelectedTaskIndex} setOpenSelectModeDialog={props.setOpenSelectModeDialog} todayStr={`${dayInfo.year}-${dayInfo.monthIntStr}-${dayInfo.date}`} />))
            }
            {
                dayPath === "yesterday" ? null : 
                    <Grid container justifyContent="center" sx={{ width: '80%', margin: '0 auto', border: '1px dashed grey', borderRadius: "10px", py: 2 }}>
                        <Grid flexGrow={1} sx={{ cursor: 'pointer' }} item>
                            <Box onClick={() => { props.setOpenAddTaskDialog(true) }} >
                                <Typography textAlign="center" variant="subtitle1">
                                    add task
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
            }
            <SelectModeDialog dailyAssignment={dailyTaskList[selectedTaskIndex]} openSelectModeDialog={props.openSelectModeDialog} setOpenSelectModeDialog={props.setOpenSelectModeDialog} /> :
        </Box>
    )
}