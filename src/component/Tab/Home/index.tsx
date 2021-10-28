import React, {useState} from 'react'
import BottomNav from 'src/component/Common/BottomNav'
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom'
import Summary from './Summary'
import {Container, Dialog, DialogContent, Button, TextField, InputAdornment, Grid, Typography, Select, MenuItem, InputLabel, FormControl} from '@mui/material'
import {StarBorder} from '@mui/icons-material'
import DailyTodo from './DailyTodo'
import MonthlyPlan from './MonthlyPlan'
import TimerMode from './TimerMode'
import RecordMode from './RecordMode'

export function Home() {
    const {url} = useRouteMatch()
    const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false)
    const [openSelectModeDialog, setOpenSelectModeDialog] = useState(false)

    return (
        <>
            <Container maxWidth="sm">
                <Route exact path={`${url}/:dayInfo`}>
                    <DailyTodo openAddTaskDialog={openAddTaskDialog} setOpenAddTaskDialog={setOpenAddTaskDialog} openSelectModeDialog={openSelectModeDialog} setOpenSelectModeDialog={setOpenSelectModeDialog} />
                </Route>
                <Route path="/monthly-plan">
                    <MonthlyPlan />
                </Route>
                <Route path={`${url}/:dayInfo/timer-mode`}>
                    <TimerMode />
                </Route>
                <Route path={`${url}/:dayInfo/record-mode`}>
                    <RecordMode />
                </Route>
            </Container>
        </>
    )
}
