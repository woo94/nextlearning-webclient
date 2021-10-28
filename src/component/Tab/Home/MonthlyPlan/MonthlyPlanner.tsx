import {useState, useContext} from 'react'
import {Container, Grid, Box, Typography, ButtonBase} from '@mui/material'
import TopController from 'src/component/Common/TopController'
import WeekList from './WeekList'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectUser} from 'src/util/appState/userSlice'
import {selectTask} from 'src/util/appState/taskSlice'
import { sortMonthlyTask } from 'src/util/snippets' 
import {indigo} from '@mui/material/colors'
import MonthlyPlannerContext from 'src/util/context/MonthlyPlannerContext'
import {useHistory, useParams, Switch, Route, useRouteMatch} from 'react-router-dom'
import SetTask from './SetTask'
import CreateTask from './CreateTask'
import {getFirestore, doc, updateDoc} from 'firebase/firestore'

const firestore = getFirestore()

export default function MonthlyPlanner() {
    const history = useHistory()
    const params = useParams() as {month: string}
    const match = useRouteMatch()
    const task = useAppSelector(selectTask)
    const user = useAppSelector(selectUser)

    const monthSelect = params.month === "this_month" ? 0 : 1

    const monthlyPlannerContextValue = useContext(MonthlyPlannerContext)

    const thisMonthWeekList = sortMonthlyTask(monthlyPlannerContextValue?.this_month ?? {counter: 0}, task.dates.this_month.numberOfWeeks)
    const nextMonthWeekList = sortMonthlyTask(monthlyPlannerContextValue?.next_month ?? {counter: 0}, task.dates.next_month.numberOfWeeks)

    const handleSave = () => {
        const yearMonth = monthSelect === 0 ? task.dates.this_month.yearMonth : task.dates.next_month.yearMonth
        const updateData = monthSelect === 0 ? monthlyPlannerContextValue?.this_month_updateDoc : monthlyPlannerContextValue?.next_month_updateDoc
        const updateDataKeys = Object.keys(updateData ?? {})
        if(updateDataKeys.length === 0) {
            return
        }
        const monthlyTaskDocRef = doc(firestore, 'user', user.uid, 'monthly_task', yearMonth)
        updateDoc(monthlyTaskDocRef, updateData)
    }

    console.log(match.url)

    return (
        <Switch>
                <Route exact path={match.url}>
                    <Container maxWidth="sm">
                        <TopController text="Monthly Plan" backRoute="/home/today" plusRoute="" />
                        <Grid my={2} container>
                            <Grid flexGrow={1} item>
                                <Box onClick={() => { history.push("/monthly-plan/this_month") }} sx={{ cursor: "pointer", bgcolor: monthSelect === 0 ? indigo[200] : 'white', border: "1px solid black", width: "80%", textAlign: "center", borderRadius: "30px", py: 0.5 }}>
                                    <Typography variant="subtitle1">
                                        {task.dates.today.monthFullStr}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid flexGrow={1} item>
                                <Box onClick={() => { history.push("/monthly-plan/next_month") }} sx={{ cursor: "pointer", bgcolor: monthSelect === 1 ? indigo[200] : 'white', border: "1px solid black", width: '80%', textAlign: "center", borderRadius: "30px", py: 0.5 }}>
                                    <Typography variant="subtitle1">
                                        {task.dates.next_month.monthFullStr}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Switch>
                            <Route path="">

                            </Route>
                        </Switch>

                        {
                            monthSelect === 0 ?
                                <WeekList monthSelect={0} taskMetadataList={thisMonthWeekList} />
                                :
                                <WeekList monthSelect={1} taskMetadataList={nextMonthWeekList} />
                        }

                        <Grid sx={{ my: 4 }} container>
                            <Grid xs={6} item>
                                <Box onClick={() => {history.push(`${match.url}/create-task`)}} sx={{ cursor: 'pointer', boxShadow: 2, textAlign: 'center', width: '60%', margin: '0 auto', py: 1, border: '1px solid black', borderRadius: '30px' }}>
                                    <Typography variant="h6">
                                        Add
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={6} item>
                                <Box onClick={handleSave} sx={{ cursor: 'pointer', boxShadow: 2, textAlign: 'center', width: '60%', margin: '0 auto', py: 1, border: '1px solid black', borderRadius: '30px' }}>
                                    <Typography variant="h6">
                                        Save
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
            </Route>
            <Route path={`${match.url}/edit-task`}>
                <SetTask />
            </Route>
            <Route path={`${match.url}/create-task`}>
                <CreateTask />
            </Route>
        </Switch>
    )
}