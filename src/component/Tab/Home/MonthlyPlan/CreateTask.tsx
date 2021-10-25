import {Grid, Container, TextField, Divider, Avatar, Box} from '@mui/material'
import {FormatListBulleted} from '@mui/icons-material'
import {useRouteMatch, Switch, Route, useHistory, Link} from 'react-router-dom'
import TopController from 'src/component/Common/TopController'
import SetTask from './SetTask'
import React, { useState, useContext } from 'react'
import {indigo} from '@mui/material/colors'
import {useAppSelector} from 'src/util/appState/hooks'
import {selectTask} from 'src/util/appState/taskSlice'
import {Common} from 'src/util/types'
import MonthlyPlannerContext, {PlannerContext} from 'src/util/context/MonthlyPlannerContext'

interface CategoryNavItemProps {
    name: Common.Category;
    currentCategory: Common.Category;
    setCurrentCategory: React.Dispatch<React.SetStateAction<Common.Category>>
}

const CategoryNavItem = (props: CategoryNavItemProps) => {
    return (
        <Grid xs={4} item>
            <Box onClick={props.setCurrentCategory.bind(null, props.name)} sx={{ bgcolor: props.name === props.currentCategory ? indigo[200] : 'white', width: '70%', margin: '0 auto', textAlign: 'center', py: 1, border: '1px solid black', borderRadius: '20px', cursor: 'pointer' }}>
                {props.name}
            </Box>
        </Grid>
    )
}

export default function CreateTask() {
    const match = useRouteMatch()
    const history = useHistory()
    const task = useAppSelector(selectTask)
    const monthlyPlannerContextValue = useContext(MonthlyPlannerContext) as PlannerContext

    const [currentCategory, setCurrentCategory]= useState<Common.Category>("school")

    const backRoute = match.url.split('/').includes('this_month') ? "/monthly-plan/this_month" : "/monthly-plan/next_month"

    const pathname = history.location.pathname
    const monthSelect = pathname.split('/').includes('this_month') ? 0 : 1
    const documentCounter = monthSelect === 0 ? monthlyPlannerContextValue.this_month.counter : monthlyPlannerContextValue.next_month.counter

    return (
        <Switch>
            <Route exact path={match.url}>
                <Container maxWidth="sm">
                    <TopController text="Create Task" backRoute={backRoute} plusRoute="" />
                    <TextField sx={{ my: 3 }} fullWidth />
                    <Switch>
                        <Grid container>
                            <CategoryNavItem setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} name="school" />
                            <CategoryNavItem setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} name="extracurricular" />
                            <CategoryNavItem setCurrentCategory={setCurrentCategory} currentCategory={currentCategory} name="challenges" />

                            <Grid my={2} container>
                                {
                                    task.designated_task[currentCategory].map(task => (
                                        <Grid xs={6} item>
                                            <Box onClick={() => { history.push(`${match.url}/new-task`, { mode: "create", monthSelect, category: currentCategory, name: task, documentCounter }) }} sx={{ width: "70%", border: "1px solid black", borderRadius: '30px', margin: '16px auto' }}>
                                                <Grid py={1} alignItems="center" container>
                                                    <Grid mx={2} item>
                                                        <Avatar>
                                                            <FormatListBulleted />
                                                        </Avatar>
                                                    </Grid>
                                                    <Grid item>
                                                        {task}
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Grid>
                    </Switch>
                    <Divider />
                    <Grid xs={6} alignItems="center" py={1} my={4} sx={{ border: '1px solid black', borderRadius: '30px' }} container>
                        <Grid mx={2} item>
                            <Avatar>
                                <FormatListBulleted />
                            </Avatar>
                        </Grid>
                        <Grid onClick={() => { history.push(pathname + '/new-task',  { mode: "create", monthSelect, category: currentCategory, name: "", documentCounter } )}} item>
                            create my own task
                        </Grid>
                    </Grid>
                </Container>
            </Route>
            <Route path={`${match.url}/new-task`}>
                <SetTask />
            </Route>
        </Switch>
    )
}