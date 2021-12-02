import React, {useEffect, useState, useContext} from 'react'
import {__DOC__PLANNER} from 'src/util/types/firestore_planner'
import {__DOC__DAILY_TASK, Mode} from 'src/util/types/firestore_daily_task'
import {Grid, Typography, Box} from '@mui/material'
import {AccessTime, RadioButtonChecked} from '@mui/icons-material'
import DailyTaskDialogContext from 'src/util/context/DailyTaskSelection'
import {useHistory, useRouteMatch, useLocation} from 'react-router-dom'

interface Props {
    task: __DOC__DAILY_TASK & __DOC__PLANNER;
}

export default function DailyTaskItem(props: Props) {
    const {onOpenDialog} = useContext(DailyTaskDialogContext)
    const {mode, planner_id, step} = props.task
    console.log(props.task)
    const history = useHistory()
    const {path} = useRouteMatch()
    const {pathname} = useLocation()

    const handleClickTask = () => {
        // 내일꺼면 아예 못누름
        if(pathname.includes("tomorrow")) {
            return
        }

        // 어제꺼면 done만 볼 수 있게 한다.
        // done한 task result를 볼 수 있게 할지말지 내일 정할꺼니까 일단은 어제꺼 누르는건 남겨놓는다.
        if(pathname.includes("yesterday")) {

        }

        if(pathname.includes("today")) {
            if(mode === "") {
                onOpenDialog(planner_id)
                return
            }
            else {
                if(["finish", "done"].includes(step)) {
                    history.push(`${path}/${planner_id}/task_result`)
                    return
                }
                else {
                    history.push(`${path}/${planner_id}?mode=${mode}`)
                    return
                }
            }
        }
    }

    return (
        <Grid key={props.task.planner_id} onClick={handleClickTask} sx={{ my: 2, py: 3, border: '1px solid #f4f4f6', borderRadius: '1rem', cursor: 'pointer'}} justifyContent="space-evenly" alignItems="center" container>
            <Grid item>
                <AccessTime />
            </Grid>
            <Grid width="50%" item>
                <Typography>
                    {props.task.name}
                </Typography>
                <Box sx={{bgcolor: '#f5f0f0', height: '3px'}}></Box>
            </Grid>
            <Grid item>
                <Grid alignItems="center" container>
                    <Grid item>
                        <Typography>
                            Time
                        </Typography>
                    </Grid>
                    <Grid item>
                        <RadioButtonChecked />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}