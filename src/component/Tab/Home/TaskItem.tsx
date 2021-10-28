import {Grid, Box, Typography} from '@mui/material'
import {ThumbUp, Timer, ThumbDown, Circle} from '@mui/icons-material'
import {MonthlyTask} from 'src/util/types'
import React, { useState } from 'react';
import {useHistory} from 'react-router-dom'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectTask} from 'src/util/appState/taskSlice'
import {taskIdToAccessor} from 'src/util/snippets'

interface Props {
    id: string;
    todayStr: string;
    setOpenSelectModeDialog: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
    setSelectedTaskIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function TaskItem(props: Props) {
    let taskProgressIcon: ReturnType<typeof ThumbUp>;
    const history = useHistory()
    const task = useAppSelector(selectTask)
    const {docId, fieldName, date} = taskIdToAccessor(props.id)
    const buttonDisable = !history.location.pathname.includes("today")
    const dailyAssignment = (task.monthly_task_docs[docId][fieldName] as MonthlyTask.SingleTask).daily_management[date]
    const taskId = dailyAssignment.id
    const todayStr = props.todayStr

    if(taskId.startsWith(todayStr)) {
        if(dailyAssignment.step === "done") {
            taskProgressIcon = <ThumbUp />
        }
        else {
            taskProgressIcon = <Circle />
        }
    }
    else if(todayStr > taskId) {
        // yesterday
        if(dailyAssignment.step === "done") {
            taskProgressIcon = <ThumbUp />
        }
        else {
            taskProgressIcon = <ThumbDown />
        }
    }
    else {
        // tomorrow
        taskProgressIcon = <Circle />
    }

    const onClickTask = () => {
        if(buttonDisable) {
            return;
        }
        props.setSelectedTaskIndex(props.index)
        if(dailyAssignment.mode === "") {
            props.setOpenSelectModeDialog(true)
        }
        else if(dailyAssignment.mode === "timer") {
            history.push(`${history.location.pathname}/timer-mode`, {id: props.id})
        }
        else {
            history.push(`${history.location.pathname}/record-mode`, {id: props.id})
        }
    }

    return (
        <Box sx={{ cursor: 'pointer', margin: '1rem 0' }} onClick={onClickTask}>
            <Grid alignItems="center" container>
                <Grid xs={1} item></Grid>
                <Grid xs={1} item>
                    {taskProgressIcon}
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid xs={4} item>
                    <Typography variant='subtitle1'>
                        {dailyAssignment.name}
                    </Typography>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid textAlign="end" xs={1} item>
                    <Timer fontSize="small" />
                </Grid>
                <Grid xs={2} item>
                    {/* {['define', 'done'].includes(props.task.step) ? prop : 'On Hold'} */}
                </Grid>
            </Grid>
        </Box>
    )
}